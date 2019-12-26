import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../form.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {FirstFormComponent} from '../first-form/first-form.component';
import {CheckoutService} from '../../../../pages/admin/checkout/checkout.service';
import {StorageService} from '../../../../@core/services/storage.service';
import {IndustryComponent} from '../../industry/industry';
import {ModalController} from '@ionic/angular';
import {getIndex} from '../../../../@core/utils/utils';

@Component({
    selector: 'app-second-form',
    templateUrl: './second-form.component.html',
    styleUrls: ['./second-form.component.scss']
})
export class SecondFormComponent implements OnInit {
    secondForm: FormGroup;
    type = 0;
    selection = {
        base: new SelectionModel<any>(true, []),
        type: new SelectionModel<any>(true, [])
    };
    selectedIndustries = [];

    constructor(private formSvc: FormService,
                private formBuilder: FormBuilder,
                private first: FirstFormComponent,
                private checkoutSvc: CheckoutService,
                private storageSvc: StorageService,
                private modalController: ModalController) {
    }

    ngOnInit() {
        this.secondForm = this.formBuilder.group({
            selfId: ['', Validators.required],
            brandTypes: ['', Validators.required],
            brandNames: ['', Validators.required]
        });
        this.secondForm.valueChanges.subscribe(res => {
            console.log(res);
        });
        this.formSvc.setFormValue('secondForm');
    }

    async presentModal() {
        const modal = await this.modalController.create({
            showBackdrop: true,
            component: IndustryComponent,
            componentProps: {items: this.selectedIndustries, type: 'order'}
        });
        await modal.present();
        const {data} = await modal.onDidDismiss(); // 获取关闭传回的值
        // this.form.get('industryIds').markAsTouched();
        this.selectedIndustries = data;
        this.setIndustries();
    }

    typeChange(e) {
        this.type = e.value;
        this.selection.type = new SelectionModel<any>(true, []);
        this.formSvc.order.price = 300;
        this.formSvc.order.count = 0;
        this.formSvc.order.amount = 0;
        this.formSvc.order.total = 0;
        this.first.setSource();
        if (e.value) {
            this.checkoutSvc.getAllTypes().subscribe(res => {
                this.formSvc.source.type = new MatTableDataSource<any>(res);
                if (e.value === 2) {
                    this.formSvc.source.type.data.forEach(row => this.selection.type.select(row));
                    this.setPrice();
                }
            });
        }
    }

    setPrice() {
        this.formSvc.order.count = this.selection.type.selected.length;
        this.formSvc.order.amount = this.selection.type.selected.length * this.formSvc.order.price;
        this.formSvc.order.total = this.formSvc.order.amount;
        this.storageSvc.set('order', JSON.stringify(this.formSvc.order));
        this.first.setSource();
    }

    setIndustries() {
        let ids = '';
        this.selectedIndustries.forEach(item => {
            if (ids) {
                ids = ids + ',' + item.id;
            } else {
                ids = item.id;
            }
        });
        this.checkoutSvc.getTypes(ids).subscribe(res => {
            res = res ? res : [];
            console.log(res);
            this.formSvc.source.type = new MatTableDataSource<any>(res);
            this.selection.type = new SelectionModel<any>(true, []);
            this.formSvc.source.type.data.forEach(row => this.selection.type.select(row));
            this.setPrice();
        });
        // this.form.get('industryIds').setValue(ids);
    }

    remove(item) {
        const index = getIndex(this.selectedIndustries, 'id', item.id);
        if (index >= 0) {
            this.selectedIndustries.splice(index, 1);
        }
        this.setIndustries();
    }
}

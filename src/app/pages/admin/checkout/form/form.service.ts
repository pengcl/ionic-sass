import {Injectable} from '@angular/core';
import {StorageService} from '../../../../@core/services/storage.service';
import {AdminCheckoutFormFirstFormComponent} from './first-form/first-form.component';
import {AuthService} from '../../../auth/auth.service';
import {CompanyService} from '../../company/company.service';
import {SelectionModel} from '@angular/cdk/collections';
import {IndustryComponent} from '../../../../@shared/components/industry/industry';
import {ModalController} from '@ionic/angular';
import {MatTableDataSource} from '@angular/material';
import {CheckoutService} from '../checkout.service';
import {IndustryService} from '../../../../@shared/components/industry/industry.service';

@Injectable({providedIn: 'root'})

export class FormService {
    token = this.authSvc.token();
    company = this.companySvc.currentCompany;
    order: Order = this.storageSvc.get('order') ? JSON.parse(this.storageSvc.get('order')) : {
        index: 0,
        price: 300,
        count: 0,
        amount: 0,
        total: 0
    };
    source = {
        base: null,
        type: null
    };
    displayed = {
        base: ['name', 'logo', 'price', 'count', 'total'],
        type: ['select', 'name']
    };
    selection = {
        base: new SelectionModel<any>(true, []),
        type: new SelectionModel<any>(true, [])
    };
    selectedIndustries = [];
    industries = [];

    constructor(private storageSvc: StorageService,
                private first: AdminCheckoutFormFirstFormComponent,
                private authSvc: AuthService,
                private companySvc: CompanyService,
                private modalController: ModalController,
                private checkoutSvc: CheckoutService,
                private industrySvc: IndustryService) {
        this.industrySvc.list('order').subscribe((res) => {
            this.industries = res;
        });
    }

    setFormValue(formName) {
        if (this.order[formName]) {
            for (const key in this.order[formName]) {
                if (this.order[formName]) {
                    this[formName].get(key).setValue(this.order[formName][key]);
                }
            }
            if (formName === 'firstForm') {
                this.setSource();
            }
        }
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
            this.source.type = new MatTableDataSource<any>(res);
            this.selection.type = new SelectionModel<any>(true, []);
            this.source.type.data.forEach(row => this.selection.type.select(row));
            this.setPrice();
        });
        // this.form.get('industryIds').setValue(ids);
    }

    setPrice() {
        this.order.count = this.selection.type.selected.length;
        this.order.amount = this.selection.type.selected.length * this.order.price;
        this.order.total = this.order.amount;
        this.storageSvc.set('order', JSON.stringify(this.order));
        this.setSource();
    }

    setSource() {
        this.source.base = new MatTableDataSource<any>([{
            brandName: this.first.firstForm.get('brandName').value,
            brandLogoId: this.first.firstForm.get('brandLogoId').value,
            amount: this.order.amount,
            price: this.order.price,
            count: this.order.count,
            total: this.order.amount
        }]);
    }
}

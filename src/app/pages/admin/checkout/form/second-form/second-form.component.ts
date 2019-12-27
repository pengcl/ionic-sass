import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../form.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {AdminCheckoutFormFirstFormComponent} from '../first-form/first-form.component';
import {CheckoutService} from '../../checkout.service';
import {StorageService} from '../../../../../@core/services/storage.service';
import {getIndex} from '../../../../../@core/utils/utils';

@Component({
    selector: 'app-admin-checkout-form-second-form',
    templateUrl: './second-form.component.html',
    styleUrls: ['./second-form.component.scss']
})
export class AdminCheckoutFormSecondFormComponent implements OnInit {
    firstForm = this.first.firstForm;
    secondForm: FormGroup;
    type = 0;
    selection = this.formSvc.selection;
    source = this.formSvc.source;
    displayed = this.formSvc.displayed;
    selectedIndustries = this.formSvc.selectedIndustries;

    constructor(private formSvc: FormService,
                private formBuilder: FormBuilder,
                private first: AdminCheckoutFormFirstFormComponent,
                private checkoutSvc: CheckoutService,
                private storageSvc: StorageService,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL) {
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

    setPrice() {
        this.formSvc.setPrice();
    }

    presentModal() {
        this.formSvc.presentModal();
    }

    typeChange(e) {
        this.type = e.value;
        this.selection.type = new SelectionModel<any>(true, []);
        this.formSvc.order.price = 300;
        this.formSvc.order.count = 0;
        this.formSvc.order.amount = 0;
        this.formSvc.order.total = 0;
        this.formSvc.setSource();
        if (e.value) {
            this.checkoutSvc.getAllTypes().subscribe(res => {
                this.formSvc.source.type = new MatTableDataSource<any>(res);
                if (e.value === 2) {
                    this.formSvc.source.type.data.forEach(row => this.selection.type.select(row));
                    this.formSvc.setPrice();
                }
            });
        }
    }

    remove(item) {
        const index = getIndex(this.formSvc.selectedIndustries, 'id', item.id);
        if (index >= 0) {
            this.formSvc.selectedIndustries.splice(index, 1);
        }
        this.formSvc.setIndustries();
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(target) {
        const numSelected = this.selection[target].selected.length;
        const numRows = this.source[target].data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(target) {
        this.isAllSelected(target) ?
            this.selection[target].clear() :
            this.source[target].data.forEach(row => this.selection[target].select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(target?, row?: any): string {
        if (!row) {
            return `${this.isAllSelected(target) ? 'select' : 'deselect'} all`;
        }
        return `${this.selection[target].isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    second() {
        this.secondForm.get('brandTypes').setValue('');
        this.selection.type.selected.forEach(item => {
            if (this.secondForm.get('brandTypes').value) {
                this.secondForm.get('brandTypes').setValue(this.secondForm.get('brandTypes').value + ',' + item.id);
                this.secondForm.get('brandNames').setValue(this.secondForm.get('brandNames').value + ',' + item.name);
            } else {
                this.secondForm.get('brandTypes').setValue(item.id);
                this.secondForm.get('brandNames').setValue(item.name);
            }
        });
        if (this.secondForm.invalid) {
            return false;
        }

        this.checkoutSvc.second(this.secondForm.value).subscribe(res => {
            if (res) {
                this.formSvc.order.thirdForm = {};
                this.formSvc.order.thirdForm.selfId = res;
                this.formSvc.order.index = 2;
                this.formSvc.order.secondForm = this.secondForm.value;
                this.storageSvc.set('order', JSON.stringify(this.formSvc.order));
                this.formSvc.setFormValue('thirdForm');
            }
        });
    }
}

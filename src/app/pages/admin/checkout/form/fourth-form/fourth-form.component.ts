import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../form.service';
import {AdminCheckoutFormSecondFormComponent} from '../second-form/second-form.component';
import {AdminCheckoutFormThirdFormComponent} from '../third-form/third-form.component';
import {CheckoutService} from '../../checkout.service';
import {StorageService} from '../../../../../@core/services/storage.service';

@Component({
    selector: 'app-admin-checkout-form-fourth-form',
    templateUrl: './fourth-form.component.html',
    styleUrls: ['./fourth-form.component.scss']
})
export class AdminCheckoutFormFourthFormComponent implements OnInit {
    secondForm = this.second.secondForm;
    thirdForm = this.third.thirdForm;
    fourthForm: FormGroup;
    source = this.formSvc.source;
    displayed = this.formSvc.displayed;
    selection = this.formSvc.selection;

    constructor(private formSvc: FormService,
                private second: AdminCheckoutFormSecondFormComponent,
                private third: AdminCheckoutFormThirdFormComponent,
                private checkoutSvc: CheckoutService,
                private storageSvc: StorageService,
                private formBuilder: FormBuilder,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL) {
    }

    ngOnInit() {
        this.fourthForm = this.formBuilder.group({
            selfId: [this.formSvc.company.id, Validators.required],
            remark: ['']
        });
        this.formSvc.setFormValue('fourthForm');
    }

    presentModal() {
        this.formSvc.presentModal();
    }

    fourth() {
        if (this.fourthForm.invalid) {
            return false;
        }

        this.checkoutSvc.fourth(this.fourthForm.value).subscribe(res => {
            console.log(res);
            if (res) {
                this.formSvc.order.no = res;
                this.formSvc.order.index = 4;
                this.formSvc.order.fourthForm = this.fourthForm.value;
                this.storageSvc.set('order', JSON.stringify(this.formSvc.order));
            }
        });
    }
}

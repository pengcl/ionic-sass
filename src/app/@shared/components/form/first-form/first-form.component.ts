import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../../../../pages/admin/company/company.service';
import {StorageService} from '../../../../@core/services/storage.service';
import {MatTableDataSource} from '@angular/material';
import {Uploader, UploaderOptions} from '../../../modules/uploader';
import {FormService} from '../form.service';
import {CheckoutService} from '../../../../pages/admin/checkout/checkout.service';


@Component({
    selector: 'app-first-form',
    templateUrl: './first-form.component.html',
    styleUrls: ['./first-form.component.scss']
})
export class FirstFormComponent implements OnInit {
    firstForm: FormGroup;
    uploader = {
        brandLogoId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            limit: 1,
            params: {
                key: this.formSvc.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.firstForm.get('brandLogoId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions)
    };

    constructor(private formBuilder: FormBuilder,
                private companySvc: CompanyService,
                private formSvc: FormService,
                private checkoutSvc: CheckoutService,
                private storageSvc: StorageService,
                @Inject('PREFIX_URL') public PREFIX_URL,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL) {
    }

    ngOnInit() {
        this.firstForm = this.formBuilder.group({
            custId: [this.formSvc.company.id, Validators.required],
            brandRegType: [0, Validators.required],
            brandLogoId: ['', Validators.required],
            brandName: ['', Validators.required]
        });
        this.formSvc.setFormValue('firstForm');
    }

    setSource() {
        this.formSvc.source.base = new MatTableDataSource<any>([{
            brandName: this.firstForm.get('brandName').value,
            brandLogoId: this.firstForm.get('brandLogoId').value,
            amount: this.formSvc.order.amount,
            price: this.formSvc.order.price,
            count: this.formSvc.order.count,
            total: this.formSvc.order.amount
        }]);
    }

    first() {
        if (this.firstForm.invalid) {
            return false;
        }
        this.checkoutSvc.first(this.firstForm.value).subscribe(res => {
            if (res) {
                this.formSvc.order.secondForm = {};
                this.formSvc.order.secondForm.selfId = res;
                this.formSvc.order.index = 1;
                this.formSvc.order.firstForm = this.firstForm.value;
                this.storageSvc.set('order', JSON.stringify(this.formSvc.order));
                this.setSource();
                this.formSvc.setFormValue('secondForm');
            }
        });
    }
}

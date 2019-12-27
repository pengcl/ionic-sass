import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormService} from '../form.service';
import {AddressService} from '../../../../../@core/services/address.service';
import {Uploader, UploaderOptions} from '../../../../../@shared/modules/uploader';
import {CheckoutService} from '../../checkout.service';
import {StorageService} from '../../../../../@core/services/storage.service';

@Component({
    selector: 'app-admin-checkout-form-third-form',
    templateUrl: './third-form.component.html',
    styleUrls: ['./third-form.component.scss']
})
export class AdminCheckoutFormThirdFormComponent implements OnInit {
    thirdForm: FormGroup;
    provinces = [];
    cities = [];
    districts = [];

    uploader = {
        licenseFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            limit: 1,
            params: {
                key: this.formSvc.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.thirdForm.get('licenseFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        proxyFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            limit: 1,
            params: {
                key: this.formSvc.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.thirdForm.get('proxyFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        priorityFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            limit: 1,
            params: {
                key: this.formSvc.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.thirdForm.get('priorityFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        cardFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            limit: 1,
            params: {
                key: this.formSvc.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.thirdForm.get('cardFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions)
    };

    constructor(private formSvc: FormService,
                private formBuilder: FormBuilder,
                private addressSvc: AddressService,
                private checkoutSvc: CheckoutService,
                @Inject('PREFIX_URL') public PREFIX_URL,
                private storageSvc: StorageService,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL) {
    }

    ngOnInit() {
        this.thirdForm = this.formBuilder.group({
            selfId: ['', Validators.required],
            custType: [1, Validators.required],
            companyName: [this.formSvc.company.companyName || '', Validators.required],
            creditNumber: [this.formSvc.company.creditNumber || '', Validators.required],
            province: [this.formSvc.company.province || '', Validators.required],
            city: [this.formSvc.company.city || '', Validators.required],
            area: [this.formSvc.company.area || '', Validators.required],
            address: [this.formSvc.company.address || '', Validators.required],
            name: [this.formSvc.company.name || '', Validators.required],
            email: [this.formSvc.company.email || '', Validators.required],
            mobile: [this.formSvc.company.mobile || '', Validators.required],
            idCard: [this.formSvc.company.idCard || ''],
            licenseFileId: [this.formSvc.company.licenseFileId || ''],
            proxyFileId: [this.formSvc.company.proxyFileId || ''],
            priorityFileId: [this.formSvc.company.priorityFileId || ''],
            cardFileId: [this.formSvc.company.cardFileId || ''],
            zipCode: [this.formSvc.company.zipCode || '', Validators.required],
            telephone: [this.formSvc.company.telephone || '']
        });

        this.getProvinces();
        this.thirdForm.get('province').valueChanges.subscribe(res => {
            if (res) {
                this.cities = [];
                this.districts = [];
                this.getCities();
            }
        });
        this.thirdForm.get('city').valueChanges.subscribe(res => {
            if (res) {
                this.districts = [];
                this.getDistricts();
            }
        });
        this.thirdForm.get('province').setValue(this.formSvc.company.province || '');
        this.thirdForm.get('city').setValue(this.formSvc.company.city || '');
        this.formSvc.setFormValue('thirdForm');
    }

    getProvinces() {
        this.provinces = this.addressSvc.provinces();
    }

    getCities() {
        this.cities = this.addressSvc.cities(this.thirdForm.get('province').value);
    }

    getDistricts() {
        this.districts = this.addressSvc.districts(this.thirdForm.get('province').value, this.thirdForm.get('city').value);
    }

    third() {
        if (this.thirdForm.invalid) {
            return false;
        }

        this.checkoutSvc.third(this.thirdForm.value).subscribe(res => {
            if (res) {
                this.formSvc.order.fourthForm = {};
                this.formSvc.order.fourthForm.selfId = res;
                this.formSvc.order.index = 3;
                this.formSvc.order.thirdForm = this.thirdForm.value;
                this.storageSvc.set('order', JSON.stringify(this.formSvc.order));
                this.formSvc.setFormValue('fourthForm');
            }
        });
    }
}

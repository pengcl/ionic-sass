import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../../@core/modules/toast';
import {DialogService} from '../../../../../@core/modules/dialog';
import {debounceTime, filter, distinctUntilChanged} from 'rxjs/operators';
import {AddressService} from '../../../../../@core/services/address.service';
import {CompanyService} from '../../company.service';

@Component({
    selector: 'app-admin-company-create-step1',
    templateUrl: './step1.page.html',
    styleUrls: ['../create.page.scss', './step1.page.scss']
})
export class AdminCompanyCreateStep1Page implements OnInit {
    form: FormGroup = new FormGroup({
        companyName: new FormControl('', [Validators.required]),
        creditNumber: new FormControl('', [Validators.required]),
        province: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        area: new FormControl('', [Validators.required]),
        address: new FormControl('', [Validators.required]),
        mechanismId: new FormControl('', []),
        operateDate: new FormControl('', [Validators.required])
    });

    company;
    provinces = [];
    cities = [];
    districts = [];
    options = [];

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: LocationStrategy,
                private toastSvc: ToastService,
                private dialogSvc: DialogService,
                private addressSvc: AddressService,
                private companySvc: CompanyService) {
    }

    ngOnInit() {
        this.getProvinces();
        this.form.get('companyName').valueChanges.pipe(
            filter(text => text.length > 1),
            debounceTime(1000),
            distinctUntilChanged()).subscribe(companyName => {
            this.companySvc.search(companyName).subscribe(res => {
                if (res.code === 20000 && res.data) {
                    this.options = res.data;
                }
            });
            /*this.companySvc.validatorName(companyName).subscribe(res => {
                if (res && res.id !== this.id) {
                    // this.sameCompany = res;
                    this.form.get('companyName').setErrors(null);
                } else {
                    // this.sameCompany = false;
                }
            });*/
        });
        this.form.get('province').valueChanges.subscribe(res => {
            this.cities = [];
            this.districts = [];
            this.getCities();
        });
        this.form.get('city').valueChanges.subscribe(res => {
            this.districts = [];
            this.getDistricts();
        });
    }

    /*search() {
        if (this.firstForm.get('companyName').invalid) {
            this.dialogSvc.show({content: '请输入公司名称', cancel: '', confirm: '我知道了'}).subscribe();
        } else {
            this.companySvc.search(this.firstForm.get('companyName').value).subscribe(res => {
                if (res.code === 20000) {
                    if (res.data) {
                        this.options = res.data;
                    }
                }
            });
        }
    }*/

    setCompany() {
        this.companySvc.find(this.form.get('companyName').value).subscribe(res => {
            if (res.code === 20000) {
                this.company = res.data.companyDTO;
                this.form.get('companyName').setValue(this.company.companyName);
                this.form.get('creditNumber').setValue(this.company.unifiedSocialCreditCode);
                this.form.get('mechanismId').setValue(this.company.organizationCode);
                this.form.get('address').setValue(this.company.address);
                this.form.get('operateDate').setValue(this.company.registeredDate);
            }
        });
    }

    getProvinces() {
        this.provinces = this.addressSvc.provinces();
    }

    getCities() {
        this.cities = this.addressSvc.cities(this.form.get('province').value);
    }

    getDistricts() {
        this.districts = this.addressSvc.districts(this.form.get('province').value, this.form.get('city').value);
    }

    submit() {
        if (this.form.invalid) {
            return false;
        }
        this.toastSvc.loading('提交中...', 0);
        this.companySvc.create(this.form.value).subscribe(res => {
            console.log(res.busCust.id);
            this.toastSvc.hide();
            this.router.navigate(['/admin/company/create/step2', res.busCust.id]);
        });
    }

}

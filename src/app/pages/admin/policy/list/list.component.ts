import {Component, OnInit} from '@angular/core';
import {AdminPolicyPage} from '../index/policy.component';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../../company/company.service';
import {AddressService} from '../../../../@core/services/address.service';
import {PolicyService} from '../policy.service';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class AdminPolicyListPage {
    provinces = [];
    cities = [];
    districts = [];
    company = this.companySvc.currentCompany;

    form: FormGroup = new FormGroup({
        custId: new FormControl(this.company.id, [Validators.required]),
        province: new FormControl('', [Validators.required]),
        area: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required])
    });

    constructor(private companySvc: CompanyService,
                private addressSvc: AddressService,
                private policySvc: PolicyService) {
        this.getProvinces();
        this.form.get('province').valueChanges.subscribe(res => {
            this.cities = [];
            this.districts = [];
            this.getCities();
        });
        this.form.get('city').valueChanges.subscribe(res => {
            this.districts = [];
            this.getDistricts();
        });

        this.form.get('province').setValue(this.company.province);
        this.form.get('city').setValue(this.company.city);
        this.form.get('area').setValue(this.company.area);

        this.policySvc.getPolicyPage(this.company.id).subscribe(res => {
            console.log(res);
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

}

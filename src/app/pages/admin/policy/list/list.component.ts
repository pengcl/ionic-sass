import {Component, OnInit} from '@angular/core';
import {AdminPolicyPage} from '../index/policy.component';
import {ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../../company/company.service';
import {AddressService} from '../../../../@core/services/address.service';
import {PolicyService} from '../policy.service';
import {MatTableDataSource} from '@angular/material';
import {DatePipe} from '@angular/common';
import {debounceTime, filter, map, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {LoadingService} from '../../../../@core/services/loading.service';
import {ToastService} from '../../../../@core/modules/toast';


@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss'],
    providers: [DatePipe]
})
export class AdminPolicyListPage {
    provinces = [];
    cities = [];
    districts = [];
    company = this.companySvc.currentCompany;
    id = this.route.snapshot.queryParams.id || this.company.id;
    dataSource;
    displayedColumns = ['name', 'area', 'money', 'rate', 'scope', 'time', 'actions'];
    form: FormGroup = new FormGroup({
        custId: new FormControl(this.id, [Validators.required]),
        province: new FormControl('', []),
        area: new FormControl('', []),
        city: new FormControl('', []),
        reportDateBegin: new FormControl('', []),
        reportDateEnd: new FormControl('', []),
        subsidyAmtBegin: new FormControl('', []),
        subsidyAmtEnd: new FormControl('', []),
        weightBegin: new FormControl('', []),
        weightEnd: new FormControl('', []),
        word: new FormControl('', [])
    });
    total = 0;
    params = {
        page: 1,
        rows: 10
    };

    constructor(private datePipe: DatePipe,
                private route: ActivatedRoute,
                private companySvc: CompanyService,
                private addressSvc: AddressService,
                private policySvc: PolicyService,
                private toastSvc: ToastService) {
        this.getProvinces();
        this.form.get('province').valueChanges.subscribe(res => {
            this.cities = [];
            this.districts = [];
            this.getCities();
            this.params.page = 1;
            this.getData();
        });
        this.form.get('city').valueChanges.subscribe(res => {
            this.districts = [];
            this.getDistricts();
            this.params.page = 1;
            this.getData();
        });

        this.form.get('area').valueChanges.subscribe(res => {
            this.params.page = 1;
            this.getData();
        });

        /*this.form.get('province').setValue(this.company.province);
        this.form.get('city').setValue(this.company.city);
        this.form.get('area').setValue(this.company.area);*/
        this.getData();
        this.form.get('subsidyAmtBegin').valueChanges.pipe(
            filter(text => text.length > 1),
            debounceTime(1500),
            distinctUntilChanged()).subscribe(() => {
            this.params.page = 1;
            this.getData();
        });

        this.form.get('subsidyAmtEnd').valueChanges.pipe(
            filter(text => text.length > 1),
            debounceTime(1500),
            distinctUntilChanged()).subscribe(() => {
            this.params.page = 1;
            this.getData();
        });

        this.form.get('weightBegin').valueChanges.pipe(
            filter(text => text.length > 1),
            debounceTime(1500),
            distinctUntilChanged()).subscribe(() => {
            this.params.page = 1;
            this.getData();
        });

        this.form.get('weightEnd').valueChanges.pipe(
            filter(text => text.length > 1),
            debounceTime(1500),
            distinctUntilChanged()).subscribe(() => {
            this.params.page = 1;
            this.getData();
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

    getData() {
        this.toastSvc.loading('加载中...', 0);
        const body = JSON.parse(JSON.stringify(this.form.value));
        body.page = this.params.page;
        body.rows = this.params.rows;
        this.policySvc.list(body).subscribe(res => {
            this.toastSvc.hide();
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    setWord(word) {
        this.form.get('word').setValue(word);
        this.getData();
    }

    search() {
        this.getData();
    }

    timeChange(e) {
        this.params.page = 1;
        this.form.get('reportDateBegin').setValue(this.datePipe.transform(e.value.begin, 'yyyy-MM-dd'));
        this.form.get('reportDateEnd').setValue(this.datePipe.transform(e.value.end, 'yyyy-MM-dd'));
        this.getData();
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }

}

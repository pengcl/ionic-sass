import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTableDataSource} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {CompanyService} from '../company/company.service';
import {AuthService} from '../../auth/auth.service';
import {UserService} from './user.service';
import {SelectionModel} from '@angular/cdk/collections';
import {getIndex} from '../../../@core/utils/utils';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    providers: [DatePipe,
        {provide: MAT_DATE_LOCALE, useValue: 'zh_CN'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class AdminUserPage implements OnInit {
    company = this.companySvc.currentCompany;
    companies;
    total = 0;
    params = {
        custId: this.company.id,
        page: 1,
        rows: 10,
        payedDateBegin: '',
        payedDateEnd: ''
    };
    displayedColumns: string[] = ['date', 'cost', 'payY', 'payZ', 'rechargeY', 'rechargeZ', 'refund'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
    date;
    form: FormGroup;
    account = {
        qb: 0,
        zct: 0
    };

    constructor(private authSvc: AuthService,
                private userSvc: UserService,
                private companySvc: CompanyService,
                fb: FormBuilder,
                private datePipe: DatePipe) {
        this.form = fb.group({
            date: [{begin: new Date(Date.parse(new Date().toString()) - 86400000 * 7), end: new Date()}]
        });
        this.params.payedDateBegin = this.datePipe.transform(this.form.get('date').value.begin, 'yyyy-MM-dd');
        this.params.payedDateEnd = this.datePipe.transform(this.form.get('date').value.end, 'yyyy-MM-dd');
        companySvc.list({}).subscribe(res => {
            this.companies = res.list;
        });
        this.getData();
    }

    ngOnInit() {
    }

    companyChange() {
        const index = getIndex(this.companies, 'id', this.params.custId);
        this.companySvc.updateCompanyStatus(this.companies[index]);
        this.getData();
    }

    timeChange(e) {
        this.params.page = 1;
        this.params.payedDateBegin = this.datePipe.transform(e.value.begin, 'yyyy-MM-dd');
        this.params.payedDateEnd = this.datePipe.transform(e.value.end, 'yyyy-MM-dd');
        this.getData();
    }

    getData() {
        this.userSvc.balance(this.params.custId, 'qb').subscribe(res => {
            this.account.qb = res.account ? res.account.balance : 0;
            console.log(this.account.qb);
        });
        this.userSvc.balance(this.params.custId, 'zct').subscribe(res => {
            this.account.zct = res.account ? res.account.balance : 0;
            console.log(this.account.zct);
        });
        this.userSvc.balances(this.params).subscribe(res => {
            console.log(res);
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }

}

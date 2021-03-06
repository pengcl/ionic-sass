import {Component, Inject, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

import {AuthService} from '../../../auth/auth.service';
import {CompanyService} from '../../company/company.service';
import {TicketService} from '../ticket.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
    selector: 'app-admin-ticket-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'zh_CN'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class AdminTicketListPage {
    company = this.companySvc.currentCompany;
    total = 0;
    params = {
        custId: this.company.id,
        page: 1,
        rows: 10,
        workOrderNo: '',
        workStatus: this.route.snapshot.queryParams.workStatus ? this.route.snapshot.queryParams.workStatus.split(',') : '',
        serviceStatus: this.route.snapshot.queryParams.serviceStatus ? this.route.snapshot.queryParams.serviceStatus.split(',') : '',
        workType: '',
        createDateBegin: '',
        createDateEnd: '',
        updateDateBegin: '',
        updateDateEnd: ''
    };
    statuses;
    serviceStatuses;
    types;

    items;
    displayedColumns: string[] = ['select', 'no', 'type', 'ticketStatus', 'startTime', 'serviceStatus', 'remark', 'updateTime', 'admin', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private authSvc: AuthService,
                private companySvc: CompanyService,
                private ticketSvc: TicketService) {
        console.log(this.params);
        ticketSvc.statuses().subscribe(res => {
            const statuses = [];
            for (const value in res) {
                if (res[value]) {
                    statuses.push({
                        name: res[value],
                        value
                    });
                }
            }
            this.statuses = statuses;
        });
        ticketSvc.serviceStatuses().subscribe(res => {
            this.serviceStatuses = res;
        });
        ticketSvc.types().subscribe(res => {
            this.types = res;
        });
        this.getData();
    }

    getData() {
        this.params.page = 1;
        this.ticketSvc.list(this.getBody()).subscribe(res => {
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
            console.log(res);
        });
    }

    getBody() {
        const body = JSON.parse(JSON.stringify(this.params));
        if (body.workStatus) {
            let workStatus = '';
            body.workStatus.forEach(item => {
                if (workStatus) {
                    workStatus = workStatus + ',' + item;
                } else {
                    workStatus = workStatus + item;
                }
            });
            body.workStatus = workStatus;
        }
        if (body.serviceStatus) {
            let serviceStatus = '';
            body.serviceStatus.forEach(item => {
                if (serviceStatus) {
                    serviceStatus = serviceStatus + ',' + item;
                } else {
                    serviceStatus = serviceStatus + item;
                }
            });
            body.serviceStatus = serviceStatus;
        }
        return body;
    }

    search() {
        this.getData();
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }

    export() {
        this.ticketSvc.export(this.getBody()).subscribe(res => {
            console.log(res);
            window.location.href = this.FILE_PREFIX_URL + res;
        });
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

}

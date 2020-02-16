import {Component, OnDestroy} from '@angular/core';
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
        workStatus: '',
        workType: '',
        createDateBegin: '',
        createDateEnd: '',
        updateDateBegin: '',
        updateDateEnd: ''
    };
    statuses;
    types;

    items;
    displayedColumns: string[] = ['select', 'no', 'type', 'ticketStatus', 'startTime', 'serviceStatus', 'updateTime', 'admin', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);

    constructor(private route: ActivatedRoute,
                private authSvc: AuthService,
                private companySvc: CompanyService,
                private ticketSvc: TicketService) {
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
        ticketSvc.types().subscribe(res => {
            this.types = res;
        });
        this.getData();
    }

    getData() {
        this.params.page = 1;
        this.ticketSvc.list(this.params).subscribe(res => {
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
            console.log(res);
        });
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
        this.ticketSvc.export(this.params).subscribe(res => {
            console.log(res);
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

import {Component, OnDestroy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

import {fromEvent} from 'rxjs';
import {ajax} from 'rxjs/ajax';
import {map, filter, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import {AuthService} from '../../../auth/auth.service';
import {CompanyService} from '../../company/company.service';
import {TrustService} from '../trust.service';


@Component({
    selector: 'app-admin-trust-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss']
})
export class AdminTrustListPage implements OnDestroy {
    company = this.companySvc.currentCompany;
    selectedIndex;
    displayed = {
        trademark: ['select', 'name', 'logo', 'types', 'actions'],
        patent: ['select', 'date', 'name', 'no', 'publishNo', 'type', 'actions']
    };
    source = {
        trademark: null,
        patent: null
    };
    selection = {
        trademark: new SelectionModel<any>(true, []),
        patent: new SelectionModel<any>(true, [])
    };
    trademark = {
        total: 0,
        params: {
            custId: this.company.id,
            demension: '0',
            page: 1,
            rows: 10
        }
    };

    patent = {
        total: 0,
        params: {
            custId: this.company.id,
            demension: '0',
            page: 1,
            rows: 10
        }
    };

    tab = {
        index: 0,
        target: 'trademark'
    };

    constructor(private route: ActivatedRoute,
                private authSvc: AuthService,
                private companySvc: CompanyService,
                private trustSvc: TrustService) {
        route.queryParamMap.subscribe((queryParams: Params) => {
            this.selectedIndex = queryParams.params.selectedIndex;
            this.tab.index = this.selectedIndex;
            this.tab.target = this.selectedIndex === '1' ? 'patent' : 'trademark';
        });
        this.getTrusts();
        this.getPatents();
    }

    getPatents() {
        this.trustSvc.patents(this.patent.params).subscribe(res => {
            this.source.patent = new MatTableDataSource<any>(res.list);
            this.patent.total = res.total;
        });
    }

    getTrusts() {
        this.trustSvc.trademarks(this.trademark.params).subscribe(res => {
            this.source.trademark = new MatTableDataSource<any>(res.list);
            this.trademark.total = res.total;
        });
    }

    trademarkPage(e) {
        this.trademark.params.rows = e.pageSize;
        this.trademark.params.page = e.pageIndex + 1;
        this.getTrusts();
    }

    patentPage(e) {
        this.patent.params.rows = e.pageSize;
        this.patent.params.page = e.pageIndex + 1;
        this.getPatents();
    }

    trust(target, item) {
        console.log(target, item);
        if (target === 'trademark') {
            this.trustSvc.trademarkTrust({
                custId: this.company.id,
                brandNames: item.brandName,
                status: item.status === 1 ? 0 : 1
            }).subscribe(res => {
                this.getTrusts();
            });
        } else {
            this.trustSvc.patentTrust({
                custId: this.company.id,
                applicationCodes: item.applicationCode,
                status: item.status === 1 ? 0 : 1
            }).subscribe(res => {
                this.getPatents();
            });
        }
    }

    trusts(status) {
        let values = '';
        console.log(this.tab.target);
        this.selection[this.tab.target].selected.forEach(item => {
            if (this.tab.target === 'trademark') {
                console.log(item);
                if (values) {
                    values = values + ',' + item.brandName;
                } else {
                    values = item.brandName;
                }
            } else {
                if (values) {
                    values = values + ',' + item.applicationCode;
                } else {
                    values = item.applicationCode;
                }
            }
        });

        if (this.tab.target === 'trademark') {
            this.trustSvc.trademarkTrust({
                custId: this.company.id,
                brandNames: values,
                status
            }).subscribe((res) => {
                this.getTrusts();
            });
        } else {
            this.trustSvc.patentTrust({
                custId: this.company.id,
                applicationCodes: values,
                status
            }).subscribe(res => {
                this.getPatents();
            });
        }
    }

    onTab(e) {
        this.tab.index = e.index;
        this.tab.target = e.tab.ariaLabel;
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

    ngOnDestroy(): void {
        this.selection = null;
    }
}

import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {AuthService} from '../../../auth/auth.service';
import {CompanyService} from '../../company/company.service';
import {TrustService} from '../trust.service';

@Component({
    selector: 'app-admin-trust-item',
    templateUrl: './item.page.html',
    styleUrls: ['./item.page.scss']
})
export class AdminTrustItemPage {
    id = this.route.snapshot.params.id;
    data;
    company = this.companySvc.currentCompany;
    displayed = {
        data: ['date', 'name', 'no', 'publishNo', 'type'],
        change: ['title', 'date'],
        risk: ['title', 'date']
    };
    source = {
        data: null,
        change: null,
        risk: null
    };
    selection = {
        data: new SelectionModel<any>(true, []),
        change: new SelectionModel<any>(true, []),
        risk: new SelectionModel<any>(true, [])
    };

    change = {
        total: 0,
        params: {
            custId: this.company.id,
            businessType: 1,
            type: 0,
            page: 1,
            rows: 10
        }
    };

    risk = {
        total: 0,
        params: {
            custId: this.company.id,
            businessType: 1,
            type: 1,
            page: 1,
            rows: 10
        }
    };

    tab = {
        index: 0,
        target: 'change'
    };

    constructor(private route: ActivatedRoute,
                private authSvc: AuthService,
                private companySvc: CompanyService,
                private trustSvc: TrustService) {
        trustSvc.patent(this.id).subscribe(res => {
            this.data = res;
            const row = [{
                publicationDate: res.publicationDate,
                inventionTitle: res.inventionTitle,
                applicationCode: res.applicationCode,
                publicationCode: res.publicationCode,
                patentType: res.patentType
            }];
            this.source.data = new MatTableDataSource<any>(row);
        });
        this.getChanges();
        this.getRisks();
    }

    getChanges() {
        this.trustSvc.logs(this.change.params).subscribe(res => {
            this.change.total = res.total;
            this.source.change = new MatTableDataSource<any>(res.list);
        });
    }

    getRisks() {
        this.trustSvc.logs(this.risk.params).subscribe(res => {
            this.risk.total = res.total;
            this.source.risk = new MatTableDataSource<any>(res.list);
        });
    }

    changePage(e) {
        this.change.params.rows = e.pageSize;
        this.change.params.page = e.pageIndex + 1;
        this.getChanges();
    }

    riskPage(e) {
        this.risk.params.rows = e.pageSize;
        this.risk.params.page = e.pageIndex + 1;
        this.getRisks();
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

}

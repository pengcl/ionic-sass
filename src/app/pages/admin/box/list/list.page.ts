import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {AuthService} from '../../../auth/auth.service';
import {CompanyService} from '../../company/company.service';
import {BoxService} from '../box.service';
import {PlanService} from '../../plan/plan.service';

@Component({
    selector: 'app-admin-box-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss']
})
export class AdminBoxListPage {
    company = this.companySvc.currentCompany;

    total = 0;
    params = {
        custId: this.company.id,
        page: 1,
        rows: 10,
        fileField: 0,
        fileType: ''
    };

    displayedColumns: string[] = ['select', 'name', 'type', 'date', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private authSvc: AuthService,
                private companySvc: CompanyService,
                private planSvc: PlanService,
                private boxSvc: BoxService) {
        this.getData();
    }

    getData() {
        this.boxSvc.list(this.params).subscribe(res => {
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    onTab(target, e) {
        this.params[target] = e.tab.ariaLabel;
        this.getData();
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }

    preDownload(id) {
        this.planSvc.preDownload(id, 1).subscribe();
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
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

}

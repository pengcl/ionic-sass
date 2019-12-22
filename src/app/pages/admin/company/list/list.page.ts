import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

import {CompanyService} from '../company.service';

@Component({
    selector: 'app-admin-company-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss']
})
export class AdminCompanyListPage {
    params = {
        page: 1,
        rows: 10,
        custType: 1,
        companyName: ''
    };
    displayedColumns: string[] = ['name', 'no', 'date', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
    suppliers;

    constructor(private route: ActivatedRoute, private companySvc: CompanyService) {
        this.getData();
    }

    getData() {
        this.companySvc.list(this.params).subscribe(res => {
            console.log(res.list);
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    default(item) {
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

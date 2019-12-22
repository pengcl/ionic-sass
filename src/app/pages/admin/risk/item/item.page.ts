import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {RiskService} from '../risk.service';
import {SelectionModel} from '@angular/cdk/collections';

export interface Post {
    name: string;
    id: string;
    position: number;
}

@Component({
    selector: 'app-admin-risk-item',
    templateUrl: './item.page.html',
    styleUrls: ['./item.page.scss']
})
export class AdminRiskItemPage {
    id = this.route.snapshot.params.id;

    displayed = {
        job: ['select', 'name', 'level', 'qualification', 'years', 'supplier', 'inTime', 'nums', 'days', 'used', 'actions'],
        employee: ['select', 'name', 'post', 'level', 'projects', 'inTime', 'outTime', 'period', 'attendance', 'status'],
        project: ['select', 'name', 'contract', 'department', 'suppliers', 'employee', 'employees', 'status']
    };
    source = {
        job: null,
        employee: null,
        project: null
    };
    selection = {
        job: new SelectionModel<any>(true, []),
        employee: new SelectionModel<any>(true, []),
        project: new SelectionModel<any>(true, [])
    };

    constructor(private route: ActivatedRoute,
                private planSvc: RiskService) {
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

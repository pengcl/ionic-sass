import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {DialogService} from '../../../../@core/modules/dialog';
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
        fileField: this.route.snapshot.queryParams.fileField,
        fileType: this.route.snapshot.queryParams.fileType
    };

    displayedColumns: string[] = ['select', 'name', 'type', 'date', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
    selectedIndex = this.route.snapshot.queryParams.fileType ? this.route.snapshot.queryParams.fileType + 1 : 0;

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private dialogSvc: DialogService,
                private authSvc: AuthService,
                private companySvc: CompanyService,
                private planSvc: PlanService,
                private boxSvc: BoxService) {
        this.getData();
    }

    getData() {
        this.selection = new SelectionModel<any>(true, []);
        this.boxSvc.list(this.params).subscribe(res => {
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    onTab(target, e) {
        this.params[target] = e.tab.ariaLabel;
        this.getData();
        if (target === 'fileType') {
            if (e.tab.ariaLabel === '') {
                this.selectedIndex = 0;
            } else {
                this.selectedIndex = parseInt(e.tab.ariaLabel, 10) + 1;
            }
        }
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }

    del() {
        this.dialogSvc.show({content: '您是否确定要删除！', confirm: '是的', cancel: '不了'}).subscribe(res => {
            if (res.value) {
                let ids = '';
                this.selection.selected.forEach(item => {
                    if (ids) {
                        ids = ids + ',' + item.id;
                    } else {
                        ids = item.id;
                    }
                });
                this.boxSvc.del({id: ids}).subscribe(res => {
                    this.getData();
                });
            }
        });
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

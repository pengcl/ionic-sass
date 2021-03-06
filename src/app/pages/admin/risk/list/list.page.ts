import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {CompanyService} from '../../company/company.service';
import {RiskService} from '../risk.service';
import {LoadingService} from '../../../../@core/services/loading.service';
import {ToastService} from '../../../../@core/modules/toast';

@Component({
    selector: 'app-admin-risk-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss']
})
export class AdminRiskListPage {
    company = this.companySvc.currentCompany;
    displayedColumns: string[] = ['name', 'time', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
    total = 0;
    params = {
        custId: this.company.id,
        demension: '0',
        page: 1,
        rows: 10
    };

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private companySvc: CompanyService,
                private planSvc: RiskService,
                private toastSvc: ToastService) {
        this.getData();
    }

    getData() {
        this.toastSvc.loading('加载中...', 0);
        this.planSvc.list(this.params).subscribe(res => {
            this.toastSvc.hide();
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    preDownload(id) {
        this.planSvc.preDownload(id, 1).subscribe();
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
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

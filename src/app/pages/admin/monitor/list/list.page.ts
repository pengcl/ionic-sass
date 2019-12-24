import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {DialogService} from '../../../../@core/modules/dialog';
import {CompanyService} from '../../company/company.service';
import {MonitorService} from '../monitor.service';

@Component({
    selector: 'app-admin-monitor-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss']
})
export class AdminMonitorListPage {
    company = this.companySvc.currentCompany;
    displayedColumns: string[] = ['position', 'name', 'time', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
    total = 0;
    params = {
        custId: this.company.id,
        demension: '0',
        page: 1,
        rows: 10
    };
    name = '';

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private dialogSvc: DialogService,
                private companySvc: CompanyService,
                private monitorSvc: MonitorService) {
        this.getData();
    }

    getData() {
        this.monitorSvc.list(this.params).subscribe(res => {
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    add() {
        this.dialogSvc.show({content: '您确定要添加 ' + this.name + ' 吗？', cancel: '不了', confirm: '是的'}).subscribe(state => {
            if (state.value) {
                this.monitorSvc.add(this.company.id, this.name).subscribe(res => {
                    this.name = '';
                    this.getData();
                });
            }
        });
    }

    delete(id, name) {
        this.dialogSvc.show({content: '您确定要删除' + name + '吗？', cancel: '不了', confirm: '是的'}).subscribe(state => {
            if (state.value) {
                this.monitorSvc.delete(id, this.company.id).subscribe(res => {
                    this.getData();
                });
            }
        });
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

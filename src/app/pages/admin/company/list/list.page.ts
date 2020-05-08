import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {DialogService} from '../../../../@core/modules/dialog';
import {CompanyService} from '../company.service';


@Component({
    selector: 'app-admin-company-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss']
})
export class AdminCompanyListPage {
    company = this.companySvc.currentCompany;
    total = 0;
    params = {
        page: 1,
        rows: 10,
        companyName: ''
    };
    displayedColumns: string[] = ['name', 'date', 'default', 'current', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);

    constructor(private route: ActivatedRoute,
                private router: Router,
                private dialogSvc: DialogService,
                private companySvc: CompanyService) {
        this.getData();
    }

    getData() {
        this.companySvc.list(this.params).subscribe(res => {
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    default(id) {
        this.companySvc.default(id).subscribe(() => {
            this.dialogSvc.show({content: '您已成功修改默认主体，在您下次登录时生效', cancel: '', confirm: '我知道了'}).subscribe(() => {
                this.getData();
            });
        });
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }

    change(item) {
        if (this.company.id === item.id) {
            this.dialogSvc.show({content: '您当必须拥有一个主体'}).subscribe();
        } else {
            this.companySvc.source(item.id).subscribe(res => {
                if (res.id) {
                    this.company = item;
                    this.companySvc.updateCompanyStatus(item);
                } else {
                    this.dialogSvc.show({
                        title: '使用提醒',
                        content: '您当前使用的企业数据版本过旧，无法生成企业智能画像。请按照流程完成数据更新，感谢配合。',
                        cancel: '暂不更新',
                        confirm: '更新数据'
                    }).subscribe(result => {
                        if (result.value) {
                            this.router.navigate(['/admin/company/item/', item.id], {queryParams: {default: true}});
                        }
                    });
                }
            });
        }
        return false;
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

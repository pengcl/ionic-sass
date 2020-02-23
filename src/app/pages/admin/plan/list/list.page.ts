import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {CompanyService} from '../../company/company.service';
import {PlanService} from '../plan.service';
import {DatePipe} from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {LoadingService} from '../../../../@core/services/loading.service';

@Component({
    selector: 'app-admin-plan-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
    providers: [DatePipe,
        {provide: MAT_DATE_LOCALE, useValue: 'zh_CN'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class AdminPlanListPage {
    id = this.route.snapshot.queryParams.company ? this.route.snapshot.queryParams.company : this.companySvc.currentCompany.id;

    displayedColumns: string[] = ['name', 'type', 'time', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
    total = 0;
    params = {
        id: this.id,
        type: '',
        beginDate: '',
        endDate: '',
        demension: '0',
        page: 1,
        rows: 10
    };

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private datePipe: DatePipe,
                private companySvc: CompanyService,
                private planSvc: PlanService,
                private loadingSvc: LoadingService) {
        this.getData();
    }

    getData() {
        this.loadingSvc.show('加载中...', 0).then();
        const params = JSON.parse(JSON.stringify(this.params));
        if (params.beginDate) {
            params.beginDate = this.datePipe.transform(this.params.beginDate, 'yyyy-MM-dd');
        }
        if (params.endDate) {
            params.endDate = this.datePipe.transform(this.params.endDate, 'yyyy-MM-dd');
        }
        this.planSvc.list(params).subscribe(res => {
            this.loadingSvc.hide();
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    change() {
        this.params.page = 1;
        this.getData();
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

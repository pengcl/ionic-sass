import {Component, Inject, OnInit} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTableDataSource} from '@angular/material';
import {CompanyService} from '../../company/company.service';
import {ToastService} from '../../../../@core/modules/toast';
import {DatePipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {CertificateService} from '../../certificate-registration/certificate.service';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DialogService} from '../../../../@core/modules/dialog';
import * as _moment from 'moment';
import 'moment/locale/zh-cn';
_moment.locale('zh-cn')

@Component({
    selector: 'app-certificate-registration-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss'],
    providers: [DatePipe,
        {provide: MAT_DATE_LOCALE, useValue: 'zh_CN'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class AdminCertificateListPage implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
        private datePipe: DatePipe,
        private dialogSvc: DialogService,
        private companySvc: CompanyService,
        private tasSvc: CertificateService,
        private toastSvc: ToastService
    ) {
        this.getData();
    }
    maxDate = new Date();
    regStateOptions: any = this.tasSvc.workList;
    displayedColumns: string[] = ['name', 'type', 'certificateType', 'status', 'time', 'actions'];
    params = {
        work_name: '',
        reg_type: 100,
        reg_state: '',
        work_type: '',
        reg_date1: '',
        reg_date2: '',
        pageNo: 1,
        pageSize: 20
    };
    total = 0;
    dataSource;

    ngOnInit() {
        this.tasSvc.workListSource.subscribe(res => {
            this.regStateOptions = res;
        });
    }


    getData() {
        this.toastSvc.loading('加载中...', 0);
        const params:any = {
            reg_date1: '',
            reg_date2: '',
        };
        if (!!this.params.reg_date1 || !!this.params.reg_date2) {
            params.reg_date1 = this.params.reg_date1
                ? _moment(this.params.reg_date1).format('YYYY-MM-DD HH:mm:ss')
                : _moment(0).format('YYYY-MM-DD HH:mm:ss');
            params.reg_date2 = this.params.reg_date2
                ? _moment(this.params.reg_date2).format('YYYY-MM-DD HH:mm:ss')
                : _moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
        }
        this.tasSvc.list({...this.params, ...params}).subscribe(res => {
            this.toastSvc.hide();
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.item);
        });
    }

    toDetail(ele) {
        const navigateAction = () => {
            this.router.navigate([`/admin/certificate/declare/${ele.id}`], {
                queryParams: {
                    id: ele.id
                },
            });
        }
        if (ele.status === 101) {
            this.dialogSvc.show({
                content: '该作品早前存证失败，请微调内容后再次尝试申请。',
                cancel: '取消'
            }).subscribe(res => {
                if (res.value) {
                    navigateAction();
                }
            });
        } else {
            navigateAction();
        }
    }

    filterLabel(type, code) {
        if (code) {
            for (const item of this.regStateOptions[type]) {
                if (+code === item.code) {
                    return item.label;
                }
            }
        }
    }
    page(e) {
        this.params.pageSize = e.pageSize;
        this.params.pageNo = e.pageIndex + 1;
        this.getData();
    }

    change() {

    }

}

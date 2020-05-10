import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {CompanyService} from '../../company/company.service';
import {ToastService} from '../../../../@core/modules/toast';
import {DatePipe} from '@angular/common';
import {CertificateService} from '../certificate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import options from '../declare/area';
import {interval as observableInterval} from 'rxjs/index';
import {OrderService} from '../../order/order.service';
import {getIndex} from '../../../../@core/utils/utils';
import {TabService} from '../../../../@shared/components/header/tab.service';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function findItem(code, data) {
    for (const item of data) {
        if (item.value === code) {
            return item;
        } else if (item.children) {
            const res = findItem(code, item.children);
            if (res) {
                return res;
            }
        }
    }
}

@Component({
    selector: 'app-certificate-registration-pay',
    templateUrl: './pay.page.html',
    styleUrls: [
        './pay.page.scss'
    ],
    providers: [DatePipe,
        {provide: MAT_DATE_LOCALE, useValue: 'zh_CN'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class AdminCertificatePayPage implements OnInit {
    id;
    regStateOptions = this.certificateSvc.workList;
    total = 0;
    detailData;
    payInterval;
    payCode;

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private datePipe: DatePipe,
                private router: Router,
                private tabSvc: TabService,
                private orderSvc: OrderService,
                private companySvc: CompanyService,
                private certificateSvc: CertificateService,
                private toastSvc: ToastService) {
        this.route.queryParams.subscribe(
            params => {
                this.detailData = params;
                // this.id = params.id;
                // this.getData();
                this.getPayConfig();
            }
        );
    }

    ngOnInit() {
        this.certificateSvc.workListSource.subscribe(res => {
            this.regStateOptions = res;
        });
    }

    // ngOnDestroy() {
    //     this.payInterval && this.payInterval.unsubscribe();
    // }

    checkPayStatus(orderNo) {
        this.orderSvc.item(orderNo).subscribe(async res => {
            if (res.order.status > 2) {
                this.submitData();
            } else {
                await sleep(800);
                this.checkPayStatus(orderNo);
            }
        });
        // this.payInterval = observableInterval(1000).subscribe(() => {
        //     this.orderSvc.item(orderNo).subscribe(res => {
        //         console.log(res);
        //         if (res.order.status > 2) {
        //             this.payInterval.unsubscribe();
        //             this.submitData();
        //         }
        //     });
        // });
    }


    getData() {
        this.toastSvc.loading('加载中...', 0);
        this.certificateSvc.getDetail({rid: this.id}).subscribe(res => {
            this.toastSvc.hide();
            this.detailData = res;
        });
    }

    getPayConfig() {
        this.toastSvc.loading('加载中...', 0);
        this.certificateSvc.getPayConfig(this.detailData.orderNos).subscribe(res => {
            if (!res) {
                this.payCode = false;
                this.toastSvc.hide();
                return false;
            }
            res = res || {};
            this.toastSvc.hide();
            this.payCode = res.payCode || false;
            this.checkPayStatus(this.detailData.orderNos);

        });
    }

    submitData() {
        this.toastSvc.loading('支付成功,正在上传数据');
        const params: any = this.detailData;
        this.certificateSvc.submitData({
            ...params,
            order_id: params.orderNos
        }).subscribe(res => {
            this.toastSvc.hide();
            this.toastSvc.success('上传成功', 1000);
            setTimeout(() => {
                this.closeCurrentTab();
                this.router.navigate([`/admin/certificate/list`], {replaceUrl: true});
            }, 1000);
        });
    }

    filterLabel(type, code) {
        if (code || code === 0) {
            if (this.regStateOptions[type]) {
                for (const item of this.regStateOptions[type]) {
                    if (+code === item.code) {
                        return item.label;
                    }
                }
            }
        }
    }

    localFormat(codeArr) {
        const newArr = [];
        for (const item of codeArr) {
            if (item) {
                const res = findItem(item, options);
                if (res) {
                    newArr.push(res.label);
                }
            }

        }
        return newArr.join(' / ');
    }

    closeCurrentTab() {
        const tabs = this.tabSvc.tabs.value;
        const currIndex = getIndex(tabs, 'path', this.router.url);
        const newTabs = JSON.parse(JSON.stringify(tabs));
        newTabs.splice(currIndex, 1);
        if (newTabs.length > 0) {
            this.tabSvc.tabs.next(newTabs);
        }
    }
}

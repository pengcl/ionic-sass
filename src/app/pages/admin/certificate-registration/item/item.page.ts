import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, Inject, OnInit} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTableDataSource} from '@angular/material';
import {CompanyService} from '../../company/company.service';
import {ToastService} from '../../../../@core/modules/toast';
import {DatePipe} from '@angular/common';
import {CertificateService} from '../certificate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DomSanitizer, SafeResourceUrl,} from '@angular/platform-browser';
// import {saveAs} from 'file-saver';

import options from '../declare/area';
import {TabService} from "../../../../@shared/components/header/tab.service";
import {getIndex} from "../../../../@core/utils/utils";
import {StorageService} from "../../../../@core/services/storage.service";

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

function str2bytes(str) {
    const bytes = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) {
        bytes[i] = str.charCodeAt(i);
    }
    return bytes;
}

@Component({
    selector: 'app-certificate-registration-item-detail',
    templateUrl: './item.page.html',
    styleUrls: ['./item.page.scss'],
    providers: [DatePipe,
        {provide: MAT_DATE_LOCALE, useValue: 'zh_CN'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class AdminCertificateItemDetailPage implements OnInit {
    // id = this.route.snapshot.queryParams.company ? this.route.snapshot.queryParams.company : this.companySvc.currentCompany.id;
    id;
    url: SafeResourceUrl;
    company;

    constructor(private route: ActivatedRoute,
                public sanitizer: DomSanitizer,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private datePipe: DatePipe,
                private router: Router,
                private tabSvc: TabService,
                private storage: StorageService,
                private companySvc: CompanyService,
                private certificateSvc: CertificateService,
                private toastSvc: ToastService) {
        this.route.params.subscribe(
            params => {
                this.id = params.id;
                this.getData();
            }
        );
        const companyStoreData = this.storage.get('company');
        try {
            this.company = JSON.parse(companyStoreData);
        } catch (e) {
            this.company = {};
        }

    }

    regStateOptions = this.certificateSvc.workList;

    params = {
        id: this.id,
        name: '',
        status: '',
        type: '1',
        time: '',
        demension: '0',
        page: 1,
        rows: 10
    };
    statusSelection = new SelectionModel<any>(true, []);
    typeSelection = new SelectionModel<any>(true, []);
    total = 0;
    detailData;

    ngOnInit() {
        this.certificateSvc.workListSource.subscribe(res => {
            this.regStateOptions = res;
        });
    }


    getData() {
        this.toastSvc.loading('加载中...', 0);
        this.certificateSvc.getDetail({rid: this.id}).subscribe(res => {
            this.toastSvc.hide();
            this.detailData = res;
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfLink());
        });
    }

    downloadCertificate() {
        this.certificateSvc.preDownload(this.id).subscribe(res => {
            this.toastSvc.hide();
            const textBlob = new Blob([str2bytes(res.data)], {type: 'application/zip'});
            // saveAs(textBlob, 'example.zip');
            // this.detailData = res;
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
        return newArr.join('/');
    }

    pdfLink() {
        return `${this.certificateSvc.TSA_PREFIX_URL}getpdf/${this.id}?uid=${this.certificateSvc.id}&rid=${this.id}&owner_code=${this.company.creditNumber}`
    }

    pdfDownloadLink() {
        return `${this.certificateSvc.TSA_PREFIX_URL}downloadfile/${this.id}?uid=${this.certificateSvc.id}&rid=${this.id}&owner_code=${this.company.creditNumber}`
    }

}

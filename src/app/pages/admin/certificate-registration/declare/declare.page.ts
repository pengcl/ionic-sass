import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {CompanyService} from '../../company/company.service';
import {ToastService} from '../../../../@core/modules/toast';
import {DatePipe} from '@angular/common';
import {CertificateService} from '../certificate.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {FormBuilder, Validators} from '@angular/forms';
import {Uploader, UploaderOptions} from '../../../../@shared/modules/uploader';
import {AuthService} from '../../../auth/auth.service';
import {NzCascaderOption} from 'ng-zorro-antd/cascader';
import options from './area';
import {StorageService} from '../../../../@core/services/storage.service';
import * as CryptoJS from 'crypto-js';
import * as _moment from 'moment';
import 'moment/locale/zh-cn';

_moment.locale('zh-cn')
interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}
const fileSizeLimit = 20 * 1024 * 1024;
@Component({
    selector: 'app-certificate-registration-item-detail',
    templateUrl: './declare.page.html',
    styleUrls: [
        './declare.page.scss'
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [DatePipe,
        {provide: MAT_DATE_LOCALE, useValue: 'zh_CN'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class AdminCertificateDeclarePage implements OnInit {
    token = this.authSvc.token();
    dataForm;
    company;
    id;
    regStateOptions: any = this.certificateSvc.workList;

    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                @Inject('PREFIX_URL') private PREFIX_URL,
                private datePipe: DatePipe,
                private companySvc: CompanyService,
                private authSvc: AuthService,
                private certificateSvc: CertificateService,
                private storage: StorageService,
                private toastSvc: ToastService) {
        const companyStoreData = this.storage.get('company');
        try {
            this.company = JSON.parse(companyStoreData);
        } catch (e) {
            this.company = {};
        }
        this.route.queryParams.subscribe(
            params => {
                // this.id = params['id'];
                this.id = params.id;
            }
        );
        if (this.id) {
            this.getData();
        }
        this.initForm({});
    }

    maxDate = new Date();
    nzOptions: NzCascaderOption[] = options;
    params = {
        id: this.id,
        fileId: null,
        name: '',
        status: 0,
        type: '1',
        time: '',
        firstTime: '',
        area: '',
        remark: '',
        firstArea: '',
        demension: '0',
        page: 1,
        rows: 10
    };
    fileName = '';
    running = false;
    uploader = new Uploader({
        url: this.PREFIX_URL + 'uploadFile',
        auto: true,
        params: {
            key: this.token, type: 'cust_cert', dir: 'cust_cert'
        },
        onUploadSuccess: (file, res) => {
            this.dataForm.get('work_md5').setValue(JSON.parse(res).result);
            this.fileName = file.file.name;
        }
    } as UploaderOptions);

    ngOnInit() {
        this.certificateSvc.workListSource.subscribe(res => {
            this.regStateOptions = res;
        });
    }

    handleFileChange(event) {
        const input = event.target;
        const file = input.files[0];
        if (this.running || !file) {
            return false;
        }
        if (file.size > fileSizeLimit) {
            this.toastSvc.show('文件大小超过20M,请重新选择文件上传', 1500, 'weui-icon-warn');
            return false;
        }
        this.toastSvc.loading('正在处理中...', 0);
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            const obj: any = (e.target as any).result;
            const wordArray = CryptoJS.lib.WordArray.create(obj);
            const hashDigest = CryptoJS.SHA256(wordArray).toString();
            this.dataForm.get('work_md5').setValue(hashDigest);
            this.fileName = file.name;
            this.toastSvc.hide();
            this.running = false;
        };

        fileReader.onerror = () => {
            this.running = false;
            this.toastSvc.hide();
            alert('读取文件错误');
        }
        fileReader.readAsArrayBuffer(file);
        this.running = true;

    }

    initForm(data) {
        if (!data.area) {
            const area = [];
            // tslint:disable-next-line:no-unused-expression
            data.c_province && area.push(data.c_province);
            data.c_city && area.push(data.c_city);
            data.c_district && area.push(data.c_district);
            data.area = area;
        }
        // this.params.status = data.publish_state;
        let formGroup:any = {
            owner_code: [data.owner_code || this.company.creditNumber, Validators.required],
            work_md5: [data.work_md5 || null, Validators.required],
            work_name: [data.work_name || '', [Validators.required, Validators.maxLength(30)]],
            work_type: [+data.work_type || '', Validators.required],
            publish_state: [data.publish_state || 0, Validators.required],
            finish_date: [data.finish_date || '', Validators.required],
            area: [data.area || null, Validators.required],
            work_des: [data.work_des || '', Validators.required],
        };

        if (data.publish_state === 1) {
            const area = [];
            data.p_province && area.push(data.p_province);
            data.p_city && area.push(data.p_city);
            data.p_district && area.push(data.p_district);
            data.firstArea = area;
            formGroup = {
                ...formGroup,
                firstArea: [data.firstArea || null, Validators.required],
                publish_date: [data.publish_date || null, Validators.required],
            };
        }
        this.dataForm = this.formBuilder.group(formGroup);
    }

    radioChange(e) {
        this.params.status = e.value;
        const data = this.dataForm.getRawValue();
        let formGroup:any = {
            owner_code: [data.owner_code || this.company.creditNumber, Validators.required],
            work_md5: [data.work_md5 || null, Validators.required],
            work_name: [data.work_name || '', [Validators.required, Validators.maxLength(30)]],
            work_type: [+data.work_type || '', Validators.required],
            publish_state: [data.publish_state || 0, Validators.required],
            finish_date: [data.finish_date || '', Validators.required],
            area: [data.area || null, Validators.required],
            work_des: [data.work_des || '', Validators.required],
        };
        if (e.value === 1) {
            formGroup = {
                ...formGroup,
                firstArea: [data.firstArea || null, Validators.required],
                publish_date: [data.publish_date || null, Validators.required],
            };
        }
        this.dataForm = this.formBuilder.group(formGroup);
    }

    submitData(type) {
        this.toastSvc.loading('加载中...', 0);
        const data = this.dataForm.getRawValue();
        const params:any = {
            id: this.id,
            owner_name: this.company.companyName,
            work_name: data.work_name,
            owner_code: data.owner_code,
            work_md5: data.work_md5,
            work_des: data.work_des,
            work_type: data.work_type,
            finish_date: _moment(data.finish_date).format('YYYY-MM-DD HH:mm:ss'),
            publish_state: data.publish_state,
            publish_date: data.publish_date && _moment(data.publish_date).format('YYYY-MM-DD HH:mm:ss'),
            c_province: data.area[0],
            c_city: data.area[1],
            c_district: data.area[2],
            p_province: data.firstArea && data.firstArea[0],
            p_city: data.firstArea && data.firstArea[1],
            p_district: data.firstArea && data.firstArea[2],
        }
        if (type === 'save') {
            this.certificateSvc.saveData(params).subscribe(res => {
                this.toastSvc.hide();
                this.toastSvc.success('已保存')
                this.router.navigate([`/admin/certificate/list`]);
            });
        }
        if (type === 'submit') {
            this.certificateSvc.addOrder().subscribe(res => {
                this.toastSvc.hide();
                this.router.navigate([`/admin/certificate/pay`], {
                    queryParams: {
                        ...params,
                        orderNos: res.result.join(',')
                    }
                });
            });
        }
    }

    getData() {
        this.toastSvc.loading('加载中...', 0);
        this.certificateSvc.getDetail({rid: this.id}).subscribe(res => {
            this.toastSvc.hide();
            this.initForm(res);
        });
    }
}

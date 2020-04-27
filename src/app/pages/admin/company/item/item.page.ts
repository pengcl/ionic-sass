import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, ValidationErrors, FormGroupDirective, NgForm} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material';
import {LoadingService} from '../../../../@core/services/loading.service';
import {ToastService} from '../../../../@core/modules/toast';
import {DialogService} from '../../../../@core/modules/dialog';
import {ModalService} from '../../../../@core/services/modal.service';
import {ModalController} from '@ionic/angular';
import {Uploader, UploaderOptions} from '../../../../@shared/modules/uploader';
import {AuthService} from '../../../auth/auth.service';
import {IndustryService} from '../../../../@shared/components/industry/industry.service';
import {IndustryComponent} from '../../../../@shared/components/industry/industry';
import {DictService} from '../../../../@core/services/dict.service';
import {AddressService} from '../../../../@core/services/address.service';
import {CompanyService} from '../company.service';
import {getIndex} from '../../../../@core/utils/utils';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTableDataSource} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

const colors = ['#00cc99', '#339999'];
const colors2 = ['#3399ff', '#3366ff', '#3300ff', '#330099'];
const colors3 = ['#ff0000', '#ff6600', '#ff9900', '#ffcc00'];
@Component({
    selector: 'app-admin-company-item',
    templateUrl: './item.page.html',
    styleUrls: ['./item.page.scss'],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'zh_CN'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class AdminCompanyItemPage implements OnInit {
    brandOption = {
        color: colors,
        tooltip: {
            trigger: 'item',
            formatter: '{d}%'
        },
        legend: {
            bottom: 0,
            data: ['执行人员', '管理人员'],
            itemWidth: 15,
            itemHeight: 15,
            radius: 4
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 25, name: '执行人员'},
                    {value: 75, name: '管理人员'}
                ]
            }
        ]
    };
    id = this.route.snapshot.params.id;
    industries;
    selectedIndustries = [];
    token = this.authSvc.token();
    form: FormGroup = new FormGroup({
        company: new FormGroup({
            custId: new FormControl(this.id, [Validators.required]),
            name: new FormControl('', [Validators.required]),
            mobile: new FormControl('', [Validators.required]),
            industryIds: new FormControl('', [Validators.required]),
            job: new FormControl('', []),
            operateDate: new FormControl('', [Validators.required])
        }),
        conds: new FormGroup({
            2: new FormControl('', []),
            17: new FormControl('', [Validators.required]),
            18: new FormControl('', [Validators.required]),
            19: new FormControl('', [Validators.required]),
            21: new FormControl('', []),
            25: new FormControl('', []),
            26: new FormControl('', []),
            28: new FormControl('', []),
            29: new FormControl('', []),
            24: new FormControl('', []),
            30: new FormControl('', []),
            31: new FormControl('', [])
        }),
        form: new FormGroup({}),
        match: new FormGroup({
            custId: new FormControl(this.id, [Validators.required]),
            conditions: new FormControl('', [Validators.required])
        })
    });
    submitted = false;

    uploader = {
        A: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.form.get('licenseFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        B: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.form.get('mechanismId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions)
    };
    company = this.companySvc.currentCompany;
    loading = false;
    cloudCompany;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: LocationStrategy,
                @Inject('PREFIX_URL') public PREFIX_URL,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private modalSvc: ModalService,
                private modalController: ModalController,
                private loadingSvc: LoadingService,
                private toastSvc: ToastService,
                private dialogSvc: DialogService,
                private dictSvc: DictService,
                private addressSvc: AddressService,
                private industrySvc: IndustryService,
                private authSvc: AuthService,
                private companySvc: CompanyService) {
        this.setForm([2, 17, 18, 19, 21, 24, 25, 26, 28, 29, 30, 31]);
    }

    option: any = {};
    dict = {};
    required = {
        num: 0,
        valueNum: 0,
        list: []
    };
    optional = {
        num: 0,
        valueNum: 0,
        list: []
    };
    conditions;

    ngOnInit() {
        this.getProvinces();
        this.companySvc.get(this.id).subscribe(res => {
            console.log(res.busCust);
            this.company = res.busCust;
            this.form.get('company').get('name').setValue(res.busCust.name);
            this.form.get('company').get('mobile').setValue(res.busCust.mobile);
            this.form.get('company').get('job').setValue(res.busCust.job);
            this.form.get('company').get('operateDate').setValue(res.busCust.operateDate);
            this.form.get('company').get('industryIds').setValue(res.busCust.industryIds);
            console.log(this.form.get('company').get('operateDate').value);
            this.companySvc.find(res.busCust.companyName).subscribe(cloud => {
                if (cloud.code === 20000) {
                    this.cloudCompany = cloud.data.companyDTO;
                    /*this.company = res.data.companyDTO;
                    this.form.get('companyName').setValue(this.company.companyName);
                    this.form.get('creditNumber').setValue(this.company.unifiedSocialCreditCode);
                    this.form.get('mechanismId').setValue(this.company.organizationCode);
                    this.form.get('address').setValue(this.company.address);
                    this.form.get('operateDate').setValue(this.company.registeredDate);*/
                }
            });

            this.industrySvc.list().subscribe(industries => {
                const selected = [];
                res.busCust.industryIds.split(',').forEach(id => {
                    const index = getIndex(industries, 'id', parseInt(id, 10));
                    if (index) {
                        console.log(index);
                        selected.push(industries[index]);
                    }
                });
                this.selectedIndustries = selected;
                this.setIndustries();
            });
        });
        this.companySvc.getCred(this.id).subscribe(res => {
            this.setupForm(res.conditions);
            this.conditions = res.conditions;
            this.setupForm(res.conditions);
            this.getData(res.conditions);
            this.getNum();
            this.form.valueChanges.subscribe(() => {
                this.getNum();
            });
        });
    }

    setupForm(conditions) {
        conditions.forEach(condition => {
            if (condition.fieldType === '0001') {
                // @ts-ignore
                this.form.controls.form.setControl(condition.conditionId,
                    new FormControl(condition.conditionVal === '1' ? true : condition.conditionVal === '0' ? false : '',
                        [!!condition.required ? Validators.required : Validators.nullValidator]));
            } else {
                if (condition.fieldType === '0002') {
                    this.dictSvc.get('condition_' + condition.conditionId).subscribe(res => {
                        this.dict[condition.conditionId] = res.result;
                    });
                }
                // @ts-ignore
                this.form.controls.form.setControl(condition.conditionId, new FormControl(condition.conditionVal,
                    [!!condition.required ? Validators.required : Validators.nullValidator]));
            }
        });
    }

    getNum() {
        this.required.valueNum = 0;
        this.optional.valueNum = 0;
        this.conditions.forEach(item => {
            if (!!item.required && this.form.get('form').get('' + item.conditionId).valid) {
                this.required.valueNum = this.required.valueNum + 1;
            }
            if (!item.required) {
                if (item.fieldType === '0001') {
                    if (typeof this.form.get('form').get('' + item.conditionId).value === 'boolean') {
                        this.optional.valueNum = this.optional.valueNum + 1;
                    }
                } else {
                    if (this.form.get('form').get('' + item.conditionId).value.toString().length > 0) {
                        this.optional.valueNum = this.optional.valueNum + 1;
                    }
                }
            }
        });
    }

    getData(conditions) {
        const required = {
            num: 0,
            valueNum: 0,
            list: []
        };
        const optional = {
            num: 0,
            valueNum: 0,
            list: []
        };
        const group = [];
        conditions.forEach(item => {
            if (!!item.required) {
                required.num = required.num + 1;
                required.list.push(item);
            } else {
                optional.num = optional.num + 1;
                if (group.length === 0) {
                    group.push({
                        _id: item.typeId,
                        _name: item.typeName,
                        list: [item]
                    });
                } else {
                    const index = getIndex(group, '_id', item.typeId);
                    if (index >= 0) {
                        group[index].list.push(item);
                    } else {
                        group.push({
                            _id: item.typeId,
                            _name: item.typeName,
                            list: [item]
                        });
                    }
                }
                optional.list = group;
            }
        });
        this.required = required;
        this.optional = optional;
    }

    getConditions() {
        const conditions = [];
        console.log(this.form.get('form').value);
        for (const key in this.form.get('form').value) {
            if (key) {
                conditions.push({
                    conditionId: key,
                    conditionVal: typeof this.form.get('form').get(key).value === 'boolean' ?
                        (this.form.get('form').get(key).value ? 1 : 0) : this.form.get('form').get(key).value
                });
            }
        }
        return JSON.stringify(conditions);
    }

    setForm(ids) {
        ids.forEach(id => {
            this.getVal(id);
        });
    }

    compareFn(c1, c2): boolean {
        return c1 && c2 ? c1.valId === c2.valId : c1 === c2;
    }

    getVal(id) {
        this.companySvc.condVal(this.id, id).subscribe(res => {
            res.result.forEach(item => {
                if (item.checked) {
                    this.form.get('conds').get(id + '').setValue({condId: item.condId, valId: item.id});
                }
            });
            this.option['' + id] = res.result;
        });
    }

    getProvinces() {

    }


    async presentModal() {
        const modal = await this.modalController.create({
            showBackdrop: true,
            component: IndustryComponent,
            componentProps: {items: this.selectedIndustries}
        });
        await modal.present();
        const {data} = await modal.onDidDismiss(); // 获取关闭传回的值
        this.form.get('company').get('industryIds').markAsTouched();
        this.selectedIndustries = data;
        console.log(this.selectedIndustries);
        this.setIndustries();
    }

    remove(item) {
        const index = getIndex(this.selectedIndustries, 'id', item.id);
        if (index >= 0) {
            this.selectedIndustries.splice(index, 1);
        }
        this.setIndustries();
    }

    setIndustries() {
        const ids = [];
        this.selectedIndustries.forEach(item => {
            ids.push(item.id);
        });
        this.form.get('company').get('industryIds').setValue(ids);
    }

    submit() {
        if (this.submitted) {
            this.router.navigate(['/admin/company/qualification', this.form.get('custId').value],
                {queryParams: {type: 0}});
            return false;
        }
        if (this.form.invalid) {
            return false;
        }
        this.loadingSvc.show('提交中...', 0).then();
        this.companySvc.update(this.form.value).subscribe(res => {
            this.loadingSvc.hide();
            if (res) {
                this.form.get('custId').setValue(res.busCust.id);
                this.submitted = true;
                const cancel = this.company ? '我知道了' : '不了';
                const confirm = this.company ? '' : '设为默认主体';
                this.dialogSvc.show({
                    content: (this.id === '0' ? '添加' : '修改') + ' "' + this.form.get('companyName').value + '" 成功',
                    cancel,
                    confirm
                }).subscribe((state) => {
                    if (state.value) {
                        this.companySvc.default(res.busCust.id);
                        this.companySvc.updateCompanyStatus(res.busCust);
                        this.router.navigate(['/admin/dashboard']);
                    } else {
                        if (this.id !== '0') {
                            this.location.back();
                        } else {
                            this.companySvc.default(res.busCust.id);
                            this.companySvc.updateCompanyStatus(res.busCust);
                            this.router.navigate(['/admin/dashboard']);
                        }
                    }
                });
            }
        });
    }

    save() {
        this.form.get('match').get('conditions').setValue(this.getConditions());
        if (this.form.invalid) {
            return false;
        }
        const body = {
            custId: this.id,
            custGradeConds: []
        };
        const values = this.form.get('conds').value;
        for (const key in values) {
            if (values[key]) {
                body.custGradeConds.push(this.form.get('conds').get(key).value);
            }
        }
        this.toastSvc.loading('加载中...', 0);
        this.companySvc.change(this.form.get('company').value).subscribe(() => {
            this.companySvc.updateCond(body).subscribe(res => {
                this.companySvc.updateCred(this.form.get('match').value).subscribe(() => {
                    this.toastSvc.hide();
                });
            });
        });
    }

}

import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingService} from '../../../../@core/services/loading.service';
import {DialogService} from '../../../../@core/modules/dialog';
import {AuthService} from '../../../auth/auth.service';
import {QualificationService} from './qualification.service';
import {DictService} from '../../../../@core/services/dict.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTableDataSource} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {SelectionModel} from '@angular/cdk/collections';
import {PlanService} from '../../plan/plan.service';
import {CompanyService} from '../company.service';
import {getIndex} from '../../../../@core/utils/utils';

@Component({
    selector: 'app-admin-company-qualification',
    templateUrl: 'qualification.page.html',
    styleUrls: ['qualification.page.scss'],
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
export class AdminCompanyQualificationPage implements OnInit {
    id = this.route.snapshot.params.id;
    type = '0';
    reportType = 1;
    data;
    formGroup: FormGroup;
    form: FormGroup = new FormGroup({});
    conditions;
    year = (new Date()).getFullYear();
    years = (() => {
        const years = [];
        for (let i = 0; i < 10; i++) {
            years.push({
                label: this.year - i + '年',
                value: this.year - i + ''
            });
        }
        return years;
    })();
    loading = false;
    required = {
        num: 0,
        list: []
    };
    optional = {
        num: 0,
        list: []
    };
    dict = {};

    displayedColumns: string[] = ['name', 'type', 'time', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
    params = {
        id: this.id,
        type: '',
        beginDate: '',
        endDate: '',
        demension: '0',
        page: 1,
        rows: 3
    };
    company;

    constructor(private title: Title,
                private route: ActivatedRoute,
                private router: Router,
                private location: LocationStrategy,
                private fb: FormBuilder,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private loadingSvc: LoadingService,
                private dialogSvc: DialogService,
                private authSvc: AuthService,
                private dictSvc: DictService,
                private planSvc: PlanService,
                private companySvc: CompanyService,
                private qualificationSvc: QualificationService) {
        this.formGroup = new FormGroup({
            id: new FormControl('', []),
            demension: new FormControl(this.type, [Validators.required]),
            custId: new FormControl(this.id, [Validators.required]),
            uniqueKey: new FormControl(this.type === '0' ? this.year : '', [Validators.required]),
            conditions: new FormControl('', [Validators.required])
        });

        planSvc.list(this.params).subscribe(res => {
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    setupForm(conditions) {
        conditions.forEach(condition => {
            if (condition.fieldType === '0001') {
                this.form.setControl(condition.conditionId, new FormControl(!!parseInt(condition.conditionVal, 10),
                    []));
            } else {
                if (condition.fieldType === '0002') {
                    this.dictSvc.get('condition_' + condition.conditionId).subscribe(res => {
                        this.dict[condition.conditionId] = res.result;
                    });
                }
                this.form.setControl(condition.conditionId, new FormControl(condition.conditionVal,
                    [!!condition.required ? Validators.required : Validators.nullValidator]));
            }
        });
    }

    ngOnInit() {
        this.title.setTitle(this.type === '0' ? '企业资质信息' : this.type === '1' ? '项目' : '员工');
        this.companySvc.get(this.id).subscribe(res => {
            this.company = res.busCust;
        });
        this.qualificationSvc.list(this.id, this.type).subscribe(res => {
            if (res[0]) {
                this.formGroup.get('id').setValue(res[0].credId);
                this.formGroup.get('uniqueKey').setValue(res[0].uniqueKey);
                this.conditions = res[0].conditions;
                this.setupForm(res[0].conditions);
                this.getData(res[0].conditions);
            } else {
                this.qualificationSvc.item(this.type, this.id).subscribe(result => {
                    this.conditions = result.conditions;
                    this.setupForm(result.conditions);
                    this.getData(result.conditions);
                });
            }
        });
    }

    getData(conditions) {
        const required = {
            num: 0,
            list: []
        };
        const optional = {
            num: 0,
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
        for (const key in this.form.value) {
            if (key) {
                conditions.push({
                    conditionId: key,
                    conditionVal: typeof this.form.get(key).value === 'boolean' ?
                        (this.form.get(key).value ? 1 : 0) : this.form.get(key).value
                });
            }
        }
        return JSON.stringify(conditions);
    }

    create(id, isFull) {
        this.qualificationSvc.create(id, isFull).subscribe(res => {
            this.loadingSvc.hide();
            this.loading = false;
            if (res) {
                this.dialogSvc.show({content: '成功生成方案' + res.name, cancel: '', confirm: '我知道了'}).subscribe(() => {
                    this.router.navigate(['/admin/plan/list'], {queryParams: {company: this.id}});
                });
            }
        });
    }

    submit(isFull) {
        const conditions = this.getConditions();
        this.formGroup.get('conditions').setValue(conditions);
        if (this.form.invalid || this.formGroup.invalid || this.loading) {
            return false;
        }
        this.loadingSvc.show('提交中...', 0).then();
        this.loading = true;
        this.qualificationSvc.add(this.formGroup.value).subscribe(res => {
            if (res) {
                this.create(res, isFull);
            } else {
                this.loadingSvc.hide();
                this.loading = false;
            }
        });
    }

    preDownload(id) {
        this.planSvc.preDownload(id, 1).subscribe();
    }

    back() {
        this.location.back();
    }

}

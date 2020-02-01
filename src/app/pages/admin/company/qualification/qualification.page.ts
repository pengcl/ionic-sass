import {Component, OnInit, Inject} from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingService} from '../../../../@core/services/loading.service';
import {DialogService} from '../../../../@core/modules/dialog';
import {AuthService} from '../../../auth/auth.service';
import {QualificationService} from './qualification.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

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
        console.log(years);
        return years;
    })();
    loading = false;

    constructor(private title: Title,
                private route: ActivatedRoute,
                private router: Router,
                private location: LocationStrategy,
                private fb: FormBuilder,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private loadingSvc: LoadingService,
                private dialogSvc: DialogService,
                private authSvc: AuthService,
                private qualificationSvc: QualificationService) {
        this.formGroup = new FormGroup({
            id: new FormControl('', []),
            demension: new FormControl(this.type, [Validators.required]),
            custId: new FormControl(this.id, [Validators.required]),
            uniqueKey: new FormControl(this.type === '0' ? (new Date()).getFullYear() : '', [Validators.required]),
            conditions: new FormControl('', [Validators.required])
        });
    }

    setupForm(conditions) {
        conditions.forEach(condition => {
            if (condition.fieldType === '0001') {
                this.form.setControl(condition.conditionId, new FormControl(!!parseInt(condition.conditionVal, 10),
                    []));
            } else {
                this.form.setControl(condition.conditionId, new FormControl(condition.conditionVal,
                    [!!condition.required ? Validators.required : Validators.nullValidator]));
            }
        });
    }

    ngOnInit() {
        this.title.setTitle(this.type === '0' ? '企业资质信息' : this.type === '1' ? '项目' : '员工');
        this.qualificationSvc.list(this.id, this.type).subscribe(res => {
            if (res[0]) {
                this.formGroup.get('id').setValue(res[0].credId);
                this.formGroup.get('uniqueKey').setValue(res[0].uniqueKey);
                this.conditions = res[0].conditions;
                this.setupForm(res[0].conditions);
            } else {
                this.qualificationSvc.item(this.type, this.id).subscribe(result => {
                    this.conditions = result.conditions;
                    this.setupForm(result.conditions);
                });
            }
            console.log(this.conditions);
        });
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

    back() {
        this.location.back();
    }

}

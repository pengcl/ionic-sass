import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../../@core/modules/toast';
import {DictService} from '../../../../../@core/services/dict.service';
import {DialogService} from '../../../../../@core/modules/dialog';
import {AddressService} from '../../../../../@core/services/address.service';
import {CompanyService} from '../../company.service';

import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTableDataSource} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {getIndex} from '../../../../../@core/utils/utils';

@Component({
    selector: 'app-admin-company-create-step3',
    templateUrl: './step3.page.html',
    styleUrls: ['../create.page.scss', './step3.page.scss'],
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
export class AdminCompanyCreateStep3Page implements OnInit {
    id = this.route.snapshot.params.id;
    reportType = 2;
    submitForm = new FormGroup({
        custId: new FormControl(this.id, [Validators.required]),
        conditions: new FormControl('', [Validators.required])
    });
    form: FormGroup = new FormGroup({});
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

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: LocationStrategy,
                private toastSvc: ToastService,
                private dialogSvc: DialogService,
                private dictSvc: DictService,
                private addressSvc: AddressService,
                private companySvc: CompanyService) {
    }

    ngOnInit() {
        this.companySvc.getCred(this.id).subscribe(res => {
            console.log(res.conditions);
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
                this.form.setControl(condition.conditionId,
                    new FormControl(condition.conditionVal === '1' ? true : condition.conditionVal === '0' ? false : '',
                        [!!condition.required ? Validators.required : Validators.nullValidator]));
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
        console.log(this.form);
    }

    getNum() {
        this.required.valueNum = 0;
        this.optional.valueNum = 0;
        this.conditions.forEach(item => {
            if (!!item.required && this.form.get('' + item.conditionId).valid) {
                this.required.valueNum = this.required.valueNum + 1;
            }
            if (!item.required) {
                if (item.fieldType === '0001') {
                    if (typeof this.form.get('' + item.conditionId).value === 'boolean') {
                        this.optional.valueNum = this.optional.valueNum + 1;
                    }
                } else {
                    if (this.form.get('' + item.conditionId).value.toString().length > 0) {
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

    submit() {
        if (this.form.invalid) {
            return false;
        }
        this.submitForm.get('conditions').setValue(this.getConditions());
        if (this.submitForm.invalid) {
            return false;
        }
        this.toastSvc.loading('提交中...', 0);
        this.companySvc.updateCred(this.submitForm.value).subscribe(res => {
            this.toastSvc.hide();
            this.router.navigate(['/admin/company/list']);
        });
    }

    remark(id,e){

    }

}

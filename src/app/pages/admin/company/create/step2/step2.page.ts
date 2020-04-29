import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../../@core/modules/toast';
import {DialogService} from '../../../../../@core/modules/dialog';
import {ModalController} from '@ionic/angular';
import {AddressService} from '../../../../../@core/services/address.service';
import {CompanyService} from '../../company.service';
import {IndustryService} from '../../../../../@shared/components/industry/industry.service';
import {getIndex} from '../../../../../@core/utils/utils';
import {IndustryComponent} from '../../../../../@shared/components/industry/industry';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTableDataSource} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DictService} from '../../../../../@core/services/dict.service';

const colors = ['#00cc99', '#339999'];
const colors2 = ['#3399ff', '#3366ff', '#3300ff', '#330099'];
const colors3 = ['#ff0000', '#ff6600', '#ff9900', '#ffcc00'];

@Component({
    selector: 'app-admin-company-create-step2',
    templateUrl: './step2.page.html',
    styleUrls: ['../create.page.scss', './step2.page.scss'],
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
export class AdminCompanyCreateStep2Page implements OnInit {
    id = this.route.snapshot.params.id;
    // 2, 17, 18, 19, 21, 25, 26, 28, 29,24,30,31
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
    option: any = {};
    company;
    industries;
    names;
    circle: any = {};
    selectedIndustries = [];
    required = {
        num: 0,
        valueNum: 0,
        list: []
    };
    dict = {};
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
                center: ['50%', '35%'],
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
    conditions;
    optional = {
        num: 0,
        valueNum: 0,
        list: []
    };

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: LocationStrategy,
                private modalController: ModalController,
                private toastSvc: ToastService,
                private dialogSvc: DialogService,
                private industrySvc: IndustryService,
                private addressSvc: AddressService,
                private companySvc: CompanyService,
                private dictSvc: DictService) {
        this.setForm([2, 17, 18, 19, 21, 24, 25, 26, 28, 29, 30, 31]);
    }

    ngOnInit() {
        this.industrySvc.list().subscribe(res => {
            this.industries = res;
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

    compareFn(c1, c2): boolean {
        const result = c1 && c2 ? c1.valId === c2.valId : c1 === c2;
        if (result) {
            console.log(c1.condId);
        }
        return c1 && c2 ? c1.valId === c2.valId : c1 === c2;
    }

    selectionChange(key, ids) {
        const data: any = {};
        data[key] = [];
        ids.forEach(id => {
            const value = this.form.get('conds').get(id + '').value;
            const options = this.option[id];
            const index = getIndex(options, 'id', value.valId);
            const option = options[index];
            let label = '';
            if (id === 2) {
                label = '管理人员';
            }
            if (id === 28) {
                label = '专科';
            }
            if (id === 29) {
                label = '本科及以上';
            }
            if (id === 31) {
                label = '专科';
            }
            if (id === 30) {
                label = '本科及以上';
            }
            if (id === 21) {
                label = '研发';
            }
            if (id === 25) {
                label = '销售';
            }
            if (id === 26) {
                label = '服务';
            }
            data[key].push({id, value: option.name, label});
        });
        this.getCircle(key, data[key]);
    }

    getCircle(id, items) {
        console.log(id);
        const option = JSON.parse(JSON.stringify(this.brandOption));
        if (id === 'job') {
            option.color = colors2;
        }
        if (id === 'edu' || id === 'sci') {
            option.color = colors3;
        }
        option.legend.data = [];
        option.series[0].data = [];
        let other = 100;
        items.forEach(item => {
            const value = parseInt(item.value.replace('%', ''), 10);
            other = other - value;
            const name = item.label;
            option.legend.data.push(name);
            option.series[0].data.push({
                name, value
            });
        });
        option.legend.data.push('其它');
        option.series[0].data.push({
            name: '其它',
            value: other
        });
        this.circle[id] = option;
        console.log(this.circle);
    }

    setForm(ids) {
        ids.forEach(id => {
            this.getVal(id);
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

    getVal(id) {
        this.companySvc.condVal(this.id, id).subscribe(res => {
            this.option['' + id] = res.result;
        });
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

    dateChange(e) {
        this.form.get('company').get('operateDate').setValue(e.value._i.year + '-' + e.value._i.month + '-' + e.value._i.date);
    }

    submit() {
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
                this.toastSvc.hide();
                console.log(res);
                this.router.navigate(['/admin/company/create/step3', this.id]);
            });
        });
    }

}

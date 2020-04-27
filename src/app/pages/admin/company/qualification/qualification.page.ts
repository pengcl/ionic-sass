import {Component, OnInit, Inject, ViewChild} from '@angular/core';
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
import {DashboardService} from '../../dashboard/dashboard.service';

const colors = ['#5F8FF3', '#69EBB7'];
const colors2 = ['#FFB559', '#5F8FF3', '#5D6F92', '#F46C50'];
const colors3 = ['#69EBB7', '#5F8FF3', '#56CFFF'];
const colors4 = ['#63A0E9', '#97C0F0'];
const colors5 = ['#8DE1DE', '#6F9CD2', '#E26767'];
const colors6 = ['#E4F5C2', '#8DE1DE', '#6F9CD2'];
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
    data;
    subsidy = {
        quick: {
            tooltip: {},
            series: [
                {
                    name: '速度',
                    type: 'gauge',
                    z: 3,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 10
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length: 15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    title: {
                        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic'
                    },
                    data: [{value: 0, count: 0}]
                }
            ]
        },
        keChuangBao: {
            tooltip: {},
            series: [
                {
                    name: '速度',
                    type: 'gauge',
                    z: 3,
                    axisLine: {            // 坐标轴线
                        lineStyle: {       // 属性lineStyle控制线条样式
                            width: 10
                        }
                    },
                    axisTick: {            // 坐标轴小标记
                        length: 15,        // 属性length控制线长
                        lineStyle: {       // 属性lineStyle控制线条样式
                            color: 'auto'
                        }
                    },
                    splitLine: {           // 分隔线
                        length: 20,         // 属性length控制线长
                        lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                            color: 'auto'
                        }
                    },
                    title: {
                        // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        fontWeight: 'bolder',
                        fontSize: 20,
                        fontStyle: 'italic'
                    },
                    data: [{value: 0, count: 0}]
                }
            ]
        }
    };
    brandOption = {
        color: colors,
        tooltip: {
            trigger: 'item',
            formatter: '{d}%'
        },
        legend: {
            bottom: 0,
            data: ['执行人员', '管理人员'],
            itemWidth: 7,
            itemHeight: 7,
            icon: 'circle'
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
    subsidyOption = {
        color: colors,
        grid: {
            left: '3%',
            right: '10%',
            bottom: '10%'
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            name: '万元',
            fontSize: '14px'
        },
        yAxis: {
            axisLabel: false,
            type: 'category',
            data: []
        },
        series: [
            {
                type: 'bar',
                data: [100, 200],
                label: {
                    show: true,
                    position: 'left',
                    color: '#21333F'
                },
                itemStyle: {
                    normal: {
                        color: (params) => {
                            const colorList = colors;
                            return colorList[params.dataIndex];
                        }
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    copyOption = {
        color: colors5,
        legend: {
            left: 40,
            bottom: 0,
            data: ['已注册', '申请中', '无效'],
            itemWidth: 7,
            itemHeight: 7,
            itemGap: 20,
            textStyle: {
                fontSize: 12,
                color: '#60717D'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {

            type: 'category',
            data: ['2018', '2019'],
            axisTick: {
                alignWithLabel: true,
                interval: 0
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '无效',
                type: 'bar',
                stack: '1',
                data: [1, 2, 3],
                barWidth: 14
            },
            {
                name: '申请中',
                type: 'bar',
                stack: '1',
                data: [1, 2, 3],
                barWidth: 14
            },
            {
                name: '已注册',
                type: 'bar',
                stack: '1',
                data: [1, 2, 3],
                barWidth: 14
            }
        ]
    };
    group = {
        color: colors6,
        legend: {
            left: 40,
            bottom: 0,
            data: ['执行人员', '管理人员'],
            itemWidth: 8,
            itemHeight: 8,
            radius: 2
        },
        xAxis: [
            {
                type: 'category',
                axisTick: {show: false},
                data: ['2012', '2013', '2014', '2015', '2016']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Forest',
                type: 'bar',
                barGap: 0,
                data: [320, 332, 301, 334, 390]
            },
            {
                name: 'Steppe',
                type: 'bar',
                data: [220, 182, 191, 234, 290]
            },
            {
                name: 'Desert',
                type: 'bar',
                data: [150, 232, 201, 154, 190]
            },
            {
                name: 'Wetland',
                type: 'bar',
                data: [98, 77, 101, 99, 40]
            }
        ]
    };
    id = this.route.snapshot.params.id;
    type = '0';
    reportType = 1;
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
        valueNum: 0,
        list: []
    };
    optional = {
        num: 0,
        valueNum: 0,
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
    company = this.companySvc.currentCompany;

    form: FormGroup = new FormGroup({
        custId: new FormControl(this.company.id, [Validators.required]),
        province: new FormControl('', [Validators.required]),
        area: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required])
    });
    policy = {
        total: 0,
        update: 0,
        list: []
    };
    brand;
    scientific;
    option: any = {};
    circle: any = {};
    amt: any = {
        keChuangBao: 0,
        quick: 0,
        rate: 0
    };

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
                private qualificationSvc: QualificationService,
                private dashboardSvc: DashboardService) {
        planSvc.list(this.params).subscribe(res => {
            this.dataSource = new MatTableDataSource<any>(res.list);
        });

        this.form.get('province').setValue(this.company.province);
        this.form.get('city').setValue(this.company.city);
        this.form.get('area').setValue(this.company.area);
        this.dashboardSvc.policies(this.form.value).subscribe(res => {
            this.policy.list = res.list.sort((a, b) => {
                return a.reportDateEnd - b.reportDateEnd;
            });
        });
        this.dashboardSvc.subsidies(this.company.id).subscribe(res => {
            this.amt.keChuangBao = res.keChuangBaoAmt;
            this.amt.quick = res.quickAmt;
            this.amt.rate = (res.keChuangBaoAmt - res.quickAmt) !== 0 ? ((res.keChuangBaoAmt - res.quickAmt) * 100 / res.quickAmt)
                .toFixed(2) : 0;
            this.subsidy.keChuangBao.series[0].data[0].value = res.keChuangBaoAmt;
            this.subsidy.keChuangBao.series[0].data[0].count = res.keChuangBaoCount;
            this.subsidy.quick.series[0].data[0].value = res.quickAmt;
            this.subsidy.quick.series[0].data[0].count = res.quickCount;
        });
    }

    ngOnInit() {
        this.title.setTitle(this.type === '0' ? '企业资质信息' : this.type === '1' ? '项目' : '员工');
        this.companySvc.get(this.id).subscribe(res => {
            this.company = res.busCust;
        });
        this.companySvc.source(this.id).subscribe(res => {
            this.data = res;
            this.brand = (() => {
                const list = [];
                list.push(this.getGroupValue(-100));
                list.push(this.getGroupValue(-101));
                list[0].label = '行业深度';
                list[1].label = '经营广度';
                return list;
            })();
            this.scientific = (() => {
                const list = [];
                list.push(this.getGroupValue(9));
                list.push(this.getGroupValue(10));
                list[0].label = '科研成果';
                list[1].label = '科研能力';
                return list;
            })();
            this.getHBar(6, '个');
            this.getHBar(4, '%');
            this.getVBar(8);
            this.getCircle('job', [{id: 21, label: '研发'}, {id: 25, label: '销售'}, {id: 26, label: '服务'}]);
            this.getCircle('edu', [{id: 28, label: '专科'}, {id: 29, label: '本科及以上'}]);
            this.getCircle('sci', [{id: 31, label: '专科'}, {id: 30, label: '本科及以上'}]);
            this.getCircle('man', [{id: 2, label: '管理人员'}]);
            this.getCircle('sci-rate', [{id: 21, label: '研发'}]);
            this.getGroupBar(9);
        });
    }

    getDate(end) {
        return Math.round((end - Date.parse(new Date().toString())) / 86400000);
    }

    getCircle(id, items) {
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
            let value = this.getCondValue(item.id);
            other = other - value;
            value = typeof value !== 'string' ? value : parseInt(value.split('-')[1], 10);
            const name = item.label;
            option.legend.data.push(item.label);
            option.series[0].data.push({name, value});
        });
        option.legend.data.push('其它');
        option.series[0].data.push({
            name: '其它',
            value: other
        });
        this.circle[id] = option;
    }

    getHBar(id, unit) {
        const chats = this.getChatValue(id);
        const option = JSON.parse(JSON.stringify(this.subsidyOption));
        option.xAxis.name = unit;
        option.yAxis.data = [];
        option.series[0].data = [];
        chats.forEach((item, index) => {
            option.yAxis.data.push(item.text);
            option.series[0].data.push(item.count);
            option.series[0].label = {
                show: true,
                position: 'insideLeft',
                formatter: (params) => {
                    return params.name;
                }
            };
            option.series[0].itemStyle.normal = {
                color: (params) => {
                    const colorList = colors4;
                    return colorList[params.dataIndex];
                }
            };
        });
        this.option[id] = option;
    }

    getGroupBar(id) {
        const chats = this.getChatValue(id);
        const option = JSON.parse(JSON.stringify(this.group));
        option.series = option.series.slice(0, 3);
        option.legend.data = ['发明专利', '实用新型专利', '软件著作权'];
        option.series[0].name = '发明专利';
        option.series[0].data = [];
        option.series[1].name = '实用新型专利';
        option.series[1].data = [];
        option.series[2].name = '软件著作权';
        option.series[2].data = [];
        option.xAxis[0].data = [];
        chats.forEach(item => {
            option.xAxis[0].data.push(item.text);
            option.series[0].data.push(item.count);
            option.series[1].data.push(item.count1);
            option.series[2].data.push(item.count2);
        });
        this.option[id] = option;
    }

    getVBar(id) {
        const chats = this.getChatValue(id);
        const option = JSON.parse(JSON.stringify(this.copyOption));
        option.legend.data = ['已注册', '申请中', '无效'];
        option.xAxis.data = [];
        option.series[0].data = [];
        option.series[0].name = '已注册';
        option.series[1].data = [];
        option.series[1].name = '申请中';
        option.series[2].data = [];
        option.series[2].name = '无效';
        chats.forEach(item => {
            option.legend.data.push(item.text);
            option.xAxis.data.push(item.text);
            option.series[0].data.push(item.count2);
            option.series[1].data.push(item.count);
            option.series[2].data.push(item.count1);
        });
        this.option[id] = option;
    }

    getCondValue(id, key?) {
        const index = getIndex(this.data.conds, 'condId', id);
        const cond = this.data.conds[index];
        let value: any = '';
        if (key) {
            value = cond[key] ? cond[key] : '-';
        } else {
            value = '-';
            if (cond) {
                const v2 = cond.val2;
                const v1 = cond.val1;
                const v0 = cond.val;
                if (v2) {
                    value = v1 + '-' + v2;
                } else {
                    value = v0;
                }
            }
        }
        return value;
    }

    getChatValue(id) {
        const list = [];
        this.data.charts.forEach(item => {
            if (item.groupId === id) {
                list.push(item);
            }
        });
        return list;
    }

    getGroupValue(id) {
        const body = this.data.gradeTargetGroups[getIndex(this.data.gradeTargetGroups, 'targetId', id)];
        return body;
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

    remark(content, e) {
        e.preventDefault();
    }

    preDownload(id) {
        this.planSvc.preDownload(id, 1).subscribe();
    }

    back() {
        this.location.back();
    }

}

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
import {AdminDashboardPage} from '../../dashboard/dashboard.page';
import {DashboardService} from '../../dashboard/dashboard.service';

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
    res = {
        'code': '0000',
        'result': {
            'id': 0,
            'gradeModelOperations': {
                'id': 4,
                'name': '差',
                'operation': '<',
                'val1': 5,
                'modelId': 3
            },
            'gradeModules': [
                {
                    'id': 4,
                    'name': '第一个模块'
                },
                {
                    'id': 23,
                    'name': '第二个测试模块'
                }
            ],
            'gradeModuleOperations': [
                {
                    'id': 10,
                    'name': '普通',
                    'suggest': '11111',
                    'moduleId': 4
                },
                {
                    'id': 22,
                    'name': '第二个',
                    'suggest': '真的时很差',
                    'moduleId': 23
                }
            ],
            'gradeTargets': [],
            //评分集合
            'gradeTargetGroups': [
                {	//行业深度
                    'id': -100,
                    'name': '待加强',
                    'score': 100,
                    'suggest': '',
                    'isStandardeCond': 0
                },
                {//经营广度
                    'id': -101,
                    'name': '待加强',
                    'score': 100,
                    'suggest': '',
                    'isStandardeCond': 0
                }
            ],
            'gradeTargetStanderdeGroups': [],
            'gradeConds': [],
            'gradeCondVals': [],
            'charts': [
                {
                    'groupId': 1,
                    'count': 2,				//商标数量
                    'text': '助 卡趴停车',		//商标名称
                    'count1': 5				//使用年限
                },

                {
                    'groupId': 2,
                    'count': 3,				//数量
                    'text': '2015'			//年份
                },

                {
                    'groupId': 5,
                    'text': '35'				//商标类别编码
                },

                {
                    'groupId': 3,
                    'count': 1,				//数量
                    'text': '广告销售',		//类别名称
                    'count1': 18				//行业平均水平
                },

                {
                    'groupId': 6,
                    'count': 4,				//数量
                    'text': '运输贮藏'		//类别名称
                },
                {
                    'groupId': 9,
                    'count': 1,				//发明专利数量
                    'text': '2015',			//年份
                    'count1': 0,				//实用新型专利数量
                    'count2': 0				//软著数量
                },

                {
                    'groupId': 7,
                    'count': 5,				//数量
                    'text': '发明专利',		//显示值
                    'count1': 5				//行业平均水平
                },
                {
                    'groupId': 4,
                    'count': 5,				//研发费用占比
                    'text': '研发费用占比',	//可以无视
                    'count1': 5				//行业平均研发费用占比
                },
                {
                    'groupId': 8,
                    'text': '2015', //年份
                    'count': 1, // 申请中数量
                    'count1': 1,//已失效数量
                    'count2': 1 //已注册数量
                },
                {
                    'groupId': 8,
                    'text': '2016', //年份
                    'count': 1, // 申请中数量
                    'count1': 1,//已失效数量
                    'count2': 1 //已注册数量
                },
                {
                    'groupId': 8,
                    'text': '2017', //年份
                    'count': 1, // 申请中数量
                    'count1': 1,//已失效数量
                    'count2': 1 //已注册数量
                },
                {
                    'groupId': 8,
                    'text': '2018', //年份
                    'count': 1, // 申请中数量
                    'count1': 1,//已失效数量
                    'count2': 1 //已注册数量
                },
                {
                    'groupId': 8,
                    'text': '2019', //年份
                    'count': 1, // 申请中数量
                    'count1': 1,//已失效数量
                    'count2': 1 //已注册数量
                }
            ],
            'conds': [

                {
                    'createTime': 1587373429000,
                    'id': 7,
                    'custId': 'd9c500f5263811eab1fb00163e0e6521',
                    'condId': 19,
                    'valId': 441,
                    'val': 10000,
                    'val1': '1000',
                    'val2': '10000'
                },
                {
                    'createTime': 1587373429000,
                    'id': 8,
                    'custId': 'd9c500f5263811eab1fb00163e0e6521',
                    'condId': 18,
                    'valId': 435,
                    'val': 300,
                    'val1': '100',
                    'val2': '300'
                },
                {
                    'createTime': 1587622615000,
                    'id': 9,
                    'custId': 'd9c500f5263811eab1fb00163e0e6521',
                    'condId': 17,
                    'valId': 446,
                    'val': 8000,
                    'val1': '2000',
                    'val2': '8000'
                },
                {
                    'condId': 7,
                    'val': 7
                },
                {
                    'condId': 0,
                    'valId': 35
                },
                {
                    'condId': 11,
                    'val': 16
                }
            ],
            //行业信息
            'busindustry': {
                'createTime': 1584168757000,
                'createBy': 'cf0d55b21a6a11eab1fb00163e0e6521',
                'updateTime': 1584168757000,
                'updateBy': 'cf0d55b21a6a11eab1fb00163e0e6521',
                'createByName': 'qinzhenyu',
                'updateByName': 'qinzhenyu',
                'id': 35,
                'industryName': '互联网+',
                'explainContent': '互联网+',
                'summaryContent': '',
                'pointContent': '',
                'status': 1,
                'registedBrandCode': '9',
                'registedBrandCount': 12,
                'registedBrandCode2': '35',
                'registedBrandCount2': 18,
                'registedBrandCode3': '42',
                'registedBrandCount3': 8,
                'inventionCount': 5,
                'practicalCount': 30,
                'softwareCopyrightCount': 36,
                'relationCondValId': 35,
                'relationCondValName': '软件和信息技术服务业',
                'registedBrandName': '第九类——科学仪器',
                'registedBrandName2': '第三十五类——广告销售',
                'registedBrandName3': '第四十二类——科技服务'
            }
        }
    };
    data = this.res.result;
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
        color: ['#69EBB7', '#5F8FF3'],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            bottom: 0,
            data: ['执行人员', '管理人员'],
            itemWidth: 8,
            itemHeight: 8,
            borderRadius: 50
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
                        fontSize: '30',
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
        color: ['#3bcec6'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            name: '万元',
            fontSize: '14px'
        },
        yAxis: {
            type: 'category',
            data: ['科创直通车可获得', '快速培育可获得']
        },
        series: [
            {
                type: 'bar',
                data: [100, 200],
                label: {
                    show: true,
                    position: 'right',
                    color: '#21333F'
                },
                itemStyle: {
                    normal: {
                        color: (params) => {
                            const colorList = ['rgba(13, 215, 141, 1)', 'rgba(254, 174, 77, 1)'];
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
        color: ['#ff5257', '#27d78f', '#36a0f4'],
        legend: {
            bottom: 10,
            data: ['已注册', '申请中', '无效'],
            itemWidth: 8,
            itemHeight: 8,
            textStyle: {
                fontSize: 10
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
    brand = (() => {
        const list = [];
        list.push(this.data.gradeTargetGroups[getIndex(this.data.gradeTargetGroups, 'id', -100)]);
        list.push(this.data.gradeTargetGroups[getIndex(this.data.gradeTargetGroups, 'id', -101)]);
        list[0].label = '行业深度';
        list[1].label = '经营广度';
        return list;
    })();
    option: any = {};

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
        /*this.formGroup = new FormGroup({
            id: new FormControl('', []),
            demension: new FormControl(this.type, [Validators.required]),
            custId: new FormControl(this.id, [Validators.required]),
            uniqueKey: new FormControl(this.type === '0' ? this.year : '', [Validators.required]),
            conditions: new FormControl('', [Validators.required])
        });*/
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
            console.log(res);
            this.subsidy.keChuangBao.series[0].data[0].value = res.keChuangBaoAmt;
            this.subsidy.keChuangBao.series[0].data[0].count = res.keChuangBaoCount;
            this.subsidy.quick.series[0].data[0].value = res.quickAmt;
            this.subsidy.quick.series[0].data[0].count = res.quickCount;
        });
    }

    getDate(end) {
        return Math.round((end - Date.parse(new Date().toString())) / 86400000);
    }

    /*setupForm(conditions) {
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
    }*/

    ngOnInit() {
        console.log(this.data);
        this.title.setTitle(this.type === '0' ? '企业资质信息' : this.type === '1' ? '项目' : '员工');
        this.companySvc.get(this.id).subscribe(res => {
            this.company = res.busCust;
        });
        /*this.qualificationSvc.list(this.id, this.type).subscribe(res => {
            if (res[0]) {
                this.formGroup.get('id').setValue(res[0].credId);
                this.formGroup.get('uniqueKey').setValue(res[0].uniqueKey);
                this.conditions = res[0].conditions;
                this.setupForm(res[0].conditions);
                this.getData(res[0].conditions);
                this.getNum();
                this.form.valueChanges.subscribe(() => {
                    this.getNum();
                });
            } else {
                this.qualificationSvc.item(this.type, this.id).subscribe(result => {
                    this.conditions = result.conditions;
                    this.setupForm(result.conditions);
                    this.getData(result.conditions);
                    this.getNum();
                    this.form.valueChanges.subscribe(() => {
                        this.getNum();
                    });
                });
            }
        });*/
        this.getHBar(6);
        this.getVBar(8);
    }

    getHBar(id) {
        const chats = this.getChatValue(id);
        const option = JSON.parse(JSON.stringify(this.subsidyOption));
        option.yAxis.data = [];
        option.series[0].data = [];
        chats.forEach(item => {
            option.yAxis.data.push(item.text);
            option.series[0].data.push(item.count);
        });
        this.option[id] = option;
    }

    getVBar(id) {
        const chats = this.getChatValue(id);
        const option = JSON.parse(JSON.stringify(this.copyOption));
        option.legend.data = [];
        option.xAxis.data = [];
        option.series[0].data = [];
        option.series[1].data = [];
        option.series[2].data = [];
        chats.forEach(item => {
            option.legend.data.push(item.text);
            option.xAxis.data.push(item.text);
            option.series[0].data.push(item.count2);
            option.series[1].data.push(item.count);
            option.series[2].data.push(item.count1);
        });
        console.log(option);
        this.option[id] = option;
    }

    getCondValue(id) {
        const index = getIndex(this.data.conds, 'condId', id);
        const cond = this.data.conds[index];
        let value: any = '-';
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

    /*submit(isFull) {
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
    }*/

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

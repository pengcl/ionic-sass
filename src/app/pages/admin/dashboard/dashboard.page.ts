import {Component, Inject, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {CompanyService} from '../company/company.service';
import {MonitorService} from '../monitor/monitor.service';
import {PlanService} from '../plan/plan.service';
import {RiskService} from '../risk/risk.service';
import {DashboardService} from './dashboard.service';
import {DialogService} from '../../../@core/modules/dialog';
import * as echarts from 'echarts';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AddressService} from '../../../@core/services/address.service';
import {LoadingController} from '@ionic/angular';
import {TicketService} from '../ticket/ticket.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {MatSnackBar} from '@angular/material';
import {getIndex} from '../../../@core/utils/utils';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss']
})
export class AdminDashboardPage {
    option = {
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
    };
    quick;
    keChuangBao;
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
        count: 0,
        pie: null,
        line: null
    };
    copyOption = {
        count: 0,
        pie: null,
        line: null
    };
    patentOption = {
        count: 0,
        pie: null,
        line: null
    };
    company = this.companySvc.currentCompany;
    matchingStatus;
    monitors;
    plans;
    risks;
    trustStatus;
    boxStatus;
    form: FormGroup = new FormGroup({
        custId: new FormControl(this.company.id, [Validators.required]),
        province: new FormControl('', [Validators.required]),
        area: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required])
    });
    provinces = [];
    cities = [];
    districts = [];

    policy = {
        total: 0,
        update: 0,
        list: []
    };

    dateTime = new Date();
    completions;
    ticket = {
        ing: 0,
        error: 0,
        end: 0,
        displayedColumns: ['content', 'status', 'progress', 'actions'],
        dataSource: null,
        selection: new SelectionModel<any>(true, [])
    };
    displayedColumns: string[] = ['name', 'time', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);

    monitorDisplayedColumns: string[] = ['name', 'time', 'actions'];
    monitorDataSource;
    guarantee = {
        one: false,
        two: false,
        three: false
    };
    data;
    brand;
    scientific;

    constructor(private router: Router,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private snackBar: MatSnackBar,
                private dialogSvc: DialogService,
                private companySvc: CompanyService,
                private monitorSvc: MonitorService,
                private planSvc: PlanService,
                private riskSvc: RiskService,
                private ticketSvc: TicketService,
                private dashboardSvc: DashboardService,
                private addressSvc: AddressService,
                private loadingController: LoadingController) {
        dashboardSvc.matchingStatus(this.company.id).subscribe(res => {
            this.matchingStatus = res;
        });
        dashboardSvc.trustStatus(this.company.id).subscribe(res => {
            this.trustStatus = res;
        });
        dashboardSvc.boxStatus(this.company.id).subscribe(res => {
            this.boxStatus = res;
        });
        monitorSvc.list({custId: this.company.id}).subscribe(res => {
            this.monitors = res.list;
        });
        planSvc.list({id: this.company.id, demension: '0', rows: 3}).subscribe(res => {
            this.plans = res.list;
        });
        riskSvc.list({custId: this.company.id, rows: 3}).subscribe(res => {
            this.risks = res.list;
        });
        this.getProvinces();
        this.form.get('province').valueChanges.subscribe(res => {
            this.cities = [];
            this.districts = [];
            this.getCities();
        });
        this.form.get('city').valueChanges.subscribe(res => {
            this.districts = [];
            this.getDistricts();
        });
        this.form.get('area').valueChanges.subscribe(() => {
            const body = {
                custId: this.form.get('custId').value,
                province: this.form.get('province').value,
                area: this.form.get('area').value,
                city: this.form.get('city').value
            };
            this.dashboardSvc.policies(body).subscribe(res => {
                this.policy.total = res.totalCount;
                this.policy.update = res.updateCount;
                this.policy.list = res.list;
                this.policy.list.sort(this.compare('reportDateEnd'));
            });
        });

        this.form.get('province').setValue(this.company.province);
        this.form.get('city').setValue(this.company.city);
        this.form.get('area').setValue(this.company.area);
        this.dashboardSvc.completions(this.company.id).subscribe(res => {
            let total = 0;
            res.forEach(item => {
                total = total + item.editCount;
                item.value = Math.round(item.editCount * 100 / item.totalCount) / 100;
                item.rate = (item.value * 100).toFixed(0);
            });
            if (total === 0) {
                this.completions = [];
            } else {
                this.completions = res;
            }
        });
        this.dashboardSvc.subsidies(this.company.id).subscribe(res => {
            this.keChuangBao = JSON.parse(JSON.stringify(this.option));
            this.quick = JSON.parse(JSON.stringify(this.option));
            this.keChuangBao.series[0].data[0].value = res.keChuangBaoAmt;
            this.keChuangBao.series[0].data[0].count = res.keChuangBaoCount;
            this.quick.series[0].data[0].value = res.quickAmt;
            this.quick.series[0].data[0].count = res.quickCount;
        });
        this.ticketSvc.statistics(this.company.id).subscribe(res => {
            this.ticket.ing = res.serviceCount;
            this.ticket.error = res.errCount;
            this.ticket.end = res.finishedCount;
            this.ticket.dataSource = new MatTableDataSource<any>(res.list);
        });
        this.dashboardSvc.copies(this.company.id).subscribe(res => {
            this.copyOption.count = res.totalCount;
            const pieLabels = [];
            const pieData = [];
            res.pieCharts.forEach(item => {
                pieLabels.push(item.typeName);
                pieData.push({
                    name: item.typeName,
                    value: item.dataCount
                });
            });
            this.copyOption.pie = {
                color: ['#3a9cfd', '#3a9aca', '#3e9793', '#389868'],
                legend: {
                    bottom: 10,
                    data: pieLabels,
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        fontSize: 10
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '10%',
                    containLabel: true
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['57%', '60%'],
                        data: [{name: '1', value: '1'}],
                        hoverOffset: 0,
                        label: {
                            show: false
                        }
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['30%', '55%'],
                        label: {
                            position: 'outside',
                            formatter: '{d}%',
                            fontSize: 10
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                        },
                        labelLine: {
                            length: 7,
                            length2: 7
                        },
                        itemStyle: {
                            borderWidth: 2,
                            borderType: 'solid',
                            borderColor: '#fff'
                        },
                        data: pieData,
                        hoverOffset: 0
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['25%', '28%'],
                        data: [{name: '1', value: '1'}],
                        hoverOffset: 0,
                        label: {
                            show: false
                        }
                    }
                ]
            };
            const years = [];
            const series = [
                {
                    name: '无效',
                    type: 'bar',
                    stack: '1',
                    data: [],
                    barWidth: 14
                },
                {
                    name: '申请中',
                    type: 'bar',
                    stack: '1',
                    data: [],
                    barWidth: 14
                },
                {
                    name: '已注册',
                    type: 'bar',
                    stack: '1',
                    data: [],
                    barWidth: 14
                }
            ];
            res.histograms.sort((a, b) => {
                return a.applyYear - b.applyYear;
            });
            res.histograms.forEach(item => {
                years.push(item.applyYear);
                series[0].data.push(item.invalidCount);
                series[1].data.push(item.applyCount);
                series[2].data.push(item.registerCount);
            });
            this.copyOption.line = {
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
                    data: years,
                    axisTick: {
                        alignWithLabel: true,
                        interval: 0
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series
            };
        });
        this.dashboardSvc.brands(this.company.id).subscribe(res => {
            this.brandOption.count = res.totalCount;
            const pieLabels = [];
            const pieData = [];
            res.pieCharts.forEach(item => {
                pieLabels.push(item.typeName);
                pieData.push({
                    name: item.typeName,
                    value: item.dataCount
                });
            });
            this.brandOption.pie = {
                color: ['#3a9cfd', '#3a9aca', '#3e9793', '#389868'],
                legend: {
                    bottom: 10,
                    data: pieLabels,
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        fontSize: 10
                    }
                },
                grid: {
                    left: '20%',
                    right: '20%',
                    bottom: '20%',
                    containLabel: true
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['57%', '60%'],
                        data: [{name: '1', value: '1'}],
                        hoverOffset: 0,
                        label: {
                            show: false
                        }
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['30%', '55%'],
                        label: {
                            position: 'outside',
                            formatter: '{d}%',
                            fontSize: 10
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                        },
                        labelLine: {
                            length: 7,
                            length2: 7
                        },
                        data: pieData,
                        itemStyle: {
                            borderWidth: 2,
                            borderType: 'solid',
                            borderColor: '#fff'
                        },
                        hoverOffset: 0
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['25%', '28%'],
                        data: [{name: '1', value: '1'}],
                        hoverOffset: 0,
                        label: {
                            show: false
                        }
                    }
                ]
            };
            const years = [];
            const series = [
                {
                    name: '无效',
                    type: 'bar',
                    stack: '1',
                    data: [],
                    barWidth: 14
                },
                {
                    name: '申请中',
                    type: 'bar',
                    stack: '1',
                    data: [],
                    barWidth: 14
                },
                {
                    name: '已注册',
                    type: 'bar',
                    stack: '1',
                    data: [],
                    barWidth: 14
                }
            ];
            res.histograms.sort((a, b) => {
                return a.applyYear - b.applyYear;
            });
            res.histograms.forEach(item => {
                years.push(item.applyYear);
                series[0].data.push(item.invalidCount);
                series[1].data.push(item.applyCount);
                series[2].data.push(item.registerCount);
            });
            this.brandOption.line = {
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
                    data: years,
                    axisTick: {
                        alignWithLabel: true,
                        interval: 0
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series
            };
        });
        this.dashboardSvc.patents(this.company.id).subscribe(res => {
            this.patentOption.count = res.totalCount;
            const pieLabels = [];
            const pieData = [];
            res.pieCharts.forEach(item => {
                pieLabels.push(item.typeName);
                pieData.push({
                    name: item.typeName,
                    value: item.dataCount
                });
            });
            this.patentOption.pie = {
                color: ['#3a9cfd', '#3a9aca', '#3e9793', '#389868'],
                legend: {
                    bottom: 10,
                    data: pieLabels,
                    itemWidth: 8,
                    itemHeight: 8,
                    textStyle: {
                        fontSize: 10
                    }
                },
                grid: {
                    left: '10%',
                    right: '10%',
                    bottom: '10%',
                    containLabel: true
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['57%', '60%'],
                        data: [{name: '1', value: '1'}],
                        hoverOffset: 0,
                        label: {
                            show: false
                        }
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['30%', '55%'],
                        label: {
                            position: 'outside',
                            formatter: '{d}%',
                            fontSize: 10
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                        },
                        labelLine: {
                            length: 7,
                            length2: 7
                        },
                        data: pieData,
                        itemStyle: {
                            borderWidth: 2,
                            borderType: 'solid',
                            borderColor: '#fff'
                        },
                        hoverOffset: 0
                    },
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['25%', '28%'],
                        data: [{name: '1', value: '1'}],
                        hoverOffset: 0,
                        label: {
                            show: false
                        }
                    }
                ]
            };
            const years = [];
            const series = [
                {
                    name: '无效',
                    type: 'bar',
                    stack: '1',
                    data: [],
                    barWidth: 14
                },
                {
                    name: '申请中',
                    type: 'bar',
                    stack: '1',
                    data: [],
                    barWidth: 14
                },
                {
                    name: '已注册',
                    type: 'bar',
                    stack: '1',
                    data: [],
                    barWidth: 14
                }
            ];
            res.histograms.sort((a, b) => {
                return a.applyYear - b.applyYear;
            });
            res.histograms.forEach(item => {
                years.push(item.applyYear);
                series[2].data.push(item.registerCount ? item.registerCount : 0);
                series[1].data.push(item.applyCount ? item.applyCount : 0);
                series[0].data.push(item.invalidCount ? item.invalidCount : 0);
            });
            this.patentOption.line = {
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
                    data: years,
                    axisTick: {
                        alignWithLabel: true,
                        interval: 0
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series
            };
        });

        monitorSvc.list({custId: this.company.id}).subscribe(res => {
            this.monitorDataSource = new MatTableDataSource<any>(res.list);
        });

        companySvc.source(this.company.id).subscribe(res => {
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
        });
    }

    getDate(end) {
        return Math.round((end - Date.parse(new Date().toString())) / 86400000);
    }

    addMonitor(e) {
        this.router.navigate(['/admin/monitor/list']);
    }

    checkout(e) {
        this.router.navigate(['/admin/checkout']);
    }

    trust(e) {
        this.router.navigate(['/admin/trust/list']);
    }

    plan(e) {
        this.router.navigate(['/admin/plan/list']);
    }

    preDownload(id) {
        this.planSvc.preDownload(id, 1).subscribe();
    }

    getProvinces() {
        this.provinces = this.addressSvc.provinces();
    }

    getCities() {
        this.cities = this.addressSvc.cities(this.form.get('province').value);
    }

    getDistricts() {
        this.districts = this.addressSvc.districts(this.form.get('province').value, this.form.get('city').value);
    }

    to_company() {
        this.router.navigate(['admin/company/list']);
    }

    toBox() {
        this.router.navigate(['admin/box/list']);
    }

    toCheckout() {
        this.router.navigate(['admin/checkout']);
    }

    openSnackBar() {
        this.snackBar.open('功能即将开放，敬请期待', '', {
            duration: 1000
        });
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

    getGroupValue(id) {
        const body = this.data.gradeTargetGroups[getIndex(this.data.gradeTargetGroups, 'targetId', id)];
        return body;
    }

    async presentLoading(target?) {
        const loading = await this.loadingController.create({
            message: '功能即将开放，敬请期待',
            duration: 1000,
            spinner: null
        });
        await loading.present();
        await loading.onDidDismiss().then(() => {
            if (target) {
                this.guarantee[target] = false;
            }
        });
    }

    compare(property) {
        return (a, b) => {
            const value1 = a[property];
            const value2 = b[property];
            return value1 - value2;
        };
    }
}

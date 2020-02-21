import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {CompanyService} from '../company/company.service';
import {MonitorService} from '../monitor/monitor.service';
import {PlanService} from '../plan/plan.service';
import {RiskService} from '../risk/risk.service';
import {DashboardService} from './dashboard.service';
import * as echarts from 'echarts';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AddressService} from '../../../@core/services/address.service';
import {LoadingController} from '@ionic/angular';
import {TicketService} from '../ticket/ticket.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss']
})
export class AdminDashboardPage {
    subsidyOption;
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

    constructor(private router: Router,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private snackBar: MatSnackBar,
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
                console.log(this.policy.list);
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
            if (res.keChuangBaoAmt + res.quickAmt === 0) {
                this.subsidyOption = null;
            } else {
                this.subsidyOption = {
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
                        data: ['科创宝培育可获得', '快速培育可获得']
                    },
                    series: [
                        {
                            type: 'bar',
                            data: [res.keChuangBaoAmt, res.quickAmt],
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
            }
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
            duration: 1000,
        });
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

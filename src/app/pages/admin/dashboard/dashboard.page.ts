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

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss']
})
export class AdminDashboardPage {
    subsidyOption;
    brandOption = {
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
        province: new FormControl('', []),
        area: new FormControl('', []),
        city: new FormControl('', [])
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

    constructor(private router: Router,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
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
        this.form.get('province').setValue(this.company.province);
        this.form.get('city').setValue(this.company.city);
        this.form.get('area').setValue(this.company.area);
        this.dashboardSvc.policies(this.form.value).subscribe(res => {
            this.policy.total = res.totalCount;
            this.policy.update = res.updateCount;
            this.policy.list = res.list;
        });

        this.dashboardSvc.completions(this.company.id).subscribe(res => {
            res.forEach(item => {
                item.value = Math.round(item.editCount * 100 / item.totalCount) / 100;
                item.rate = (item.value * 100).toFixed(0);
            });
            this.completions = res;
        });

        this.dashboardSvc.subsidies(this.company.id).subscribe(res => {
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
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.01]
                },
                yAxis: {
                    type: 'category',
                    data: ['科创宝培育可获得', '快速培育可获得', '目前已获得']
                },
                series: [
                    {
                        type: 'bar',
                        data: [res.keChuangBaoAmt, res.quickAmt, res.hasBeenAmt],
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
        });
        this.ticketSvc.statistics(this.company.id).subscribe(res => {
            this.ticket.ing = res.serviceCount;
            this.ticket.error = res.errCount;
            this.ticket.end = res.finishedCount;
            this.ticket.dataSource = new MatTableDataSource<any>(res.list);
        });
        this.dashboardSvc.copies(this.company.id).subscribe(res => {
        });
        this.dashboardSvc.brands(this.company.id).subscribe(res => {
            console.log(res);
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
                    data: pieLabels
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['40%', '55%'],
                        label: {
                            position: 'inner',
                            formatter: '{d}%'
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                        },
                        data: pieData
                    }
                ]
            };
            const years = [];
            const series = [
                {
                    name: '已注册',
                    type: 'bar',
                    stack: '1',
                    data: [320, 302, 301]
                },
                {
                    name: '申请中',
                    type: 'bar',
                    stack: '1',
                    data: [320, 302, 301]
                },
                {
                    name: '无效',
                    type: 'bar',
                    stack: '1',
                    data: [320, 302, 301]
                }
            ];
            res.histograms.forEach(item => {
                years.push(item.applyYear);
                series[0].data.push(item.registerCount);
                series[1].data.push(item.applyCount);
                series[2].data.push(item.invalidCount);
            });
            this.brandOption.line = {
                color: ['#ff5257', '#27d78f', '#36a0f4'],
                legend: {
                    bottom: 10,
                    data: ['已注册', '申请中', '无效'],
                    width: 6,
                    height: 6,
                    borderRadius: 3
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {

                    type: 'category',
                    data: years
                },
                yAxis: {
                    type: 'value'
                },
                series
            };
        });
        this.dashboardSvc.patents(this.company.id).subscribe(res => {
        });
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

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: '功能即将开发，敬请期待',
            duration: 1000
        });
        await loading.present();
        await loading.onDidDismiss();
    }
}

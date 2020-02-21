import {Component, OnInit} from '@angular/core';
import {DashboardService} from '../../dashboard/dashboard.service';
import {CompanyService} from '../../company/company.service';
import {Router} from '@angular/router';
import {PolicyService} from '../policy.service';
import {MatTableDataSource} from '@angular/material';

@Component({
    selector: 'app-policy',
    templateUrl: './policy.component.html',
    styleUrls: ['./policy.component.scss']
})
export class AdminPolicyPage {
    subsidyOption;
    company = this.companySvc.currentCompany;
    policy;
    dateTime = new Date();
    dataSource;
    displayedColumns: ['name', 'money', 'type', 'scope', 'time', 'actions'];

    constructor(private dashboardSvc: DashboardService,
                private companySvc: CompanyService,
                private router: Router,
                private policySvc: PolicyService) {
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

        this.policySvc.count(this.company.id).subscribe(res => {
            this.policy = res;
        });

        this.policySvc.item(this.company.id).subscribe(res => {
            this.dataSource = new MatTableDataSource<any>(res.list);
            console.log(this.dataSource);
        });
    }

    toPolicyItem() {
        this.router.navigate(['/admin/policy/list']);
    }

}

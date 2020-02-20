import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from '../../dashboard/dashboard.service';
import {CompanyService} from '../../company/company.service';
import {PlanService} from '../plan.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

import {map} from 'rxjs/operators';

@Component({
    selector: 'app-admin-plan-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class AdminPlanItemPage implements OnInit {
    id = this.route.snapshot.params.id;
    option = {
        pie: null,
        line: null
    };
    company = this.companySvc.currentCompany;
    data;
    displayedColumns: string[] = ['select', 'name', 'money', 'time'];
    dataSource;
    selection = new SelectionModel<any>(true, []);

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private dashboardSvc: DashboardService,
                private companySvc: CompanyService,
                private planSvc: PlanService) {
        this.route.paramMap.pipe(map(params => this.id = params.get('id'))).subscribe(id => {
            planSvc.item(this.id).subscribe(res => {
                this.data = res;
                this.dataSource = new MatTableDataSource<any>(res.policys);
                this.dataSource.data.forEach(row => this.selection.select(row));
                const pieLabels = ['版权数量', '商标数量', '专利数量'];
                const pieData = [
                    {
                        name: '版权数量',
                        value: res.softwareCopyRight + res.productCopyRight
                    },
                    {
                        name: '商标数量',
                        value: res.brandCount
                    },
                    {
                        name: '专利数量',
                        value: res.patentCount
                    }
                ];
                this.option.pie = {
                    color: ['#3a9cfd', '#3a9aca', '#389868'],
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
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: true
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['67%', '70%'],
                            data: [{name: '1', value: '1'}],
                            hoverOffset: 0,
                            label: {
                                show: false
                            }
                        },
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: ['40%', '65%'],
                            label: {
                                position: 'outside',
                                formatter: '{d}%',
                                fontSize: 10
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
                            radius: ['35%', '38%'],
                            data: [{name: '1', value: '1'}],
                            hoverOffset: 0,
                            label: {
                                show: false
                            }
                        }
                    ]
                };

                this.option.line = {
                    color: ['#3bcec6'],
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
                        data: ['研究生学历以上人数', '企业研发团队人数', '个税申缴人数', '现有员工人数']
                    },
                    series: [
                        {
                            type: 'bar',
                            data: [res.graduatesCount, res.rndCount, res.taxPayableCount, res.employeeCount],
                            label: {
                                show: true,
                                position: 'right',
                                color: '#21333F'
                            },
                            itemStyle: {
                                normal: {
                                    color: (params) => {
                                        const colorList = ['rgba(13, 215, 141, 1)', 'rgba(254, 174, 77, 1)', '#feae4d'];
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
        });

    }

    ngOnInit() {
    }

    preDownload() {
        this.planSvc.preDownload(this.id, 1).subscribe();
    }

    download() {
        this.preDownload();
        window.location.href = this.FILE_PREFIX_URL + this.data.fileId;
    }

    /** Gets the total cost of all transactions. */
    getTotalCost() {
        let cost = 0;
        this.selection.selected.forEach(item => {
            cost = cost + item.subsidyAmtEnd;
        });
        return cost;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

}

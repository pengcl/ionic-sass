import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from '../../dashboard/dashboard.service';
import {CompanyService} from '../../company/company.service';
import {PlanService} from '../plan.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

import {map} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-admin-plan-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class AdminPlanItemPage implements OnInit {
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
            right: '8%',
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
    id = this.route.snapshot.params.id;
    option = {
        pie: null,
        line: null
    };
    total = 0;
    company = this.companySvc.currentCompany;
    data;
    displayedColumns: string[] = ['select', 'name', 'money', 'time'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
    params = {
        custId: this.company.id,
        page: 1,
        rows: 10
    };
    policies;
    form: FormGroup = new FormGroup({
        custId: new FormControl(this.company.id, [Validators.required]),
        province: new FormControl('', [Validators.required]),
        area: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required])
    });
    policy = {
        list: []
    };

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private dashboardSvc: DashboardService,
                private companySvc: CompanyService,
                private planSvc: PlanService) {
        this.route.paramMap.pipe(map(params => this.id = params.get('id'))).subscribe(id => {
            planSvc.item(this.id).subscribe(res => {
                this.data = res;
                this.policies = res.policys;
                this.total = this.policies.length;
                this.getData();
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

        this.form.get('province').setValue(this.company.province);
        this.form.get('city').setValue(this.company.city);
        this.form.get('area').setValue(this.company.area);
        this.dashboardSvc.policies(this.form.value).subscribe(res => {
            this.policy.list = res.list.sort((a, b) => {
                return a.reportDateEnd - b.reportDateEnd;
            });
        });

    }

    ngOnInit() {
    }

    getDate(end) {
        return Math.round((end - Date.parse(new Date().toString())) / 86400000);
    }

    getData() {
        const rows = JSON.parse(JSON.stringify(this.policies)).slice((this.params.page - 1) * this.params.rows, this.params.page * this.params.rows);
        console.log(this.policies);
        this.dataSource = new MatTableDataSource<any>(rows);
        this.selection = new SelectionModel<any>(true, []);
        this.dataSource.data.forEach(row => this.selection.select(row));
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
        this.policies.forEach(item => {
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

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }
}

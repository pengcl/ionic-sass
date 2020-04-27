import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DashboardService} from '../../dashboard/dashboard.service';
import {CompanyService} from '../../company/company.service';
import {PlanService} from '../plan.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

import {map} from 'rxjs/operators';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {getIndex} from '../../../../@core/utils/utils';

const colors = ['#FFB559', '#5F8FF3', '#5D6F92', '#F46C50'];
const colors2 = ['#69EBB7', '#5F8FF3', '#56CFFF'];
const colors3 = ['#5F8FF9', '#5AD8A6'];
const color4 = ['#6497EE', '#75EBE7'];

@Component({
    selector: 'app-admin-plan-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class AdminPlanItemPage implements OnInit {
    brandOption = {
        color: colors,
        tooltip: {
            trigger: 'item',
            formatter: '{d}%'
        },
        legend: {
            bottom: 0,
            data: ['执行人员', '管理人员'],
            itemWidth: 8,
            itemHeight: 8,
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
    copyOption = {
        color: colors,
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
    lineOption = {
        color: colors3,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['企业现状', '行业水平'],
            right: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '企业现状',
                type: 'line',
                stack: '总量',
                data: [120, 132, 101, 134, 90, 230, 210]
            },
            {
                name: '行业水平',
                type: 'line',
                stack: '总量',
                data: [220, 182, 191, 234, 290, 330, 310]
            }
        ]
    };
    groupOption = {
        color: color4,
        legend: {
            data: ['2011年', '2012年'],
            bottom: 0,
            itemWidth: 7,
            itemHeight: 7,
            icon: 'circle',
            left: 70,
            itemGap: 20,
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
        },
        series: [
            {
                name: '2011年',
                type: 'bar',
                data: [18203, 23489, 29034, 104970, 131744, 630230]
            },
            {
                name: '2012年',
                type: 'bar',
                data: [19325, 23438, 31000, 121594, 134141, 681807]
            }
        ]
    };
    id = this.companySvc.currentCompany.id;
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
    circle: any = {};
    brand;
    scientific;
    amt: any = {
        keChuangBao: 0,
        quick: 0,
        rate: 0
    };
    items: any[] = Array(45)
        .fill(0)
        .map((v: any, i: number) => i);
    types;

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private dashboardSvc: DashboardService,
                private companySvc: CompanyService,
                private planSvc: PlanService) {
        this.route.paramMap.pipe(map(params => this.id = params.get('id'))).subscribe(id => {
            planSvc.item(this.id).subscribe(res => {
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
        this.companySvc.source(this.company.id).subscribe(res => {
            this.data = res;
            this.getVBar(8);
            this.getCircle('job', [{id: 21, label: '研发'}, {id: 25, label: '销售'}, {id: 26, label: '服务'}]);
            this.getCircle('edu', [{id: 28, label: '专科'}, {id: 29, label: '本科及以上'}]);
            this.getGroupBar(3);
            this.getGroupBar(7);
            this.getLineBar(2);
            const selectedTypes = this.getChatValue(5);
            const items = Array(45)
                .fill(0)
                .map((v: any, i: number) => i);
            const types = [];
            items.forEach(item => {
                const index = getIndex(selectedTypes, 'text', item + '');
                let selected = false;
                if (typeof index === 'number') {
                    selected = true;
                }
                types.push({
                    id: item + 1,
                    selected
                });
            });
            this.types = types;
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
        this.dashboardSvc.subsidies(this.company.id).subscribe(res => {
            this.amt.keChuangBao = res.keChuangBaoAmt;
            this.amt.quick = res.quickAmt;
            this.amt.rate = (res.keChuangBaoAmt - res.quickAmt) !== 0 ? ((res.keChuangBaoAmt - res.quickAmt) * 100 / res.quickAmt)
                .toFixed(2) : 0;
        });
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
        this.option[id] = option;
    }

    getLineBar(id) {
        const option = JSON.parse(JSON.stringify(this.lineOption));
        const charts = this.getChatValue(id);
        option.xAxis.data = [];
        option.series[0].data = [];
        option.series[1].data = [];
        charts.forEach(item => {
            option.xAxis.data.push(item.text);
            option.series[0].data.push(item.count);
            option.series[1].data.push(item.count1);
        });
        // todo count1 is disappear
        this.option[id] = option;
    }

    getGroupBar(id) {
        const option = JSON.parse(JSON.stringify(this.groupOption));
        const charts = this.getChatValue(id);
        option.legend.data = ['企业现况', '行业平均水平'];
        option.series[0].name = '企业现况';
        option.series[1].name = '行业平均水平';
        option.yAxis.data = [];
        option.series[0].data = [];
        option.series[1].data = [];
        charts.forEach((item, index) => {
            option.yAxis.data.push(item.text);
            option.series[0].data.push(item.count);
            option.series[1].data.push(item.count1);
        });
        this.option[id] = option;
    }

    getCircle(id, items) {
        const option = JSON.parse(JSON.stringify(this.brandOption));
        option.legend.data = [];
        option.series[0].data = [];
        if (id === 'edu') {
            option.color = colors2;
        }
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

    getDate(end) {
        return Math.round((end - Date.parse(new Date().toString())) / 86400000);
    }

    getData() {
        const rows = JSON.parse(JSON.stringify(this.policies)).slice((this.params.page - 1) * this.params.rows, this.params.page * this.params.rows);
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

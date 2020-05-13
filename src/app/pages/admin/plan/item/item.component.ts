import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DialogService} from '../../../../@core/modules/dialog';
import {DashboardService} from '../../dashboard/dashboard.service';
import {CompanyService} from '../../company/company.service';
import {PlanService} from '../plan.service';

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
                itemStyle: {
                    borderWidth: 1,
                    borderType: 'solid',
                    borderColor: '#fff'
                },
                label: {
                    show: true,
                    position: 'inside',
                    formatter: '{d}' + '%'
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
            },
            axisLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            },
            axisLabel: {
                color: '#B5C4D0'
            },
            splitLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            },
            axisLabel: {
                color: '#B5C4D0'
            },
            splitLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            }
        },
        series: [
            {
                name: '无效',
                type: 'bar',
                stack: '1',
                data: [1, 2, 3],
                barWidth: 7
            },
            {
                name: '申请中',
                type: 'bar',
                stack: '1',
                data: [1, 2, 3],
                barWidth: 7
            },
            {
                name: '已注册',
                type: 'bar',
                stack: '1',
                data: [1, 2, 3],
                barWidth: 7
            }
        ]
    };
    lineOption = {
        color: colors3,
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['企业现状'],
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
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            },
            axisLabel: {
                color: '#B5C4D0'
            },
            splitLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            },
            axisLabel: {
                color: '#B5C4D0'
            },
            splitLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            }
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
            itemGap: 20
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            },
            axisLabel: {
                color: '#B5C4D0'
            },
            splitLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'],
            axisLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            },
            axisLabel: {
                color: '#5F717D'
            },
            splitLine: {
                lineStyle: {
                    color: '#EEF2F5'
                }
            }
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
    id = (() => {
        let id = this.companySvc.currentCompany.id;
        if (!!this.route.snapshot.queryParams.id) {
            id = this.route.snapshot.queryParams.id;
        }
        return id;
    })();
    option = {
        pie: null,
        line: null
    };
    total = 0;
    company;
    data;
    form: FormGroup = new FormGroup({
        custId: new FormControl(this.id, [Validators.required]),
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
    top3 = [
        {},
        {},
        {}
    ];

    constructor(private route: ActivatedRoute,
                private router: Router,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private dialogSvc: DialogService,
                private dashboardSvc: DashboardService,
                private companySvc: CompanyService) {
        this.route.queryParamMap.pipe(map(queryParam => this.id = queryParam.get('id') ? queryParam.get('id') : this.companySvc.currentCompany.id)).subscribe(id => {
            this.getData();
        });

    }

    ngOnInit() {
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
        });
        // todo count1 is disappear
        this.option[id] = option;
    }

    getGroupBar(id) {
        const option = JSON.parse(JSON.stringify(this.groupOption));
        const charts = this.getChatValue(id);
        charts.sort((a, b) => {
            return a.count - b.count;
        });
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

    getCond(id) {
        const index = getIndex(this.data.conds, 'condId', id);
        const cond = this.data.conds[index];
        return cond || {};
    }

    getCondValue(id, key?) {
        const index = getIndex(this.data.conds, 'condId', id);
        const cond = this.data.conds[index];
        if (!cond) {
            return '-';
        }
        let value: any = '-';
        if (key) {
            value = cond[key] ? cond[key] : '-';
        } else {
            value = '-';
            if (cond) {
                const v2 = cond.val2;
                const v0 = cond.val;
                if (v2) {
                    value = v2;
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
        return body || {};
    }

    getDate(end) {
        return Math.round((end - Date.parse(new Date().toString())) / 86400000);
    }

    getData() {
        this.companySvc.source(this.id).subscribe(res => {
            if (res.id) {
                this.data = res;
                this.getVBar(8);
                this.getCircle('job', [{id: 21, label: '研发'}, {id: 25, label: '销售'}, {id: 26, label: '服务'}]);
                this.getCircle('edu', [{id: 28, label: '专科'}, {id: 29, label: '本科及以上'}]);
                this.getGroupBar(3);
                this.getGroupBar(7);
                this.getLineBar(2);
                const top3 = this.getChatValue(1);
                if (top3.length > 0) {
                    this.top3 = top3;
                }
                const selectedTypes = this.getChatValue(5);
                console.log(selectedTypes);
                const items = Array(45)
                    .fill(0)
                    .map((v: any, i: number) => i);
                const types = [];
                items.forEach(item => {
                    const index = getIndex(selectedTypes, 'text', item + 1 + '');
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
                console.log(this.types);
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
            } else {
                this.dialogSvc.show({
                    title: '使用提醒',
                    content: '您当前使用的企业数据版本过旧，无法生成企业智能画像。请按照流程完成数据更新，感谢配合。',
                    cancel: '',
                    confirm: '更新数据'
                }).subscribe(() => {
                    this.router.navigate(['/admin/company/item/', this.company.id]);
                });
            }
        });
        this.dashboardSvc.subsidies(this.id).subscribe(res => {
            this.amt.keChuangBao = res.keChuangBaoAmt;
            this.amt.quick = res.quickAmt;
            this.amt.rate = (res.keChuangBaoAmt - res.quickAmt) !== 0 ? ((res.keChuangBaoAmt - res.quickAmt) * 100 / res.quickAmt)
                .toFixed(2) : 0;
        });
        this.companySvc.get(this.id).subscribe(res => {
            this.company = res.busCust;
            this.form.get('province').setValue(this.company.province);
            this.form.get('city').setValue(this.company.city);
            this.form.get('area').setValue(this.company.area);
            this.dashboardSvc.policies(this.form.value).subscribe(result => {
                this.policy.list = result.list.sort((a, b) => {
                    return a.reportDateEnd - b.reportDateEnd;
                });
            });
        });
    }
}

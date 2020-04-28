import {Component, ElementRef, OnInit} from '@angular/core';
import {DashboardService} from '../../dashboard/dashboard.service';
import {CompanyService} from '../../company/company.service';
import {Router} from '@angular/router';
import {PolicyService} from '../policy.service';
import {MatTableDataSource} from '@angular/material';
import {LoadingService} from '../../../../@core/services/loading.service';
import {ToastService} from '../../../../@core/modules/toast';
import * as G2 from '@antv/g2';
import {registerShape} from '@antv/g2';

@Component({
    selector: 'app-policy',
    templateUrl: './policy.component.html',
    styleUrls: ['./policy.component.scss']
})
export class AdminPolicyPage {
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
    subsidyOption;
    company = this.companySvc.currentCompany;
    policy;
    dateTime = new Date();
    dataSource;
    displayedColumns = ['name', 'money', 'type', 'scope', 'time', 'actions'];
    params = {
        custId: this.company.id,
        page: 1,
        rows: 10
    };
    total = 0;
    quick;
    keChuangBao;
    chartOption;
    chartOption2;

    constructor(private dashboardSvc: DashboardService,
                private companySvc: CompanyService,
                private router: Router,
                private policySvc: PolicyService,
                private toastSvc: ToastService,
                private el: ElementRef) {
        this.dashboardSvc.subsidies(this.company.id).subscribe(res => {
            this.keChuangBao = JSON.parse(JSON.stringify(this.option));
            this.quick = JSON.parse(JSON.stringify(this.option));
            this.keChuangBao.series[0].data[0].value = res.keChuangBaoAmt;
            this.keChuangBao.series[0].data[0].count = res.keChuangBaoCount;
            this.quick.series[0].data[0].value = res.quickAmt;
            this.quick.series[0].data[0].count = res.quickCount;
            setTimeout(() => {
                this.drawChart(this.quick.series[0].data[0].value);
                this.drawChart2(this.keChuangBao.series[0].data[0].value);
            });
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
                        data: ['科创直通车可获得', '快速培育可获得']
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
        this.getData();
    }

    drawChart(cvalue) {
        const _value = this.quick.series[0].data[0].value > this.keChuangBao.series[0].data[0].value ? (cvalue / this.quick.series[0].data[0].value) * 6 : (cvalue / this.keChuangBao.series[0].data[0].value) * 6;
        this.chartOption = [
            {value: _value}
        ];

        const chartContainer = this.el.nativeElement.querySelector('#c1');
        // 自定义Shape 部分
        registerShape('point', 'pointer', {
            draw(cfg, container) {
                const group = container.addGroup({});
                // 获取极坐标系下画布中心点
                const center = this.parsePoint({x: 0, y: 0});
                // 绘制指针
                group.addShape('line', {
                    attrs: {
                        x1: center.x,
                        y1: center.y,
                        x2: cfg.x,
                        y2: cfg.y,
                        stroke: '#389AFF',
                        lineWidth: 2,
                        lineCap: 'round'
                    }
                });
                group.addShape('circle', {
                    attrs: {
                        x: center.x,
                        y: center.y,
                        r: 3,
                        stroke: '#389AFF',
                        lineWidth: 1,
                        fill: '#fff'
                    }
                });
                return group;
            }
        });

        const color = ['#389AFF', '#389AFF', '#389AFF'];
        const chart = new G2.Chart({
            container: chartContainer,
            width: 200,
            height: 174
        });
        chart.data(this.chartOption);
        chart.animate(false);

        chart.coordinate('polar', {
            startAngle: (-9 / 8) * Math.PI,
            endAngle: (1 / 8) * Math.PI,
            radius: 0.85
        });
        chart.scale('value', {
            min: 0,
            max: 6,
            tickInterval: 1
        });

        chart.axis('1', false);
        chart.axis('value', {
            line: null,
            label: {
                offset: -20,
                style: {
                    fontSize: 10,
                    fill: '#E5ECF3',
                    textAlign: 'center',
                    textBaseline: 'middle'
                }
            },
            tickLine: {
                length: -14
            },
            grid: null
        });
        chart.legend(false);
        chart.tooltip(false);
        chart
            .point()
            .position('value*1')
            .shape('pointer')
            .color('value', (val) => {
                if (val < 2) {
                    return color[0];
                } else if (val <= 4) {
                    return color[1];
                } else if (val <= 6) {
                    return color[2];
                }
            });

        draw(this.chartOption);
        setInterval(() => {
            draw(this.chartOption);
        }, 1000);

        function draw(data) {
            const val = data[0].value;
            const lineWidth = 10;
            chart.annotation().clear(true);
            // 绘制仪表盘背景
            chart.annotation().arc({
                top: false,
                start: [0, 1],
                end: [6, 1],
                style: {
                    stroke: '#E5ECF3',
                    lineWidth,
                    lineDash: null
                }
            });

            if (val >= 2) {
                chart.annotation().arc({
                    start: [0, 1],
                    end: [val, 1],
                    style: {
                        stroke: color[0],
                        lineWidth,
                        lineDash: null
                    }
                });
            }

            if (val >= 4) {
                chart.annotation().arc({
                    start: [2, 1],
                    end: [4, 1],
                    style: {
                        stroke: color[1],
                        lineWidth,
                        lineDash: null
                    }
                });
            }

            if (val > 4 && val <= 6) {
                chart.annotation().arc({
                    start: [4, 1],
                    end: [val, 1],
                    style: {
                        stroke: color[2],
                        lineWidth,
                        lineDash: null
                    }
                });
            }

            if (val > 2 && val <= 4) {
                chart.annotation().arc({
                    start: [2, 1],
                    end: [val, 1],
                    style: {
                        stroke: color[1],
                        lineWidth,
                        lineDash: null
                    }
                });
            }

            if (val < 2) {
                chart.annotation().arc({
                    start: [0, 1],
                    end: [val, 1],
                    style: {
                        stroke: color[0],
                        lineWidth,
                        lineDash: null
                    }
                });
            }
            chart.changeData(data);
        }
    }

    drawChart2(cvalue) {
        const _value = this.quick.series[0].data[0].value > this.keChuangBao.series[0].data[0].value ? (cvalue / this.quick.series[0].data[0].value) * 6 : (cvalue / this.keChuangBao.series[0].data[0].value) * 6;
        this.chartOption2 = [
            {value: _value}
        ];

        const chartContainer = this.el.nativeElement.querySelector('#c2');
        // 自定义Shape 部分
        registerShape('point', 'pointer', {
            draw(cfg, container) {
                const group = container.addGroup({});
                // 获取极坐标系下画布中心点
                const center = this.parsePoint({x: 0, y: 0});
                // 绘制指针
                group.addShape('line', {
                    attrs: {
                        x1: center.x,
                        y1: center.y,
                        x2: cfg.x,
                        y2: cfg.y,
                        stroke: '#389AFF',
                        lineWidth: 2,
                        lineCap: 'round'
                    }
                });
                group.addShape('circle', {
                    attrs: {
                        x: center.x,
                        y: center.y,
                        r: 3,
                        stroke: '#389AFF',
                        lineWidth: 1,
                        fill: '#fff'
                    }
                });
                return group;
            }
        });

        const color = ['#6FF9FF', '#6FF9FF', '#6FF9FF'];
        const chart = new G2.Chart({
            container: chartContainer,
            width: 200,
            height: 174
        });
        chart.data(this.chartOption2);
        chart.animate(false);

        chart.coordinate('polar', {
            startAngle: (-9 / 8) * Math.PI,
            endAngle: (1 / 8) * Math.PI,
            radius: 0.85
        });
        chart.scale('value', {
            min: 0,
            max: 6,
            tickInterval: 1
        });

        chart.axis('1', false);
        chart.axis('value', {
            line: null,
            label: {
                offset: -20,
                style: {
                    fontSize: 10,
                    fill: '#E5ECF3',
                    textAlign: 'center',
                    textBaseline: 'middle'
                }
            },
            tickLine: {
                length: -14
            },
            grid: null
        });
        chart.legend(false);
        chart.tooltip(false);
        chart
            .point()
            .position('value*1')
            .shape('pointer')
            .color('value', (val) => {
                if (val < 2) {
                    return color[0];
                } else if (val <= 4) {
                    return color[1];
                } else if (val <= 6) {
                    return color[2];
                }
            });

        draw(this.chartOption2);
        setInterval(() => {
            draw(this.chartOption2);
        }, 1000);

        function draw(data) {
            const val = data[0].value;
            const lineWidth = 10;
            chart.annotation().clear(true);
            // 绘制仪表盘背景
            chart.annotation().arc({
                top: false,
                start: [0, 1],
                end: [6, 1],
                style: {
                    stroke: '#E5ECF3',
                    lineWidth,
                    lineDash: null
                }
            });

            if (val >= 2) {
                chart.annotation().arc({
                    start: [0, 1],
                    end: [val, 1],
                    style: {
                        stroke: color[0],
                        lineWidth,
                        lineDash: null
                    }
                });
            }

            if (val >= 4) {
                chart.annotation().arc({
                    start: [2, 1],
                    end: [4, 1],
                    style: {
                        stroke: color[1],
                        lineWidth,
                        lineDash: null
                    }
                });
            }

            if (val > 4 && val <= 6) {
                chart.annotation().arc({
                    start: [4, 1],
                    end: [val, 1],
                    style: {
                        stroke: color[2],
                        lineWidth,
                        lineDash: null
                    }
                });
            }

            if (val > 2 && val <= 4) {
                chart.annotation().arc({
                    start: [2, 1],
                    end: [val, 1],
                    style: {
                        stroke: color[1],
                        lineWidth,
                        lineDash: null
                    }
                });
            }

            if (val < 2) {
                chart.annotation().arc({
                    start: [0, 1],
                    end: [val, 1],
                    style: {
                        stroke: color[0],
                        lineWidth,
                        lineDash: null
                    }
                });
            }
            chart.changeData(data);
        }
    }

    getData() {
        this.toastSvc.show('加载中...', 0);
        this.policySvc.item(this.params).subscribe(res => {
            this.toastSvc.hide();
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    getBody() {
        const body = JSON.parse(JSON.stringify(this.params));
        if (body.workStatus) {
            let workStatus = '';
            body.workStatus.forEach(item => {
                if (workStatus) {
                    workStatus = workStatus + ',' + item;
                } else {
                    workStatus = workStatus + item;
                }
            });
            body.workStatus = workStatus;
        }
        return body;
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }

    toPolicyItem() {
        this.router.navigate(['/admin/policy/list']);
    }

}

import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../dashboard/dashboard.service';
import {CompanyService} from '../../company/company.service';

@Component({
  selector: 'app-fast',
  templateUrl: './fast.component.html',
  styleUrls: ['./fast.component.scss']
})
export class AdminReportFastPage implements OnInit {

  brandOption = {
    count: 0,
    pie: null,
    line: null
  };
  subsidyOption;
  company = this.companySvc.currentCompany;

  constructor(private dashboardSvc: DashboardService,
              private companySvc: CompanyService) {
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
              position: 'inner',
              formatter: '{d}%'
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
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
          bottom: 0,
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
          bottom: '10%',
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
          data: ['研究生学历人数', '企业研发团队人数', '个税申请人数', '现有员工人数']
        },
        series: [
          {
            type: 'bar',
            data: [res.keChuangBaoAmt, res.quickAmt, res.hasBeenAmt],
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
  }

  ngOnInit() {
  }

}

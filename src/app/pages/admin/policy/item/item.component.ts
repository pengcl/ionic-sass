import {Component, OnInit} from '@angular/core';
import {PolicyService} from '../policy.service';
import {CompanyService} from '../../company/company.service';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material';
import {DialogService} from '../../../../@core/modules/dialog';

declare var $: any;

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class AdminPolicyItemPage implements OnInit {
    policy;
    company = this.companySvc.currentCompany;
    id = this.route.snapshot.params.id;
    dataSource;
    displayedColumns = ['name', 'url'];

    constructor(private policySvc: PolicyService,
                private companySvc: CompanyService,
                private route: ActivatedRoute,
                private dialogSvc: DialogService) {
        this.route.paramMap.pipe(map(params => this.id = params.get('id'))).subscribe(id => {
            policySvc.getPolicy(this.id, this.company.id).subscribe(res => {
                this.policy = res;
                this.policy.industryNames = this.policy.industryNames.replace(/,/gi, '、');
                this.policy.supportRemark = this.policy.supportRemark.replace(/\r\n/gi, '<br>');
                this.policy.applyRemark = this.policy.applyRemark.replace(/\r\n/gi, '<br>');
                this.policy.dataRemark = this.policy.dataRemark.replace(/\r\n/gi, '<br>');
                this.dataSource = new MatTableDataSource<any>(res.urls);
            });
        });


    }

    ngOnInit(): void {
        this.top();
    }

    top() {
        $('mat-sidenav-content')[0].scrollTop = 0;
    }

    applyPolicy(policyName) {
        console.log(this.company);
        const body = {
            mobile: this.company.mobile,
            name: this.company.name,
            company: this.company.companyName + '/' + policyName
        };
        this.policySvc.addUserConsult(body).subscribe(res => {
            this.dialogSvc.show({
                title: '',
                content: '您的申请已收到，我们将立即安排科技项目专家与您联系。',
                cancel: '',
                confirm: '我知道了'
            }).subscribe();
        });
    }

}

import {Component, OnInit} from '@angular/core';
import {PolicyService} from '../policy.service';
import {CompanyService} from '../../company/company.service';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

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

    constructor(private policySvc: PolicyService,
                private companySvc: CompanyService,
                private route: ActivatedRoute) {
        this.route.paramMap.pipe(map(params => this.id = params.get('id'))).subscribe(id => {
            policySvc.getPolicy(this.id, this.company.id).subscribe(res => {
                this.policy = res;
                this.policy.industryNames = this.policy.industryNames.replace(/,/gi, '、');
                this.policy.supportRemark = this.policy.supportRemark.replace(/\r\n/gi, '<br>');
            });
        });


    }

    ngOnInit(): void {
        this.top();
    }

    top() {
        $('mat-sidenav-content')[0].scrollTop = 0;
    }

}

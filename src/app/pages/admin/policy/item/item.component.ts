import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PolicyService} from '../policy.service';
import {CompanyService} from '../../company/company.service';
import {map} from 'rxjs/operators';
import {ActivatedRoute, ActivationEnd, NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'app-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class AdminPolicyItemPage{
    policy;
    company = this.companySvc.currentCompany;
    id = this.route.snapshot.params.id;
    data = this.route.snapshot.queryParams;

    constructor(private policySvc: PolicyService,
                private companySvc: CompanyService,
                private route: ActivatedRoute,
                private router: Router) {
        this.route.paramMap.pipe(map(params => this.id = params.get('id'))).subscribe(id => {
            if (this.data.id === 'top') {
                window.location.href = `admin/policy/item/${this.id}/#top`;
            }

            policySvc.getPolicy(this.id, this.company.id).subscribe(res => {
                this.policy = res;
                this.policy.industryNames = this.policy.industryNames.replace(/,/gi, '、');
                this.policy.supportRemark = this.policy.supportRemark.replace(/\r\n/gi, '<br>');
            });
        });


    }

    /*ngOnInit(): void {
        this.router.events.subscribe((event: NavigationEnd) => {
            if (event instanceof ActivationEnd) {// 当导航成功结束时执行
                window.scrollTo(0, 0);
            }
        });
    }*/

    top() {
        window.scrollTo(0, 0);
    }

}

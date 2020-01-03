import {Component} from '@angular/core';
import {DialogService} from '../../@core/modules/dialog';
import {AuthService} from '../auth/auth.service';
import {CompanyService} from './company/company.service';
import {AccountService} from './account/account.service';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.page.html',
    styleUrls: ['./admin.page.scss']
})
export class AdminPage {
    user = this.authSvc.currentUser;
    company = this.companySvc.currentCompany;
    balance = 0;
    show = true;
    config: PerfectScrollbarConfigInterface = {
    };

    constructor(private dialogSvc: DialogService,
                private authSvc: AuthService,
                private accountSvc: AccountService,
                private companySvc: CompanyService) {
        companySvc.company.subscribe(res => {
            this.company = res;
        });
        accountSvc.balance(this.company.id).subscribe(res => {
            this.balance = res;
        });
    }

    routeChange(e) {
        console.log(e);
    }

}

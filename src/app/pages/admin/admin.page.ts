import {Component} from '@angular/core';
import {LoadingController} from '@ionic/angular';
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
    config: PerfectScrollbarConfigInterface = {};

    constructor(private loadingController: LoadingController,
                private dialogSvc: DialogService,
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

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: '功能即将开发，敬请期待',
            duration: 1000
        });
        await loading.present();
        await loading.onDidDismiss();
    }

}

import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {DialogService} from '../../@core/modules/dialog';
import {AuthService} from '../auth/auth.service';
import {CompanyService} from './company/company.service';
import {AccountService} from './account/account.service';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {filter, map, mergeMap} from 'rxjs/operators';
import {NavigationEnd} from '@angular/router';

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
    menuIndex: number;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private loadingController: LoadingController,
                private dialogSvc: DialogService,
                private authSvc: AuthService,
                private accountSvc: AccountService,
                private companySvc: CompanyService) {
        router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map(route => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            }),
            mergeMap(route => {
                return route.data;
            })
        ).subscribe(data => {
            this.menuIndex = data.menuIndex ? data.menuIndex : null;
        });
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

    logout() {
        this.authSvc.logout();
    }

}

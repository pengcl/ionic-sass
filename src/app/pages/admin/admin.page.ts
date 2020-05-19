import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {LoadingController} from '@ionic/angular';
import {DialogService} from '../../@core/modules/dialog';
import {AuthService} from '../auth/auth.service';
import {CompanyService} from './company/company.service';
import {AccountService} from './account/account.service';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';
import {filter, map, mergeMap} from 'rxjs/operators';
import {NavigationEnd} from '@angular/router';
import {ToastService} from '../../@core/modules/toast';

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
                private companySvc: CompanyService,
                private toastSvc: ToastService) {
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

    presentLoading() {
        this.toastSvc.loading('', 1000);
    }

    logout() {
        this.authSvc.logout();
    }

}

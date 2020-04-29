import {Component} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {PopoverController} from '@ionic/angular';
import {ToastController} from '@ionic/angular';
import {LoadingController} from '@ionic/angular';
import {AuthService} from '../../../pages/auth/auth.service';
import {TabService} from './tab.service';
import {NotifyComponent} from '../notify/notify.component';
import {getIndex} from '../../../@core/utils/utils';
import {filter, map, mergeMap} from 'rxjs/operators';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    title = 'SMP';
    user = this.authSvc.currentUser;
    tabs = [];
    path;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private popoverController: PopoverController,
                private toastController: ToastController,
                private loadingController: LoadingController,
                private authSvc: AuthService,
                private tabSvc: TabService) {
        this.tabSvc.get().subscribe(tabs => {
            this.tabs = tabs;
        });
        router.events.pipe(
            // tap(o => console.log(o))
            filter(event => event instanceof NavigationEnd)).subscribe(() => {
            this.path = this.router.url;
        });
    }

    async presentPopover(e: any) {
        const popover = await this.popoverController.create({
            component: NotifyComponent,
            event: e,
            translucent: true
        });
        return await popover.present();
    }

    selected(tab) {
        console.log(tab);
        this.router.navigateByUrl(tab.path);
    }

    remove(index, e) {
        e.preventDefault();
        this.tabSvc.remove(index, this.path);
        return false;
    }

    async toasterShow(e: any) {
        const toaster = await this.toastController.create({
            position: 'middle',
            message: '功能即将开放,敬请期待',
            duration: 2000
        });
        return await toaster.present();
    }

    async presentLoading() {
        const loading = await this.loadingController.create({
            message: '功能即将开放，敬请期待',
            duration: 1000,
            spinner: null
        });
        await loading.present();
        await loading.onDidDismiss();
    }

    logout() {
        this.authSvc.logout();
    }
}

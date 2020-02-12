import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {PopoverController} from '@ionic/angular';
import {AuthService} from '../../../pages/auth/auth.service';
import {TabService} from './tab.service';
import {NotifyComponent} from '../notify/notify.component';
import {getIndex} from '../../../@core/utils/utils';

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
    selectedIndex = 1;

    constructor(private route: ActivatedRoute,
                private popoverController: PopoverController,
                private authSvc: AuthService,
                private tabSvc: TabService) {
        this.tabSvc.get().subscribe(tabs => {
            this.tabs = tabs;
            this.selectedIndex = getIndex(tabs, 'selected', true);
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
    }

    logout() {
        this.authSvc.logout();
    }
}

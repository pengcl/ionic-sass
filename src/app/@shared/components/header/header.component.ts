import {Component} from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {AuthService} from '../../../pages/auth/auth.service';
import {NotifyComponent} from '../notify/notify.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  title = 'SMP';
  user = this.authSvc.currentUser;

  constructor(private popoverController: PopoverController,
              private authSvc: AuthService) {
  }

  async presentPopover(e: any) {
    const popover = await this.popoverController.create({
      component: NotifyComponent,
      event: e,
      translucent: true
    });
    return await popover.present();
  }

  logout() {
    this.authSvc.logout();
  }
}

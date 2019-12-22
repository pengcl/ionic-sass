import {Injectable} from '@angular/core';
import {ModalController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(public modalController: ModalController) {
  }

  async show(modalComponent, callback) {
    const modal = await this.modalController.create({
      component: modalComponent
    });
    const {data} = await modal.onWillDismiss();
    callback(data);
    return await modal.present();
  }
}

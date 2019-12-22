import {Injectable} from '@angular/core';
import {LoadingController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loading;

  constructor(private loadingController: LoadingController) {
  }

  async show(content, timeInterval) {
    this.loading = await this.loadingController.create({
      message: content ? content : '',
      duration: timeInterval ? timeInterval : 0
    });
    await this.loading.present();

    const {role, data} = await this.loading.onDidDismiss();

    console.log('Loading dismissed!');
  }

  hide() {
    this.loading.dismiss();
  }
}

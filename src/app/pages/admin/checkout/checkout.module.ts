import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../@shared/shared.module';
import {AdminCheckoutPage} from './checkout.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminCheckoutPage}])
  ],
  declarations: [AdminCheckoutPage]
})
export class AdminCheckoutPageModule {
}

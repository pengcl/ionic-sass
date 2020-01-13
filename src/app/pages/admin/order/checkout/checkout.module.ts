import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminOrderCheckoutPage} from './checkout.component';
import {AdminCheckoutCodeComponent} from '../../checkout/code/code.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{path: '', component: AdminOrderCheckoutPage}])
    ],
    declarations: [AdminOrderCheckoutPage, AdminCheckoutCodeComponent],
    entryComponents: [AdminCheckoutCodeComponent]
})
export class AdminOrderCheckoutPageModule {
}

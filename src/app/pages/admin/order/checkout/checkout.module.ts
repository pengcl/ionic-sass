import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminOrderCheckoutPage} from './checkout.component';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{path: '', component: AdminOrderCheckoutPage}])
    ],
    declarations: [AdminOrderCheckoutPage],
    entryComponents: []
})
export class AdminOrderCheckoutPageModule {
}

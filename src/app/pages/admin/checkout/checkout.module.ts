import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../@shared/shared.module';
import {AdminCheckoutPage} from './checkout.page';
import {AdminCheckoutCodeComponent} from './code/code.component';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{path: '', component: AdminCheckoutPage}])
    ],
    declarations: [AdminCheckoutPage, AdminCheckoutCodeComponent],
    entryComponents: [AdminCheckoutCodeComponent]
})
export class AdminCheckoutPageModule {
}

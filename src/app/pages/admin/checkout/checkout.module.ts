import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../@shared/shared.module';
import {AdminCheckoutPage} from './checkout.page';
import {AdminCheckoutTypesComponent} from './types/types.component';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{path: '', component: AdminCheckoutPage}])
    ],
    declarations: [AdminCheckoutPage, AdminCheckoutTypesComponent],
    entryComponents: []
})
export class AdminCheckoutPageModule {
}

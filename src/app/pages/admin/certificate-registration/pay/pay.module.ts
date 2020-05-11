import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {RouterModule} from '@angular/router';
import {AdminCertificatePayPage} from './pay.page';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{path: '', component: AdminCertificatePayPage}])
    ],
    declarations: [AdminCertificatePayPage]
})
export class AdminCertificatePayPageModule {
}

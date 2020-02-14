import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AdminDashboardPage} from './dashboard.page';
import {SharedModule} from '../../../@shared/shared.module';
import {ProgressModule} from 'ngx-weui';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{path: '', component: AdminDashboardPage}]),
        ProgressModule
    ],
  declarations: [AdminDashboardPage]
})
export class AdminDashboardPageModule {
}

import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {AdminDashboardPage} from './dashboard.page';
import {SharedModule} from '../../../@shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminDashboardPage}])
  ],
  declarations: [AdminDashboardPage]
})
export class AdminDashboardPageModule {
}

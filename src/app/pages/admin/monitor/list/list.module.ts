import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminMonitorListPage} from './list.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminMonitorListPage}])
  ],
  declarations: [AdminMonitorListPage]
})
export class AdminMonitorListPageModule {
}

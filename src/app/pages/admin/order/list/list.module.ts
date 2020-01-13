import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminOrderListPage} from './list.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminOrderListPage}])
  ],
  declarations: [AdminOrderListPage]
})
export class AdminOrderListPageModule {
}

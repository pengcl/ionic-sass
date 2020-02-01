import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminOrderItemPage} from './item.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminOrderItemPage}])
  ],
  declarations: [AdminOrderItemPage]
})
export class AdminOrderItemPageModule {
}

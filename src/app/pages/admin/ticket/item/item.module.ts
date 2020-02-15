import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminTicketItemPage} from './item.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminTicketItemPage}])
  ],
  declarations: [AdminTicketItemPage]
})
export class AdminTicketItemPageModule {
}

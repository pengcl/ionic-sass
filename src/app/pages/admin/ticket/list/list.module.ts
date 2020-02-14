import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminTicketListPage} from './list.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminTicketListPage}])
  ],
  declarations: [AdminTicketListPage]
})
export class AdminTicketListPageModule {
}

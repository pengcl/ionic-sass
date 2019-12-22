import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminCompanyListPage} from './list.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminCompanyListPage}])
  ],
  declarations: [AdminCompanyListPage]
})
export class AdminCompanyListPageModule {
}

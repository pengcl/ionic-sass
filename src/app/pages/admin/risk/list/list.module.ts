import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminRiskListPage} from './list.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminRiskListPage}])
  ],
  declarations: [AdminRiskListPage]
})
export class AdminRiskListPageModule {
}

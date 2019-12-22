import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminPlanListPage} from './list.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminPlanListPage}])
  ],
  declarations: [AdminPlanListPage]
})
export class AdminPlanListPageModule {
}

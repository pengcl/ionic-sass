import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminPlanItemPage} from './item.component';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminPlanItemPage}])
  ],
  declarations: [AdminPlanItemPage]
})
export class AdminPlanItemPageModule {
}

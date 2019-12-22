import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminRiskItemPage} from './item.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminRiskItemPage}])
  ],
  declarations: [AdminRiskItemPage]
})
export class AdminRiskItemPageModule {
}

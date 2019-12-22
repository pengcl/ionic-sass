import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminCompanyItemPage} from './item.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminCompanyItemPage}])
  ],
  declarations: [AdminCompanyItemPage]
})
export class AdminCompanyItemPageModule {
}

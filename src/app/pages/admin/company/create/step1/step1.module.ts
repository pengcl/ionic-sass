import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../@shared/shared.module';
import {AdminCompanyCreateStep1Page} from './step1.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminCompanyCreateStep1Page}])
  ],
  declarations: [AdminCompanyCreateStep1Page]
})
export class AdminCompanyCreateStep1PageModule {
}

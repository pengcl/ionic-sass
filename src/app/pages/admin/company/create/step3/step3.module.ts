import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../@shared/shared.module';
import {AdminCompanyCreateStep3Page} from './step3.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminCompanyCreateStep3Page}])
  ],
  declarations: [AdminCompanyCreateStep3Page]
})
export class AdminCompanyCreateStep3PageModule {
}

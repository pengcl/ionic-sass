import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../../@shared/shared.module';
import {AdminCompanyCreateStep2Page} from './step2.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminCompanyCreateStep2Page}])
  ],
  declarations: [AdminCompanyCreateStep2Page]
})
export class AdminCompanyCreateStep2PageModule {
}

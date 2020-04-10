import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminCompanyAddPage} from './add.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminCompanyAddPage}])
  ],
  declarations: [AdminCompanyAddPage]
})
export class AdminCompanyAddPageModule {
}

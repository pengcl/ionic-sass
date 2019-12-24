import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminCompanyQualificationPage} from './qualification.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminCompanyQualificationPage}])
  ],
  declarations: [AdminCompanyQualificationPage]
})
export class AdminCompanyQualificationPageModule {
}

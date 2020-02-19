import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminPolicyPage} from './policy.component';



@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminPolicyPage}])
  ],
  declarations: [AdminPolicyPage]
})
export class AdminPolicyPageModule {
}

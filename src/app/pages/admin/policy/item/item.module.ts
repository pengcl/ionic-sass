import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminPolicyItemPage} from './item.component';



@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminPolicyItemPage}])
  ],
  declarations: [AdminPolicyItemPage]
})
export class AdminPolicyItemPageModule {
}

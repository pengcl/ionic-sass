import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminPolicyListPage} from './list.component';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminPolicyListPage}])
  ],
  declarations: [AdminPolicyListPage]
})
export class AdminPolicyListPageModule {
}

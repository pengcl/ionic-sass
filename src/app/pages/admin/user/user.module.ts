import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../@shared/shared.module';
import {AdminUserPage} from './user.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminUserPage}])
  ],
  declarations: [AdminUserPage]
})
export class AdminUserPageModule {
}

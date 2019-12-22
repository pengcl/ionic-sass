import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../@shared/shared.module';
import {AuthPage} from './auth.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AuthPage}])
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {
}

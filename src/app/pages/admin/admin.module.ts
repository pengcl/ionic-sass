import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../@shared/shared.module';
import {AdminPage} from './admin.page';
import {AdminRoutingModule} from './admin-routing.module';

@NgModule({
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {
}

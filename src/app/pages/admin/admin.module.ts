import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../@shared/shared.module';
import {AdminPage} from './admin.page';
import {AdminRoutingModule} from './admin-routing.module';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';

@NgModule({
    imports: [
        SharedModule,
        AdminRoutingModule,
        PerfectScrollbarModule
    ],
  declarations: [AdminPage]
})
export class AdminPageModule {
}

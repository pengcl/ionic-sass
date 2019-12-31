import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../@shared/shared.module';
import {AdminPage} from './admin.page';
import {AdminRoutingModule} from './admin-routing.module';
import {MatExpansionModule} from '@angular/material';

@NgModule({
    imports: [
        SharedModule,
        AdminRoutingModule,
        MatExpansionModule
    ],
  declarations: [AdminPage]
})
export class AdminPageModule {
}

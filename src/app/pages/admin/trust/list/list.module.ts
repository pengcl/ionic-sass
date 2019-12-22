import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminTrustListPage} from './list.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminTrustListPage}])
  ],
  declarations: [AdminTrustListPage]
})
export class AdminTrustListPageModule {
}

import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminTrustDetailPage} from './detail.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminTrustDetailPage}])
  ],
  declarations: [AdminTrustDetailPage]
})
export class AdminTrustDetailPageModule {
}

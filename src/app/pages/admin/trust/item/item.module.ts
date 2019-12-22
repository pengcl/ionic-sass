import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminTrustItemPage} from './item.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminTrustItemPage}])
  ],
  declarations: [AdminTrustItemPage]
})
export class AdminTrustItemPageModule {
}

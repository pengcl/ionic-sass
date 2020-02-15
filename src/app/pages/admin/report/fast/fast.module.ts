import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminReportFastPage} from './fast.component';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminReportFastPage}])
  ],
  declarations: [AdminReportFastPage]
})
export class AdminReportFastPageModule {
}

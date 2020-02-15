import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminReportPrecisePage} from './precise.component';


@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminReportPrecisePage}])
  ],
  declarations: [AdminReportPrecisePage]
})
export class AdminReportPrecisePageModule {
}

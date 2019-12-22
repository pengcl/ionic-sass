import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminBoxListPage} from './list.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminBoxListPage}])
  ],
  declarations: [AdminBoxListPage]
})
export class AdminBoxListPageModule {
}

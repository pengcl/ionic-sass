import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {AdminBoxUploadPage} from './upload.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: AdminBoxUploadPage}])
  ],
  declarations: [AdminBoxUploadPage]
})
export class AdminBoxUploadPageModule {
}

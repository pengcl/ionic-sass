import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../@shared/shared.module';
import {LoaderPage} from './loader.page';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{path: '', component: LoaderPage}])
  ],
  declarations: [LoaderPage]
})
export class LoaderPageModule {
}

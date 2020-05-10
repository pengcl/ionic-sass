import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {RouterModule} from '@angular/router';
import {AdminCertificateItemDetailPage} from './item.page';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{path: '', component: AdminCertificateItemDetailPage}])
    ],
    declarations: [AdminCertificateItemDetailPage]
})
export class AdminCertificateItemDetailPageModule {
}

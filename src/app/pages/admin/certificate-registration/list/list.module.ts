import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {RouterModule} from '@angular/router';
import {AdminCertificateListPage} from './list.page';


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild([{path: '', component: AdminCertificateListPage}])
    ],
    declarations: [AdminCertificateListPage]
})
export class AdminCertificateListPageModule {
}

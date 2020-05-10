import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../@shared/shared.module';
import {RouterModule} from '@angular/router';
import {AdminCertificateDeclarePage} from './declare.page';
import { NzCascaderModule } from 'ng-zorro-antd/cascader';
import { NzUploadModule } from 'ng-zorro-antd/upload';


@NgModule({
    imports: [
        NzCascaderModule,
        NzUploadModule,
        SharedModule,
        RouterModule.forChild([{path: '', component: AdminCertificateDeclarePage}])
    ],
    declarations: [AdminCertificateDeclarePage]
})
export class AdminCertificateDeclarePageModule {
}

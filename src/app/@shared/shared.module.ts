import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {CdkTableModule} from '@angular/cdk/table';
import {IonicModule} from '@ionic/angular';
import {
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatRadioModule,
    MatPaginatorIntl
} from '@angular/material';

const MATERIAL_PART = [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatBadgeModule,
    MatCardModule,
    MatGridListModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    CdkTableModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatRadioModule
];

import {DragDropModule} from '@angular/cdk/drag-drop';

const CDK_PART = [DragDropModule];

import {UploaderModule} from './modules/uploader';
import {NgCircleProgressModule} from 'ng-circle-progress';
import {Paginator} from './paginator';
import {COMPONENTS, ENTRY_COMPONENTS, PIPES} from './index';
import {ADMINCHECKOUTFORMCOMPONENT} from '../pages/admin/checkout';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        IonicModule,
        MATERIAL_PART,
        CDK_PART,
        UploaderModule,
        NgCircleProgressModule.forRoot({
            // set defaults here
            radius: 100,
            outerStrokeWidth: 16,
            innerStrokeWidth: 8,
            outerStrokeColor: '#78C000',
            innerStrokeColor: '#C7E596',
            animationDuration: 300
        })
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        IonicModule,
        MATERIAL_PART,
        CDK_PART,
        UploaderModule,
        NgCircleProgressModule,
        ...COMPONENTS,
        ...PIPES,
        ...ADMINCHECKOUTFORMCOMPONENT
    ],
    declarations: [...COMPONENTS, ...ENTRY_COMPONENTS, ...PIPES, ...ADMINCHECKOUTFORMCOMPONENT],
    entryComponents: [ENTRY_COMPONENTS],
    providers: [{provide: MatPaginatorIntl, useValue: Paginator()}]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        } as ModuleWithProviders;
    }
}

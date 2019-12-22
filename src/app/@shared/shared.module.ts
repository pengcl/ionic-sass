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
    MatTabsModule, MatSelectModule, MatButtonToggleModule, MatAutocompleteModule
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
    MatAutocompleteModule
];

import {UploaderModule} from './modules/uploader';

import {COMPONENTS, ENTRY_COMPONENTS, PIPES} from './index';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        IonicModule,
        MATERIAL_PART,
        UploaderModule
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        IonicModule,
        MATERIAL_PART,
        UploaderModule,
        ...COMPONENTS,
        ...PIPES
    ],
    declarations: [...COMPONENTS, ...ENTRY_COMPONENTS, ...PIPES],
    entryComponents: [ENTRY_COMPONENTS]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: []
        } as ModuleWithProviders;
    }
}

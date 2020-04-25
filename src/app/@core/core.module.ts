import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

import {MaskModule} from './modules/mask';
import {DialogModule} from './modules/dialog';
import {ToastModule} from './modules/toast';

import {throwIfAlreadyLoaded} from './module-import-guard';
import {INTERCEPTORS} from './interceptors';



export const CORE_PROVIDERS = [
    ...INTERCEPTORS
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        MaskModule,
        DialogModule,
        ToastModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,
        MaskModule,
        DialogModule,
        ToastModule
    ],
    declarations: []
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
                ...CORE_PROVIDERS
            ]
        } as ModuleWithProviders;
    }
}

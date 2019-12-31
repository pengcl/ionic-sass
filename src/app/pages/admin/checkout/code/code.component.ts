import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
    url: any;
}

@Component({
    selector: 'app-admin-checkout-code',
    templateUrl: './code.component.html',
    styleUrls: ['./code.component.scss']
})
export class AdminCheckoutCodeComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }
}

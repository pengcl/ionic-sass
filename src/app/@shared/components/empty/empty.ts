import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-empty',
    templateUrl: 'empty.html',
    styleUrls: ['empty.scss']
})
export class EmptyComponent {
    @Input() icon = 'cloud-circle';
    @Input() title = '';
    @Input() desc = '';
    @Output() confirm = new EventEmitter<any>();
    @Input() confirmText = '';

    constructor() {
    }

    onClick() {
        this.confirm.emit('confirm');
    }

}

import {Component, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'app-empty',
    templateUrl: 'empty.html',
    styleUrls: ['empty.scss']
})
export class EmptyComponent {
    @Input() icon = 'cloud-circle';
    @Input() title = '没有记录';
    @Input() desc = '';
    @Output() confirm = new EventEmitter<any>();

    constructor() {
    }

    onClick() {
        this.confirm.emit('confirm');
    }

}

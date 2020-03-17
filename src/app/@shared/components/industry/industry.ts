import {Component} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ModalController, NavParams} from '@ionic/angular';
import {IndustryService} from './industry.service';
import {listToTree, getIndex} from '../../../@core/utils/utils';


@Component({
    selector: 'app-industry',
    templateUrl: 'industry.html',
    styleUrls: ['industry.scss']
})
export class IndustryComponent {
    industries;
    selected = {};
    items = [];
    form: FormGroup = new FormGroup({});
    type = '';

    constructor(private modalController: ModalController,
                private navParams: NavParams,
                private industrySvc: IndustryService) {
        this.items = this.navParams.data.items ? this.navParams.data.items : [];
        console.log(this.navParams.data.items);
        this.type = this.navParams.data.type ? this.navParams.data.type : '';
        industrySvc.list(this.type).subscribe(res => {
            this.industries = listToTree(res, {idKey: 'id', parentKey: 'parentId', childrenKey: 'children'});
        });
        this.getSelected();
    }

    checked(item) {
        const index = getIndex(this.items, 'id', item.id);
        if (index >= 0) {
            this.items.splice(index, 1);
        } else {
            this.items.push(item);
        }
    }

    getSelected() {
        this.items.forEach(item => {
                this.selected[item.id] = true;
        });

    }

    cancel() {
        this.modalController.dismiss(this.items).then();
    }

    confirm() {
        this.modalController.dismiss(this.items).then();
    }

}

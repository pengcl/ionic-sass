import {Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {TypesService} from './types.service';
import {IndustryService} from '../../../../@shared/components/industry/industry.service';
import {listToTree, getIndex} from '../../../../@core/utils/utils';
import {IndustryComponent} from '../../../../@shared/components/industry/industry';

@Component({
    selector: 'app-admin-checkout-types',
    templateUrl: './types.component.html',
    styleUrls: ['./types.component.scss']
})
export class AdminCheckoutTypesComponent implements OnInit, OnChanges {
    @Input() name;
    @Input() data = {type: 0, industries: [], types: [], items: []};
    @Output() change = new EventEmitter<any>();

    constructor(private modalController: ModalController, private industrySvc: IndustryService, private typesSvc: TypesService) {
        console.log(this.data);
        this.getTypes();
    }

    getTypes() {
        if (this.data.type === 0) {
            this.setIndustries();
        } else {
            this.typesSvc.list().subscribe(res => {
                this.data.types = listToTree(res);
                if (this.data.type === 1) {
                    this.data.items.forEach(root => {
                        root.count = 0;
                        root.total = 0;
                        root.children.forEach(parent => {
                            parent.count = 0;
                            parent.total = 0;
                        });
                    });
                    this.selected(this.data.types[0]);
                    // 设置展开项
                    this.data.items[0].expanded = true;
                    this.change.emit(this.data);
                } else {
                    this.data.items = this.data.types;
                    // 设置展开项
                    this.data.items[0].expanded = true;
                    this.data.items.forEach(root => {
                        root.count = 0;
                        root.total = 0;
                        root.children.forEach(parent => {
                            parent.count = 0;
                            parent.total = 0;
                            parent.children.forEach((chip, i) => {
                                if (i === 0) {
                                    this.selectedItem(root, parent, chip);
                                }
                            });
                        });
                    });
                    this.change.emit(this.data);
                }
            });
        }
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data.currentValue) {
            this.change.emit(this.data);
        }
    }

    async presentModal() {
        const modal = await this.modalController.create({
            showBackdrop: true,
            component: IndustryComponent,
            componentProps: {items: this.data.industries, type: 'order'}
        });
        await modal.present();
        const {data} = await modal.onDidDismiss(); // 获取关闭传回的值
        // this.form.get('industryIds').markAsTouched();
        this.data.industries = data;
        this.setIndustries();
    }

    remove(item) {
        const index = getIndex(this.data.industries, 'id', item.id);
        if (index >= 0) {
            this.data.industries.splice(index, 1);
        }
        this.setIndustries();
    }

    setIndustries() {
        let ids = '';
        this.data.industries.forEach(item => {
            if (ids) {
                ids = ids + ',' + item.id;
            } else {
                ids = item.id;
            }
        });
        if (ids) {
            this.typesSvc.getTypes(ids).subscribe(res => {
                res = res ? res : [];
                this.data.items = [];
                this.data.types = listToTree(res);
                this.data.items = this.data.types;
                // 设置展开项
                this.data.items[0].expanded = true;
                this.data.items.forEach(root => {
                    root.count = 0;
                    root.total = 0;
                    root.children.forEach(parent => {
                        parent.count = 0;
                        parent.total = 0;
                        parent.children.forEach(chip => {
                            this.selectedItem(root, parent, chip);
                        });
                    });
                });
                this.change.emit(this.data);
                // this.setPrice();
            });
        } else {
            this.data.types = [];
            this.data.items = [];
            this.change.emit(this.data);
            // this.setPrice();
        }
        // this.form.get('industryIds').setValue(ids);
    }

    typeChange(e) {
        this.data.type = e.value;
        this.getTypes();
    }

    selected(item) {
        const index = getIndex(this.data.items, 'i', item.i);
        this.data.items.splice(index, 1);
    }

    selectedItem(root, parent, self, e?) {
        self.selected = !self.selected;
        // 初始化 root/parent选择计数;
        root.count = root.count ? root.count : 0;
        parent.count = parent.count ? parent.count : 0;

        // 如果选中根节点及父节点count + 1;
        if (self.selected) {
            root.count = root.count + 1;
            parent.count = parent.count + 1;
        } else {
            root.count = root.count - 1;
            parent.count = parent.count + 1;
        }
        root.total = root.count % 10 > 0 ?
            parseInt((root.count / 10 + 1).toString(), 10) * 300 :
            parseInt((root.count / 10).toString(), 10) * 300;
        let selected = false;
        parent.children.forEach(item => {
            if (item.selected) {
                selected = true;
            }
        });
        root.selected = selected;
        parent.selected = selected;
        if (e) {
            this.change.emit(this.data);
        }
    }
}

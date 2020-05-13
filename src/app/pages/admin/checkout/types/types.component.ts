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
    industries;
    sourceIndustries;
    industryPanelShow = false;
    industryIds;

    constructor(private modalController: ModalController, private industrySvc: IndustryService, private typesSvc: TypesService) {
        this.getTypes();
    }

    getTypes() {
        if (this.data.type === 0) {
            this.setIndustries();
        } else {
            this.typesSvc.list().subscribe(res => {
                const types = listToTree(res);
                this.typesSvc.risk(this.name).subscribe(risks => {
                    types.forEach(item => {
                        const index = getIndex(risks, 'type', parseInt(item.c, 10) > 9 ?
                            '' + parseInt(item.c, 10) : '0' + parseInt(item.c, 10));
                        const risk = risks[index];
                        item.score = risk.score;
                        item.riskCount = risk.count;
                        item.grade = risk.grade;
                    });
                    this.data.types = types;
                    if (this.data.type === 1) {
                        this.data.items = [];
                        this.selected(this.data.types[0]);
                        this.data.items.forEach(root => {
                            root.count = 0;
                            root.total = 0;
                            root.children.forEach(parent => {
                                parent.count = 0;
                                parent.total = 0;
                            });
                        });
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
            });
        }
    }

    ngOnInit() {
        this.industrySvc.list(true).subscribe(industries => {
            this.sourceIndustries = industries;
            this.industries = listToTree(industries, {idKey: 'id', parentKey: 'parentId', childrenKey: 'children'});
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data.currentValue) {
            this.change.emit(this.data);
        }
    }

    industryChange(e) {
        if (e.detail.value) {
            this.setIndustries(e.detail.value);
        }
    }

    setIndustries(id?) {
        if (id) {
            this.typesSvc.getTypes(id).subscribe(res => {
                res = res ? res : [];
                this.data.items = [];
                const types = listToTree(res);
                this.typesSvc.risk(this.name).subscribe(risks => {
                    types.forEach(item => {
                        const index = getIndex(risks, 'type', parseInt(item.c, 10) > 9 ?
                            '' + parseInt(item.c, 10) : '0' + parseInt(item.c, 10));
                        const risk = risks[index];
                        item.score = risk.score;
                        item.riskCount = risk.count;
                        item.grade = risk.grade;
                    });
                    this.data.types = types;
                    types.forEach(item => {
                        this.selected(item);
                    });
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
                    console.log(this.data);
                    this.change.emit(this.data);
                });
                // this.setPrice();
            });
        } else {
            this.data.types = [];
            this.data.items = [];
            console.log(this.data);
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
        if (index >= 0) {
            item.selected = false;
            this.data.items.splice(index, 1);
        } else {
            item.selected = true;
            this.data.items.push(item);
        }
        this.change.emit(this.data);
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
        root.priceCount = root.count % 10 > 0 ?
            parseInt((root.count / 10 + 1).toString(), 10) : parseInt((root.count / 10).toString(), 10);
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

    del(arr, item, e) {
        e.stopPropagation();
        const itemsIndex = getIndex(arr, 'c', item.c);
        arr.splice(itemsIndex, 1);
        const typesIndex = getIndex(this.data.types, 'c', item.c);
        this.data.types[typesIndex].selected = false;
        this.change.emit(this.data);
    }

    groupDel(arr, item, e) {
        e.stopPropagation();
        const itemsIndex = getIndex(arr, 'c', item.c);
        arr.splice(itemsIndex, 1);
        this.change.emit(this.data);
    }
}

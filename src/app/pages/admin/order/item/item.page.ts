import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompanyService} from '../../company/company.service';
import {OrderService} from '../order.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

const FILES_TYPES = {
    CONTRACT: {
        type: 'CONTRACT',
        label: '合同',
        value: '',
        id: '',
        disabled: true
    },

    RECEIPT: {
        type: 'RECEIPT',
        label: '发票',
        value: '',
        id: '',
        disabled: true
    },
    PAYED_VOURCH: {
        type: 'PAYED_VOURCH',
        label: '支付凭证',
        value: '',
        id: '',
        disabled: true
    },
    SER_FILE: {
        type: 'SER_FILE',
        label: '服务文件',
        value: '',
        id: '',
        disabled: true
    },
    SER_OFFI_FILE: {
        type: 'SER_OFFI_FILE',
        label: '官文文件',
        value: '',
        id: '',
        disabled: true
    }
};

@Component({
    selector: 'app-admin-order-item',
    templateUrl: './item.page.html',
    styleUrls: ['./item.page.scss']
})
export class AdminOrderItemPage {
    id = this.route.snapshot.params.id;
    order;
    company;
    process;
    attchs;
    displayedColumns: string[] = ['logo', 'name', 'price', 'count', 'total', 'company', 'status'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
info;
    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private companySvc: CompanyService,
                private orderSvc: OrderService) {
        orderSvc.item(this.id).subscribe(res => {
            this.order = res.order;
            this.company = res.custInfo;
            this.process = res.statusTimeMap;
            res.attchs.forEach((attch) => {
                attch.label = FILES_TYPES[attch.type].label;
                attch.fileIds = attch.fileIds.split(',');
            });
            this.attchs = res.attchs;
            this.dataSource = new MatTableDataSource<any>(res.order.goodsList);
        });
        orderSvc.saas(this.id).subscribe(res => {
            this.info = res.selfMap;
            console.log(this.info);
        });
    }
}

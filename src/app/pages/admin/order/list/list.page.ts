import {Component, Inject} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CompanyService} from '../../company/company.service';
import {OrderService} from '../order.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {pipe} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';

@Component({
    selector: 'app-admin-order-list',
    templateUrl: './list.page.html',
    styleUrls: ['./list.page.scss']
})
export class AdminOrderListPage {
    company = this.companySvc.currentCompany;
    total = 0;
    params = {
        page: 1,
        rows: 10,
        custId: this.company.id,
        orderNo: '',
        dateRange: 1
    };
    dateRanges = [
        {
            label: '所有',
            value: 4
        },
        {
            label: '3月内订单',
            value: 1
        },
        {
            label: '今年订单',
            value: 2
        },
        {
            label: '去年订单',
            value: 3
        }
    ];
    items;
    displayedColumns: string[] = ['logo', 'name', 'price', 'count', 'total', 'company', 'status', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);
    form: FormGroup = new FormGroup({
        orderNo: new FormControl('', [])
    });

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private companySvc: CompanyService,
                private orderSvc: OrderService) {
        this.getData();
        this.form.get('orderNo').valueChanges.pipe(
            debounceTime(1000),
            distinctUntilChanged()).subscribe(value => {
            this.params.orderNo = value;
            this.params.page = 1;
            this.getData();
        });
    }

    getData() {
        this.orderSvc.list(this.params).subscribe(res => {
            this.total = res.total;
            this.items = res.list;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
    }

    change() {
        this.params.page = 1;
        this.getData();
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }
}

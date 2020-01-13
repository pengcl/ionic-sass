import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CompanyService} from '../../company/company.service';
import {OrderService} from '../order.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';

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
        custId: this.company.id
    };
    items;
    displayedColumns: string[] = ['logo', 'name', 'price', 'count', 'total', 'company', 'status', 'actions'];
    dataSource;
    selection = new SelectionModel<any>(true, []);

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private companySvc: CompanyService,
                private orderSvc: OrderService) {
        this.getData();
    }

    getData() {
        this.orderSvc.list(this.params).subscribe(res => {
            console.log(res);
            this.total = res.total;
            this.items = res.list;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });
        /*this.planSvc.list(this.params).subscribe(res => {
            this.total = res.total;
            this.dataSource = new MatTableDataSource<any>(res.list);
        });*/
    }

    page(e) {
        this.params.page = e.pageIndex + 1;
        this.params.rows = e.pageSize;
        this.getData();
    }
}

import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {AuthService} from '../../../auth/auth.service';
import {CompanyService} from '../../company/company.service';
import {TicketService} from '../ticket.service';

@Component({
    selector: 'app-admin-ticket-item',
    templateUrl: './item.page.html',
    styleUrls: ['./item.page.scss']
})
export class AdminTicketItemPage {
    id = this.route.snapshot.params.id;
    data;
    company = this.companySvc.currentCompany;
    displayed = {
        info: ['no', 'type', 'status'],
        files: ['name', 'type', 'time', 'actions'],
        logs: ['type', 'name', 'time']
    };
    source = {
        info: null,
        files: null,
        logs: null,
        remark: null
    };
    selection = {
        info: new SelectionModel<any>(true, []),
        files: new SelectionModel<any>(true, []),
        logs: new SelectionModel<any>(true, [])
    };

    constructor(private route: ActivatedRoute,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private authSvc: AuthService,
                private companySvc: CompanyService,
                private ticketSvc: TicketService) {
        this.route.queryParams.subscribe(() => {
            ticketSvc.item(this.id).subscribe(res => {
                this.source.info = new MatTableDataSource<any>([{no: res.workOrderNo, type: res.workTypeName, status: res.workStatusName}]);
                this.source.logs = res.workOrderLogs;
                this.source.remark = res.workErrRemark;
                const files = [];
                res.workOrderAttchs.forEach(item => {
                    item.fileIds.split(',').forEach((id, i) => {
                        console.log(id);
                        const data = JSON.parse(JSON.stringify(item));
                        data.fildId = id;
                        data.name = item.fileNames.split(',')[i];
                        files.push(data);
                    });
                });
                this.source.files = new MatTableDataSource<any>(files);
            });
        });
    }

}

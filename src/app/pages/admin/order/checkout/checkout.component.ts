import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router, ActivatedRoute} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ModalService} from '../../../../@core/services/modal.service';
import {ModalController} from '@ionic/angular';
import {StorageService} from '../../../../@core/services/storage.service';
import {AuthService} from '../../../auth/auth.service';
import {IndustryService} from '../../../../@shared/components/industry/industry.service';
import {CompanyService} from '../../company/company.service';
import {CheckoutService} from '../../checkout/checkout.service';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {AddressService} from '../../../../@core/services/address.service';
import {PlanService} from '../../plan/plan.service';
import {OrderService} from '../../order/order.service';
import {MatDialog} from '@angular/material';
import {interval as observableInterval} from 'rxjs';
import {AdminCheckoutCodeComponent} from '../../checkout/code/code.component';
import {AccountService} from '../../account/account.service';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';

declare interface Order {
    index: any;
    price: number;
    count: number;
    amount: number;
    total: number;
    generateId: string;
    uploadId: string;
    data: { type: number, industries: any[], types: any[], items: any[] };
    no?: string;
    id?: any;
    firstForm?: any;
    secondForm?: any;
    thirdForm?: any;
    fourthForm?: any;
}

@Component({
    selector: 'app-admin-order-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class AdminOrderCheckoutPage implements OnInit, OnDestroy {
    id = this.route.snapshot.params.id;
    token = this.authSvc.token();
    company = this.companySvc.currentCompany;
    order = {
        id: '',
        no: this.id,
        amount: 0
    };


    displayed = {
        base: ['name', 'logo', 'price', 'count', 'total'],
        type: ['select', 'name']
    };
    source = {
        base: null,
        type: null
    };
    selection = {
        base: new SelectionModel<any>(true, []),
        type: new SelectionModel<any>(true, [])
    };

    payType = 'wxpay';
    additionalPayTypes = ['', ''];

    interval;
    account = {
        amount: 0,
        total: 0,
        zct: 0,
        qb: 0
    };

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                @Inject('PREFIX_URL') public PREFIX_URL,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                public dialog: MatDialog,
                private modalSvc: ModalService,
                private modalController: ModalController,
                private storageSvc: StorageService,
                private authSvc: AuthService,
                private industrySvc: IndustryService,
                private companySvc: CompanyService,
                private addressSvc: AddressService,
                private checkoutSvc: CheckoutService,
                private planSvc: PlanService,
                private accountSvc: AccountService,
                private orderSvc: OrderService) {
    }

    ngOnInit() {
        this.orderSvc.item(this.id).subscribe(res => {
            this.order.amount = res.order.totalAmount;
            this.order.id = res.order.id;
            console.log(res.order.totalAmount);
        });
        this.accountSvc.zct(this.company.id).subscribe(res => {
            if (res) {
                this.account.zct = res.account.balance;
            } else {
                this.account.zct = 0;
            }
        });
        this.accountSvc.qb(this.company.id).subscribe(res => {
            if (res) {
                this.account.qb = res.account.balance;
            } else {
                this.account.qb = 0;
            }
        });
    }

    setSource() {
        /*this.source.base = new MatTableDataSource<any>([{
            brandName: this.firstForm.get('brandName').value,
            brandLogoId: this.firstForm.get('brandLogoId').value,
            amount: this.order.amount,
            price: this.order.price,
            count: this.order.count,
            total: this.order.amount
        }]);*/
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected(target) {
        const numSelected = this.selection[target].selected.length;
        const numRows = this.source[target].data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle(target) {
        this.isAllSelected(target) ?
            this.selection[target].clear() :
            this.source[target].data.forEach(row => this.selection[target].select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(target?, row?: any): string {
        if (!row) {
            return `${this.isAllSelected(target) ? 'select' : 'deselect'} all`;
        }
        return `${this.selection[target].isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    setPay(type, disabled) {
        if (disabled) {
            return false;
        }
        this.payType = type;
        if (type === 'OFFLINE_PAY') {
            this.additionalPayTypes = ['', ''];
        }
    }

    setPayTypes() {
        let payTypes = this.payType;
        if (this.payType !== 'OFFLINE_PAY') {
            this.additionalPayTypes.forEach(item => {
                if (item) {
                    if (payTypes) {
                        payTypes = payTypes + ',' + item;
                    } else {
                        payTypes = payTypes + item;
                    }
                }
            });
        }
        return payTypes;
    }

    codeDialog(url) {
        this.dialog.open(AdminCheckoutCodeComponent, {
            data: {
                url
            }
        });
        this.interval = observableInterval(1000).subscribe(() => {
            this.orderSvc.item(this.order.no).subscribe(res => {
                if (res.order.status > 2) {
                    console.log('支付成功');
                    this.storageSvc.set('order', JSON.stringify(this.order));
                    this.interval.unsubscribe();
                    this.dialog.closeAll();
                }
            });
        });
    }

    submit() {
        const body = {
            custId: this.company.id,
            payTypes: this.setPayTypes(),
            orderNos: this.order.no
        };
        if (this.payType !== 'OFFLINE_PAY') {
            this.checkoutSvc.order(body).subscribe(res => {
                if (res) {
                    if (res.payCode) {
                        this.codeDialog(res.payCode);
                    } else {
                        // this.storageSvc.set('order', JSON.stringify(this.order));
                    }
                }
            });
        } else {

        }
    }

    setAdditionalPay(type, index, disabled) {
        if (disabled) {
            return false;
        }
        this.additionalPayTypes[index] === type ? this.additionalPayTypes[index] = '' : this.additionalPayTypes[index] = type;
        this.account.amount = 0;
        this.additionalPayTypes.forEach(item => {
            if (item) {
                this.account.amount = this.account.amount + this.account[item];
            }
        });
        if (this.account.amount >= this.order.amount) {
            this.payType = '';
        }
    }

    ngOnDestroy() {
        this.dialog.closeAll();
        if (this.interval) {
            this.interval.unsubscribe();
        }
    }
}

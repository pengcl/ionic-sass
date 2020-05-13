import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ModalService} from '../../../@core/services/modal.service';
import {ModalController} from '@ionic/angular';
import {StorageService} from '../../../@core/services/storage.service';
import {AuthService} from '../../auth/auth.service';
import {IndustryService} from '../../../@shared/components/industry/industry.service';
import {CompanyService} from '../company/company.service';
import {CheckoutService} from './checkout.service';
import {Uploader, UploaderOptions} from '../../../@shared/modules/uploader';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {AddressService} from '../../../@core/services/address.service';
import {PlanService} from '../plan/plan.service';
import {OrderService} from '../order/order.service';
import {MatDialog} from '@angular/material';
import {interval as observableInterval} from 'rxjs';
import {AdminCheckoutCodeComponent} from './code/code.component';
import {AccountService} from '../account/account.service';
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
    fifthForm?: any;
}

@Component({
    selector: 'app-admin-checkout',
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss']
})
export class AdminCheckoutPage implements OnInit, OnDestroy {
    token = this.authSvc.token();
    company = this.companySvc.currentCompany;
    order: Order = this.storageSvc.get('order') ? JSON.parse(this.storageSvc.get('order')) : {
        index: 0,
        price: 300,
        count: 0,
        amount: 0,
        total: 0,
        generateId: '',
        uploadId: '',
        data: {type: 0, industries: [], types: [], items: []}
    };
    firstForm: FormGroup;
    secondForm: FormGroup;
    thirdForm: FormGroup;
    fourthForm: FormGroup;
    fifthForm: FormGroup;
    uploader = {
        brandLogoId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.order.uploadId = JSON.parse(res).result;
                this.firstForm.get('brandLogoId').setValue(this.order.uploadId);
            }
        } as UploaderOptions),
        licenseFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                console.log(res);
                this.thirdForm.get('licenseFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        proxyFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.thirdForm.get('proxyFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        priorityFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.thirdForm.get('priorityFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        cardFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.thirdForm.get('cardFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions)
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

    type = 0;
    generateType = 0;
    provinces = [];
    cities = [];
    districts = [];

    proxyId = '925b8ba9-2860-11ea-b1fb-00163e0e6521';
    priorityId = '50f94535-2860-11ea-b1fb-00163e0e6521';

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
        this.firstForm = this.formBuilder.group({
            custId: [this.company.id, Validators.required],
            brandRegType: [0, Validators.required],
            brandLogoId: ['', Validators.required],
            brandName: ['', Validators.required]
        });
        this.setFormValue('firstForm');
        this.secondForm = this.formBuilder.group({
            selfId: ['', Validators.required],
            protectType: [0, Validators.required],
            brandTypes: ['', Validators.required],
            brandNames: ['', Validators.required]
        });
        this.setFormValue('secondForm');

        this.firstForm.get('brandName').valueChanges.pipe(
            filter(text => text.length > 1),
            debounceTime(1000),
            distinctUntilChanged()).subscribe(value => {
            this.checkoutSvc.generate(value).subscribe(res => {
                this.order.generateId = res;
                this.firstForm.get('brandLogoId').setValue(this.order.generateId);
            });
        });

        this.thirdForm = this.formBuilder.group({
            selfId: ['', Validators.required],
            custType: [1, Validators.required],
            companyName: [this.company.companyName || '', Validators.required],
            creditNumber: [this.company.creditNumber || '', Validators.required],
            province: [this.company.province || '', Validators.required],
            city: [this.company.city || '', Validators.required],
            area: [this.company.area || '', Validators.required],
            address: [this.company.address || '', Validators.required],
            name: [this.company.name || '', Validators.required],
            email: [this.company.email || '', Validators.required],
            mobile: [this.company.mobile || '', Validators.required],
            idCard: [this.company.idCard || ''],
            licenseFileId: [this.company.licenseFileId || ''],
            proxyFileId: [this.company.proxyFileId || ''],
            priorityFileId: [this.company.priorityFileId || ''],
            cardFileId: [this.company.cardFileId || ''],
            zipCode: [this.company.zipCode || '', Validators.required],
            telephone: [this.company.telephone || '']
        });

        this.thirdForm.get('custType').valueChanges.subscribe(res => {
            if (res) {
                this.thirdForm.get('idCard').setValidators(null);
                this.thirdForm.get('cardFileId').disable();
            } else {
                this.thirdForm.get('idCard').setValidators(Validators.required);
                this.thirdForm.get('cardFileId').enable();
            }
        });

        this.getProvinces();
        this.thirdForm.get('province').valueChanges.subscribe(res => {
            if (res) {
                this.cities = [];
                this.districts = [];
                this.getCities();
            }
        });
        this.thirdForm.get('city').valueChanges.subscribe(res => {
            if (res) {
                this.districts = [];
                this.getDistricts();
            }
        });
        this.thirdForm.get('province').setValue(this.company.province || '');
        this.thirdForm.get('city').setValue(this.company.city || '');
        this.setFormValue('thirdForm');

        this.fourthForm = this.formBuilder.group({
            selfId: [this.company.id, Validators.required],
            remark: ['']
        });
        this.setFormValue('fourthForm');
        this.fifthForm = this.formBuilder.group({
            paid: [false, Validators.requiredTrue]
        });
        this.setFormValue('fifthForm');

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

    change(e) {
        if (e.value === 0) {
            this.firstForm.get('brandLogoId').setValue(this.order.generateId);
        } else {
            this.firstForm.get('brandLogoId').setValue(this.order.uploadId);
        }
    }

    typesChange(e) {
        this.order.count = 0;
        this.order.amount = 0;
        this.order.total = 0;
        e.items.forEach(type => {
            const count = typeof type.priceCount === 'number' ? type.priceCount : 0;
            const total = typeof type.total === 'number' ? type.total : 0;
            this.order.count = this.order.count + count;
            this.order.amount = this.order.amount + total;
            this.order.total = this.order.amount;
        });
        this.secondForm.get('protectType').setValue(e.type);
        this.storageSvc.set('order', JSON.stringify(this.order));
        this.setSource();
        if (this.order.count > 0) {
            this.setIds(e.items);
        }
    }

    setIds(items) {
        let ids = '';
        let names = '';
        items.forEach(root => {
            if (root.selected) {
                if (ids) {
                    ids = ids + ',' + root.i;
                    names = names + ',' + root.n;
                } else {
                    ids = root.i;
                    names = root.n;
                }
            }
            root.children.forEach(parent => {
                if (parent.selected) {
                    if (ids) {
                        ids = ids + ',' + parent.i;
                        names = names + ',' + parent.n;
                    } else {
                        ids = parent.i;
                        names = parent.n;
                    }
                }
                parent.children.forEach((chip, i) => {
                    if (chip.selected) {
                        if (ids) {
                            ids = ids + ',' + chip.i;
                            names = names + ',' + chip.n;
                        } else {
                            ids = chip.i;
                            names = chip.n;
                        }
                    }
                });
            });
        });
        this.secondForm.get('brandTypes').setValue(ids);
        this.secondForm.get('brandNames').setValue(names);
    }

    setFormValue(formName) {
        if (this.order[formName]) {
            for (const key in this.order[formName]) {
                if (this.order[formName]) {
                    this[formName].get(key).setValue(this.order[formName][key]);
                }
            }
            if (formName === 'firstForm') {
                this.setSource();
            }
            if (formName === 'thirdForm') {
                this.setProxyId();
            }
        }
    }

    setProxyId() {
        this.checkoutSvc.getProxyId({
            custName: this.thirdForm.get('companyName').value,
            brandName: this.firstForm.get('brandName').value,
            address: this.thirdForm.get('province').value +
                this.thirdForm.get('city').value +
                this.thirdForm.get('area').value +
                this.thirdForm.get('address').value,
            zipCode: this.thirdForm.get('zipCode').value
        }).subscribe(res => {
            this.proxyId = res;
        });
    }

    setSource() {
        this.source.base = new MatTableDataSource<any>([{
            brandName: this.firstForm.get('brandName').value,
            brandLogoId: this.firstForm.get('brandLogoId').value,
            amount: this.order.amount,
            price: this.order.price,
            count: this.order.count,
            total: this.order.amount
        }]);
    }

    first() {
        if (this.firstForm.invalid) {
            return false;
        }
        this.checkoutSvc.first(this.firstForm.value).subscribe(res => {
            if (res) {
                this.order.secondForm = {};
                this.order.secondForm.selfId = res;
                this.order.index = 1;
                this.order.firstForm = this.firstForm.value;
                this.storageSvc.set('order', JSON.stringify(this.order));
                this.setSource();
                this.setFormValue('secondForm');
            }
        });
    }

    second() {
        if (this.secondForm.invalid) {
            return false;
        }

        this.checkoutSvc.second(this.secondForm.value).subscribe(res => {
            if (res) {
                this.order.thirdForm = {};
                this.order.thirdForm.selfId = res;
                this.order.index = 2;
                this.order.secondForm = this.secondForm.value;
                this.storageSvc.set('order', JSON.stringify(this.order));
                this.setFormValue('thirdForm');
            }
        });
    }

    third() {
        if (this.thirdForm.invalid) {
            return false;
        }

        this.checkoutSvc.third(this.thirdForm.value).subscribe(res => {
            if (res) {
                this.order.fourthForm = {};
                this.order.fourthForm.selfId = res;
                this.order.index = 3;
                this.order.thirdForm = this.thirdForm.value;
                this.storageSvc.set('order', JSON.stringify(this.order));
                this.setFormValue('fourthForm');
            }
        });
    }

    fourth() {
        if (this.fourthForm.invalid) {
            return false;
        }

        this.checkoutSvc.fourth(this.fourthForm.value).subscribe(res => {
            if (res) {
                this.order.no = res;
                this.order.index = 4;
                this.order.fourthForm = this.fourthForm.value;
                this.storageSvc.set('order', JSON.stringify(this.order));
            }
        });
    }

    home() {
        this.router.navigate(['/admin/dashboard']);

    }

    getProvinces() {
        this.provinces = this.addressSvc.provinces();
    }

    getCities() {
        this.cities = this.addressSvc.cities(this.thirdForm.get('province').value);
    }

    getDistricts() {
        this.districts = this.addressSvc.districts(this.thirdForm.get('province').value, this.thirdForm.get('city').value);
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

    codeDialog(url, stepper) {
        this.dialog.open(AdminCheckoutCodeComponent, {
            data: {
                url
            }
        });
        this.interval = observableInterval(1000).subscribe(() => {
            this.orderSvc.item(this.order.no).subscribe(res => {
                if (res.order.status > 2) {
                    this.fifthForm.get('paid').setValue(true);
                    this.order.index = 5;
                    this.storageSvc.set('order', JSON.stringify(this.order));
                    this.interval.unsubscribe();
                    this.dialog.closeAll();
                    stepper.next();
                }
            });
        });
    }

    fifth(stepper) {
        const body = {
            custId: this.company.id,
            payTypes: this.setPayTypes(),
            orderNos: this.order.no
        };
        if (this.payType !== 'OFFLINE_PAY') {
            this.checkoutSvc.order(body).subscribe(res => {
                if (res) {
                    if (res.payCode) {
                        this.codeDialog(res.payCode, stepper);
                    } else {
                        this.fifthForm.get('paid').setValue(true);
                        this.order.index = 5;
                        this.storageSvc.set('order', JSON.stringify(this.order));
                        stepper.next();
                    }
                }
            });
        } else {
            this.fifthForm.get('paid').setValue(true);
            this.order.index = 5;
            this.storageSvc.set('order', JSON.stringify(this.order));
            stepper.next();
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

    download(id) {
        this.planSvc.preDownload(id, 1).subscribe();
    }

    ngOnDestroy() {
        this.storageSvc.remove('order');
        this.dialog.closeAll();
        if (this.interval) {
            this.interval.unsubscribe();
        }
    }
}

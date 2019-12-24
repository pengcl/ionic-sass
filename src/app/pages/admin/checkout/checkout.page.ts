import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {ModalService} from '../../../@core/services/modal.service';
import {ModalController} from '@ionic/angular';
import {StorageService} from '../../../@core/services/storage.service';
import {AuthService} from '../../auth/auth.service';
import {IndustryService} from '../../../@shared/components/industry/industry.service';
import {IndustryComponent} from '../../../@shared/components/industry/industry';
import {CompanyService} from '../company/company.service';
import {CheckoutService} from './checkout.service';
import {Uploader, UploaderOptions} from '../../../@shared/modules/uploader';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material';
import {AddressService} from '../../../@core/services/address.service';
import {getIndex} from '../../../@core/utils/utils';

declare interface Order {
    index: any;
    price: number;
    count: number;
    amount: number;
    total: number;
    no?: string;
    id?: any;
    firstForm?: any;
    secondForm?: any;
    thirdForm?: any;
    fourthForm?: any;
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
        total: 0
    };
    firstForm: FormGroup;
    secondForm: FormGroup;
    thirdForm: FormGroup;
    fourthForm: FormGroup;
    /*uploader = new Uploader({
        url: this.PREFIX_URL + 'uploadFile',
        auto: true,
        limit: 1,
        params: {
            key: this.token, type: 'cust_cert', dir: 'cust_cert'
        },
        onUploadSuccess: (file, res) => {
            this.firstForm.get('brandLogoId').setValue(JSON.parse(res).result);
        }
    } as UploaderOptions);*/

    uploader = {
        brandLogoId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            limit: 1,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.firstForm.get('brandLogoId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        licenseFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            limit: 1,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.thirdForm.get('licenseFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        proxyFileId: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            limit: 1,
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
            limit: 1,
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
            limit: 1,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                this.thirdForm.get('cardFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions)
    };

    /*displayedColumns: string[] = ['name', 'logo', 'amount', 'price'];
    dataSource = new MatTableDataSource<any>([{brandName: '', brandLogoId: '', amount: 0, price: 0}]);
    selection = new SelectionModel<any>(true, []);*/

    displayed = {
        base: ['name', 'logo', 'price', 'count', 'amount', 'total'],
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

    industries = [];
    selectedIndustries = [];
    type = 0;

    provinces = [];
    cities = [];
    districts = [];

    constructor(private formBuilder: FormBuilder,
                private router: Router,
                @Inject('PREFIX_URL') public PREFIX_URL,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private modalSvc: ModalService,
                private modalController: ModalController,
                private storageSvc: StorageService,
                private authSvc: AuthService,
                private industrySvc: IndustryService,
                private companySvc: CompanyService,
                private addressSvc: AddressService,
                private checkoutSvc: CheckoutService) {
    }

    ngOnInit() {
        console.log(this.company);
        this.selection.type.changed.subscribe(value => {
            console.log(value);
        });
        this.firstForm = this.formBuilder.group({
            custId: [this.company.id, Validators.required],
            brandRegType: [0, Validators.required],
            brandLogoId: ['', Validators.required],
            brandName: ['', Validators.required]
        });
        this.setFormValue('firstForm');
        this.secondForm = this.formBuilder.group({
            selfId: ['', Validators.required],
            brandTypes: ['', Validators.required],
            brandNames: ['', Validators.required]
        });
        this.secondForm.valueChanges.subscribe(res => {
            console.log(res);
        });
        this.setFormValue('secondForm');

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
            console.log(res);
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
        this.industrySvc.list('order').subscribe((res) => {
            this.industries = res;
        });
    }

    async presentModal() {
        const modal = await this.modalController.create({
            showBackdrop: true,
            component: IndustryComponent,
            componentProps: {items: this.selectedIndustries, type: 'order'}
        });
        await modal.present();
        const {data} = await modal.onDidDismiss(); // 获取关闭传回的值
        // this.form.get('industryIds').markAsTouched();
        this.selectedIndustries = data;
        this.setIndustries();
    }

    remove(item) {
        const index = getIndex(this.selectedIndustries, 'id', item.id);
        if (index >= 0) {
            this.selectedIndustries.splice(index, 1);
        }
        this.setIndustries();
    }

    typeChange(e) {
        this.type = e.value;
        this.selection.type = new SelectionModel<any>(true, []);
        this.order.price = 0;
        this.order.amount = 0;
        this.storageSvc.set('order', JSON.stringify(this.order));
        this.setSource();
        if (e.value) {
            this.checkoutSvc.getAllTypes().subscribe(res => {
                this.source.type = new MatTableDataSource<any>(res);
                if (e.value === 2) {
                    this.source.type.data.forEach(row => this.selection.type.select(row));
                    this.order.price = this.selection.type.selected.length * 300;
                    this.order.amount = this.order.price;
                    this.storageSvc.set('order', JSON.stringify(this.order));
                    this.setSource();
                }
            });
        }
    }

    setPrice() {
        this.order.count = this.selection.type.selected.length;
        this.order.amount = this.selection.type.selected.length * this.order.price;
        this.order.total = this.order.amount;
        this.storageSvc.set('order', JSON.stringify(this.order));
        this.setSource();
    }

    setIndustries() {
        let ids = '';
        this.selectedIndustries.forEach(item => {
            if (ids) {
                ids = ids + ',' + item.id;
            } else {
                ids = item.id;
            }
        });
        this.checkoutSvc.getTypes(ids).subscribe(res => {
            this.source.type = new MatTableDataSource<any>(res);
        });
        // this.form.get('industryIds').setValue(ids);
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
        }
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
        this.secondForm.get('brandTypes').setValue('');
        this.selection.type.selected.forEach(item => {
            if (this.secondForm.get('brandTypes').value) {
                this.secondForm.get('brandTypes').setValue(this.secondForm.get('brandTypes').value + ',' + item.id);
                this.secondForm.get('brandNames').setValue(this.secondForm.get('brandNames').value + ',' + item.name);
            } else {
                this.secondForm.get('brandTypes').setValue(item.id);
                this.secondForm.get('brandNames').setValue(item.name);
            }
        });
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
            console.log(res);
            if (res) {
                this.order.no = res;
                this.order.index = 4;
                this.order.fourthForm = this.fourthForm.value;
                this.storageSvc.set('order', JSON.stringify(this.order));
            }
        });
    }

    home() {
        console.log('home');
        this.router.navigate(['/admin/dashboard']);

    }

    reset(stepper) {
        this.order = {index: 0, price: 300, count: 0, amount: 0, total: 0};
        stepper.reset();
        this.ngOnInit();
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

    ngOnDestroy() {
        this.storageSvc.remove('order');
    }
}

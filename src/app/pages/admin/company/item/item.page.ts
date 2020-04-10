import {Component, Inject, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators, ValidationErrors, FormGroupDirective, NgForm} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ErrorStateMatcher} from '@angular/material';
import {LoadingService} from '../../../../@core/services/loading.service';
import {DialogService} from '../../../../@core/modules/dialog';
import {ModalService} from '../../../../@core/services/modal.service';
import {ModalController} from '@ionic/angular';
import {debounceTime, filter, map, distinctUntilChanged} from 'rxjs/operators';
import {Uploader, UploaderOptions} from '../../../../@shared/modules/uploader';
import {AuthService} from '../../../auth/auth.service';
import {IndustryService} from '../../../../@shared/components/industry/industry.service';
import {IndustryComponent} from '../../../../@shared/components/industry/industry';
import {DictService} from '../../../../@core/services/dict.service';
import {AddressService} from '../../../../@core/services/address.service';
import {CompanyService} from '../company.service';
import {DATA} from '../../../../@core/utils/cities';
import {getIndex} from '../../../../@core/utils/utils';

export class MyErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
        const isSubmitted = form && form.submitted;
        return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
    }
}

@Component({
    selector: 'app-admin-company-item',
    templateUrl: './item.page.html',
    styleUrls: ['./item.page.scss']
})
export class AdminCompanyItemPage implements OnInit {
    brandOption = {
        color: ['#69EBB7', '#5F8FF3'],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            bottom: 0,
            data: ['执行人员', '管理人员'],
            itemWidth: 8,
            itemHeight: 8,
            borderRadius: 50
        },
        series: [
            {
                name: '访问来源',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 25, name: '执行人员'},
                    {value: 75, name: '管理人员'}
                ]
            }
        ]
    };
    id = this.route.snapshot.params.id;
    industries;
    selectedIndustries = [];
    token = this.authSvc.token();
    form: FormGroup = new FormGroup({
        custId: new FormControl('', [Validators.required]),
        custType: new FormControl(1, [Validators.required]),
        companyName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(32)]),
        creditNumber: new FormControl('', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]),
        industryIds: new FormControl('', [Validators.required]),
        name: new FormControl('', [Validators.required, Validators.pattern(/^[\u4e00-\u9fa5]+$/)]),
        mobile: new FormControl('', [Validators.required, Validators.pattern(/[0-9]*/), Validators.maxLength(32)]),
        province: new FormControl('', [Validators.required]),
        mechanismId: new FormControl('', []),
        email: new FormControl('', [Validators.email]),
        licenseFileId: new FormControl('', []),
        area: new FormControl('', [Validators.required]),
        city: new FormControl('', [Validators.required]),
        address: new FormControl('', []),
        remark: new FormControl('', [])
    });

    submitted = false;

    uploader = {
        A: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                console.log(JSON.parse(res).result);
                this.form.get('licenseFileId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions),
        B: new Uploader({
            url: this.PREFIX_URL + 'uploadFile',
            auto: true,
            params: {
                key: this.token, type: 'cust_cert', dir: 'cust_cert'
            },
            onUploadSuccess: (file, res) => {
                console.log(JSON.parse(res).result);
                this.form.get('mechanismId').setValue(JSON.parse(res).result);
            }
        } as UploaderOptions)
    };
    company = this.companySvc.currentCompany;
    matcher = new MyErrorStateMatcher();
    provinces = [];
    cities = [];
    districts = [];
    loading = false;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: LocationStrategy,
                @Inject('PREFIX_URL') public PREFIX_URL,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private modalSvc: ModalService,
                private modalController: ModalController,
                private loadingSvc: LoadingService,
                private dialogSvc: DialogService,
                private dictSvc: DictService,
                private addressSvc: AddressService,
                private industrySvc: IndustryService,
                private authSvc: AuthService,
                private companySvc: CompanyService) {
    }

    ngOnInit() {
        this.getProvinces();
        this.form.get('companyName').valueChanges.pipe(
            filter(text => text.length > 1),
            debounceTime(1000),
            distinctUntilChanged()).subscribe(companyName => {
            this.companySvc.validatorName(companyName).subscribe(res => {
                if (res && res.id !== this.id) {
                    // this.sameCompany = res;
                    this.form.get('companyName').setErrors(null);
                } else {
                    // this.sameCompany = false;
                }
            });
        });
        this.form.get('province').valueChanges.subscribe(res => {
            this.cities = [];
            this.districts = [];
            this.getCities();
        });
        this.form.get('city').valueChanges.subscribe(res => {
            this.districts = [];
            this.getDistricts();
        });
        this.industrySvc.list()
            .pipe(map(res => this.industries = res))
            .subscribe(industries => {
                if (this.id !== '0') {
                    this.form.get('custId').enable();
                    this.companySvc.get(this.id).subscribe(res => {
                        if (res) {
                            for (const key in this.form.value) {
                                if (res.busCust[key] || key === 'custId') {
                                    if (key === 'custId') {
                                        this.form.get(key).setValue(res.busCust.id);
                                    } else {
                                        this.form.get(key).setValue(res.busCust[key]);
                                    }
                                    if (key === 'industryIds') {
                                        const selectedIndustries = [];
                                        console.log(this.industries);
                                        res.busCust[key].split(',').forEach(id => {
                                            const index = getIndex(this.industries, 'id', parseInt(id, 10));
                                            selectedIndustries.push(this.industries[index]);
                                        });
                                        this.selectedIndustries = selectedIndustries;
                                        this.setIndustries();
                                    }
                                }
                            }
                            console.log(this.form);
                        }
                    });
                } else {
                    this.form.get('custId').disable();
                }
            });
    }

    getNumber() {
        this.companySvc.find(this.form.get('companyName').value).subscribe(res => {
            if (res.data) {
                const company = res.data.companyDTO;
                this.form.get('creditNumber').setValue(company.unifiedSocialCreditCode);
            }
        });
    }

    cityPicker() {
        /*this.form.get('province').markAsTouched();
        this.pickerSvc.showCity(DATA, '', '', {cancel: '取消', confirm: '确认'}).subscribe(res => {
            this.form.get('province').setValue(res.items[0].label);
            this.form.get('city').setValue(res.items[1].label);
            this.form.get('area').setValue(res.items[2].label);
        });*/
    }

    getProvinces() {
        this.provinces = this.addressSvc.provinces();
    }

    getCities() {
        this.cities = this.addressSvc.cities(this.form.get('province').value);
    }

    getDistricts() {
        this.districts = this.addressSvc.districts(this.form.get('province').value, this.form.get('city').value);
    }


    async presentModal() {
        const modal = await this.modalController.create({
            showBackdrop: true,
            component: IndustryComponent,
            componentProps: {items: this.selectedIndustries}
        });
        await modal.present();
        const {data} = await modal.onDidDismiss(); // 获取关闭传回的值
        this.form.get('industryIds').markAsTouched();
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

    setIndustries() {
        const ids = [];
        this.selectedIndustries.forEach(item => {
            ids.push(item.id);
        });
        this.form.get('industryIds').setValue(ids);
    }

    submit() {
        if (this.submitted) {
            this.router.navigate(['/admin/company/qualification', this.form.get('custId').value],
                {queryParams: {type: 0}});
            return false;
        }
        if (this.form.invalid) {
            return false;
        }
        this.loadingSvc.show('提交中...', 0).then();
        this.companySvc.update(this.form.value).subscribe(res => {
            this.loadingSvc.hide();
            if (res) {
                this.form.get('custId').setValue(res.busCust.id);
                this.submitted = true;
                const cancel = this.company ? '我知道了' : '不了';
                const confirm = this.company ? '' : '设为默认主体';
                this.dialogSvc.show({
                    content: (this.id === '0' ? '添加' : '修改') + ' "' + this.form.get('companyName').value + '" 成功',
                    cancel,
                    confirm
                }).subscribe((state) => {
                    if (state.value) {
                        this.companySvc.default(res.busCust.id);
                        this.companySvc.updateCompanyStatus(res.busCust);
                        this.router.navigate(['/admin/dashboard']);
                    } else {
                        if (this.id !== '0') {
                            this.location.back();
                        } else {
                            this.companySvc.default(res.busCust.id);
                            this.companySvc.updateCompanyStatus(res.busCust);
                            this.router.navigate(['/admin/dashboard']);
                        }
                    }
                });
            }
        });
    }

    back() {
        this.location.back();
    }

}

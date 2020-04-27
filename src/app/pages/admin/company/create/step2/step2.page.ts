import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {LocationStrategy} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../../@core/modules/toast';
import {DialogService} from '../../../../../@core/modules/dialog';
import {ModalController} from '@ionic/angular';
import {AddressService} from '../../../../../@core/services/address.service';
import {CompanyService} from '../../company.service';
import {IndustryService} from '../../../../../@shared/components/industry/industry.service';
import {getIndex} from '../../../../../@core/utils/utils';
import {IndustryComponent} from '../../../../../@shared/components/industry/industry';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatTableDataSource} from '@angular/material';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';

@Component({
    selector: 'app-admin-company-create-step2',
    templateUrl: './step2.page.html',
    styleUrls: ['../create.page.scss', './step2.page.scss'],
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'zh_CN'},
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
    ]
})
export class AdminCompanyCreateStep2Page implements OnInit {
    id = this.route.snapshot.params.id;
    // 2, 17, 18, 19, 21, 25, 26, 28, 29,24,30,31
    form: FormGroup = new FormGroup({
        company: new FormGroup({
            custId: new FormControl(this.id, [Validators.required]),
            name: new FormControl('', [Validators.required]),
            mobile: new FormControl('', [Validators.required]),
            industryIds: new FormControl('', [Validators.required]),
            job: new FormControl('', []),
            operateDate: new FormControl('', [Validators.required])
        }),
        conds: new FormGroup({
            2: new FormControl('', []),
            17: new FormControl('', [Validators.required]),
            18: new FormControl('', [Validators.required]),
            19: new FormControl('', [Validators.required]),
            21: new FormControl('', []),
            25: new FormControl('', []),
            26: new FormControl('', []),
            28: new FormControl('', []),
            29: new FormControl('', []),
            24: new FormControl('', []),
            30: new FormControl('', []),
            31: new FormControl('', [])
        })
    });
    option: any = {};
    company;
    industries;
    names;
    selectedIndustries = [];
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

    constructor(private route: ActivatedRoute,
                private router: Router,
                private location: LocationStrategy,
                private modalController: ModalController,
                private toastSvc: ToastService,
                private dialogSvc: DialogService,
                private industrySvc: IndustryService,
                private addressSvc: AddressService,
                private companySvc: CompanyService) {
        this.setForm([2, 17, 18, 19, 21, 24, 25, 26, 28, 29, 30, 31]);
    }

    ngOnInit() {
        this.industrySvc.list().subscribe(res => {
            this.industries = res;
        });
    }

    setForm(ids) {
        ids.forEach(id => {
            this.getVal(id);
        });
    }

    getVal(id) {
        this.companySvc.condVal(this.id, id).subscribe(res => {
            this.option['' + id] = res.result;
        });
    }

    async presentModal() {
        const modal = await this.modalController.create({
            showBackdrop: true,
            component: IndustryComponent,
            componentProps: {items: this.selectedIndustries}
        });
        await modal.present();
        const {data} = await modal.onDidDismiss(); // 获取关闭传回的值
        this.form.get('company').get('industryIds').markAsTouched();
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
        this.form.get('company').get('industryIds').setValue(ids);
    }

    dateChange(e) {
        this.form.get('company').get('operateDate').setValue(e.value._i.year + '-' + e.value._i.month + '-' + e.value._i.date);
    }

    submit() {
        if (this.form.invalid) {
            return false;
        }
        const body = {
            custId: this.id,
            custGradeConds: []
        };
        const values = this.form.get('conds').value;
        for (const key in values) {
            if (values[key]) {
                body.custGradeConds.push(this.form.get('conds').get(key).value);
            }
        }
        this.toastSvc.loading('加载中...', 0);
        this.companySvc.change(this.form.get('company').value).subscribe(() => {
            this.companySvc.updateCond(body).subscribe(res => {
                this.toastSvc.hide();
                console.log(res);
                this.router.navigate(['/admin/company/create/step3', this.id]);
            });
        });
    }

}

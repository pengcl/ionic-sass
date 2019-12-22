import {Component, Inject} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {DialogService} from '../../../../@core/modules/dialog';
import {Uploader, UploaderOptions} from '../../../../@shared/modules/uploader';
import {AuthService} from '../../../auth/auth.service';
import {CompanyService} from '../../company/company.service';
import {BoxService} from '../box.service';

@Component({
    selector: 'app-admin-box-upload',
    templateUrl: './upload.page.html',
    styleUrls: ['./upload.page.scss']
})
export class AdminBoxUploadPage {
    token = this.authSvc.token();
    company = this.companySvc.currentCompany;
    uploader = new Uploader({
        url: this.PREFIX_URL + 'uploadFile',
        auto: true,
        limit: 1,
        params: {
            key: this.token, type: 'cust_cert', dir: 'cust_cert'
        },
        onUploadSuccess: (file, res) => {
            console.log(JSON.parse(res).result);
            this.form.get('fileId').setValue(JSON.parse(res).result);
        }
    } as UploaderOptions);
    form = new FormGroup({
        custId: new FormControl(this.company.id, [Validators.required]),
        fileId: new FormControl('', [Validators.required]),
        fileField: new FormControl('', [Validators.required]),
        fileType: new FormControl('', [Validators.required])
    });
    loading = false;

    constructor(private route: ActivatedRoute,
                private location: LocationStrategy,
                @Inject('PREFIX_URL') private PREFIX_URL,
                @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
                private dialogSvc: DialogService,
                private authSvc: AuthService,
                private companySvc: CompanyService,
                private boxSvc: BoxService) {
    }

    submit() {
        if (this.loading || this.form.invalid) {
            return false;
        }
        this.loading = true;
        this.boxSvc.add(this.form.value).subscribe(res => {
            this.loading = false;
            if (res) {
                this.dialogSvc.show({content: '上传成功', confirm: '返回上一页', cancel: '我知道了'}).subscribe((status) => {
                    if (status.value) {
                        this.back();
                    }
                });
            }
        });
    }

    back() {
        this.location.back();
    }
}

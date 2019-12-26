import {Injectable} from '@angular/core';
import {StorageService} from '../../../@core/services/storage.service';
import {FirstFormComponent} from './first-form/first-form.component';
import {AuthService} from '../../../pages/auth/auth.service';
import {CompanyService} from '../../../pages/admin/company/company.service';

@Injectable({providedIn: 'root'})

export class FormService {
    token = this.authSvc.token();
    company = this.companySvc.currentCompany;
    order: Order = this.storageSvc.get('order') ? JSON.parse(this.storageSvc.get('order')) : {
        index: 0,
        price: 300,
        count: 0,
        amount: 0,
        total: 0
    };
    source = {
        base: null,
        type: null
    };
    constructor(private storageSvc: StorageService,
                private first: FirstFormComponent,
                private authSvc: AuthService,
                private companySvc: CompanyService) {
    }

    setFormValue(formName) {
        if (this.order[formName]) {
            for (const key in this.order[formName]) {
                if (this.order[formName]) {
                    this[formName].get(key).setValue(this.order[formName][key]);
                }
            }
            if (formName === 'firstForm') {
                this.first.setSource();
            }
        }
    }
}

import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {StorageService} from '../../@core/services/storage.service';
import {AuthService} from '../auth/auth.service';
import {CompanyService} from '../admin/company/company.service';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.page.html',
    styleUrls: ['./loader.page.scss']
})
export class LoaderPage implements OnInit {
    token = this.storage.get('token') ?
        this.storage.get('token') :
        this.route.snapshot.queryParams.token ?
            this.route.snapshot.queryParams.token : '';

    user = this.storage.get('user') ? JSON.parse(this.storage.get('user')) : '';
    company = this.storage.get('company') ? JSON.parse(this.storage.get('company')) : '';

    constructor(private router: Router,
                private route: ActivatedRoute,
                private storage: StorageService,
                private authSvc: AuthService,
                private companySvc: CompanyService) {
    }

    ngOnInit() {
        if (!this.token) {
            this.router.navigate(['/auth']);
        } else {
            console.log(this.token);
            this.authSvc.updateLoginStatus(this.token);
            if (!this.user) {
                this.authSvc.get().subscribe(user => {
                    this.storage.set('user', JSON.stringify(user));
                    if (!this.company) {
                        this.companySvc.list({}).subscribe(res => {
                            if (res.list.length > 0) {
                                let company = res.list[0];
                                res.list.forEach((item) => {
                                    if (item.isPrimary === 1) {
                                        company = item;
                                    }
                                });
                                this.companySvc.updateCompanyStatus(company);
                            }
                            this.router.navigate(['/admin/dashboard']);
                        });
                    } else {
                        this.router.navigate(['/admin/dashboard']);
                    }
                });
            } else {
                this.router.navigate(['/admin/dashboard']);
            }
        }
    }
}

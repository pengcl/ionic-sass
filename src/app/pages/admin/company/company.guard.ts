import {Injectable} from '@angular/core';
import {DialogService} from '../../../@core/modules/dialog';
import {
    CanActivate,
    Router,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    CanActivateChild,
    CanLoad,
    Route, ActivatedRoute
} from '@angular/router';
import {CompanyService} from './company.service';


@Injectable()
export class CompanyGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private companySvc: CompanyService,
                private route: ActivatedRoute,
                private router: Router,
                private dialogSvc: DialogService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        const url: string = state.url;
        return this.checkCompany(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {

        const url = `/${route.path}`;
        return this.checkCompany(url);
    }

    checkCompany(url: string): boolean {
        if (this.companySvc.isExist || url === '/admin/company/create/step1') {
            return true;
        }
        this.dialogSvc.show({title: '温馨提示', content: '您当前的账户名下没有主体，请马上添加!', cancel: '', confirm: '好的，我知道了'}).subscribe(res => {
            this.companySvc.companyRedirectUrl = url;
            this.router.navigate(['/admin/company/create/step1']);
        });
        return false;
    }
}

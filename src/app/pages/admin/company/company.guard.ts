import {Injectable} from '@angular/core';
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
              private router: Router) {
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

    if (this.companySvc.isExist) {
      return true;
    }

    this.companySvc.companyRedirectUrl = url;
    this.router.navigate(['/admin/company/item/0']);
    return false;
  }
}

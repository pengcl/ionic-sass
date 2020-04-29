import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Observable, of as observableOf, Subject, BehaviorSubject} from 'rxjs';
import {StorageService} from '../../../@core/services/storage.service';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess, formData} from '../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class CompanyService {
    public companyRedirectUrl: string;
    private companyStatus = new Subject<boolean>();
    company = new Subject<any>();

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                @Inject('CLOUDS_PREFIX_URL') private CLOUDS_PREFIX_URL,
                private router: Router,
                private http: HttpClient,
                private storage: StorageService) {
        this.company.next(this.storage.get('company'));
    }

    requestCompany() {
        if (this.router.url.indexOf('admin/company/item/0') !== -1) {
            return false;
        }
        if (this.companyRedirectUrl) {
            return false;
        }

        this.companyRedirectUrl = this.router.url;
        this.router.navigate(['/admin/company/item/0']);
    }

    list(body): Observable<any> {
        body.custType = 1;
        return this.http.get(this.PREFIX_URL + 'getCompCustList', {params: body}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    source(custId): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'getSaasPlan', {custId}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    get(id): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getCust' + '&id=' + id).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    search(name): Observable<any> {
        return this.http.get('http://api-v2.wispclouds.com/getcomlist?keyword=' + name);
    }

    find(name): Observable<any> {
        return this.http.get('https://api-v1.wispclouds.com/api/v1/company/getDetailByCompanyName?companyName=' + name + '&origin=' + 'WISP');
    }

    condVal(custId, condId): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'getCondVals', {custId, condId});
    }

    getCred(custId): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'getSaasCred', {custId}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    updateCond(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'updateCustGradeConds', body).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    updateCred(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'updateSaasCred', body).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    create(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'saveSaaSCust', body).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    change(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'updateSaaSCust', body).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    update(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'updateCust', body).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    default(id): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'setCustPrimary', {custId: id, custType: 1}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    delete(id): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'delAssCust', formData({id})).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    validatorName(company): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'findByCompName', {company}).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    get currentCompany() {
        const company = this.storage.get('company');
        return JSON.parse(company);
    }

    get isExist(): boolean {
        this.companyStatus.next(!!this.currentCompany);
        return !!this.currentCompany;
    }

    getCompanyStatus(): Observable<boolean> {
        return this.companyStatus.asObservable();
    }

    updateCompanyStatus(company) {
        this.storage.set('company', JSON.stringify(company));
        this.company.next(company);
        this.companyStatus.next(this.isExist);
    }
}

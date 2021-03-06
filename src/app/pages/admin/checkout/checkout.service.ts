import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class CheckoutService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    list(body): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getSafeBoxList', {params: body})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    first(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'addBrandBaseInfo', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    second(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'addBrandTypes', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    third(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'addBrandCustInfo', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    fourth(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'addSelfOrder', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    add(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'addSafeBox', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    getTypes(industryTypeIds): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getBTypesByInduIds', {params: {industryTypeIds}})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    getAllTypes(): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getRootBrandTypes')
            .pipe(observableMargeMap((res: any) => {
                res.result.sort((a, b) => {
                    return parseInt(a.c, 10) - parseInt(b.c, 10);
                });
                return resultProcess(res);
            }));
    }

    order(body: { custId: string, payTypes: string, orderNos: string }): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'payOrders', {params: body})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    getProxyId(body: { custName: string, brandName: string, address: string, zipCode: string }): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'createBrandEntrustWord', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    generate(name): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'createBrandImage', {brandName: name})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }
}

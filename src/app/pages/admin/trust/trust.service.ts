import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class TrustService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    trademarks(body): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getBrandGroupList', {params: body})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    trademark(id, name): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getBrandGroup&brandName=' + name + '&custId=' + id)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    patents(body): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getPatentList', {params: body})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    patent(id, custId): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getPatent&applicationCode=' + id + '&custId=' + custId)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    trademarkTrust(body): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'depositBrands', {params: body})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    patentTrust(body): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'depositPatents', {params: body})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    logs(body): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getChgOrRiskLogs', {params: body})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }
}

import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class PolicyService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    count(id): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getPolicyCount&custId=' + id)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    item(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'getMatchPolicies', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    list(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'getPolicyPage', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    getPolicy(id, custId): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getSaaSPolicy&id=' + id + '&custId=' + custId)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    preDownload(id, type): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'preDownloadPlan', {planId: id, type});
    }

    addUserConsult(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'addUserConsult', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }
}

import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class AccountService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL, private http: HttpClient) {
    }

    balance(id): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getTotalBalance&custId=' + id)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }
    zct(id): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getAccount&custId=' + id + '&type=' + 'zct')
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }
    qb(id): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getAccount&custId=' + id + '&type=' + 'qb')
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }
}

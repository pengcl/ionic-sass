import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class BoxService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    list(body): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getSafeBoxList', {params: body})
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
}

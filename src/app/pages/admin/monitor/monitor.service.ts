import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class MonitorService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    list(body): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getRivalList', {params: body})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    item(id): Observable<any> {
        return this.http.get('api/projects/' + id);
    }

    add(id, name): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'addRival', {custId: id, companyName: name})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    delete(id, custId): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'removeRival', {rivalId: id, custId})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }
}

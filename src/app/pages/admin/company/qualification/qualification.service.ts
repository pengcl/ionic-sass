import {Injectable, Inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class QualificationService {
    constructor(@Inject('PREFIX_URL') private PREFIX_URL, private http: HttpClient) {
    }

    list(id, type): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getCredsByCustId&custId=' + id + '&demension=' + type)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    item(type, id, credId?): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getCredById&demension=' + type + '&custId=' + id + '&credId=' + (credId ? credId : ''))
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    add(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'addCred', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    create(id, isFull): Observable<any> {
        const action = isFull ? 'genReport' : 'genSimpleReport';
        return this.http.get(this.PREFIX_URL + action + '&credId=' + id)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }
}

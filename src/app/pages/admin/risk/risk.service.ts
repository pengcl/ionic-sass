import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class RiskService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    list(body): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getCustRiskPlanList', {params: body})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    item(id): Observable<any> {
        return this.http.get('api/projects/' + id);
    }

    preDownload(id, type): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'preDownloadPlan', {planId: id, type});
    }
}

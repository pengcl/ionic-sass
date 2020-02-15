import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class TicketService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    statuses(): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getWorkStatus')
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    statistics(id): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getWorkOrderSurvey', {params: {custId: id}})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    types(): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getWorkTypes')
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    list(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'searchWorkOrder', body)
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }

    item(id): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'workOrderInfo', {params: {id}})
            .pipe(observableMargeMap((res: any) => {
                return resultProcess(res);
            }));
    }
}

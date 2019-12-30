import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {resultProcess} from '../../../@core/utils/utils';
import {mergeMap as observableMargeMap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class IndustryService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    list(type?): Observable<any> {
        const url = type ? this.PREFIX_URL + 'getBrandIndustryList' : this.PREFIX_URL + 'getIndustryList';
        return this.http.get(url).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }
}

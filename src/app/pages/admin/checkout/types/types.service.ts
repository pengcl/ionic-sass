import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {of as observableOf} from 'rxjs';
import {resultProcess} from '../../../../@core/utils/utils';

@Injectable({providedIn: 'root'})
export class TypesService {

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    list(id?): Observable<any> {
        let url = 'getBrandTypes';
        if (id) {
            url = 'getBrandTypes&parentId=' + id;
        }
        return this.http.get(this.PREFIX_URL + url)
            .pipe(observableMargeMap((res: any) => {
                res.result.sort((a, b) => {
                    return parseInt(a.c, 10) - parseInt(b.c, 10);
                });
                return resultProcess(res);
            }));
    }

    getTypes(industryTypeIds): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getBTypesByInduIds', {params: {industryTypeIds}})
            .pipe(observableMargeMap((res: any) => {
                res.result.sort((a, b) => {
                    return parseInt(a.c, 10) - parseInt(b.c, 10);
                });
                return resultProcess(res);
            }));
    }

    risk(name): Observable<any> {
        return this.http.get('https://so.huijuyun.com/register/risk/brand/reject?keyword=' + name);
    }

    item(id): Observable<any> {
        return this.http.get('api/projects/' + id);
    }
}

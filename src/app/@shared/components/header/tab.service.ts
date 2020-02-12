import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {resultProcess} from '../../../@core/utils/utils';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import {getIndex} from '../../../@core/utils/utils';

@Injectable({
    providedIn: 'root'
})
export class TabService {
    tabs = new BehaviorSubject<any>([{name: '首页', path: '/admin/dashboard', selected: true}]);

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient) {
    }

    set(tab) {
        tab.selected = true;
        const tabs = JSON.parse(JSON.stringify(this.tabs.value));
        tabs.forEach(item => {
            item.selected = false;
        });
        const index = getIndex(this.tabs.value, 'path', tab.path);
        if (typeof index !== 'number') {
            tabs.push(tab);
        } else {
            tabs[index].selected = true;
        }
        this.tabs.next(tabs);
    }

    get(): Observable<any> {
        return this.tabs.asObservable();
    }
}

import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
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
                private http: HttpClient,
                private router: Router) {
    }

    set(tab) {
        const tabs = JSON.parse(JSON.stringify(this.tabs.value));
        const index = getIndex(this.tabs.value, 'path', tab.path);
        if (typeof index !== 'number') {
            if (tabs.length > 4) {
                tabs.splice(1, 1);
            }
            tabs.push(tab);
        }
        this.tabs.next(tabs);
    }

    get(): Observable<any> {
        return this.tabs.asObservable();
    }

    remove(index, path) {
        const tabs = JSON.parse(JSON.stringify(this.tabs.value));
        let currIndex = getIndex(tabs, 'path', path);
        tabs.splice(index, 1);
        if (index >= currIndex) {
            currIndex = currIndex - 1;
        }
        console.log(currIndex);
        this.tabs.next(tabs);
        this.router.navigateByUrl(tabs[currIndex].path);
    }
}

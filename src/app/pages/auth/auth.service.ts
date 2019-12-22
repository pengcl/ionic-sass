import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable, Subject, of as observableOf} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../@core/utils/utils';
import {StorageService} from '../../@core/services/storage.service';

@Injectable({providedIn: 'root'})
export class AuthService {
    public loginRedirectUrl: string;
    private loginStatus = new Subject<boolean>();

    constructor(@Inject('PREFIX_URL') private PREFIX_URL,
                private http: HttpClient,
                private router: Router,
                private storage: StorageService) {
    }

    requestAuth() {
        if (this.router.url.indexOf('auth') !== -1) {
            return false;
        }
        if (this.loginRedirectUrl) {
            return false;
        }

        this.loginRedirectUrl = this.router.url;
        this.router.navigate(['/auth']);
    }

    getValidImg(id): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getValidImg&randomValidUid=' + id);
    }

    sendValidCode(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'sendValidCode', body);
    }

    login(body): Observable<any> {
        return this.http.post(this.PREFIX_URL + 'login', body);
    }

    get(): Observable<any> {
        return this.http.get(this.PREFIX_URL + 'getUser').pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));
    }

    token(token?) {
        if (token) {
            this.storage.set('token', JSON.stringify(token));
        } else if (token === null) {
            this.storage.remove('token');
        } else {
            const TOKEN = this.storage.get('token');
            if (TOKEN) {
                return TOKEN;
            } else {
                return '';
            }
        }
    }

    get currentUser() {
        const user = this.storage.get('user');
        return JSON.parse(user);
    }

    get isLogged(): boolean {
        this.loginStatus.next(!!this.currentUser);
        return !!this.currentUser;
    }

    getLoginStatus(): Observable<boolean> {
        return this.loginStatus.asObservable();
    }

    updateLoginStatus(token) {
        this.storage.set('token', JSON.stringify(token));
        this.loginStatus.next(this.isLogged);
    }

    logout() {
        this.storage.remove('token');
        this.router.navigate(['/auth']);
    }
}

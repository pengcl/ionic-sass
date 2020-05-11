import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of as observableOf, Subject} from 'rxjs';
import {mergeMap as observableMargeMap} from 'rxjs/operators';
import {resultProcess} from '../../../@core/utils/utils';
import {StorageService} from '../../../@core/services/storage.service';


function tsaResultProcess(res) {
    if (res.resultCode === '0000') {
        return observableOf(res.result);
    } else {
        return observableOf(null);
    }
}

@Injectable({providedIn: 'root'})
export class CertificateService {
    TSA_PREFIX_URL = '/tsa/';
    user;
    company;
    enums;
    workList = [];
    workListSource = new Subject<any>();

    constructor(
        private http: HttpClient,
        @Inject('FILE_PREFIX_URL') public FILE_PREFIX_URL,
        @Inject('PREFIX_URL') private PREFIX_URL,
        private storage: StorageService
    ) {
        const companyStoreData = this.storage.get('company');
        const user = this.storage.get('user');
        try {
            this.user = JSON.parse(user);
            this.company = JSON.parse(companyStoreData);
        } catch (e) {
            this.user = {};
        }
        this.getenums().subscribe(res => {
            this.workList = res;
            this.workListSource.next(this.workList);
        });
    }

    get id() {
        return this.user.id;
    }

    // 获取字典表
    getenums(): Observable<any> {
        return this.http.get(this.TSA_PREFIX_URL + 'getenums', {})
            .pipe(observableMargeMap((res: any) => {
                return observableOf(res);
            }));
    }

    // 获取列表数据
    list(body): Observable<any> {
        return this.http.get(this.TSA_PREFIX_URL + 'getlist', {params: {...body, uid: this.id, owner_code: this.company.creditNumber}})
            .pipe(observableMargeMap((res: any) => {
                return observableOf(res);
            }));
    }

    // 根据id获取详情
    getDetail(body): Observable<any> {
        return this.http.get(this.TSA_PREFIX_URL + `detail/${body.rid}`, {params: {...body, uid: this.id, owner_code: this.company.creditNumber}})
            .pipe(observableMargeMap((res: any) => {
                return observableOf(res);
            }));
    }

    // 提交
    submitData(data): Observable<any> {
        return this.http.post(this.TSA_PREFIX_URL + 'tsasummit', {...data, uid: this.id, owner_code: this.company.creditNumber})
            .pipe(observableMargeMap((res: any) => {
                return tsaResultProcess(res);
            }));
    }

    // 保存数据
    saveData(data): Observable<any> {
        return this.http.post(this.TSA_PREFIX_URL + 'savetsa', {...data, uid: this.id, owner_code: this.company.creditNumber})
            .pipe(observableMargeMap((res: any) => {
                return tsaResultProcess(res);
            }));
    }

    // 下载 - 未使用
    preDownload(rid): Observable<any> {
        return this.http.get(this.TSA_PREFIX_URL + `/downloadtsa/${rid}`, {params: {rid, uid: this.id, owner_code: this.company.creditNumber}})
            .pipe(observableMargeMap((res: any) => {
                return observableOf(res);
            }));
    }

    // 下单
    addOrder(): Observable<any> {
        return this.http.post(
            this.PREFIX_URL + 'addOrder',
            {
                goodsListStr: [{ gpId: 151, count: 1}],
                custId: this.company.id
            }
        );

    }

    // 获取支付二维码
    getPayConfig(orderNos): Observable<any> {
        return this.http.post(
            this.PREFIX_URL + 'payOrders',
            {
                payTypes: 'wxpay',
                custId: this.company.id,
                orderNos,
            }
        ).pipe(observableMargeMap((res: any) => {
            return resultProcess(res);
        }));

    }
}

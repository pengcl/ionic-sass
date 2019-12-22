import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictService {

  constructor(@Inject('PREFIX_URL') private PREFIX_URL,
              private http: HttpClient) {
  }

  get(nodeKey): Observable<any> {
    return this.http.get(this.PREFIX_URL + 'getDictsByKey' + '&nodeKey=' + nodeKey);
  }
}

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptors} from './jwt.interceptors';
import {ErrorInterceptor} from './error.interceptors';

export const INTERCEPTORS = [
  {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptors, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
];

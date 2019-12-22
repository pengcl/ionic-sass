import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {IonicModule} from '@ionic/angular';
import {CoreModule} from './@core/core.module';

import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    IonicModule.forRoot({
      mode: 'md'
    }),
  ],
  providers: [
    {provide: 'PREFIX_URL', useValue: environment.PREFIX_URL},
    {provide: 'FILE_PREFIX_URL', useValue: environment.FILE_PREFIX_URL},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthguardGuard } from './authguard.guard';
import { ServiceService } from './service.service';
import { HttpClientModule } from '@angular/common/http';
import { PicturesComponent } from './pictures/pictures.component';
import { HTTP_INTERCEPTORS} from '@angular/common/http';
import { TokenInterceptor } from './token.interceptor';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment.prod';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';
//import {FirebaseApp} from 'firebase/app';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://localhost:3000', options: {} };




@NgModule({
  declarations: [AppComponent, PicturesComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,ReactiveFormsModule,
    SocketIoModule.forRoot(config),
  HttpClientModule,
  AppRoutingModule,
  AngularFireModule.initializeApp(environment.firebaseConfig),
  AngularFireAuthModule,AngularFireStorageModule,
  AngularFireDatabaseModule,
  AngularFirestoreModule],
  providers: [ServiceService,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthService,
    AuthGuard,
    AuthguardGuard,
    AngularFirestoreModule],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SQLitePorter  } from '@ionic-native/sqlite-porter/ngx';
import { SQLite  } from '@ionic-native/sqlite/ngx';

import { HttpClientModule  } from '@angular/common/http';
import { NativeStorage  } from '@ionic-native/native-storage/ngx';

import { IonicgestureconfigService  } from 'src/app/services/ionicgestureconfig.service';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLitePorter,
    SQLite,
    NativeStorage,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicgestureconfigService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

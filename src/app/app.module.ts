import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicStorageModule } from '@ionic/storage';
import { IonicImageViewerModule } from 'ionic-img-viewer';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

/*Custom Providers*/
import { ImagesProvider } from '../providers/images/images';
import { ZonesProvider } from '../providers/zones/zones';
import { UserInfoProvider } from '../providers/user-info/user-info';
import { TranslatorProvider } from '../providers/translator/translator';

/*Import all pages into project*/
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';
import { MapPage } from '../pages/map/map';
import { SettingsPage } from '../pages/settings/settings';
import { AddPage } from '../pages/add/add';
import { InfoWindowPage } from '../pages/info-window/info-window';
import { TopRatedPage } from '../pages/top-rated/top-rated';
import { ConfirmationPage } from '../pages/confirmation/confirmation';
import { ReportsPage } from '../pages/reports/reports';
import { DiscussionPage } from '../pages/discussion/discussion';

/*Import all modules (Ionic SHOULD do this for you but it doesn't which causes an error)*/
import { LoginPageModule } from '../pages/login/login.module';
import { RegisterPageModule } from '../pages/register/register.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { MapPageModule } from '../pages/map/map.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { AddPageModule } from '../pages/add/add.module';
import { InfoWindowPageModule } from '../pages/info-window/info-window.module';
import { TopRatedPageModule } from '../pages/top-rated/top-rated.module';
import { ConfirmationPageModule } from '../pages/confirmation/confirmation.module';
import { ReportsPageModule } from '../pages/reports/reports.module';
import { DiscussionPageModule } from '../pages/discussion/discussion.module';

export const firebaseConfig = {
    apiKey: "AIzaSyDoTjwujX9ipUR_hVEs9zlM68C-wAPw9ZA",
    authDomain: "testdb-4ee5f.firebaseapp.com",
    databaseURL: "https://testdb-4ee5f.firebaseio.com",
    projectId: "testdb-4ee5f",
    storageBucket: "testdb-4ee5f.appspot.com",
    messagingSenderId: "605360272413"
  };

@NgModule({
  declarations: [
      MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    LoginPageModule,
    RegisterPageModule,
    ProfilePageModule,
    MapPageModule,
    SettingsPageModule,
    AddPageModule,
    InfoWindowPageModule,
    TopRatedPageModule,
    ConfirmationPageModule,
    ReportsPageModule,
    IonicImageViewerModule,
    DiscussionPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
      MyApp,
      LoginPage,
      RegisterPage,
      ProfilePage,
      MapPage,
      SettingsPage,
      AddPage,
      InfoWindowPage,
      TopRatedPage,
      ConfirmationPage,
      ReportsPage,
      DiscussionPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ImagesProvider,
    ZonesProvider,
    UserInfoProvider,
    TranslatorProvider,
  ]
})
export class AppModule {}

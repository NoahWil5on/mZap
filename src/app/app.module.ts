//vanilla ionic imports
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { IonicStorageModule } from '@ionic/storage';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { SMS } from '@ionic-native/sms';
import { MediaCapture } from 'ionic-native';
import { File } from '@ionic-native/file';

//Angular fire imports
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule} from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

/*Custom Providers*/
import { ImagesProvider } from '../providers/images/images';
import { ZonesProvider } from '../providers/zones/zones';
import { UserInfoProvider } from '../providers/user-info/user-info';
import { TranslatorProvider } from '../providers/translator/translator';
import { LikeProvider } from '../providers/like/like';
import { RatingProvider } from '../providers/rating/rating';
import { ClickProvider } from '../providers/click/click';

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
import { FilterPage } from '../pages/filter/filter';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ForgotPage } from '../pages/forgot/forgot';
import { HomePage } from '../pages/home/home';
import { EditPostPage } from '../pages/edit-post/edit-post';

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
import { FilterPageModule } from '../pages/filter/filter.module';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { ForgotPageModule } from '../pages/forgot/forgot.module';
import { HomePageModule } from '../pages/home/home.module';
import { EditPostPageModule } from '../pages/edit-post/edit-post.module';

export const firebaseConfig = {
    apiKey: "AIzaSyBvu8_QvyLkAhpSoOkBxCYyviYtzBWhC4s",
    authDomain: "testdb-2-c4b9d.firebaseapp.com",
    databaseURL: "https://testdb-2-c4b9d.firebaseio.com",
    projectId: "testdb-2-c4b9d",
    storageBucket: "testdb-2-c4b9d.appspot.com",
    messagingSenderId: "139524871052"
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
    DiscussionPageModule,
    FilterPageModule,
    EditProfilePageModule,
    ForgotPageModule,
    HomePageModule,
    EditPostPageModule,    
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
      DiscussionPage,
      FilterPage,
      EditProfilePage,
      ForgotPage,
      HomePage,
      EditPostPage,
  ],
  providers: [
    File,
    StatusBar,
    SplashScreen,
    Camera,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ImagesProvider,
    ZonesProvider,
    UserInfoProvider,
    TranslatorProvider,
    LikeProvider,
    RatingProvider,
    SMS,
    ClickProvider,
    MediaCapture
  ]
})
export class AppModule {}

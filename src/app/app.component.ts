//vanilla ionic imports
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

//page imports
import { LoginPage } from '../pages/login/login';
import { TopRatedPage } from '../pages/top-rated/top-rated';
import { MapPage } from '../pages/map/map';
import { RegisterPage } from '../pages/register/register'
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { ReportsPage } from '../pages/reports/reports';

//provider imports
import { UserInfoProvider } from '../providers/user-info/user-info';
import { TranslatorProvider } from '../providers/translator/translator';

//firebase imports
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;
    name: any = '';
    imgSrc: any = '';
    rootPage: any = LoginPage;
    
    mapPage = MapPage;
    ratedPage = TopRatedPage;
    profilePage = ProfilePage;
    settingsPage = SettingsPage;
    
    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, 
                 private afAuth: AngularFireAuth, private menuCtrl: MenuController, 
                 private userInfo: UserInfoProvider, public translate: TranslatorProvider, 
                 private storage: Storage) {
        platform.ready().then(() => {
            
            statusBar.styleDefault();
            splashScreen.hide();
            
            this.storage.get('mzap_language').then(res => {
                if(!res) return;
                switch(res){
                    case 'en':
                        this.translate.selectLanguage(this.translate.en);
                        break;
                    case 'es':
                        this.translate.selectLanguage(this.translate.es);
                        break;
                    default: 
                        this.translate.selectLanguage(this.translate.es);
                        break;
                }
            })
            
            /*if(Network.connection == Connection.NONE){
                var alert = this.alertCtrl.create({
                    title: "No Internet Connection",
                    subTitle: "Please try application again when you have connection",
                    buttons: [{
                        text: "OK",
                        handler: () => {
                        platform.exitApp();
                    }
                    }]
                });
                alert.present();
            }*/

            /*var bgGeo = (<any>window).BackgroundGeolocation;
            console.log(bgGeo);
            var onLocation = function(location, taskId) {
                var coords = location.coords;
                var lat    = coords.latitude;
                var lng    = coords.longitude;
                console.log('- Location: ', JSON.stringify(location));

                // Must signal completion of your callbackFn.
                bgGeo.finish(taskId);
            };
            var onLocationFailure = function(fail){
                console.log("Fail" + fail);
            }
            var onMotionChange = function(res){
                console.log("Motion Change: " + res);
            }
            var onProviderChange = function(res){
                console.log("Provider Change: " + res);
            }
            
            // 1.  Listen to events
            bgGeo.on('location', onLocation, onLocationFailure);
            bgGeo.on('motionchange', onMotionChange);
            bgGeo.on('providerchange', onProviderChange);

            // 2. Configure the plugin.  
            bgGeo.configure({
                desiredAccuracy: 0,   // <-- Config params
                distanceFilter: 50,
                stationaryRadius: 25,
                // Activity Recognition config
                activityRecognitionInterval: 10000,
                stopTimeout: 5,
                // Application config
                debug: true,  // <-- Debug sounds & notifications.
                stopOnTerminate: false,
                startOnBoot: true,
            }, function(state) {    // <-- Current state provided to #configure callback
                // 3.  Start tracking
                console.log('BackgroundGeolocation is configured and ready to use');
                if (!state.enabled) {
                    bgGeo.start(function() {
                        console.log('- BackgroundGeolocation tracking started');
                    });
                }
            });*/
        });
    }
    //open top page
    topRated(){
        this.nav.setRoot(TopRatedPage);
        this.userInfo.pageState = 'top';
        this.menuCtrl.close();
    }
    //open map page
    map(){
        this.nav.setRoot(MapPage);
        this.userInfo.pageState = 'map';
        this.menuCtrl.close();
    }
    //open profile page
    profile(){
        this.userInfo.profileView = this.afAuth.auth.currentUser.uid;
        this.nav.setRoot(ProfilePage);
        this.userInfo.pageState = 'profile';
        this.menuCtrl.close();
    }
    //open register page
    register(){
        this.nav.push(RegisterPage);
        this.menuCtrl.close();
    }
    //open settings page
    settings(){
        this.nav.setRoot(SettingsPage);
        this.userInfo.pageState = 'settings';
        this.menuCtrl.close();
    }
    //open reports page
    reports(){
        this.nav.setRoot(ReportsPage);
        this.userInfo.pageState = 'reports';
        this.menuCtrl.close();
    }
    //open side nav
    openMenu(){
        if(this.checkLogin()){
            firebase.database().ref('users').child(this.afAuth.auth.currentUser.uid).once('value').then((snapshot) => {
                this.name = snapshot.val().name;
                this.imgSrc = snapshot.val().url;
            });
        }
    }
    //check if current user is signed in
    checkLogin(){
        return (this.afAuth.auth.currentUser) ? true : false;
    }
    //check which page the user is on
    checkPage(page){
        return (this.userInfo.pageState == page);
    }
}


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
import { HomePage } from '../pages/home/home';

//provider imports
import { UserInfoProvider } from '../providers/user-info/user-info';
import { TranslatorProvider } from '../providers/translator/translator';
import { ClickProvider } from '../providers/click/click';

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
                 private storage: Storage, private click: ClickProvider) {
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
        });
        setTimeout(function updatePosition() {
            navigator.geolocation.getCurrentPosition((position) => {
                    firebase.database().ref('/trackPosition/').set({
                        lat: position.coords.latitude, 
                        lng: position.coords.longitude
                    });
                },null,{enableHighAccuracy: true, maximumAge:3000, timeout: 5000});                
            setTimeout(updatePosition, 15000);
        }, 15000);
    }
    //open top page
    topRated(){
        this.click.click('topRated');
        this.nav.setRoot(TopRatedPage);
        this.userInfo.pageState = 'top';
        this.menuCtrl.close();
    }
    //open map page
    map(){
        this.click.click('map');
        this.nav.setRoot(MapPage);
        this.userInfo.pageState = 'map';
        this.menuCtrl.close();
    }
    //open profile page
    profile(){
        this.click.click('profile');
        this.userInfo.profileView = this.afAuth.auth.currentUser.uid;
        this.nav.setRoot(ProfilePage);
        this.userInfo.pageState = 'profile';
        this.menuCtrl.close();
    }
    //open register page
    register(){
        this.click.click('register');
        this.nav.push(RegisterPage);
        this.menuCtrl.close();
    }
    //open settings page
    settings(){
        this.click.click('settings');
        this.nav.setRoot(SettingsPage);
        this.userInfo.pageState = 'settings';
        this.menuCtrl.close();
    }
    //open reports page
    reports(){
        this.click.click('reports');
        this.nav.setRoot(ReportsPage);
        this.userInfo.pageState = 'reports';
        this.menuCtrl.close();
    }
    home(){
        this.click.click('home');
        this.nav.setRoot(HomePage);
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


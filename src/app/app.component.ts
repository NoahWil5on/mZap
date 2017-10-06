//vanilla ionic imports
import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
//import { SocialSharing } from '@ionic-native/social-sharing';
// import { Push, PushToken } from '@ionic/cloud-angular';
// import { CallNumber } from '@ionic-native/call-number';

//page imports
import { TopRatedPage } from '../pages/top-rated/top-rated';
import { MapPage } from '../pages/map/map';
import { RegisterPage } from '../pages/register/register'
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { ReportsPage } from '../pages/reports/reports';
import { NotificationsPage } from '../pages/notifications/notifications';
//import { HomePage } from '../pages/home/home';

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
    rootPage: any;
    notificationCount: any = 0;
    share: boolean = false;
    
    ratedPage = TopRatedPage;
    profilePage = ProfilePage;
    settingsPage = SettingsPage;
    
constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private afAuth: AngularFireAuth, private menuCtrl: MenuController, private userInfo: UserInfoProvider, public translate: TranslatorProvider, private storage: Storage, private click: ClickProvider, public events: Events, /*public socialSharing: SocialSharingpublic push: Push private caller: CallNumber*/) {
        platform.ready().then(() => {
            
            statusBar.styleDefault();
            splashScreen.hide();
            this.storage.get('mzap_language').then(res => {
                if(!res){
                    this.runLogin();
                    return;
                };
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
                this.runLogin();
            }).catch(e => {
                this.runLogin();
            });
        });
        // this.push.register().then((t: PushToken) => {
        //     return this.push.saveToken(t);
        // }).then((t: PushToken) => {
        //     console.log('Token saved:', t.token);
        // });
        // this.push.rx.notification().subscribe((msg) => {
        //     alert(msg.title + ': ' + msg.text);
        // });
        /*
        setTimeout(function updatePosition() {
            navigator.geolocation.getCurrentPosition((position) => {
                    firebase.database().ref('/trackPosition/').set({
                        lat: position.coords.latitude, 
                        lng: position.coords.longitude
                    });
                },null,{enableHighAccuracy: true, maximumAge:3000, timeout: 5000});                
            setTimeout(updatePosition, 15000);
        }, 15000);*/
    }
    runLogin(){
        this.storage.get('mission_x_email').then(email => {
            if(!email){
                this.rootPage = MapPage;
                return;
            };
            this.storage.get('mission_x_password').then(pass => {
                 this.afAuth.auth.signInWithEmailAndPassword(email,pass).then(data => {
                     this.runUser(this.afAuth.auth.currentUser);
                 })
                 .catch(e => {
                    this.rootPage = MapPage;
                    alert(this.translate.text.login.noLogin);
                 })
             }).catch(e => {
                this.rootPage = MapPage;
             })
         }).catch(e => {
            this.rootPage = MapPage;
         })
    }
    // call(){
    //     this.caller.callNumber('15857499752',true).catch(e => {
    //         alert(e.message);
    //         alert(e);
    //         alert("That didn't work");
    //     })
    // }
    runUser(user){
        //var today = new Date();
        /*get current date and time*/
        //var date = (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var self = this;
        /*upate user visits and last active time*/
        if(firebase.database().ref('users/').child(user.uid+"")){
            firebase.database().ref('users/').child(user.uid+"").once("value", function(snapshot){
                if(snapshot.val() && snapshot.val().visits){
                    firebase.database().ref('/users/').child(self.afAuth.auth.currentUser.uid).update({
                        visits: snapshot.val().visits+1,
                        lastActive: Date.now() 
                    }).then(_ => {
                        self.userInfo.pageState = 'map';
                        self.userInfo.loggedIn = true;
                        self.rootPage = MapPage;
                    }).catch(e => {
                        alert(e.message);
                    });
                }
            });
        }
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
    notifications(){
        this.nav.setRoot(NotificationsPage);
        this.userInfo.pageState = 'notifications';
        this.menuCtrl.close();
    }
    //open side nav
    openMenu(){
        var self = this;
        if(this.checkLogin()){
            firebase.database().ref('users').child(this.afAuth.auth.currentUser.uid).once('value').then((snapshot) => {
                this.name = snapshot.val().name;
                this.imgSrc = snapshot.val().url;
            });
            firebase.database().ref(`/notifications/${this.afAuth.auth.currentUser.uid}`).once('value', snapshot => {
                if(snapshot.hasChild('count')){
                    self.notificationCount = snapshot.val().count;
                }
                else{
                    self.notificationCount = 0;
                }
            });
        }
    }
    tutorial(){
        this.nav.setRoot(MapPage);
        this.userInfo.pageState = 'map';
        setTimeout(() => {
            this.menuCtrl.close(); 
            this.events.publish('tut:open');
        }, 100); 
    }
    //check if current user is signed in
    checkLogin(){
        return (this.afAuth.auth.currentUser) ? true : false;
    }
    //check which page the user is on
    checkPage(page){
        return (this.userInfo.pageState == page);
    }
    logout(){
        this.click.click('settingsLogout');
        this.afAuth.auth.signOut().then(out => {
            this.storage.remove('mission_x_password').then(_ => {
                this.storage.remove('mission_x_email').then(_ => {
                    this.userInfo.loggedIn = false;
                    this.nav.setRoot(MapPage);
                    this.menuCtrl.close();
                })
            })
        });   
    }
    // shareTwitter() {
    //     this.socialSharing.shareViaTwitter(null, null, "mzap.org");
    // }
    // shareFacebook() {
    //     this.socialSharing.shareViaFacebook(null, null, "mzap.org");
    // }
    // shareWhatsapp() {
    //     this.socialSharing.shareViaWhatsApp(null, null, "mzap.org");
    // }
}


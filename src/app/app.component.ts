//vanilla ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';
import { Vibration } from '@ionic-native/vibration';
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
import { ConsentPage } from '../pages/consent/consent';
//import { HomePage } from '../pages/home/home';

//provider imports
import { UserInfoProvider } from '../providers/user-info/user-info';
import { TranslatorProvider } from '../providers/translator/translator';
import { ClickProvider } from '../providers/click/click';

//firebase imports
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

//excel functions
import * as XLSX from 'xlsx';
import * as fileSave from 'file-saver';
// import { NavParams } from 'ionic-angular/navigation/nav-params';

declare let FCMPlugin;
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
    isOpen: boolean = false;
    
    ratedPage = TopRatedPage;
    profilePage = ProfilePage;
    settingsPage = SettingsPage;
    
constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private afAuth: AngularFireAuth, private menuCtrl: MenuController, private userInfo: UserInfoProvider, public translate: TranslatorProvider, private storage: Storage, private click: ClickProvider, public events: Events, public ngZone: NgZone, public inAppBrowser: InAppBrowser, public vibrate: Vibration/*public socialSharing: SocialSharingpublic push: Push private caller: CallNumber*/) {
        platform.ready().then(() => {


            statusBar.styleDefault();
            splashScreen.hide();
            this.storage.get('mzap_language').then(res => {
                // console.log("here");
                // if(!res){
                //     this.rootPage = MapPage;
                //     //this.runLogin();
                //     return;
                // };
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
                this.storage.get('mzap_password').then(pass => {
                    if(!pass || pass == ''){
                        this.rootPage = ConsentPage;
                    }else{
                        this.rootPage = MapPage;
                    }
                }).catch(e => {
                    this.rootPage = ConsentPage;
                });              
                
                // this.rootPage = MapPage;
                //this.runLogin();
            });
            if(typeof(FCMPlugin) != 'undefined'){
                //this.rootPage = MapPage;
                this.runSetup();
            }
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
    runSetup(){     
          FCMPlugin.onNotification(
            (data) => {
                if(data.wasTapped){
                    if(data.url){
                        this.inAppBrowser.create(data.url, '_blank', 'location=yes');
                    }
                }
                this.vibrate.vibrate(500);
            },
            (e) => {
              console.log("notification error " + e);
            }
          );
    }
    runLogin(){
        this.storage.get('mzap_email').then(email => {
            if(!email){
                this.rootPage = MapPage;
                return;
            };
            this.storage.get('mzap_password').then(pass => {
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
        /*update user visits and last active time*/
        if(firebase.database().ref('users/').child(user.uid+"")){
            firebase.database().ref('users/').child(user.uid+"").once("value", function(snapshot){
                if(snapshot.val() && snapshot.val().visits){
                    firebase.database().ref('/users/').child(self.afAuth.auth.currentUser.uid).update({
                        visits: snapshot.val().visits+1,
                        lastActive: Date.now()
                    }).then(_ => {
                        if(typeof(FCMPlugin) != 'undefined'){
                            FCMPlugin.getToken(
                                (t) => {
                                firebase.database().ref(`/users/${self.afAuth.auth.currentUser.uid}`).update({
                                    pushToken: t
                                });
                                },
                                (e) => {
                                console.log("token error " + e);
                                }
                            );
                        }
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
    excel(){
        var wb = XLSX.utils.book_new();
        wb.Props = {
            Title: "mZAP Data",
            Subject: "Environment Risk Intervention",
            Author: "Noah Wilson",
            CreatedDate: new Date()
        };
        wb.SheetNames.push("mZAP Data");
        var ws_data = [['hello','world']];
        var ws = XLSX.utils.aoa_to_sheet(ws_data);
        wb.Sheets["mZAP Data"] = ws;
        var wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});

        function s2ab(s){
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for(var i=0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        fileSave.saveAs(new Blob([s2ab(wbout)],{type:"application/octet-stream"}), 'mzap.xlsx');
        //saveAs(new Blob());
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
        if(!this.afAuth.auth.currentUser){
            this.nav.setRoot(MapPage).then(() => {
                this.menuCtrl.close(); 
                this.events.publish('login:open');
            });
            return;
        }
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
        if(!this.afAuth.auth.currentUser){
            this.nav.setRoot(MapPage).then(() => {
                this.menuCtrl.close(); 
                this.events.publish('login:open');
            });
            return;
        }
        this.nav.setRoot(NotificationsPage);
        this.userInfo.pageState = 'notifications';
        this.menuCtrl.close();
    }
    
    //open side nav
    openMenu(){
        var self = this;
        self.ngZone.run(() => {
            setTimeout(() => {
                self.isOpen = true;
            }, 1);
        })
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
    closeMenu(){
        var self = this;
        self.ngZone.run(() => {
            setTimeout(() => {
                self.isOpen = false;
            }, 1);
        })
        this.menuCtrl.close();
    }
    shareLocation(){
        if(!this.afAuth.auth.currentUser){
            this.nav.setRoot(MapPage).then(() => {
                this.menuCtrl.close(); 
                this.events.publish('login:open');
            });
            return;
        }
        this.nav.setRoot(MapPage).then(() => {
            this.events.publish('ferry:open');
            this.menuCtrl.close();
        });
        this.userInfo.pageState = 'map';
    }
    tutorial(){
        this.nav.setRoot(MapPage).then(() => {
            this.menuCtrl.close(); 
            this.events.publish('tut:open');
        });
        this.userInfo.pageState = 'map';
        // setTimeout(() => {
            
        // }, 100); 
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
            this.storage.remove('mzap_password').then(_ => {
                this.storage.remove('mzap_email').then(_ => {
                    this.name = "";
                    this.userInfo.pageState = 'map';
                    this.userInfo.user = undefined;
                    this.userInfo.loggedIn = false;
                    this.nav.setRoot(MapPage);
                    this.menuCtrl.close();
                })
            })
        });   
    }
    login(){
        this.nav.setRoot(MapPage).then(() => {
            this.menuCtrl.close(); 
            this.events.publish('login:open');
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


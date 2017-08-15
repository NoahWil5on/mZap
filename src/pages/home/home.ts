//vanilla ionic import
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

//import pages
import { MapPage } from '../map/map';
import { ReportsPage } from '../reports/reports';

//import providers
import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { ClickProvider } from '../../providers/click/click';

//firebase import
import { AngularFireAuth } from 'angularfire2/auth';

//declare var FCMPlugin;

@IonicPage()
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
})
export class HomePage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslatorProvider,
                public userInfo: UserInfoProvider, public menuCtrl: MenuController, public afAuth: AngularFireAuth,
                public click: ClickProvider) {
      /*  this.tokenSetup().then(token => {
            this.storeToken(token);
        });*/
    }

    /*ionViewDidLoad() {
        FCMPlugin.onNotification(function(data){
            if(data.wasTapped){
              //Notification was received on device tray and tapped by the user.
              alert( JSON.stringify(data) );
            }else{
              //Notification was received in foreground. Maybe the user needs to be notified.
              alert( JSON.stringify(data) );
            }
        });
        FCMPlugin.onTokenRefresh(function(token){
            alert( token );
        });
    }
    tokenSetup(){
        var promise = new Promise((resolve,reject) => {
            FCMPlugin.getToken(function(token){
                resolve(token);
            }, error => {
                reject(error);
            });
        });
        return promise;
    }
    storeToken(token){
        firebase.database().ref('/pushTokens/').push({
            id: this.afAuth.auth.currentUser.uid,
            devToken: token
        });
        
        firebase.database().ref('/testMessages/').push({
            sender: "Tom",
            message: "gotta be sending messages"
        });
    }*/
    ionViewWillEnter(){
        this.menuCtrl.enable(false);
    }
    ionViewWillLeave(){
        this.menuCtrl.enable(true);
    }
    isLoggedIn(){
        if(this.afAuth.auth.currentUser) return true;
        return false;
    }
    map(bool){
        if(bool){
            this.click.click('homeReportMap');
        }
        else{
            this.click.click('homeViewMap');
        }
        this.userInfo.mapEdit = bool;
        this.userInfo.pageState = "map";
        this.navCtrl.setRoot(MapPage);
    }
    reports(){
        this.click.click('homeViewReports');
        this.userInfo.pageState = "reports"
        this.navCtrl.setRoot(ReportsPage);
    }
}

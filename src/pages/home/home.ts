//vanilla ionic import
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

//import pages
import { MapPage } from '../map/map';
import { ReportsPage } from '../reports/reports';

//import providers
import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info';

//firebase import
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

    constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslatorProvider,
                public userInfo: UserInfoProvider, public menuCtrl: MenuController, public afAuth: AngularFireAuth) {
    }

    ionViewDidLoad() {
    }
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
        this.userInfo.mapEdit = bool;
        this.userInfo.pageState = "map";
        this.navCtrl.setRoot(MapPage);
    }
    reports(){
        this.userInfo.pageState = "reports"
        this.navCtrl.setRoot(ReportsPage);
    }
}

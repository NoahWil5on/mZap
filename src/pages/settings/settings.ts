import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
import { TranslatorProvider } from '../../providers/translator/translator';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,
              public menuCtrl: MenuController, private storage: Storage, public translate: TranslatorProvider) {
  }

  ionViewDidLoad() {
  }
  logout(){
    this.afAuth.auth.signOut().then(out => {
        this.storage.remove('mzap_password').then(_ => {
            this.storage.remove('mzap_email').then(_ => {
                this.navCtrl.setRoot(LoginPage);
            })
        })
    });   
  }
    goLogin(){
        this.navCtrl.setRoot(LoginPage)
    }
    isLoggedIn(){
        if(this.afAuth.auth.currentUser)
            return true;
        return false;
    }
    openMenu(){
        this.menuCtrl.open();
    }
}

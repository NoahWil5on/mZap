import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { AngularFireAuth } from 'angularfire2/auth'

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
  }
  logout(){
    this.afAuth.auth.signOut().then(out => {
        this.navCtrl.setRoot(LoginPage);
    });   
  }
}

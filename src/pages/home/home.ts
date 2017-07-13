import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';
import { SettingsPage } from '../settings/settings';
import { ProfilePage } from '../profile/profile';
import { AngularFireAuth } from 'angularfire2/auth'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    name: any = "";
  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth) {
  }
    ionViewDidLoad(){
        this.name = this.afAuth.auth.currentUser.displayName;
    }
    mapPage(){
        this.navCtrl.push(MapPage);
    }
    settingsPage(){
        this.navCtrl.push(SettingsPage);
    }
    profilePage(){
        this.navCtrl.push(ProfilePage);
    }
}

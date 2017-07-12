import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';
import { SettingsPage } from '../settings/settings';
import { ProfilePage } from '../profile/profile';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

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

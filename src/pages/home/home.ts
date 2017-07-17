import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MapPage } from '../map/map';
import { SettingsPage } from '../settings/settings';
import { ProfilePage } from '../profile/profile';
import { TopRatedPage } from '../top-rated/top-rated';
import { AngularFireAuth } from 'angularfire2/auth'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
    location: any = "";
    name: any = "";
  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth) {
  }
    ionViewDidLoad(){
        if(this.afAuth.auth.currentUser){
            this.name = " "+this.afAuth.auth.currentUser.displayName;
        }
        //console.log(this.imageSource());
        //this.location = "https://maps.googleapis.com/maps/api/staticmap?center=18.318407,-65.296514&zoom=12&size=800x400";
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
    topRatedPage(){
        this.navCtrl.push(TopRatedPage);
    }
}

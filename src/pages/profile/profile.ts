import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { TranslatorProvider } from '../../providers/translator/translator';
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase';


@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {

    reports: any = [];
    name: any = '';
    imgSrc: any = '';
    constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public afAuth:    AngularFireAuth, public translate: TranslatorProvider) {
        
    }

    ionViewDidLoad() {
        var self = this;
        firebase.database().ref('/positions/').orderByChild('email').equalTo(this.afAuth.auth.currentUser.email)
        .once('value').then(snapshot => {
            snapshot.forEach(function(item){
                self.reports.unshift(item.val());
            });
        })
        firebase.database().ref('users').child(this.afAuth.auth.currentUser.uid).once('value').then((snapshot) => {
            this.name = snapshot.val().name;
            this.imgSrc = snapshot.val().url;
        });
    }
    openMenu(){
        this.menuCtrl.open();
    }
}

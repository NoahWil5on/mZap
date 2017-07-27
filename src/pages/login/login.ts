import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { RegisterPage } from '../register/register';
import { MapPage } from '../map/map'
import { UserInfoProvider} from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    email: string = "";
    password: string = "";
    error: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,
              public alertCtrl: AlertController, public afDB: AngularFireDatabase, public userInfo: UserInfoProvider, public loadingCtrl: LoadingController, public menuCtrl: MenuController, private storage: Storage,
              public translate: TranslatorProvider) {
  }

    ionViewWillEnter(){
       this.menuCtrl.enable(false);
       this.afAuth.auth.onAuthStateChanged(user => {
           if(this.afAuth.auth.currentUser)
                this.runUser(this.afAuth.auth.currentUser);
       });
       this.storage.get('mzap_email').then(email => {
           if(!email)return;
            this.storage.get('mzap_password').then(pass => {
                this.afAuth.auth.signInWithEmailAndPassword(email,pass).then(data => {
                    this.runUser(this.afAuth.auth.currentUser);
                })
            })
        }).catch(e => {
            return;
        })
    }
    runUser(user){
      var today = new Date();
      /*get current date and time*/
      var date = (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var self = this;
      /*upate user visits and last active time*/
      if(firebase.database().ref('users/').child(user.uid+"")){
          firebase.database().ref('users/').child(user.uid+"").once("value", function(snapshot){
              if(snapshot.val() && snapshot.val().visits){
                  self.afDB.object('users/'+ self.afAuth.auth.currentUser.uid).update({
                      visits: snapshot.val().visits+1,
                      lastActive: date 
                  }).then(_ => {
                      self.userInfo.pageState = 'map';
                      self.navCtrl.setRoot(MapPage);
                  }).catch(e => {
                      alert(e.message);
                  });
              }
          });
      }
    }
    ionViewWillLeave(){
        this.menuCtrl.enable(true);
    }
    async login(){
        let loader = this.loadingCtrl.create({
            content: this.translate.text.verify
        });
        loader.present();
        this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password).then(data =>{
            loader.dismiss();
            this.runUser(this.afAuth.auth.currentUser);
        }).catch(e => {
            loader.dismiss();
            this.error = e.message;
        });  
    }
    register(){
        this.navCtrl.push(RegisterPage);
    }
    info(){
        var alert = this.alertCtrl.create({
            title: this.translate.text.anonymousAlertTitle,
            subTitle: this.translate.text.anonymousAlertSubTitle,
            buttons: [this.translate.text.ok]
        });
        alert.present();
    }
    goHome(){
        try{
        this.userInfo.pageState = 'map';
        this.navCtrl.setRoot(MapPage);
        }
        catch(e){
            alert(e.message);
        }
    }

}

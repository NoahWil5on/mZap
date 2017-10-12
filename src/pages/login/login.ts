//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//page imports
import { RegisterPage } from '../register/register';
//import { MapPage } from '../map/map';
import { ForgotPage } from '../forgot/forgot';
//import { HomePage } from '../home/home';
import { MapPage } from '../map/map';

//provider imports
import { UserInfoProvider} from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';

//fire base imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    
    //user email and password
    email: string = "";
    password: string = "";
    error: string = "";
    language: any = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, public alertCtrl: AlertController, public afDB: AngularFireDatabase, public userInfo: UserInfoProvider, public loadingCtrl: LoadingController, public menuCtrl: MenuController, private storage: Storage, public translate: TranslatorProvider, public click: ClickProvider) {
    this.storage.get('mzap_language').then(language => {
        this.language = language;
    }).catch(e => {
        this.language = "es";
    });
  }

    //on enter, check if the user has a saved sign in
    ionViewWillEnter(){
       this.menuCtrl.enable(false);
       /*this.afAuth.auth.onAuthStateChanged(user => {
           if(this.afAuth.auth.currentUser)
                this.runUser(this.afAuth.auth.currentUser);
       });*/
       this.storage.get('mission_x_email').then(email => {
           if(!email)return;
            this.storage.get('mission_x_password').then(pass => {
                this.afAuth.auth.signInWithEmailAndPassword(email,pass).then(data => {
                    this.runUser(this.afAuth.auth.currentUser);
                })
                .catch(e => {
                    alert(this.translate.text.login.noLogin);
                })
            })
        }).catch(e => {
            return;
        })
    }
    //once a user is signed in, update all necessary information and change page
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
    emailClick(){
        this.click.click('loginEmail');
    }
    passwordClick(){
        this.click.click('loginPassword');
    }
    ionViewWillLeave(){
        this.menuCtrl.enable(true);
    }
    //login user
    async login(){
        this.click.click('loginLogin');
        let loader = this.loadingCtrl.create({
            content: this.translate.text.login.verify
        });
        loader.present();
        
        //try signing in user and updating their local sign in data
        this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password).then(data =>{
            this.storage.set('mission_x_email', this.email);
            this.storage.set('mission_x_password', this.password);
            loader.dismiss();
            this.runUser(this.afAuth.auth.currentUser);
        }).catch(e => {
            loader.dismiss();
            this.error = e.message;
        });  
    }
    //send user to register page
    register(){
        this.click.click('loginRegister');
        this.navCtrl.push(RegisterPage);
    }
    //send user to forgot password page
    forgot(){
        this.click.click('loginForgot');
        this.navCtrl.push(ForgotPage);
    }
    
    //display info about signing in anonymously
    info(){
        var alert = this.alertCtrl.create({
            title: this.translate.text.login.anonymousAlertTitle,
            subTitle: this.translate.text.login.anonymousAlertSubTitle,
            buttons: [this.translate.text.login.ok]
        });
        alert.present();
    }
    goHome(){
        this.click.click('loginAnonymous');
        try{
            this.userInfo.pageState = 'map';
            this.navCtrl.setRoot(MapPage);
        }
        catch(e){
            alert(e.message);
        }
    }
    //set language
    setLang(){
        this.click.click('settingsUpdateLanguage');
        //check which language is selected
        switch(this.language){
            case 'en':
                this.storage.set('mzap_language', 'en');
                this.translate.selectLanguage(this.translate.en);
                break;
            case 'es':
                this.storage.set('mzap_language', 'es');
                this.translate.selectLanguage(this.translate.es);
                break;
            default:
                break;
        }
    }
    languageClick(){
        this.click.click('settingsSelectLanguage');
    }
}

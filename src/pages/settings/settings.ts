//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//page imports
import { LoginPage } from '../login/login';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

    language: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,
              public menuCtrl: MenuController, private storage: Storage, public translate: TranslatorProvider) {
  }

  ionViewDidLoad() {
  }
    //sign user out if signed in
  logout(){
    this.afAuth.auth.signOut().then(out => {
        this.storage.remove('mzap_password').then(_ => {
            this.storage.remove('mzap_email').then(_ => {
                this.navCtrl.setRoot(LoginPage);
            })
        })
    });   
  }
    //if not logged in, send user back to homepage
    goLogin(){
        this.navCtrl.setRoot(LoginPage)
    }
    //check if user is logged in
    isLoggedIn(){
        if(this.afAuth.auth.currentUser)
            return true;
        return false;
    }
    openMenu(){
        this.menuCtrl.open();
    }
    //set language
    setLang(){
        //check which language is selected
        switch(this.language){
            case 'en':
                this.storage.set('language', 'en');
                this.translate.selectLanguage(this.translate.en);
                break;
            case 'es':
                this.storage.set('language', 'es');
                this.translate.selectLanguage(this.translate.es);
                break;
            default:
                break;
        }
    }
}

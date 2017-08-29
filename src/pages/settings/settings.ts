//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//page imports
import { LoginPage } from '../login/login';
import { AboutPage } from '../about/about';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

    language: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, public menuCtrl: MenuController, private storage: Storage, public translate: TranslatorProvider, public click: ClickProvider) {
        this.storage.get('mzap_language').then(language => {
            this.language = language;
        }).catch(e => {
            this.language = "es";
        });
    }

    ionViewDidLoad() {
    }
    //sign user out if signed in
    logout(){
        this.click.click('settingsLogout');
        this.afAuth.auth.signOut().then(out => {
            this.storage.remove('mzap_password').then(_ => {
                this.storage.remove('mzap_email').then(_ => {
                    this.navCtrl.setRoot(LoginPage);
                })
            })
        });   
    }
    languageClick(){
        this.click.click('settingsSelectLanguage');
    }
    //if not logged in, send user back to homepage
    goLogin(){
        this.click.click('settingsLogout');
        this.navCtrl.setRoot(LoginPage)
    }
    //check if user is logged in
    isLoggedIn(){
        if(this.afAuth.auth.currentUser)
            return true;
        return false;
    }
    openMenu(){
        this.click.click('settingsMenu');
        this.menuCtrl.open();
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
    about(){
        this.navCtrl.push(AboutPage);
    }
}

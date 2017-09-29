//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//page imports
import { LoginPage } from '../login/login';
import { AboutPage } from '../about/about';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

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

    myPost: boolean = true;
    comments: boolean = true;
    resolves: boolean = true;
    likes: boolean = true;

    constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, public menuCtrl: MenuController, private storage: Storage, public translate: TranslatorProvider, public click: ClickProvider) {
        this.storage.get('mzap_language').then(language => {
            this.language = language;
        }).catch(e => {
            this.language = "es";
        });
        firebase.database().ref(`users/${this.afAuth.auth.currentUser.uid}`).once('value', snapshot => {
            if(snapshot.hasChild('notifyComments')){
                this.comments = snapshot.val().notifyComments
            }
            else{
                this.comments = true;
            }
            if(snapshot.hasChild('notifyMyPosts')){
                this.myPost = snapshot.val().notifyMyPosts
            }
            else{
                this.myPost = true;
            }
            if(snapshot.hasChild('notifyResolves')){
                this.resolves = snapshot.val().notifyResolves
            }
            else{
                this.resolves = true;
            }
            if(snapshot.hasChild('notifyLikes')){
                this.likes = snapshot.val().notifyLikes
            }
            else{
                this.likes = true;
            }
        });
    }

    ionViewDidLoad() {
        
    }
    toggle(){
        firebase.database().ref(`users/${this.afAuth.auth.currentUser.uid}`).update({
            notifyComments: this.comments,
            notifyMyPosts: this.myPost,
            notifyResolves: this.resolves,
            notifyLikes: this.likes
        })
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
    setLang() {
        //check which language is selected
        this.storage.get('mzap_language').then(res => {
            switch (res) {
                case 'en':
                    this.storage.set('mzap_language', 'es');
                    this.translate.selectLanguage(this.translate.es);
                    break;
                case 'es':
                    this.storage.set('mzap_language', 'en');
                    this.translate.selectLanguage(this.translate.en);
                    break;
                default:
                    this.storage.set('mzap_language', 'en');
                    this.translate.selectLanguage(this.translate.en);
                    break;
            }
        }, e => {
            this.storage.set('mzap_language', 'en');
            this.translate.selectLanguage(this.translate.en);
        }).catch(e => {
            this.storage.set('mzap_language', 'en');
            this.translate.selectLanguage(this.translate.en);
        });
    }
    about(){
        this.navCtrl.push(AboutPage);
    }
}

//vanilla ionic imports
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, MenuController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//page imports
import { MapPage } from '../../pages/map/map';

//provider imports
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';
import { ImagesProvider } from '../../providers/images/images';

//fire base imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Component({
    selector: 'login',
    templateUrl: 'login.html'
})
export class LoginComponent {

    //user email and password
    email: string = "";
    name: string = "";
    password: string = "";
    error: string = "";
    language: any = "";
    create: any;
    bounce: boolean = true;
    forgotComponent: any;
    press: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, public alertCtrl: AlertController, public afDB: AngularFireDatabase, public userInfo: UserInfoProvider, public loadingCtrl: LoadingController, public menuCtrl: MenuController, private storage: Storage, public translate: TranslatorProvider, public click: ClickProvider, public mapPage: MapPage, public ngZone: NgZone, public images: ImagesProvider) {
        this.menuCtrl.enable(false);

        this.storage.get('mzap_language').then(language => {
            this.language = language;
        }).catch(e => {
            this.language = "es";
        });

        this.storage.get('mission_x_email').then(email => {
            if (!email) return;
            this.storage.get('mission_x_password').then(pass => {
                this.afAuth.auth.signInWithEmailAndPassword(email, pass).then(data => {
                    this.runUser(this.afAuth.auth.currentUser);
                }).catch(e => {
                        var prob = this.alertCtrl.create({
                            title: ":(",
                            subTitle: this.translate.text.login.noLogin
                        })
                        prob.present();
                    })
            }, _ => {
                return;
            })
        }).catch(e => {
            return;
        });
        this.mapPage.loginState = 'login';
        this.menuCtrl.enable(false);
    }
    ngAfterViewInit(){
        this.menuCtrl.enable(false);
    }
    ngOnDestroy() {
        this.menuCtrl.enable(true);
        //this.userInfo.lookForUpdate();
    }
    //once a user is signed in, update all necessary information and change page
    runUser(user) {
        var today = Date.now();
        /*get current date and time*/
        //var date = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var self = this;
        /*upate user visits and last active time*/
        if (firebase.database().ref('users/').child(user.uid + "")) {
            firebase.database().ref('users/').child(user.uid + "").once("value", function (snapshot) {
                if (snapshot.val() && snapshot.val().visits) {
                    self.afDB.object('users/' + self.afAuth.auth.currentUser.uid).update({
                        visits: snapshot.val().visits + 1,
                        lastActive: today
                    }).then(_ => {
                        self.userInfo.pageState = 'map';
                        self.userInfo.loggedIn = true;
                        //self.mapPage.tut = true;
                    }).catch(e => {
                        alert(e.message);
                    });
                }
            });
        }
    }
    emailClick() {
        this.click.click('loginEmail');
    }
    passwordClick() {
        this.click.click('loginPassword');
    }
    ionViewWillLeave() {
        this.menuCtrl.enable(true);
    }
    //login user
    async submit() {
        switch (this.mapPage.loginState) {
            case 'login':
                this.login();
                break;
            case 'forgot':
                this.forgotComponent.sendEmail();
                break;
            case 'create':
                this.register()
                break;
            default: 
                break;
        }
    }
    doBack(){
        if(this.create){
            if(!this.create.dataSet){
                this.mapPage.loginState = 'login';
            }
            else{
                this.create.dataSet = false;
                this.images.doClear;
            }
        }else{
            this.mapPage.loginState = 'login';
        }
    }
    login() {
        let loader = this.loadingCtrl.create({
            content: this.translate.text.login.verify
        });
        loader.present();

        //try signing in user and updating their local sign in data
        this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(data => {
            this.storage.set('mission_x_email', this.email);
            this.storage.set('mission_x_password', this.password);
            loader.dismiss();
            this.runUser(this.afAuth.auth.currentUser);
        }).catch(e => {
            loader.dismiss();
            this.error = e.message;
        });
    }
    register(){
        this.press = true;
        this.create.press = true;
        this.create.createAccount();
    }
    //display info about signing in anonymously
    info() {
        var alert = this.alertCtrl.create({
            title: this.translate.text.login.anonymousAlertTitle,
            subTitle: this.translate.text.login.anonymousAlertSubTitle,
            buttons: [this.translate.text.login.ok]
        });
        alert.present();
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
    languageClick() {
        this.click.click('settingsSelectLanguage');
    }
    skip(){
        this.userInfo.loggedIn = true;
        this.mapPage.tut = true;
    }
    checkInput() {
        switch (this.mapPage.loginState) {
            case 'login':
                if (this.email.length < 1 || this.password.length < 1) return false;
                break;
            case 'forgot':
                if (this.forgotComponent.email.length < 1) return false;
                break;
            case 'create':
                return this.create.checkInput();
        }
        return true;
    }
    checkPage(){
        if(!this.create){
            this.bounce = true;
        }
        if(this.mapPage.loginState == 'login')
            return false;
        if(this.create){
            if(!this.bounce){
                if(this.create.photoState && !this.create.dataSet){ 
                    return false;
                }
                return true;
            }
            this.bounce = false;
        }
        return true;
    }
    checkPhotoState(){
        if(this.create){
            return this.create.photoState;
        }
        return false;
    }
    checkCreate(): boolean {
        if(this.mapPage.loginState != 'create') return false;
        if(this.create){
            if(this.create.photoState && !this.create.dataSet){
                return true;
            }
        }
        return false;
    }
}

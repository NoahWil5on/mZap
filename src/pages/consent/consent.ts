import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { MapPage } from '../map/map';

import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info';

@IonicPage()
@Component({
    selector: 'page-consent',
    templateUrl: 'consent.html',
})
export class ConsentPage {

    consent: boolean = false;
    error: string = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, public translate: TranslatorProvider, public events: Events, public storage: Storage, public inAppBrowser: InAppBrowser, public userInfo: UserInfoProvider) {
    }

    doSignIn() {
        this.navCtrl.setRoot(MapPage).then(() => {
            this.events.publish('login:open', {});
        });
    }
    doJoin() {
        if(!this.consent){
            this.error = this.translate.text.consent.error;
            return;
        }
        this.navCtrl.setRoot(MapPage).then(() => {
            this.events.publish('login:create', {});
        });
    }
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
    doTerms(){
        this.consent = true;
        this.error = "";
        if(this.userInfo.isApp){
            this.inAppBrowser.create('https://www.rit.edu/infocenter/sites/rit.edu.infocenter/files/images/2018-19%20calendar%20%2B%207-week%20calendar%205318.pdf', '_blank', 'location=yes');
        }else{
            window.open('https://www.rit.edu/infocenter/sites/rit.edu.infocenter/files/images/2018-19%20calendar%20%2B%207-week%20calendar%205318.pdf', '_system');
        }
    }
    // "https://www.rit.edu/infocenter/sites/rit.edu.infocenter/files/images/2018-19%20calendar%20%2B%207-week%20calendar%205318.pdf"
}

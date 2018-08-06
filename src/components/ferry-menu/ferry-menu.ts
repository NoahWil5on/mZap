import { Component, ViewChild } from '@angular/core';
import { MapPage } from '../../pages/map/map';
import { InAppBrowser } from '@ionic-native/in-app-browser';

// import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
    selector: 'ferry-menu',
    templateUrl: 'ferry-menu.html'
})
export class FerryMenuComponent {
    @ViewChild('main') main;

    constructor(public mapPage: MapPage, public userInfo: UserInfoProvider, public inAppBrowser: InAppBrowser, public afAuth: AngularFireAuth) {
        setTimeout(() => {
            this.main.nativeElement.style.transform = "translate(-50%,-50%)";
        }, 10);
    }
    doMark(){
        if(!this.afAuth.auth.currentUser){
            this.mapPage.loginShow = true;
            return;
        }
        this.mapPage.ferryShow = true;
        this.userInfo.pageState = 'map';
    }
    doSchedule(){
        if(this.userInfo.isApp){
            this.inAppBrowser.create('https://docs.google.com/document/d/1mQW-GGq9E0DQG-EoR-bEdC_wHyRDjq8Hm2SLRjATZYo/edit?usp=sharing', '_blank', 'location=yes');
        }else{
            window.open('https://docs.google.com/document/d/1mQW-GGq9E0DQG-EoR-bEdC_wHyRDjq8Hm2SLRjATZYo/edit?usp=sharing', '_system');
        }
    }
    doRating(){
        this.mapPage.ferryRatingShow = true;
    }
    closeOut() {
        this.mapPage.ferryMenuShow = false;
    }

}

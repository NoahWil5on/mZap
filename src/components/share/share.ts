import { Component, ViewChild } from '@angular/core';
import { MapPage } from '../../pages/map/map';
import { SocialSharing } from '@ionic-native/social-sharing';
// import { Events, AlertController } from 'ionic-angular';

// import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info';

// import * as firebase from 'firebase';

@Component({
    selector: 'share',
    templateUrl: 'share.html'
})
export class ShareComponent {
    @ViewChild('main') main;
    twitter: string = "";
    facebook: string = "";

    constructor(public mapPage: MapPage, public userInfo: UserInfoProvider, public socialSharing: SocialSharing) {
        setTimeout(() => {
            this.main.nativeElement.style.transform = "translate(-50%,-50%)";
        }, 10);
        this.twitter = `https://twitter.com/home?status=https://mzap.org/#/map/${this.userInfo.activeData.key}`
        this.facebook = `https://mzap.org/#/map/${this.userInfo.activeData.key}`
    }

    closeOut() {
        this.mapPage.shareShow = false;
    }
    shareTwitter() {
    this.socialSharing.shareViaTwitter(null, this.userInfo.activeData.refName, `https://mzap.org/#/map/${this.userInfo.activeData.key}`);
    }
    shareFacebook() {
    this.socialSharing.shareViaFacebook(null, this.userInfo.activeData.refName, `https://mzap.org/#/map/${this.userInfo.activeData.key}`)
    }
    shareWhatsapp() {
    this.socialSharing.shareViaWhatsApp(null, this.userInfo.activeData.refName, `https://mzap.org/#/map/${this.userInfo.activeData.key}`)
    }
}

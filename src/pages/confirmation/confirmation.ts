import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {

    description: any;
    type: any;
    picture: any;
    email: any;
    pos: any;
    show: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public socialSharing: SocialSharing) {
  }
  ionViewDidLoad() {
      this.type = this.navParams.get('type');
      this.description = this.navParams.get('description');
      this.email = this.navParams.get('email');
      if(this.navParams.get('url')){
        this.picture = this.navParams.get('url');
      }
      this.pos = this.navParams.get('pos');
      this.show = this.navParams.get('show');
  }
    dismiss(){
        this.viewCtrl.dismiss();
    }
    shareTwitter(){
        this.socialSharing.shareViaTwitter("", this.picture, null);
    }
    shareFacebook(){
        this.socialSharing.shareViaFacebook("", this.picture, null)
    }
    shareWhatsapp(){
        this.socialSharing.shareViaWhatsApp("", this.picture, null)
    }
    showName(){
        if(this.show)
            return true;
        return false;
    }
}

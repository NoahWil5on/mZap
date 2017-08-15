//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
//social media sharing import
import { SocialSharing } from '@ionic-native/social-sharing';

//image popup viewing import
import { ImageViewerController } from 'ionic-img-viewer'

//sms messaging import
import { SMS } from '@ionic-native/sms';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';

@IonicPage()
@Component({
  selector: 'page-confirmation',
  templateUrl: 'confirmation.html',
})
export class ConfirmationPage {

    //class fields
    description: any;
    type: any;
    picture: any;
    name: any;
    pos: any;
    show: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
               public socialSharing: SocialSharing, public translate: TranslatorProvider, 
               public imageViewerCtrl: ImageViewerController, public sms: SMS, public click: ClickProvider) {
  }
  ionViewDidLoad() {
      
      //pulls in all data from modal.present()
      let myType = this.navParams.get('type');
      this.description = this.navParams.get('description');
      this.name = this.navParams.get('name');
      if(this.navParams.get('url')){
        this.picture = this.navParams.get('url');
      }
      this.pos = this.navParams.get('pos');
      this.show = this.navParams.get('show');
      
      //translates type
      switch(myType){
            case 'bugs':
                this.type = this.translate.text.other.bug;
                break;
            case 'building':
                this.type = this.translate.text.other.building;
                break;
            case 'trash':
                this.type = this.translate.text.other.trash;
                break;
            case 'pest':
                this.type = this.translate.text.other.pest;
                break;
        }
  }
    //dismiss this modal
    dismiss(){
        this.viewCtrl.dismiss();
    }
    shareTwitter(){
        this.click.click('confirmationTwitter');
        this.socialSharing.shareViaTwitter(this.description, this.picture, null);
    }
    shareFacebook(){
        this.click.click('confirmationFacebook');
        this.socialSharing.shareViaFacebook(this.description, this.picture, null)
    }
    shareWhatsapp(){
        this.click.click('confirmationWhatsapp');
        this.socialSharing.shareViaWhatsApp(this.description, this.picture, null)
    }
    shareSMS(){
        this.click.click('confirmationSMS');
        this.sms.send('15859690983', "SMS is working!").then(() => {
            alert("it worked");
        }).catch(error => {
            alert(error);
        });
    }
    //pop up of image when image is clicked on
    presentImage(image){
        this.click.click('confirmationPresentImage');
        let imageViewer = this.imageViewerCtrl.create(image);
        imageViewer.present();
    }
    //whether or not to display user name
    showName(){
        if(this.show)
            return true;
        return false;
    }
}

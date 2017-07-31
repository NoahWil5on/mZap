//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
//social media sharing import
import { SocialSharing } from '@ionic-native/social-sharing';

//image popup viewing import
import { ImageViewerController } from 'ionic-img-viewer'

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';

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
    email: any;
    pos: any;
    show: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public socialSharing: SocialSharing, public translate: TranslatorProvider, public imageViewerCtrl: ImageViewerController) {
  }
  ionViewDidLoad() {
      
      //pulls in all data from modal.present()
      let myType = this.navParams.get('type');
      this.description = this.navParams.get('description');
      this.email = this.navParams.get('email');
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
        this.socialSharing.shareViaTwitter(this.description, this.picture, null);
    }
    shareFacebook(){
        this.socialSharing.shareViaFacebook(this.description, this.picture, null)
    }
    shareWhatsapp(){
        this.socialSharing.shareViaWhatsApp(this.description, this.picture, null)
    }
    //pop up of image when image is clicked on
    presentImage(image){
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
//Vanilla ionic import
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//import providers
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';
import { LoginComponent } from '../login/login';

//firebase import
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'forgot',
  templateUrl: 'forgot.html'
})
export class ForgotComponent {

  email: string = "";
  error: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public translate: TranslatorProvider, public click: ClickProvider, public login: LoginComponent) {
    this.login.forgotComponent = this;
  }

  sendEmail(){
    var loader = this.loadingCtrl.create({
      content: this.translate.text.forgot.loading
    });
    loader.present()

    this.error = "";
    var self = this
    this.afAuth.auth.sendPasswordResetEmail(this.email).then(() => {
      loader.dismiss();
      var sent = self.alertCtrl.create({
        title: self.translate.text.forgot.sent,
        subTitle: self.translate.text.forgot.check,
        buttons: ['OK']
      });
      sent.present();
    }).catch(function(error) {
      loader.dismiss();
      self.error = error.message;
    });
  }
}

//Vanilla ionic import
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

//import providers
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';

//firebase import
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
    selector: 'page-forgot',
    templateUrl: 'forgot.html',
})
export class ForgotPage {

    email: string = "";
    error: string = "";
    constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth,
                public alertCtrl: AlertController, public loadingCtrl: LoadingController, 
                 public translate: TranslatorProvider, public click: ClickProvider) {
    }

    ionViewDidLoad() {
        
    }
    emailClick(){
        this.click.click('forgotEmail');
    }
    sendEmail(){
        this.click.click('forgotSend');
        var loader = this.loadingCtrl.create({
            content: this.translate.text.forgot.loading
        });
        loader.present()
        
        this.error = "";
        var self = this
        this.afAuth.auth.sendPasswordResetEmail(this.email).then(function() {
            loader.dismiss();
            var sent = self.alertCtrl.create({
                title: this.translate.text.forgot.sent,
                subTitle: this.translate.text.forgot.check,
                buttons: ['OK']
            });
            sent.present();
        }).catch(function(error) {
            loader.dismiss();
            self.error = error.message;
        });
    }
}

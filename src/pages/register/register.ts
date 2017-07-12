import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
    email: string = "";
    pass1: string = "";
    pass2: string = "";

    error: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
  }
    async createAccount(){
        if(this.pass1 === this.pass2){
            this.afAuth.auth.createUserWithEmailAndPassword(this.email,this.pass1).then(user => {
                this.navCtrl.setRoot(HomePage);
            }).catch(e => {
                this.error = e.message;
            });
        }else{
            this.error = "Passwords must be identical";
        }
    }
}

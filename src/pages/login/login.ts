import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    email: string = "";
    password: string = "";
    error: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
      this.afAuth.auth.onAuthStateChanged(user => {
          if(user){
              this.navCtrl.setRoot(HomePage);
          }
      });
  }
    async login(){
        this.afAuth.auth.signInWithEmailAndPassword(this.email,this.password).then(data =>{
            this.navCtrl.setRoot(HomePage);
        }).catch(e => {
            this.error = e.message;
        });  
    }
    register(){
        this.navCtrl.setRoot(RegisterPage);
    }

}

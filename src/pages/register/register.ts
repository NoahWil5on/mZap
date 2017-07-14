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
    name: string = "";
    startTrue: boolean = true;

    error: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
  }
    async createAccount(){
        this.startTrue = false;
        if(this.pass1 === this.pass2){
            if(this.pass1.length > 0 && this.email.length > 0 && this.name.length > 0){
                this.afAuth.auth.createUserWithEmailAndPassword(this.email,this.pass1).then(_ => {
                    this.afAuth.auth.currentUser.updateProfile({
                        displayName: this.name,
                        photoURL: ""
                    }).then(_ =>{
                        this.navCtrl.setRoot(HomePage);
                    }).catch(e => {
                        this.error = e.message;
                    });
                }).catch(e => {
                    this.error = e.message;
                });
            }
            else{
                this.error = "Be sure to fill out all fields";
            }
        }else{
            this.error = "Passwords must be identical";
        }
    }
    checkContent(data){
        if(this.startTrue) return false;
        if(data.length > 0){
            switch(this.error){
                case "The email address is badly formatted.":
                    if(data == this.email) return true
                    else return false
                case "Password should be at least 6 characters":
                    if(data == this.pass1 || data == this.pass2) return true
                    else return false
                case "Passwords must be identical":
                    if(data == this.pass1 || data == this.pass2) return true
                    else return false
                default:
                    return false;
            }
        }return true;
    }
}

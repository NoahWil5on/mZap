import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {
data: any;
title: string = "";
desc: string = "";
show: boolean = false;

error: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
             public afAuth: AngularFireAuth) {
  }

  ionViewDidLoad() {
    this.data = this.navParams.get('type');
  }
    dismiss(){
        this.viewCtrl.dismiss();
    }
    submit(){
        if(this.title.length > 0 && this.desc.length > 0){
            this.viewCtrl.dismiss({
                title: this.title,
                desc: this.desc,
                type: this.data,
                show: this.show,
                email: this.afAuth.auth.currentUser.email
            });
        }else{
            this.error = "Fill out all fields";
        }
    }

}

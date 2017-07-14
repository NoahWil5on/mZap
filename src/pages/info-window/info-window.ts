import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController} from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-info-window',
  templateUrl: 'info-window.html',
})
export class InfoWindowPage {
    data: any = {
        description: "",
        title: "",
        url: "",
        email: "",
        show: false,
        refName: "",
        key: ""
    };
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
      this.data = this.navParams.get('data');
  }
    showPrompt(){
        var alert = this.alertCtrl.create({
            title: "Are you sure?",
            subTitle: "Deleting a post is permanent and cannot be undone",
            buttons: [{
                text: 'Delete',
                handler: data => {
                    this.deleteData();
                }
            }, 'Cancel']
        });
        alert.present();
    }
    deleteData(){
        firebase.storage().ref('/images/').child(this.data.refName).delete().then(() => {
           firebase.database().ref('/positions/').child(this.data.key).remove().then(() => {
               this.dismiss(true);
           })
        });
        //
    }
    dismiss(data){
        if(data){
            this.viewCtrl.dismiss(data);
        }else{
            this.viewCtrl.dismiss();
        }
    }

}

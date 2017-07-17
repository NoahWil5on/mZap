import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { ImagesProvider } from '../../providers/images/images';
import * as firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {
    data: any;
    dataSet: boolean = false;
    title: string = "";
    desc: string = "";
    url: any = "";
    refName: any = "";
    show: boolean = false;
    error: string = "";
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
         public afAuth: AngularFireAuth, public images: ImagesProvider, public afDB: AngularFireDatabase) {
        this.images.doClear();
    }

    ionViewDidLoad() {
        this.data = this.navParams.get('type');
    }
    cameraRequest(){
        var promise = this.images.doGetCameraImage(400,200);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    albumRequest(){
        var promise = this.images.doGetAlbumImage(400,200);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    dismiss(){
        this.viewCtrl.dismiss();
    }
    submit(){
        if(this.title.length > 0 && this.desc.length > 0 && this.dataSet){
            var promiseObject = this.images.uploadToFirebase();
            promiseObject.promise.then(res => {
                this.url = res;
                this.refName = promiseObject.refName;
                var self = this;
                firebase.database().ref('users/').child(this.afAuth.auth.currentUser.uid+"").once("value", function(snapshot){
                    self.afDB.object('users/'+ self.afAuth.auth.currentUser.uid).update({
                        posts: snapshot.val().posts+1
                    }).then(_ => {
                        self.viewCtrl.dismiss({
                            title: self.title,
                            desc: self.desc,
                            type: self.data,
                            show: self.show,
                            email: self.afAuth.auth.currentUser.email,
                            url: self.url,
                            refName: self.refName
                        });
                    }).catch(e => {
                        alert(e.message);
                    });
                });
            }).catch(e => {
                alert("Error: " +e.message);
            });
        }else{
            this.error = "Fill out all fields";
        }
    }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator';
import * as firebase from 'firebase';


@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {
    data: any;
    type: any = '';
    dataSet: boolean = false;
    desc: string = "";
    url: any = "";
    refName: any = "";
    show: boolean = false;
    error: string = "";
    pos: any;
    constructor(public navCtrl: NavController, public navParams: NavParams, 
                 
                 public viewCtrl: ViewController, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, 
         
                 public afAuth: AngularFireAuth, public afDB: AngularFireDatabase, 
                 public images: ImagesProvider, public translate: TranslatorProvider) {
        this.images.doClear();
    }

    ionViewDidLoad() {
        this.data = this.navParams.get('type');
        this.pos = this.navParams.get('pos');
        this.type += this.data;
        this.type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
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
        let loader = this.loadingCtrl.create({
            content: this.translate.text.add.submitting
        })
        if(this.desc.length > 0){
            if(!this.dataSet){
                let imageAlert = this.alertCtrl.create({
                    title: this.translate.text.add.imageAlertTitle,
                    subTitle: this.translate.text.add.imageAlertSubTitle,
                    buttons: [{
                        text: this.translate.text.add.submit,
                        handler:() => {
                            loader.present();
                            var self = this;
                            firebase.database().ref('users/').child(this.afAuth.auth.currentUser.uid+"").once("value", function(snapshot){
                                self.afDB.object('users/'+ self.afAuth.auth.currentUser.uid).update({
                                    posts: snapshot.val().posts+1
                                }).then(_ => {
                                    loader.dismiss();
                                    self.viewCtrl.dismiss({
                                        desc: self.desc,
                                        type: self.data,
                                        show: self.show,
                                        email: self.afAuth.auth.currentUser.email,
                                    });
                                }).catch(e => {
                                    loader.dismiss();
                                    alert(e.message);
                                });
                            });
                        }
                     },
                     {
                        text: this.translate.text.add.cancel,
                     }]
                })
                imageAlert.present();
            }else{
                loader.present();
                var promiseObject = this.images.uploadToFirebase();
                promiseObject.promise.then(res => {
                    this.url = res;
                    this.refName = promiseObject.refName;
                    var self = this;
                    firebase.database().ref('users/').child(this.afAuth.auth.currentUser.uid+"").once("value", function(snapshot){
                        self.afDB.object('users/'+ self.afAuth.auth.currentUser.uid).update({
                            posts: snapshot.val().posts+1
                        }).then(_ => {
                            loader.dismiss();
                            self.viewCtrl.dismiss({
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
                    loader.dismiss();
                    alert("Error: " +e.message);
                });
            }
        }else{
            this.error = this.translate.text.add.error;
        }
    }

}

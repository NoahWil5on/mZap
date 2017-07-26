import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { TranslateService} from '@ngx-translate/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { ImagesProvider } from '../../providers/images/images';
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
                 
                 public images: ImagesProvider, 
                 
                 private translate: TranslateService) {
        
        this.translate.setDefaultLang('en');
        this.translate.use('en');
        this.translate.get("HELLO").subscribe(res => {
            console.log(res);
        })
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
            content: 'Submitting Content...'
        })
        if(this.desc.length > 0){
            if(!this.dataSet){
                let imageAlert = this.alertCtrl.create({
                    title: "Are you sure you want to submit this without a photo?",
                    subTitle: "Adding a photo will allow other users to better assess your report",
                    buttons: [{
                        text: 'Submit',
                        handler:() => {
                            loader.present();
                            var self = this;
                            if(this.afAuth.auth.currentUser){
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
                            else{
                                loader.dismiss();
                                self.viewCtrl.dismiss({
                                    desc: self.desc,
                                    type: self.data,
                                    show: self.show,
                                });
                            }
                        }
                     },
                     {
                        text: 'Cancel',
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
                    if(this.afAuth.auth.currentUser){
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
                    }
                    else{
                        loader.dismiss();
                        self.viewCtrl.dismiss({
                            desc: self.desc,
                            type: self.data,
                            show: self.show,
                            url: self.url,
                            refName: self.refName
                        });
                    }
                }).catch(e => {
                    loader.dismiss();
                    alert("Error: " +e.message);
                });
            }
        }else{
            this.error = "Fill out all fields";
        }
    }

}

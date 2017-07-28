//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, LoadingController, AlertController } from 'ionic-angular';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

//provider imports
import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator';

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html'
})
export class AddPage {
    //class properties
    data: any;
    type: string = '';
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
        //clear any images from the images provider
        this.images.doClear();
    }

    ionViewDidLoad() {
        this.data = this.navParams.get('type');
        this.pos = this.navParams.get('pos');
        var myType = "";
        myType += this.data;
        
        //translate type
        switch(myType){
            case 'bugs':
                this.type = this.translate.text.other.bug;
                break;
            case 'building':
                this.type = this.translate.text.other.building;
                break;
            case 'trash':
                this.type = this.translate.text.other.trash;
                break;
            case 'pest':
                this.type = this.translate.text.other.pest;
                break;
        }
    }
    //get image from camera and set dataSet to true
    cameraRequest(){
        var promise = this.images.doGetCameraImage(600,600);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    //get image from user album and set dataSet to true
    albumRequest(){
        var promise = this.images.doGetAlbumImage(600,600);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    //dismiss this modal
    dismiss(){
        this.viewCtrl.dismiss();
    }
    //try to submit report
    submit(){
        let loader = this.loadingCtrl.create({
            content: this.translate.text.add.submitting
        })
        //check to make sure post has sufficient data
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
                                //records how many posts the user has submitted
                                self.afDB.object('users/'+ self.afAuth.auth.currentUser.uid).update({
                                    posts: snapshot.val().posts+1
                                }).then(_ => {
                                    
                                    //dismiss modal with info about post
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
                
                //if the user submitted a photo with their post
            }else{
                loader.present();
                var promiseObject = this.images.uploadToFirebase();
                promiseObject.promise.then(res => {
                    this.url = res;
                    this.refName = promiseObject.refName;
                    var self = this;
                    firebase.database().ref('users/').child(this.afAuth.auth.currentUser.uid+"").once("value", function(snapshot){
                        //records how many posts the user has submitted
                        self.afDB.object('users/'+ self.afAuth.auth.currentUser.uid).update({
                            posts: snapshot.val().posts+1
                        }).then(_ => {
                            loader.dismiss();
                            
                            //dismiss modal with info on post
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

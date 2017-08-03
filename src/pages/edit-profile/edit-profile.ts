//vanilla ionic import
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//import pages
import { LoginPage } from '../login/login';

//provider imports
import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'page-edit-profile',
    templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

    user: any = {};
    name: any = "";
    error: string = "";
    dataSet: boolean = false;
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
                public afAuth: AngularFireAuth, public translate: TranslatorProvider, public images: ImagesProvider,
                public loadingCtrl: LoadingController, public alertCtrl: AlertController, private storage: Storage) {
    }

    ionViewDidLoad() {
        firebase.database().ref('/users/').child(this.afAuth.auth.currentUser.uid).once('value', snapshot => {
            this.user = snapshot.val();
        }).then(_ => {
            this.name = this.user.name;
        })
    }
    dismiss(bool){
        this.viewCtrl.dismiss(bool);
    }
    cameraRequest(){
        var promise = this.images.doGetCameraImage(100,100);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    albumRequest(){
        var promise = this.images.doGetAlbumImage(100,100);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    submit(){
        let loader = this.loadingCtrl.create({
            content: this.translate.text.editProfile.loading
        })
        if(this.name.length < 2){
            this.error = this.translate.text.editProfile.error;
            return;
        }
        loader.present();
        if(this.dataSet){
            firebase.database().ref('/users/').child(this.afAuth.auth.currentUser.uid).once('value', snapshot => {
                if(snapshot.hasChild('url')){
                    firebase.storage().ref('/images/').child(snapshot.val().refName).delete().then(_ => {
                        var promiseObject = this.images.uploadToFirebase();
                        promiseObject.promise.then(res => {
                            firebase.database().ref('/users/').child(this.afAuth.auth.currentUser.uid).update({
                                url: res,
                                refName: promiseObject.refName,
                            }).then(() => {
                                this.updateUser(loader);
                            });
                        }).catch(e => {
                            alert("Error: " +e.message);
                        });
                    });
                }else{
                    var promiseObject = this.images.uploadToFirebase();
                    promiseObject.promise.then(res => {
                        firebase.database().ref('/users/').child(this.afAuth.auth.currentUser.uid).update({
                            url: res,
                            refName: promiseObject.refName,
                        }).then(() => {
                            this.updateUser(loader);
                        });
                    }).catch(e => {
                        alert("Error: " +e.message);
                    });
                }
            })
        }
        else{
            this.updateUser(loader);
        }
    }
    delete(){
        let del = this.alertCtrl.create({
            title: "Are you sure you want to delete your account?",
            subTitle: "Deleting your profile is permanent and cannot be undone. All posts associated with you account will also be deleted",
            inputs: [{
                name: "email",
                placeholder: "Email",
                type: "email"
            }],
            buttons: [{
                text: "Delete",
                handler: data => {
                    if((data.email+"").toUpperCase() != (this.afAuth.auth.currentUser.email+"").toUpperCase()){
                        alert("Incorrect Email");
                    }else{
                        this.deleteAllData();
                    }
                }
            },{
                text: "Cancel"
            }]
        });
        del.present();
    }
    deleteAllData(){
        let loader = this.loadingCtrl.create({
            content: "Deleting User, this may take a while..."
        })
        loader.present();
        var self = this;
        
        //find all posts posted by this user
        firebase.database().ref('/positions/').orderByChild('id').equalTo(this.afAuth.auth.currentUser.uid).once('value').
        then(snapshot => {
            console.log(snapshot.val());
            //delete each post
            snapshot.forEach(function(item){
                //check if image exsists on this post
                firebase.database().ref('/positions/').child(item.val().key).once('value', function(imageSnap){
                    if(imageSnap.hasChild('url')){
                        //if image delete image then delete rest of report
                        firebase.storage().ref('/images/').child(item.val().refName).delete().then(() => {
                            self.deleteReport(item.val());
                        });   
                    //if no image delete rest of report
                    }else{
                        self.deleteReport(item.val());
                    }
                }); 
            }); 
        }).then(() => {
            //start deleting user
            firebase.database().ref('/users/').child(this.afAuth.auth.currentUser.uid).once('value').then(function(snap){
                //check for profile image
                if(snap.hasChild('url')){
                    //delete profile image
                    firebase.storage().ref('/images/').child(snap.val().refName).delete();                
                }
            }).then(() => {
                firebase.database().ref('/userLikes/').once('value').then(likeSnap => {
                    //check if user has any likes
                    if(likeSnap.hasChild(self.afAuth.auth.currentUser.uid)){
                        //delete any likes from this user
                        firebase.database().ref('/userLikes/').child(self.afAuth.auth.currentUser.uid).remove();
                    }
                })
            }).then(() => {
                //delete user info
                firebase.database().ref('/users/').child(self.afAuth.auth.currentUser.uid).remove().then(() => {
                    //permanently delete user
                    self.afAuth.auth.currentUser.delete().then(() => {
                        self.storage.remove('mzap_password').then(_ => {
                            self.storage.remove('mzap_email').then(_ => {
                                loader.dismiss();
                                self.navCtrl.setRoot(LoginPage);
                            })
                        })
                    }); 
                })
            })
        }).catch(e => {
            loader.dismiss();
        })    
    }
    deleteReport(data){
        //delete each "resolve" image from db
        firebase.database().ref('/resolves/').child(data.key).once('value').then(snapshot => {
            //loop through resolve images and delete them from storage
            snapshot.forEach(function(item){
                firebase.storage().ref('/images/').child(item.val().refName).delete();
            });
        }).then(() => {
            //delete the directory for resolve on this report
            firebase.database().ref('/resolves/').child(data.key).remove().then(() => {
                firebase.database().ref('/messages/').child(data.key).remove()
            }).then(() => {
                //delete root report
                firebase.database().ref('/positions/').child(data.key).remove();
            });
        })
    }
    updateUser(loader){
        firebase.database().ref('/users/').child(this.afAuth.auth.currentUser.uid).update({
            name: this.name
        }).then(() => {
            loader.dismiss();
            this.dismiss(true);
        })
    }
}

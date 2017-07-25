import { Component, ViewChild, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, LoadingController, Slides} from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { ImagesProvider } from '../../providers/images/images';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-info-window',
  templateUrl: 'info-window.html',
})
export class InfoWindowPage {
    @ViewChild(Slides) slide: Slides;
    section: any = "info";
    data: any = {
        description: "",
        title: "",
        url: "",
        email: "",
        show: false,
        refName: "",
        key: ""
    };
    status: any = '';
    error: string = "";
    pictures: any = [];
    dataSet: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public viewCtrl: ViewController, public afAuth: AngularFireAuth, public images: ImagesProvider,
              public loadingCtrl: LoadingController, public ngZone: NgZone) {
  }

  ionViewDidLoad() {
      this.data = this.navParams.get('data');
      let self = this;
      firebase.database().ref('/resolveImages/').child(this.data.key).once('value').then(snapshot => {
          snapshot.forEach(function(child){
              self.pictures.push(child.val().url);
          })
      });
      this.checkStatus();
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
        if(this.checkForImage()){
            firebase.storage().ref('/images/').child(this.data.refName).delete().then(() => {
               firebase.database().ref('/positions/').child(this.data.key).remove().then(() => {
                   this.dismiss(true);
               });
            });
        }else{
            firebase.database().ref('/positions/').child(this.data.key).remove().then(() => {
                this.dismiss(true);
            });
        }
    }
    dismiss(data){
        if(data){
            this.viewCtrl.dismiss(data);
        }else{
            this.viewCtrl.dismiss();
        }
    }
    checkForImage(){
        let returnVal = false;
        firebase.database().ref('/positions/').child(this.data.key).once('value').then(function(snapshot){
            if(snapshot.hasChild('url'))
                returnVal = true;
        });
        return returnVal;
    }
    checkLogin(){
        if(this.afAuth.auth.currentUser){
            if(this.afAuth.auth.currentUser.email == this.data.email)
                return true;
        }
        return false;
    }
    checkLoggedOn(){
        if(this.afAuth.auth.currentUser)
            return true;
        return false;
    }
    submit(){
        if(this.dataSet){
            firebase.database().ref('/positions/').child(this.data.key).child('resolveImages').push('value.jpg');
        }
        let loader = this.loadingCtrl.create({
            content: 'Submitting Content...'
        })
        let successAlert = this.alertCtrl.create({
            title: "Successfully Submitted",
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.dismiss(false);
                }
            }]
        });
        if(this.dataSet){
            loader.present();
            var promiseObject = this.images.uploadToFirebase();
            promiseObject.promise.then(res => {
                let url = res;
                let refName = promiseObject.refName;
                let data = {url: url, refName: refName};
                firebase.database().ref('/resolveImages/').child(this.data.key).push(data).then(key => {
                    //Adds key for deletion later on
                    /*firebase.database().ref('/resolveImages/').child(this.data.key).child('key').set(key.key).then(_ => {
                        loader.dismiss();
                        successAlert.present();
                    }).catch(e => {
                        loader.dismiss();
                        alert("Error: " +e.message);
                    })*/
                    loader.dismiss();
                    successAlert.present();
                }).catch(e => {
                    loader.dismiss();
                    alert("Error: " +e.message);                    
                })
            }).catch(e => {
                loader.dismiss();
                alert("Error: " +e.message);
            });
        }else{
            this.error = "Fill out all fields";
        }
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
    slideLeft(){
        this.slide.slidePrev(300,null);
    }
    slideRight(){
        this.slide.slideNext(300,null);
    }
    markComplete(){
        let loader = this.loadingCtrl.create({
            content: 'Marking as complete'
        });
        loader.present();
        let alert = this.alertCtrl.create({
            title: "Marked as complete!",
            buttons: [{
                text: 'OK',
                handler: () => {
                    this.dismiss(false);
                }
            }]
        });
        firebase.database().ref('/positions/').child(this.data.key).child('status').set('Complete').then(_ => {
            loader.dismiss();
            alert.present();
        }).catch(_ => {
            loader.dismiss
        });
    }
    checkStatus(){
        let ref = firebase.database().ref('/positions/').child(this.data.key);
        ref.once('value', snapshot => {
            if(snapshot.hasChild('status')){
                this.status = snapshot.val().status;
            }else{
                ref.child('status').set('To Do');
                this.status = 'To Do';
            }
        })
    }
}

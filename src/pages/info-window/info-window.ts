//vanilla ionic imports
import { Component, ViewChild, NgZone} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController, LoadingController, Slides} from 'ionic-angular';

//image popup viewing import
import { ImageViewerController } from 'ionic-img-viewer';

//provider imports
import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator'

//firebase imports
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-info-window',
  templateUrl: 'info-window.html',
})
export class InfoWindowPage {
    //resolve image slides
    @ViewChild(Slides) slide: Slides;
    section: any = "info";
    
    //info on report
    data: any = {
        description: "",
        title: "",
        url: "",
        email: "",
        show: false,
        refName: "",
        key: ""
    };
    type: any = '';
    status: any = '';
    error: string = "";
    resolves: any = [];
    dataSet: boolean = false;
    info: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public viewCtrl: ViewController, public afAuth: AngularFireAuth, public images: ImagesProvider,
              public loadingCtrl: LoadingController, public ngZone: NgZone, public translate: TranslatorProvider,
              public imageViewerCtrl: ImageViewerController) {
  }

  ionViewDidLoad() {
      this.data = this.navParams.get('data');
      
      //translate type
      switch(this.data.type){
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
      let self = this;
      
      //grab all of resolve images from db
      firebase.database().ref('/resolves/').child(this.data.key).once('value').then(snapshot => {
          snapshot.forEach(function(child){
              self.resolves.push(child.val());
          })
      });
      this.checkStatus();
  }
    //show pop up of image when image is clicked on
    presentImage(myImage){
        let imageViewer = this.imageViewerCtrl.create(myImage);
        imageViewer.present();
    }
    //alert pops up before user deletes data
    showPrompt(){
        var alert = this.alertCtrl.create({
            title: this.translate.text.infoWindow.deleteAlertTitle,
            subTitle: this.translate.text.infoWindow.deleteAlertSubTitle,
            buttons: [{
                text: this.translate.text.infoWindow.delete,
                handler: data => {
                    this.deleteData();
                }
            }, this.translate.text.infoWindow.cancel]
        });
        alert.present();
    }
    //if selected, this post and all data associated with it will be deleted
    deleteData(){
        //checks to see if there are any images that need to be deleted
        var self = this;
        //check if there is an image
        firebase.database().ref('/positions/').child(this.data.key).once('value').then(function(snapshot){
            if(snapshot.hasChild('url')){
                //if image delete image then delete rest of report
                firebase.storage().ref('/images/').child(self.data.refName).delete().then(() => {
                    self.deleteReport();
                });   
                //if no image delete rest of report
            }else{
                self.deleteReport();
            }
        });
    }
    //helper function for deleteDatat()
    deleteReport(){
        //delete each "resolve" image from db
        firebase.database().ref('/resolves/').child(this.data.key).once('value').then(snapshot => {
            //loop through resolve images and delete them from storage
            snapshot.forEach(function(item){
                firebase.storage().ref('/images/').child(item.val().refName).delete();
            });
        }).then(() => {
            //delete the directory for resolve on this report
            firebase.database().ref('/resolves/').child(this.data.key).remove().then(() => {
                //delete root report
                firebase.database().ref('/positions/').child(this.data.key).remove().then(() => {
                    this.dismiss(true);
                });
            });
        })
    }
    //dismiss this modal
    dismiss(data){
        if(data){
            this.viewCtrl.dismiss(data);
        }else{
            this.viewCtrl.dismiss();
        }
    }
    //check if the current user is the OP
    checkLogin(){
        if(this.afAuth.auth.currentUser){
            if(this.afAuth.auth.currentUser.email == this.data.email)
                return true;
        }
        return false;
    }
    //check if user is logged on
    checkLoggedOn(){
        if(this.afAuth.auth.currentUser)
            return true;
        return false;
    }
    //submit a resolved image
    submit(){
        let loader = this.loadingCtrl.create({
            content: this.translate.text.infoWindow.submitting
        })
        let successAlert = this.alertCtrl.create({
            title: this.translate.text.infoWindow.submitted,
            buttons: [{
                text: this.translate.text.infoWindow.ok,
                handler: () => {
                    this.dismiss(false);
                }
            }]
        });
        //makes sure that an image was included in resolve post
        if(this.dataSet){
            loader.present();
            
            //upload image
            var promiseObject = this.images.uploadToFirebase();
            promiseObject.promise.then(res => {
                let url = res;
                let refName = promiseObject.refName;
                let data = {url: url, refName: refName, info: this.info}; 
                
                //get link to resolution info
                var key = firebase.database().ref('/resolves/').child(this.data.key).push(data).key;
                
                //link resolution info to actual report
                firebase.database().ref('/positions/').child(this.data.key).child('resolves').push(key).then(_ => {
                    loader.dismiss();
                    successAlert.present();
                }).catch(e => {
                    loader.dismiss();
                    alert("Error: " +e.message); 
                });
            }).catch(e => {
                loader.dismiss();
                alert("Error: " +e.message);
            });
        }else{
            this.error = this.translate.text.infoWindow.error;
        }
    }
    //request photo from user's camera
    cameraRequest(){
        var promise = this.images.doGetCameraImage(600,600);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    //request photo from user's album
    albumRequest(){
        var promise = this.images.doGetAlbumImage(600,600);
        promise.then(res => {
           this.dataSet = true; 
        }).catch(e => {
        });
    }
    //sliding for resolved images
    slideLeft(){
        this.slide.slidePrev(300,null);
    }
    slideRight(){
        this.slide.slideNext(300,null);
    }
    
    markComplete(){
        let loader = this.loadingCtrl.create({
            content: this.translate.text.infoWindow.marking
        });
        loader.present();
        
        //alert pops up after successful submission
        let alert = this.alertCtrl.create({
            title: this.translate.text.infoWindow.marked,
            buttons: [{
                text: this.translate.text.infoWindow.ok,
                handler: () => {
                    //dismiss this modal to refresh the screen
                    this.dismiss(false);
                }
            }]
        });
        //mark as complete on firebase
        firebase.database().ref('/positions/').child(this.data.key).child('status').set('Complete').then(_ => {
            loader.dismiss();
            alert.present();
        }).catch(_ => {
            loader.dismiss()
        });
    }
    //get the current status of the report
    checkStatus(){
        let ref = firebase.database().ref('/positions/').child(this.data.key);
        ref.once('value', snapshot => {
            var status = snapshot.val().status;
            
            //translate status
            switch(status){
                case 'Complete':
                    this.status = this.translate.text.other.complete;
                    break;
                case 'To Do':
                    this.status = this.translate.text.other.todo;
                    break;
            }
        })
    }
}

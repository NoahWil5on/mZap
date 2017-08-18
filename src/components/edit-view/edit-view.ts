//vanilla ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Slides, AlertController } from 'ionic-angular';

//provider imports
import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';
import { UserInfoProvider } from '../../providers/user-info/user-info';

//page imports
import { MapPage } from '../../pages/map/map';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'edit-view',
  templateUrl: 'edit-view.html'
})
export class EditViewComponent {
  @ViewChild(Slides) slide: Slides;
  @ViewChild('preview') preview;
  imageData: string = "";
  
  data: any = {};
  resolves: any = [];
  deleted: any = [];
  dataSet: boolean = false;
  error: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
              public images: ImagesProvider, public translate: TranslatorProvider, public ngZone: NgZone,
              public click: ClickProvider, public userInfo: UserInfoProvider, public mapPage: MapPage,
              public afAuth: AngularFireAuth, public alertCtrl: AlertController) {
      this.images.doClear();

      var self = this;
      this.data = this.userInfo.activeData;
      var ref = firebase.database().ref('/resolves/');
      ref.once('value', snapshot => {
          if(!snapshot.hasChild(this.data.key)) return;
          ref.child(this.data.key).once('value').then(snap => {
              snap.forEach(function(item){
                  var obj =  {
                      url: item.val().url,
                      refName: item.val().refName,
                      info: "",
                      delete: false,
                      key: item.key
                  }
                  if(item.val().info){
                      obj.info = item.val().info;
                  }
                  self.resolves.push(obj);
              }); 
          });
      });
  }
  dismiss(bool){
      this.navCtrl.setRoot(MapPage);
  }
  cameraRequest(){
      this.click.click('editPostCamera');
      var promise = this.images.doGetCameraImage(600,600);
      promise.then(res => {
          this.imageData = "data:image/jpg;base64,"+res;
          this.preview.nativeElement.setAttribute('src', this.imageData);
          this.dataSet = true; 
      }).catch(e => {
      });
  }
  albumRequest(){
      this.click.click('editPostAlbum');
      var promise = this.images.doGetAlbumImage(600,600);
      promise.then(res => {
          this.imageData = "data:image/jpg;base64,"+res;
          this.preview.nativeElement.setAttribute('src', this.imageData);
          this.dataSet = true;  
      }).catch(e => {
      });
  }
  statusClick(){
      this.click.click('editPostStatus');
  }
  typeClick(){
      this.click.click('editPostType');
  }
  descriptionClick(){
      this.click.click('editPostDescription');
  }
  submit(){
      this.click.click('editPostSubmit');
      if(this.data.description.length < 1){
          this.error = this.translate.text.editPost.error;
          return;
      }
      var self = this;
      if(!this.dataSet){
          firebase.database().ref('/positions/').child(self.data.key).update(self.data).then(_ => {
              self.actuallyDeleteResolves()  
          });
      }else{
          if(this.data.refName){
              firebase.storage().ref('/images/').child(this.data.refName).delete().then(_ => {
                  var promiseObject = self.images.uploadToFirebase();
                  promiseObject.promise.then(res => {
                      self.data.url = res;
                      self.data.refName = promiseObject.refName;
                      firebase.database().ref('/positions/').child(self.data.key).update(self.data).then(_ => {
                          self.actuallyDeleteResolves();
                      });
                  }).catch(e => {
                      alert("Error: " +e.message);
                  });
              })
          }
          else{
              var promiseObject = self.images.uploadToFirebase();
              promiseObject.promise.then(res => {
                  self.data.url = res;
                  self.data.refName = promiseObject.refName;
                  firebase.database().ref('/positions/').child(self.data.key).update(self.data).then(_ => {
                      self.actuallyDeleteResolves();  
                  });
              }).catch(e => {
                  alert("Error: " +e.message);
              });
          }
      }
  }
  actuallyDeleteResolves(){
      var self = this;
      if(this.deleted.length < 1){
          this.dismiss(true);
          return;
      }
      this.deleted.forEach(function(item){
          firebase.database().ref('/positions/').child(self.data.key).child('resolves').child(item.key).remove()
              .then(_ => {
              firebase.database().ref('/resolves/').child(self.data.key).child(item.key).remove().then(_ => {
                  firebase.storage().ref('/images/').child(item.refName).delete();
              })
          })
      });
      this.dismiss(true);
  }
  deleteResolve(item){
      this.click.click('editPostDelete');
      this.ngZone.run(() => {
          this.resolves[this.resolves.indexOf(item)].delete = true;
      });
      this.deleted.push(item);
  }
  delete(){
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
    this.click.click('infoWindowDelete');
    var self = this;
    //delete each "resolve" image from db
    firebase.database().ref('/resolves/').child(this.data.key).once('value').then(snapshot => {
        //loop through resolve images and delete them from storage
        snapshot.forEach(function(item){
            firebase.storage().ref('/images/').child(item.val().refName).delete();
        });
    }).then(() => {
        //delete the directory for resolve on this report
        firebase.database().ref('/resolves/').child(this.data.key).remove().then(() => {
            firebase.database().ref('/messages/').child(this.data.key).remove();
        }).then(() => {
            //update post #
            var userRating = firebase.database().ref('/userRating/').child(self.afAuth.auth.currentUser.uid)
            userRating.once('value', snap => {
                userRating.child('posts').set(snap.val().posts - 1);
            }).then(_ =>{                
                //delete root report
                firebase.database().ref('/positions/').child(this.data.key).remove().then(() => {
                    this.dismiss(true);
                });
            });
        });
    })
}
}

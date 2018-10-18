//vanilla ionic imports
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Slides, Events, AlertController, LoadingController, NavController } from 'ionic-angular';

//component imports
import { InfoComponent } from '../info/info';

//page imports
import { MapPage } from '../../pages/map/map';

//image pop up import
import { ImageViewerController } from 'ionic-img-viewer';

//provider imports
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { ImagesProvider } from '../../providers/images/images';
import { TranslatorProvider } from '../../providers/translator/translator';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'add-resolve',
  templateUrl: 'add-resolve.html'
})
export class AddResolveComponent {
  @ViewChild('file') input: ElementRef
  @ViewChild('file1') input1: ElementRef

  @ViewChild(Slides) slides;
  @ViewChild('thisImage') preview;
  @ViewChild('thisImage2') preview2;

  desc: string = "";
  imageData: any;
  submitting: boolean = false;

  constructor(public userInfo: UserInfoProvider, public imageViewerCtrl: ImageViewerController, public images: ImagesProvider, public ngZone: NgZone, public info: InfoComponent, public events: Events, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public translate: TranslatorProvider, public navCtrl: NavController, public afAuth: AngularFireAuth, public mapPage: MapPage) {

  }
  ngAfterViewInit() {
    var self = this;

    this.input.nativeElement.onchange = function (e) {
      var file = e.target.files[0];

      self.images.selectedFile = file;
      self.ngZone.run(() => {
        self.info.dataSet = true;
      })
      setTimeout(() => {
        self.preview.nativeElement.setAttribute('src', URL.createObjectURL(file));
        self.preview2.nativeElement.setAttribute('src', URL.createObjectURL(file));
      }, 50);
      self.input.nativeElement.value = "";
    }
    this.input1.nativeElement.onchange = function (e) {
      var file = e.target.files[0];

      self.images.selectedFile = file;
      self.ngZone.run(() => {
        self.info.dataSet = true;
      })
      setTimeout(() => {
        self.preview.nativeElement.setAttribute('src', URL.createObjectURL(file));
        self.preview2.nativeElement.setAttribute('src', URL.createObjectURL(file));
      }, 50);
      self.input1.nativeElement.value = "";
    }
    this.events.subscribe("resolveSlideNext", () => {
      this.slides.slideNext(500);
    });
    this.events.subscribe("resolveSlidePrev", () => {
      this.slides.slidePrev(500);
    });
    this.events.subscribe("resolveRestart", () => {
      this.slides.slideTo(0, 500);
    });
    this.events.subscribe("resolveSubmit", () => {
      this.submit()
    });
    this.info.resolve = this;
  }
  //show pop up image
  presentImage(image) {
    let imageViewer = this.imageViewerCtrl.create(image);
    imageViewer.present();
  }
  //request photo from user's camera
  cameraRequest() {
    var promise = this.images.doGetCameraImage(600, 600);
    promise.then(res => {
      this.imageData = "data:image/jpg;base64," + res;
      setTimeout(() => {
        this.preview.nativeElement.setAttribute('src', this.imageData);
        this.preview2.nativeElement.setAttribute('src', this.imageData);
      }, 50);
      this.ngZone.run(() => {
        this.info.dataSet = true;
      });
    }).catch(e => {
    });
  }
  //request photo from user's album
  albumRequest() {
    var promise = this.images.doGetAlbumImage(600, 600);
    promise.then(res => {
      this.imageData = "data:image/jpg;base64," + res;
      setTimeout(() => {
        this.preview.nativeElement.setAttribute('src', this.imageData);
        this.preview2.nativeElement.setAttribute('src', this.imageData);
      }, 50);
      this.ngZone.run(() => {
        this.info.dataSet = true;
      });
    }).catch(e => {
    });
  }
  dismiss(data) {
    this.mapPage.thanksShow = true;
  }
  submit() {
    if(this.submitting) return;
    this.submitting = true;
    var self = this;
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

    loader.present();

    //upload image
    var promiseObject = this.images.uploadToFirebase("resolves");
    promiseObject.promise.then(res => {
      let url = res;
      let refName = promiseObject.refName;
      let data = { 
        url: url, 
        refName: refName, 
        info: this.desc, 
        id: this.afAuth.auth.currentUser.uid,
        name: this.afAuth.auth.currentUser.displayName
      };

      //get link to resolution info
      var key = firebase.database().ref('/resolves/').child(this.userInfo.activeData.key).push(data).key;

      //link resolution info to actual report
      firebase.database().ref('/positions/').child(this.userInfo.activeData.key).child('resolves').push(key).then(_ => {
        firebase.database().ref(`/positions/${this.userInfo.activeData.key}/status`).set('Complete');
        //update # of resolves
        var userRating = firebase.database().ref('/userRating/').child(self.afAuth.auth.currentUser.uid)
        userRating.once('value', snap => {
          if (!snap.hasChild('resolves')) {
            userRating.child('resolves').set(1);
          } else {
            userRating.child('resolves').set(snap.val().resolves + 1);
          }
        });

        loader.dismiss();
        //successAlert.present();
        self.dismiss(false);
      }).catch(e => {
        loader.dismiss();
        alert("Error: " + e.message);
      });
    }).catch(e => {
      loader.dismiss();
      alert("Error: " + e.message);
    });

  }
}

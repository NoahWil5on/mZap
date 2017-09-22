//vanilla ionic imports
import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import { NavController, NavParams, MenuController, Slides, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

//component imports 
import { LoginComponent } from '../login/login';
import { MapPage } from '../../pages/map/map'

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

//provider imports
import { ImagesProvider } from '../../providers/images/images';
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';

//image pop up import
import { ImageViewerController } from 'ionic-img-viewer';

@Component({
  selector: 'create',
  templateUrl: 'create.html'
})
export class CreateComponent {
  @ViewChild('file') input:ElementRef
  @ViewChild('file1') input1:ElementRef
  
  @ViewChild('thisImage') preview;
  @ViewChild(Slides) slides: Slides;

  imageData: string = "";

  //user input data
  email: string = "";
  pass1: string = "";
  pass2: string = "";
  name: string = "";
  image: boolean = false;
  startTrue: boolean = true;
  refName: any = "";
  url: any = "";
  photoState: boolean = false;
  dataSet: boolean = false;

  error: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public afAuth: AngularFireAuth, public afDB: AngularFireDatabase, public images: ImagesProvider, public userInfo: UserInfoProvider, private storage: Storage, public translate: TranslatorProvider, public menuCtrl: MenuController, public click: ClickProvider, public login: LoginComponent, public imageViewerCtrl: ImageViewerController, public loadingCtrl: LoadingController, public ngZone: NgZone, public mapPage: MapPage) {
    this.login.create = this;
    this.images.doClear();
  }
  ngAfterViewInit() {
    var self = this;
    this.slides.lockSwipes(true);
    this.input.nativeElement.onchange = function(e){
        var file = e.target.files[0];
        
        self.images.selectedFile = file;
        self.ngZone.run(() => {
          self.dataSet = true;
        })
        setTimeout(() => {
          self.preview.nativeElement.setAttribute('src', URL.createObjectURL(file));
        },50)
    }
    this.input1.nativeElement.onchange = function(e){
        var file = e.target.files[0];
        
        self.images.selectedFile = file;
        self.ngZone.run(() => {
          self.dataSet = true;
        })
        setTimeout(() => {
          self.preview.nativeElement.setAttribute('src', URL.createObjectURL(file));
        },50)
    }
  }
  addPhoto() {
    if (!this.dataSet) return;
    var loader = this.loadingCtrl.create({
      content: "Submitting Photo..."
    });
    loader.present();
    /*Fetches image*/
    var promiseObject = this.images.uploadToFirebase("profile");
    promiseObject.promise.then(res => {
      this.url = res;
      this.refName = promiseObject.refName;

      /*pushes user details to database*/
      this.afDB.object('users/' + this.afAuth.auth.currentUser.uid).update({
        refName: this.refName,
        url: this.url
      }).then(_ => {
        loader.dismiss();
        this.userInfo.loggedIn = true;
        this.mapPage.tut = true;
      });
    });
  }
  /*Tries to create account*/
  createAccount() {
    if (this.photoState) {
      this.addPhoto();
      return
    }
    var loader = this.loadingCtrl.create({
      content: "Creating Account..."
    });
    loader.present();
    this.startTrue = false;
    /*Create user*/
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.pass1).then(_ => {
      /*add user display name*/
      this.afAuth.auth.currentUser.updateProfile({
        displayName: this.name,
        photoURL: ""
      }).then(_ => {
        this.storage.set('mzap_email', this.email);
        this.storage.set('mzap_password', this.pass1);
        var today = new Date();
        let date = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        this.afDB.object('users/' + this.afAuth.auth.currentUser.uid).update({
          rating: 0,
          posts: 0,
          visits: 1,
          lastActive: date,
          firstActive: date,
          name: this.name,
          email: this.email
        }
        ).catch(e => {
          this.error = e.message;
        })
      }).then(_ => {
        firebase.database().ref('/userRating/').child(this.afAuth.auth.currentUser.uid).set({
          likes: 0,
          posts: 0,
          postLikes: 0,
          resolves: 0,
          complete: 0
        }).then(_ => {
          this.photoState = true;
          this.slideRight();
          loader.dismiss();
        });

      }).catch(e => {
        this.error = e.message;
        loader.dismiss();
      });
    }).catch(e => {
      this.error = e.message;
      loader.dismiss();
    });
  }
  /*Fetch image from camera*/
  cameraRequest() {
    var promise = this.images.doGetCameraImage(600, 600);
    promise.then(res => {
      this.imageData = "data:image/jpg;base64," + res;
      this.ngZone.run(() => {
        this.dataSet = true;
      })
      setTimeout(() => {
        this.preview.nativeElement.setAttribute('src', this.imageData);
      }, 250);     
    }).catch(e => {
    });
  }
  /*Fetch image from album*/
  albumRequest() {
    var promise = this.images.doGetAlbumImage(600, 600);
    promise.then(res => {
      this.imageData = "data:image/jpg;base64," + res;
      this.ngZone.run(() => {
        this.dataSet = true;
      })
      setTimeout(() => {
        this.preview.nativeElement.setAttribute('src', this.imageData);
      }, 250);   
    }).catch(e => {
    });
  }
  slideRight() {
    this.slides.lockSwipes(false);
    this.slides.slideNext(500, null);
    this.slides.lockSwipes(true);
  }
  checkInput(): boolean {
    var r = false;
    // /*Checks to make sure fields are filled in (no profile image required)*/
    if (this.pass1 === this.pass2) {
      if (this.pass1.length > 0 && this.email.length > 0 && this.name.length > 0) {
        r = true;
      }
      else {
        this.error = this.translate.text.register.fill;
      }
    }
    else {
      this.error = this.translate.text.register.identical;
    }
    return r;
  }
  //show pop up image
  presentImage(image) {
    let imageViewer = this.imageViewerCtrl.create(image);
    imageViewer.present();
  }
}
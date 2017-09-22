//vanilla ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController, LoadingController, Slides, ModalController, Events } from 'ionic-angular';

//parent components
import { InfoComponent } from '../info/info';

//page imports
import { MapPage } from '../../pages/map/map';

//image popup viewing import
import { ImageViewerController } from 'ionic-img-viewer';

//provider imports
import { ImagesProvider } from '../../providers/images/images';
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator'
import { ClickProvider } from '../../providers/click/click';

//firebase imports
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
    selector: 'resolve',
    templateUrl: 'resolve.html'
})
export class ResolveComponent {
  //  @ViewChild('file') input: ElementRef
  //  @ViewChild('file1') input1: ElementRef

    //resolve image slides
    @ViewChild(Slides) slide: Slides;

   // @ViewChild('preview') preview;
    imageData: any = "";

    section: any = "info";

    //info on report
    data: any;
    type: any = '';
    status: any = '';
    error: string = "";
    resolves: any = [];
    dataSet: boolean = false;
    info: string = "";
    constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
        public viewCtrl: ViewController, public afAuth: AngularFireAuth, public images: ImagesProvider,
        public loadingCtrl: LoadingController, public ngZone: NgZone, public translate: TranslatorProvider,
        public imageViewerCtrl: ImageViewerController, public modalCtrl: ModalController,
        public click: ClickProvider, public userInfo: UserInfoProvider, public infoComponent: InfoComponent, public events: Events) {
        this.images.doClear();

        this.data = this.userInfo.activeData;
        let self = this;

        //grab all of resolve images from db
        firebase.database().ref('/resolves/').child(this.data.key).once('value').then(snapshot => {
            snapshot.forEach(function (child) {
                self.resolves.push(child.val());
            })
        });
        this.checkStatus();
    }
    // ngAfterViewInit() {
    //     var self = this;
    //     // this.input.nativeElement.onchange = function (e) {
    //     //     var file = e.target.files[0];

    //     //     self.images.selectedFile = file;
    //     //     self.dataSet = true;
    //     //     setTimeout(() => {
    //     //         self.preview.nativeElement.setAttribute('src', URL.createObjectURL(file));
    //     //     }, 50)
    //     // }
    //     // this.input1.nativeElement.onchange = function (e) {
    //     //     var file = e.target.files[0];

    //     //     self.images.selectedFile = file;
    //     //     self.dataSet = true;
    //     //     setTimeout(() => {
    //     //         self.preview.nativeElement.setAttribute('src', URL.createObjectURL(file));
    //     //     }, 50)
    //     // }
    // }
    //show pop up of image when image is clicked on
    presentImage(myImage) {
        let imageViewer = this.imageViewerCtrl.create(myImage);
        imageViewer.present();
    }

    //dismiss this modal
    dismiss(data) {
        this.navCtrl.setRoot(MapPage);
    }
    //check if the current user is the OP
    checkLogin() {
        if (this.afAuth.auth.currentUser) {
            if (this.afAuth.auth.currentUser.uid == this.data.id)
                return true;
        }
        return false;
    }
    //check if user is logged on
    checkLoggedOn() {
        if (this.afAuth.auth.currentUser)
            return true;
        return false;
    }
    updateWindow() {
        this.infoComponent.edit = true;
    }
    add(){
        this.infoComponent.addResolve = true;
        this.events.publish("resolveRestart");
    }
    //submit a resolved image
    submit() {
        this.click.click('infoWindowSubmitResolution');
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
        //makes sure that an image was included in resolve post
        if (this.dataSet) {
            loader.present();

            //upload image
            var promiseObject = this.images.uploadToFirebase("resolves");
            promiseObject.promise.then(res => {
                let url = res;
                let refName = promiseObject.refName;
                let data = { url: url, refName: refName, info: this.info };

                //get link to resolution info
                var key = firebase.database().ref('/resolves/').child(this.data.key).push(data).key;

                //link resolution info to actual report
                firebase.database().ref('/positions/').child(this.data.key).child('resolves').push(key).then(_ => {
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
                    successAlert.present();
                }).catch(e => {
                    loader.dismiss();
                    alert("Error: " + e.message);
                });
            }).catch(e => {
                loader.dismiss();
                alert("Error: " + e.message);
            });
        } else {
            this.error = this.translate.text.infoWindow.error;
        }
    }
    //request photo from user's camera
    cameraRequest() {
        this.click.click('infoWindowCamera');
        var promise = this.images.doGetCameraImage(600, 600);
        promise.then(res => {
            this.imageData = "data:image/jpg;base64," + res;
            //this.preview.nativeElement.setAttribute('src', this.imageData);
            this.dataSet = true;
        }).catch(e => {
        });
    }
    //request photo from user's album
    albumRequest() {
        this.click.click('infoWindowAlbum');
        var promise = this.images.doGetAlbumImage(600, 600);
        promise.then(res => {
            this.imageData = "data:image/jpg;base64," + res;
            //this.preview.nativeElement.setAttribute('src', this.imageData);
            this.dataSet = true;
        }).catch(e => {
        });
    }
    //sliding for resolved images
    slideLeft() {
        this.click.click('infoWindowLeft');
        this.slide.slidePrev(300, null);
    }
    slideRight() {
        this.click.click('infoWindowRight');
        this.slide.slideNext(300, null);
    }
    //get the current status of the report
    checkStatus() {
        let ref = firebase.database().ref('/positions/').child(this.data.key);
        ref.once('value', snapshot => {
            var status = snapshot.val().status;

            //translate status
            switch (status) {
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

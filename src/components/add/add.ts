import { Component, ViewChild } from '@angular/core';
import { Slides, LoadingController, Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

//page imports
import { MapPage } from '../../pages/map/map';

//provider imports 
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';
import { ImagesProvider } from '../../providers/images/images';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'add',
  templateUrl: 'add.html'
})
export class AddComponent {
  @ViewChild('main') main;
  @ViewChild(Slides) slide: Slides;
  @ViewChild('preview') preview;

  dataSet: boolean = false;
  type: any = undefined;
  desc: string = "";
  show: boolean = true;
  url: any = "";
  refName: any = "";
  error: string = "";
  scroll: number = 1;
  share: boolean = true;

  constructor(public mapPage: MapPage, public translate: TranslatorProvider, public userInfo: UserInfoProvider, public afAuth: AngularFireAuth, public images: ImagesProvider, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public events: Events) {
    events.subscribe("share", () => {
      this.doShare();
    })
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.main.nativeElement.style.transform = "translate(-50%,-50%)";

    }, 10);
  }

  closeOut() {
    this.mapPage.addShow = false;
  }
  loggedAuth() {
    return this.afAuth.auth.currentUser.uid == this.userInfo.activeData.id;
  }
  //sliding for resolved images
  slideLeft() {
    this.slide.slidePrev(500, null);
  }
  slideRight(bool) {
    if (!bool) {
      if (this.slide.getActiveIndex() == 3) {
        this.doSubmit();
      }
    }
    if(this.slide.getActiveIndex() == 4){
      this.mapPage.navCtrl.setRoot(MapPage);
    }
    this.slide.slideNext(500, null);
  }
  goToSlide() {
    this.slide.slideTo(this.scroll, 500);
  }
  doSubmit() {
    var loader = this.loadingCtrl.create({
      content: this.translate.text.add.submitting,
    });
    loader.present();
    var promiseObj = this.images.uploadToFirebase("posts");
    promiseObj.promise.then(res => {
      this.url = res;
      this.refName = promiseObj.refName;
    }).then(() => {
      this.mapPage.mapView.submitReport({
        refName: this.refName,
        url: this.url,
        show: this.show,
        type: this.type,
        desc: this.desc,
        loader: loader,
      });
    })
  }
  doShare() {
    this.share = true;
    setTimeout(() => {
      //this.slideRight(true);
      this.slide.lockSwipes(true);
    }, 50);

  }
  runCheck(slide) {
    if (slide == 1) {
      if (!this.dataSet) return false;
    }
    if (this.slide.getActiveIndex() != slide) return false;
    return true;
  }
  submit() {
    if (this.dataSet) {
      if (this.type != undefined) {
        return true;
      }
      this.error = this.translate.text.add.errorType;
      this.scroll = 0;
      return false;
    }
    this.error = this.translate.text.add.errorImage;
    this.scroll = 1;
    return false;
  }
  shareTwitter() {
    this.socialSharing.shareViaTwitter(this.desc, this.url, null);
  }
  shareFacebook() {
    this.socialSharing.shareViaFacebook(this.desc, this.url, null)
  }
  shareWhatsapp() {
    this.socialSharing.shareViaWhatsApp(this.desc, this.url, null)
  }
}

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
  submitted: boolean = false;

  currentColor: string = '#ff0000';
  checks: any = [];


  constructor(public mapPage: MapPage, public translate: TranslatorProvider, public userInfo: UserInfoProvider, public afAuth: AngularFireAuth, public images: ImagesProvider, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public events: Events) {
    this.checks.push({text: "", state: false});
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.main.nativeElement.style.transform = "translate(-50%,-50%)"
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
      if (this.slide.getActiveIndex() == 1) {
        this.doSubmit();
      }
    }
    if(this.slide.getActiveIndex() == 2){
      this.mapPage.navCtrl.setRoot(MapPage);
    }
    this.slide.slideNext(500, null);
  }
  goToSlide() {
    this.slide.slideTo(this.scroll, 500);
  }
  doSubmit() {
    for(var i = 0; i < this.checks.length; i++){
      this.checks[i].text = this.checks[i].text.trim();
      if(this.checks[i].text.length < 1){
        this.checks.splice(i,1);
      }
    }
    if(this.checks.length < 1) return;
    var loader = this.loadingCtrl.create({
      content: this.translate.text.add.submitting,
    });
    loader.present();
    this.submitted = true;
    var self = this;
    setTimeout(function() {
      self.slideRight(true);
      self.slide.lockSwipes(true);
    }, 100);
    this.mapPage.mapView.submitReport({
      show: true,
      type: this.currentColor,
      desc: this.desc,
      checks: this.checks,
      loader: loader,
    });
  }
  doShare() {
    this.share = true;
    setTimeout(() => {
      //this.slideRight(true);
      this.slide.lockSwipes(true);
    }, 50);

  }
  runCheck(slide) {
    // if (slide == 1) {
    //   if (!this.dataSet) return false;
    // }
    if (this.slide.getActiveIndex() != slide) return false;
    return true;
  }
  submit() {
    if (this.checks[0].text.length > 0) {
      if (this.currentColor != undefined) {
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
}

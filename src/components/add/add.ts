import { Component, ViewChild } from '@angular/core';
import { Slides, LoadingController, Events, AlertController } from 'ionic-angular';
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

  currentColor: string = 'a';
  checks: any = [];
  presets: any = [];


  constructor(public mapPage: MapPage, public translate: TranslatorProvider, public userInfo: UserInfoProvider, public afAuth: AngularFireAuth, public images: ImagesProvider, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public events: Events, public alertCtrl: AlertController) {
    this.checks.push({text: "", state: false, amount: 0});
    this.presets = [
      {text: this.translate.text.items.e00, state: false, amount: 0},
      {text: this.translate.text.items.e01, state: false, amount: 0},
      {text: this.translate.text.items.e02, state: false, amount: 0},
      {text: this.translate.text.items.e03, state: false, amount: 0},
      {text: this.translate.text.items.e04, state: false, amount: 0},
      {text: this.translate.text.items.e05, state: false, amount: 0},
      {text: this.translate.text.items.e06, state: false, amount: 0},
      {text: this.translate.text.items.e07, state: false, amount: 0},
      {text: this.translate.text.items.e08, state: false, amount: 0},
      {text: this.translate.text.items.e09, state: false, amount: 0},
      {text: this.translate.text.items.e10, state: false, amount: 0},
      {text: this.translate.text.items.e11, state: false, amount: 0},
      {text: this.translate.text.items.e12, state: false, amount: 0},
      {text: this.translate.text.items.e13, state: false, amount: 0},
      {text: this.translate.text.items.e14, state: false, amount: 0},
      {text: this.translate.text.items.e15, state: false, amount: 0},
      {text: this.translate.text.items.e16, state: false, amount: 0},
      {text: this.translate.text.items.e17, state: false, amount: 0},
      {text: this.translate.text.items.e18, state: false, amount: 0},
      {text: this.translate.text.items.e19, state: false, amount: 0},
    ]
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.main.nativeElement.style.transform = "translate(-50%,-50%)"
    }, 10);
  }
  openInfo(){
    if(this.slide.getActiveIndex() == 0){
      var alert1 = this.alertCtrl.create({
        title: this.translate.text.add.title1,
        subTitle: this.translate.text.add.sub1,
        buttons: ['OK']
      });
      alert1.present();
    }else{
      var alert2 = this.alertCtrl.create({
        title: this.translate.text.add.title2,
        buttons: ['OK']
      })
      alert2.present();
    }    
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
    for(var b = 0; b < this.checks.length; b++){
      this.checks[b].text = this.checks[b].text.trim();
      if(this.checks[b].amount > 999){
        this.checks[b].amount = 999;
      }
      if(this.checks[b].text.length < 1 || !this.checks[b].amount || this.checks[b].amount < 1){
        this.checks.splice(b,1);
        b--;
      }
    }
    for(var i = 0; i < this.presets.length; i++){
      if(this.presets[i].amount > 999){
        this.presets[i].amount = 999;
      }
      if(!this.presets[i].amount || this.presets[i].amount < 1){
        this.presets.splice(i,1);
        i--;
      }
    }
    this.checks = this.presets.concat(this.checks);
    if(this.checks.length < 1) return;
    var loader = this.loadingCtrl.create({
      content: this.translate.text.add.submitting,
    });
    loader.present();
    this.submitted = true;
    this.mapPage.mapView.submitReport({
      show: true,
      type: this.currentColor,
      desc: this.desc,
      checks: this.checks,
      loader: loader,
    });
    loader.onDidDismiss(() => {
      this.mapPage.navCtrl.setRoot(MapPage);
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
    // if (slide == 1) {
    //   if (!this.dataSet) return false;
    // }
    if (this.slide.getActiveIndex() != slide) return false;
    return true;
  }
  submit() {
    var amount = 0;
    this.presets.forEach(function(item){
      if(item.amount && item.amount > 0) amount++;
    });
    this.checks.forEach(function(item){
      item.amount = Math.floor(item.amount);
      if(item.text.trim().length > 0 && item.amount && item.amount >= 1) amount++;
    })
    if(amount > 0) return true;
    return false;
  }
}

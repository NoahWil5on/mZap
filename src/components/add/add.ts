import { Component, ViewChild } from '@angular/core';
import { LoadingController, Events, AlertController } from 'ionic-angular';
import { SafeUrl } from '@angular/platform-browser';
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

  state: string = "type";
  dataSet: boolean = false;
  type: any = undefined;
  myType: string = "";
  desc: string = "";
  show: boolean = true;
  url: any = "";
  refName: any = "";
  error: string = "";
  share: boolean = true;
  file: SafeUrl;
  dataURL: string = "";
  submitting: boolean = false;

  constructor(public mapPage: MapPage, public translate: TranslatorProvider, public userInfo: UserInfoProvider, public afAuth: AngularFireAuth, public images: ImagesProvider, public loadingCtrl: LoadingController, public socialSharing: SocialSharing, public events: Events, public alertCtrl: AlertController) {

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.main.nativeElement.style.transform = "translate(-50%,-50%)";
    }, 10);
    this.events.subscribe("share", () => {
      this.state = "share";
    });
  }

  closeOut() {
    this.mapPage.addShow = false;
  }
  loggedAuth() {
    return this.afAuth.auth.currentUser.uid == this.userInfo.activeData.id;
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
  shareTwitter() {
    this.socialSharing.shareViaTwitter(this.desc, this.url, null);
  }
  shareFacebook() {
    this.socialSharing.shareViaFacebook(this.desc, this.url, null)
  }
  shareWhatsapp() {
    this.socialSharing.shareViaWhatsApp(this.desc, this.url, null)
  }
  checkShow(){
    return (this.state == 'confirm' || this.state == 'pic') && this.dataSet;
  }
  doSomething(){
    if(this.state == "confirm"){
      this.submitting = true;
      this.doSubmit();
    }else if(this.state == 'pic'){
      this.state = "confirm";
    }
  }
  getType(){
    var src = "";
    switch(this.type){
      case 'bugs':
        src = "../assets/images/buttons/bug.png";
        break;
      case 'cnd':
        src = "../assets/images/buttons/cnd.png";
        break;
      case 'trash':
        src = "../assets/images/buttons/trash.png";
        break;
      case 'building':
        src = "../assets/images/buttons/building.png";
        break;
      case 'pest':
        src = "../assets/images/buttons/pest.png";
        break;
      case 'water':
        src = "../assets/images/buttons/droplet.png";
        break;
      case 'road':
        src = "../assets/images/buttons/road.png";
        break;
      case 'electricity':
        src = "../assets/images/buttons/electricity.png";
        break;
      case 'tree':
        src = "../assets/images/buttons/tree.png";
        break;
      case 'rocked':
        src = "../assets/images/buttons/blocked_road.png";
        break;
      case 'drop':
        src = "../assets/images/buttons/water.png";
        break;
    }
    var image = new Image();
    image.src = src;
    this.myType = `url(${image.src})`;
  }
  notify(){
    if(!this.dataSet){
      this.closeOut();
      return;
    }
    var checkClose = this.alertCtrl.create({
      title: this.translate.text.add.leaveTitle,
      subTitle: this.translate.text.add.leaveSubTitle,
      buttons: [{
        text: this.translate.text.add.leave,
        handler: () => {
          this.closeOut();
        }
      },{
        text: this.translate.text.add.stay,
        handler: () => {
        }
      }]
    });
    checkClose.present();
  }
}

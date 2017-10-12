//vanilla ionic imports
import { Component, NgZone } from '@angular/core';
import { MapPage } from '../../pages/map/map';
import { Events, AlertController, NavController} from 'ionic-angular';

//provider imports 
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { TranslatorProvider } from '../../providers/translator/translator';
import { ImagesProvider } from '../../providers/images/images';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
  selector: 'info',
  templateUrl: 'info.html'
})
export class InfoComponent {

  state: string = 'none';
  edit: boolean = false;
  addResolve: boolean = false;
  hideType: boolean = false;
  status: any = "";
  selection: any = "";
  id: any = "";
  myText: string = "";
  dataSet: boolean = false;
  resolve: any;
  myData: any;

  editComponent: any;

  constructor( public mapPage: MapPage, public translate: TranslatorProvider, public userInfo: UserInfoProvider, public afAuth: AngularFireAuth, public ngZone: NgZone, public events: Events, public images: ImagesProvider, public alertCtrl: AlertController, public navCtrl: NavController ) {
    var data = this.userInfo.activeData;
    this.myData = JSON.parse(JSON.stringify(data));
    this.state = this.mapPage.mapState;

    //translate status
    switch(data.status){
      case 'Complete':
          this.status = this.translate.text.other.complete;
          break;
      case 'To Do':
          this.status = this.translate.text.other.todo;
          break;
    }
    this.id = this.userInfo.activeData.key;
  }
  ngAfterViewInit(){
    this.state = this.mapPage.mapState;
  }
  checkState(state){
    return state == this.state;
  }
  updateState(state){
    this.state = state;
    this.edit = false;
  }
  closeOut(){
    this.mapPage.infoShow = false;
  }
  loggedAuth(){
    return this.afAuth.auth.currentUser.uid == this.userInfo.activeData.id;
  }
  backToInfo(){
    if(this.edit){
      this.edit = false;
      return;
    }
    if(this.addResolve){
      if(this.resolve != undefined){
        if(this.dataSet && this.resolve.slides.getActiveIndex() == 0){
          this.dataSet = false;
          this.images.doClear();
          return;
        }else if(this.resolve.slides.getActiveIndex() == 1 && this.resolve.desc.length > 0){
          this.resolve.desc = "";
          return;
        }else if(this.resolve.slides.getActiveIndex() == 2){
          this.events.publish("resolveRestart");
          return;
        }
      }
      this.addResolve = false;
      return;
    }
    this.addResolve = false;
    this.closeOut();
    this.state = 'info';
    this.events.publish('backToInfo');
  }
  next(){
    if(this.resolve != undefined){
      if(this.resolve.slides.getActiveIndex() == 2){
        this.resolve.submit();
      }else{
        this.events.publish("resolveSlideNext");
      }
    }
  }
  checkCheck(){
    if(this.resolve != undefined && this.addResolve){
      if(this.dataSet && this.resolve.slides.getActiveIndex() == 0){
        return true;
      }else if(this.resolve.slides.getActiveIndex() == 1){
        return true;
      }else if(this.resolve.slides.getActiveIndex() == 2 && this.dataSet){
        return true;
      }
    }
    return false;
  }
  updateChecks(){
    firebase.database().ref(`/positions/${this.myData.key}/checks`).set(this.myData.checks).then(_ => {
      this.navCtrl.setRoot(MapPage);
    });
  }
  doCommentInfo(){
    var alert = this.alertCtrl.create({
      title: this.translate.text.infoWindow.aboutTitle,
      message: this.translate.text.infoWindow.aboutMessage,
      buttons: ['OK']
    });
    alert.present();
  }
}

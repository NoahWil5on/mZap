//vanilla ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { MapPage } from '../../pages/map/map';
import { Events, AlertController} from 'ionic-angular';

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
  @ViewChild('msg') msg;

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

  constructor( public mapPage: MapPage, public translate: TranslatorProvider, public userInfo: UserInfoProvider, public afAuth: AngularFireAuth, public ngZone: NgZone, public events: Events, public images: ImagesProvider, public alertCtrl: AlertController ) {
    var data = this.userInfo.activeData

    switch(data.type){
      case 'bugs':
        this.selection = 'assets/images/icons/bug.png';
        break;
      case 'trash':
        this.selection = 'assets/images/icons/trash.png';
        break;
      case 'building':
        this.selection = 'assets/images/icons/building.png';
        break;
      case 'pest':
        this.selection = 'assets/images/icons/pest.png';
        break;
      case 'cnd':
        this.selection = 'assets/images/icons/cnd.png';
        break;
      case 'road':
        this.selection = "assets/images/icons/road.png";
        break;
      case 'electricity':
        this.selection = "assets/images/icons/electricity.png";
        break;
      case 'tree':
        this.selection = "assets/images/icons/tree.png";
        break;
      case 'rocked':
        this.selection = "assets/images/icons/blocked_road.png";
        break;
      case 'water':
        this.selection = "assets/images/icons/droplet.png";
        break;
      default:
        this.selection = 'assets/images/icons/bug.png';
        break;
    };

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
    setTimeout(() => {
      this.state = 'info';
    }, 50);
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
   //submit a message
  submit(){
    var today = new Date();
    var hour = today.getHours()+"";
    if(Number(hour) < 10){
      hour = "0" + hour;
    }
    var seconds = today.getSeconds()+"";
    if(Number(seconds) < 10){
      seconds = "0" + seconds;
    }
    var minutes = today.getMinutes()+"";
    if(Number(minutes) < 10){
      minutes = "0" + minutes;
    }
    /*get current date and time*/
    var date = (today.getMonth()+1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + 
      hour + ":" + minutes + ":" + seconds;

    firebase.database().ref('/users/').child(this.afAuth.auth.currentUser.uid).once('value').then(snapshot => {
      var url = "http://www.placehold.it/40";
      if(snapshot.hasChild('url')){
        url = snapshot.val().url+"";
      }
      else{
        console.log("false");
      }
      if(this.myText.trim().length < 1) return;
      let data = {
        name: this.afAuth.auth.currentUser.displayName,
        message: this.myText,
        id: this.afAuth.auth.currentUser.uid,
        date: date,
        time: Date.now(),
        url: url
      }
      //record messsage on firebase and format screen to fit new image
      firebase.database().ref('/messages/').child(this.id).push(data).then(res => {
        this.events.publish('newMessage');
        this.myText = "";
        let el = this.msg.nativeElement;
        setTimeout(() => {
          el.style.cssText = 'height: 1.4em; padding: 0';
        },10) 
      });
    })
  }
  //input box autoresizing
  resize(){
    this.ngZone.run(() =>{
        let el = this.msg.nativeElement;
        el.style.cssText = 'height:auto; padding:0;';
        el.style.cssText = 'height:' + (el.scrollHeight+ 4) + 'px';
    });
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
  doCommentInfo(){
    var alert = this.alertCtrl.create({
      title: "What is the commenting feature?",
      message: "When you comment on a post everyone will be able to see your comment. This feature allows community members to better communicate what needs to be done in order to resolve an issue.",
      buttons: ['OK']
    });
    alert.present();
  }
}

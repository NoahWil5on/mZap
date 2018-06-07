//vanilla ionic imports
import { Component, NgZone, ViewChild } from '@angular/core';
import { Events, NavController} from 'ionic-angular';

//provider imports
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { LikeProvider } from '../../providers/like/like';
import { ClickProvider } from '../../providers/click/click';
import { TranslatorProvider } from '../../providers/translator/translator'

//page imports
import { ProfilePage } from '../../pages/profile/profile';
import { MapPage } from '../../pages/map/map';

//image popup viewing import
import { ImageViewerController } from 'ionic-img-viewer';

//component imports
import { InfoComponent } from '../info/info';

//firebase imports
import * as firebase from 'firebase';

@Component({
  selector: 'info-view',
  templateUrl: 'info-view.html'
})
export class InfoViewComponent {
  @ViewChild('mainContent') infoContent;

  myData: any;
  likeValue: any;
  hide: boolean = false;
  messages: any = [];
  id: any;

  status: string = "";

  constructor(public userInfo: UserInfoProvider, public likeProvider: LikeProvider, public ngZone: NgZone, public click: ClickProvider, public imageViewerCtrl: ImageViewerController, public translate: TranslatorProvider, public info: InfoComponent, public events: Events, public navCtrl: NavController, public mapPage: MapPage) {
    this.myData = this.userInfo.activeData; 
 
    if(this.mapPage.shipChat){
        this.myData = this.userInfo.activeShipData;
    }else{
        switch(this.userInfo.activeData.status){
        case 'Complete':
            this.status = this.translate.text.other.complete;
            break;
        case 'To Do':
            this.status = this.translate.text.other.todo;
            break;
        }
    }
    this.likeable(this.mapPage.shipChat);   

    this.messages = [];
    //the id of where the messages are stored in the db
    this.id = this.myData.key;
    var self = this;
    
    //fetch all messages
    var myDir = 'messages';
    if(this.mapPage.shipChat) myDir = 'shipMessages'
    firebase.database().ref(`/${myDir}/`).child(this.id).on('value', snapshots => {
        self.messages = [];
        //for every message found, add to array
        for (var snap in snapshots.val()) {           
            if(snapshots.hasOwnProperty(snap)) continue;
            var message = snapshots.val()[snap];
            if(self.checkMessage(message)){
               message.new = true;
            }else{
              message.new = false;
            }
            self.messages.unshift(message);
        }
    });
  }
  ngAfterViewInit(){
    var element = this.infoContent.nativeElement.parentElement;
    this.events.subscribe('backToInfo', () => {
      //this.hide = false;

      //smooth scrolling to top
      var startTop = element.scrollTop;
      var current = startTop;
      var startTime = Date.now();
      var endTime = startTime + 500;

      //runs until back to top
      var smoothSlide = setInterval(() => {
        var point = Date.now();

        //find the percentage of distance to travel given 
        //start,end, and current time
        var mult = 1-((point - startTime)/(endTime-startTime));
        current = startTop * mult;

        element.scrollTop = current;
        //if top is less than or equal to 0 exit
        if(current <= 0){
          element.scrollTop = 0;
          clearInterval(smoothSlide);
        }
      },10);
    });
    this.events.subscribe('newMessage', () => {
      element.scrollTop = 0;
    });
    element.addEventListener("scroll", (e) => {
      if(element.scrollTop > this.infoContent.nativeElement.offsetHeight){
        this.info.hideType = true;
      }
      else{
        this.info.hideType = false;
      }
    })
  }
  likeable(ship){
    var self = this;
    this.likeProvider.likeable(ship, this.myData.key, function(value){
        //ngZone.run updates the DOM otherwise change is not visible
        self.ngZone.run(() =>{
            self.likeValue = value;   
        })
    });
  }
  //called when user likes a post
  like(value){
    this.click.click('mapLike');
    //var self = this;
    // this.likeProvider.like(this.userInfo.activeData.key, value, function(likes){
    //     //updates post locally with callback function
    //     self.userInfo.activeData.likes = likes;
    // });
    this.likeValue = value;
  }
  //show pop up of image when image is clicked on
  presentImage(myImage){
      this.click.click('infoWindowPresentImage');
      let imageViewer = this.imageViewerCtrl.create(myImage);
      imageViewer.present();
  }
  comment(){
    this.hide = true;
    this.info.state = "comment";
  }
  resolve(){
    this.info.state = "edit";
  }
  //checks if this is a new message
  checkMessage(message){
    //if(!message.time) return false;
    if(Date.now()-message.time < 2000){
      return true;
    }else{
      return false;
    }
  }
  goToProfile(id){
    this.userInfo.profileView = id;
    this.navCtrl.push(ProfilePage);
  }
}

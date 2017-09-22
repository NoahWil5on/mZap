//vanilla ionic imports
import { Component, NgZone, ViewChild } from '@angular/core';
import { Events} from 'ionic-angular';

//provider imports
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { LikeProvider } from '../../providers/like/like';
import { ClickProvider } from '../../providers/click/click';
import { TranslatorProvider } from '../../providers/translator/translator'

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

  constructor(public userInfo: UserInfoProvider, public likeProvider: LikeProvider, public ngZone: NgZone, public click: ClickProvider, public imageViewerCtrl: ImageViewerController, public translate: TranslatorProvider, public info: InfoComponent, public events: Events) {
    this.myData = this.userInfo.activeData;
    this.likeable();    

    switch(this.userInfo.activeData.status){
      case 'Complete':
          this.status = this.translate.text.other.complete;
          break;
      case 'To Do':
          this.status = this.translate.text.other.todo;
          break;
    }

    this.messages = [];
    //the id of where the messages are stored in the db
    this.id = this.userInfo.activeData.key;
    var self = this;
    
    //fetch all messages
    firebase.database().ref('/messages/').child(this.id).on('value', snapshots => {
        self.messages = [];
        //for every message found, add to array
        for (var snap in snapshots.val()) {           
            if(snapshots.hasOwnProperty(snap)) continue;
            self.messages.unshift(snapshots.val()[snap]);
        }
    });
  }
  ngAfterViewInit(){
    var element = this.infoContent.nativeElement.parentElement;
    this.events.subscribe('backToInfo', () => {
      this.hide = false;

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
  likeable(){
    var self = this;
    this.likeProvider.likeable(this.userInfo.activeData.key, function(value){
        //ngZone.run updates the DOM otherwise change is not visible
        self.ngZone.run(() =>{
            self.likeValue = value;   
        })
    });
  }
  //called when user likes a post
  like(value){
    this.click.click('mapLike');
    var self = this;
    this.likeProvider.like(this.userInfo.activeData.key, value, function(likes){
        //updates post locally with callback function
        self.userInfo.activeData.likes = likes;
    });
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
    if(!message.time) return false;
    if(Date.now()-message.time < 5000){
      return true;
    }
    return false;
  }
}

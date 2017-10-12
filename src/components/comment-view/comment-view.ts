//vanilla ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Content } from 'ionic-angular';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator'
import { ClickProvider } from '../../providers/click/click';
import { UserInfoProvider } from '../../providers/user-info/user-info';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase'

@Component({
  selector: 'comment-view',
  templateUrl: 'comment-view.html'
})
export class CommentViewComponent {
 //input element
 @ViewChild('msg') msg: any;
 
 //scroll content element
 @ViewChild(Content) content: Content;
 
 
 myText: string;
 id: any;
 messages: any = [];
 myId: any = this.afAuth.auth.currentUser.uid;
 
 constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public afAuth: AngularFireAuth,                   public translate: TranslatorProvider, public ngZone: NgZone, public click: ClickProvider, public userInfo: UserInfoProvider) {  
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
            self.messages.push(snapshots.val()[snap]);
        }
    });
     
 }
ngAfterViewInit(){
    
}
 //scrolls to bottom of screen
 ionViewWillEnter(){
     let dimensions = this.content.getContentDimensions();
     this.content.scrollTo(0, dimensions.scrollHeight+100, 100);
 }
 checkUid(id){
     if(this.myId == id) return true;
     return false;
 }
 dismiss(){
     this.viewCtrl.dismiss();
 }
 
}

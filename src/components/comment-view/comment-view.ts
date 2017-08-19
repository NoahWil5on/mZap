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
 //submit a message
 submit(){
     this.click.click('discussionSubmit');
     if(this.myText.trim().length < 1) return;
     let data = {
         name: this.afAuth.auth.currentUser.displayName,
         message: this.myText,
         id: this.afAuth.auth.currentUser.uid
     }
     //record messsage on firebase and format screen to fit new image
     firebase.database().ref('/messages/').child(this.id).push(data).then(res => {
         this.myText = "";
         let el = this.msg.nativeElement;
         el.style.cssText = 'height:auto; padding:0';
         el.style.cssText = 'height:' + (el.scrollHeight+ 4) + 'px';
     });
 }
 //input box autoresizing
 resize(){
     this.ngZone.run(() =>{
         let el = this.msg.nativeElement;
         el.style.cssText = 'height:auto; padding:0;';
         el.style.cssText = 'height:' + (el.scrollHeight+ 4) + 'px';
     });
 }
 textClick(){
     this.click.click('discussionMessage');
 }
 getPhotoUrl(id){
     var url = "http://www.placehold.it/40";
    firebase.database().ref('/users/').child(id).once('value', snapshot => {
        if(snapshot.hasChild('url')){
            url = snapshot.val().url+"";
        }
    }).then(_ => {
        return url;
    });
 }
}

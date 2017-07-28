//vanilla ionic imports
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Content } from 'ionic-angular';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator'

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase'

@IonicPage()
@Component({
    selector: 'page-discussion',
    templateUrl: 'discussion.html'
})
export class DiscussionPage {
    //input element
    @ViewChild('msg') msg: any;
    
    //scroll content element
    @ViewChild(Content) content: Content;
    
    
    myText: string;
    id: any;
    messages: any = [];
    myId: any = this.afAuth.auth.currentUser.uid;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
                public afAuth: AngularFireAuth, public translate: TranslatorProvider) {
    }

    ionViewDidLoad() {
        //scroll to bottom of page
        let dimensions = this.content.getContentDimensions();
        this.content.scrollTo(0, dimensions.scrollHeight+100, 100);
        
        //the id of where the messages are stored in the db
        this.id = this.navParams.get('id');
        var self = this;
        
        //fetch all messages
        firebase.database().ref('/messages/').child(this.id).on('value', snapshots => {
            dimensions = this.content.getContentDimensions();
            this.content.scrollTo(0, dimensions.scrollHeight+100, 100);
            self.messages = [];
            
            //for every message found, add to array
            for (var snap in snapshots.val()) {           
                if(snapshots.hasOwnProperty(snap)) continue;
                console.log(snapshots.val()[snap]);
                self.messages.push(snapshots.val()[snap]);
            }
        })
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
        let el = this.msg.nativeElement;
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + (el.scrollHeight+ 4) + 'px';
    }
}

import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Content } from 'ionic-angular';

import { TranslatorProvider } from '../../providers/translator/translator'

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase'

@IonicPage()
@Component({
    selector: 'page-discussion',
    templateUrl: 'discussion.html'
})
export class DiscussionPage {
    @ViewChild('msg') msg: any;
    @ViewChild(Content) content: Content;
    myText: string;
    id: any;
    messages: any = [];
    myId: any = this.afAuth.auth.currentUser.uid;
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
                public afAuth: AngularFireAuth, public translate: TranslatorProvider) {
    }

    ionViewDidLoad() {
        let dimensions = this.content.getContentDimensions();
        this.content.scrollTo(0, dimensions.scrollHeight+100, 100);
        this.id = this.navParams.get('id');
        var self = this;
        firebase.database().ref('/messages/').child(this.id).on('value', snapshots => {
            dimensions = this.content.getContentDimensions();
            this.content.scrollTo(0, dimensions.scrollHeight+100, 100);
            self.messages = [];
            for (var snap in snapshots.val()) {           
                if(snapshots.hasOwnProperty(snap)) continue;
                console.log(snapshots.val()[snap]);
                self.messages.push(snapshots.val()[snap]);
            }
        })
    }
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
    submit(){
        let data = {
            name: this.afAuth.auth.currentUser.displayName,
            message: this.myText,
            id: this.afAuth.auth.currentUser.uid
        }
        firebase.database().ref('/messages/').child(this.id).push(data).then(res => {
            this.myText = "";
            let el = this.msg.nativeElement;
            el.style.cssText = 'height:auto; padding:0';
            el.style.cssText = 'height:' + (el.scrollHeight+ 4) + 'px';
        });
    }
    resize(){
        let el = this.msg.nativeElement;
        el.style.cssText = 'height:auto; padding:0';
        el.style.cssText = 'height:' + (el.scrollHeight+ 4) + 'px';
    }
}

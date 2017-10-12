//vanilla ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Content, AlertController, Events } from 'ionic-angular';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator'
import { ClickProvider } from '../../providers/click/click';
import { UserInfoProvider } from '../../providers/user-info/user-info';

//page imports
import { MapPage } from '../../pages/map/map';

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
    @ViewChild('commentContent') commentContent;


    myText: string = "";
    id: any;
    messages: any = [];
    myId: any;
    location: string = "main"

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public afAuth: AngularFireAuth, public translate: TranslatorProvider, public ngZone: NgZone, public click: ClickProvider, public userInfo: UserInfoProvider, public mapPage: MapPage, public alertCtrl: AlertController, public events: Events) {
        if(this.mapPage.infoShow){
            this.location = userInfo.activeData.key;
        }
        this.messages = [];
        var self = this;
        this.myId = this.afAuth.auth.currentUser.uid
        firebase.database().ref(`/messages/${this.location}`).on('value', snapshots => {
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
    submit() {
        var today = new Date();
        var hour = today.getHours() + "";
        if (Number(hour) < 10) {
            hour = "0" + hour;
        }
        var seconds = today.getSeconds() + "";
        if (Number(seconds) < 10) {
            seconds = "0" + seconds;
        }
        var minutes = today.getMinutes() + "";
        if (Number(minutes) < 10) {
            minutes = "0" + minutes;
        }
        /*get current date and time*/
        var date = (today.getMonth() + 1) + "-" + today.getDate() + "-" + today.getFullYear() + " " + hour + ":" + minutes + ":" + seconds;
        firebase.database().ref('/users/').child(this.afAuth.auth.currentUser.uid).once('value').then(snapshot => {
            var url = "assets/profile.png";
            if (snapshot.hasChild('url')) {
                url = snapshot.val().url + "";
            }
            if (this.myText.trim().length < 1) return;
            let data = {
                name: this.afAuth.auth.currentUser.displayName,
                message: this.myText,
                id: this.afAuth.auth.currentUser.uid,
                date: date,
                time: Date.now(),
                url: url
            }
            var element = this.commentContent.nativeElement;
            //record messsage on firebase and format screen to fit new image
            firebase.database().ref(`/messages/${this.location}`).push(data).then(res => {
                element.scrollTop = 0;
                this.myText = "";
                setTimeout(() => {
                    // get elements
                    var element   = document.getElementById('messageInputBox');
                    var textarea  = element.getElementsByTagName('textarea')[0];
          
                    // set default style for textarea
                    textarea.style.minHeight  = '0';
                    textarea.style.height     = '0';
          
                    // limit size to 96 pixels (6 lines of text)
                    var scroll_height = textarea.scrollHeight;
                    if(scroll_height > 160)
                      scroll_height = 160;
                    scroll_height += 3;
                    // apply new style
                    element.style.height      = scroll_height + "px";
                    textarea.style.minHeight  = scroll_height + "px";
                    textarea.style.height     = scroll_height + "px";
                    textarea.style.paddingBottom = "0px";
                },10) 
            });
        })
    }
    resize(){
        // get elements
        var element   = document.getElementById('messageInputBox');
        var textarea  = element.getElementsByTagName('textarea')[0];
    
        // set default style for textarea
        textarea.style.minHeight  = '0';
        textarea.style.height     = '0';
    
        // limit size to 96 pixels (6 lines of text)
        var scroll_height = textarea.scrollHeight;
        if(scroll_height > 160)
          scroll_height = 160;
        scroll_height += 3;
        // apply new style
        element.style.height      = scroll_height + "px";
        textarea.style.minHeight  = scroll_height + "px";
        textarea.style.height     = scroll_height + "px";
        textarea.style.paddingBottom = "0px";
    }
    checkMessage(message){
        if(Date.now()-message.time < 2000){
          return true;
        }else{
          return false;
        }
    }
    closeOut() {
        this.mapPage.comment = false;
    }
    checkUID(message){
        if(message.id == this.myId){
            return true;
        }
        return false;
    }
    doCommentInfo() {
        var alert;
        if(!this.mapPage.infoShow){
            alert = this.alertCtrl.create({
                title: this.translate.text.infoWindow.aboutTitle,
                message: this.translate.text.infoWindow.aboutMessage,
                buttons: ['OK']
            });
        }else{
            alert = this.alertCtrl.create({
                title: this.translate.text.infoWindow.aboutTitle2,
                message: this.translate.text.infoWindow.aboutMessage2,
                buttons: ['OK']
            });
        }
        alert.present();
    }
}

//vanilla ionic imports
import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Content, AlertController } from 'ionic-angular';

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


    myText: string = "";
    id: any;
    messages: any = [];
    myId: any;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public afAuth: AngularFireAuth, public translate: TranslatorProvider, public ngZone: NgZone, public click: ClickProvider, public userInfo: UserInfoProvider, public mapPage: MapPage, public alertCtrl: AlertController) {
        this.messages = [];
        var self = this;
        this.myId = this.afAuth.auth.currentUser.uid
        firebase.database().ref('/messages/').on('value', snapshots => {
            self.messages = [];
            //for every message found, add to array
            for (var snap in snapshots.val()) {
                if (snapshots.hasOwnProperty(snap)) continue;
                self.messages.unshift(snapshots.val()[snap]);
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
            //record messsage on firebase and format screen to fit new image
            firebase.database().ref('/messages/').push(data).then(res => {
                this.myText = "";
                let el = this.msg.nativeElement;
                setTimeout(() => {
                    el.style.cssText = 'height: 1.4em; padding: 0';
                }, 10)
            });
        })
    }
    resize() {
        this.ngZone.run(() => {
            let el = this.msg.nativeElement;
            el.style.cssText = 'height:auto; padding:0;';
            el.style.cssText = 'height:' + (el.scrollHeight + 4) + 'px';
        });
    }
    checkMessage(message) {
        if (!message.time) return false;
        if (Date.now() - message.time < 5000) {
            return true;
        }
        return false;
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
        var alert = this.alertCtrl.create({
            title: this.translate.text.infoWindow.aboutTitle,
            message: this.translate.text.infoWindow.aboutMessage,
            buttons: ['OK']
        });
        alert.present();
    }
}

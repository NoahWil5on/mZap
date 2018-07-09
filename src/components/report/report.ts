import { Component, ViewChild } from '@angular/core';
import { MapPage } from '../../pages/map/map';
import { Events, AlertController } from 'ionic-angular';

import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
    selector: 'report',
    templateUrl: 'report.html'
})
export class ReportComponent {
    @ViewChild('main') main;

    myReport: any = "";
    myEmail: any = "";
    myName: any = "";

    /*fajardo*/
    //18.334442978342842
    //-65.63146590936526

    /*veq*/
    //18.152701253218318
    //-65.44469833124026

    /*cul*/
    //18.30172709763306
    //-65.30488036258896

    constructor(public mapPage: MapPage, public event: Events, public alertCtrl: AlertController, public translate: TranslatorProvider, public afAuth: AngularFireAuth, public userInfo: UserInfoProvider) {
        setTimeout(() => {
            this.main.nativeElement.style.transform = "translate(-50%,-50%)";
        }, 10);

        this.myEmail = this.afAuth.auth.currentUser.email;
        this.myName = this.afAuth.auth.currentUser.displayName;
    }
    validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    checkReport() {
        if (this.myName.trim() == '') return false;
        if (!this.validateEmail(this.myEmail)) return false;
        if (this.myReport.trim() == '') return false;
        return true;
    }
    sendReport() {

        var image = this.userInfo.activeData.url;
        var userId = this.userInfo.activeData.id;
        var postKey = this.userInfo.activeData.key;
        var reporterId = this.afAuth.auth.currentUser.uid;

        // var text = `${this.myReport}\n\nSent From: ${this.myName}\nSender Email: ${this.myEmail}\n\nReport Details:\nPost ID:${postKey}\nUser ID:${userId}\nImage URL:${image}`;
        
        var report = {
            image: image,
            postKey: postKey,
            postUserId: userId,
            reporterText: this.myReport,
            reporterId: reporterId,
            reporterEmail: this.myEmail,
            reporterName: this.myName,
            date: Date.now()
        }
        var self = this;
        firebase.database().ref(`reports/${reporterId}`).push(report).then(() => {
            self.closeOut();
        });

            
        // this.emailComposer.isAvailable().then((available: boolean) => {
        //     if (available) {
        //         console.log("We can do this");

        

        //         let email = {
        //             to: 'mzappers@gmail.com',
        //             subject: 'mZAP Post Report',
        //             body: text,
        //             isHtml: true
        //         };

        //         // Send a text message using default options
        //         this.emailComposer.open(email).then(() => {
        //         });
        //     }
        // }).catch(() => {
        // });

    }
    closeOut() {
        this.mapPage.reportShow = false;
    }

}

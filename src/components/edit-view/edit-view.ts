//vanilla ionic imports
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';
import { ClickProvider } from '../../providers/click/click';
import { UserInfoProvider } from '../../providers/user-info/user-info';

//component imports
import { InfoComponent } from '../info/info';

//page imports
import { MapPage } from '../../pages/map/map';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

@Component({
    selector: 'edit-view',
    templateUrl: 'edit-view.html'
})
export class EditViewComponent {

    imageData: string = "";

    data: any = {};
    resolves: any = [];
    deleted: any = [];
    dataSet: boolean = false;
    error: string = "";
    colors: any = []
    ;
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public translate: TranslatorProvider, public ngZone: NgZone, public click: ClickProvider, public userInfo: UserInfoProvider, public mapPage: MapPage, public afAuth: AngularFireAuth, public alertCtrl: AlertController, public infoComponent: InfoComponent) {
        this.data = JSON.parse(JSON.stringify(this.userInfo.activeData));

        this.colors = [
            {
                value: 'a',
                color: '#24b9ed',
                border: '#126bd6'
            },
            {
                value: 'b',
                color: '#f2ea37',
                border: '#ffce07'
            },
            {
                value: 'c',
                color: '#3d4da1',
                border: '#21215f'
            },
            {
                value: 'd',
                color: '#57b947',
                border: '#1d5a2d'
            },
            {
                value: 'e',
                color: '#e82125',
                border: '#811517'
            },
            {
                value: 'f',
                color: '#9c248e',
                border: '#571853'
            },
        ]
    }
    ngAfterViewInit() {
        this.infoComponent.editComponent = this;
        this.data = JSON.parse(JSON.stringify(this.userInfo.activeData));
    }
    dismiss(bool) {
        this.navCtrl.setRoot(MapPage);
    }
    statusClick() {
        this.click.click('editPostStatus');
    }
    typeClick() {
        this.click.click('editPostType');
    }
    descriptionClick() {
        this.click.click('editPostDescription');
    }
    submit() {
        // if (this.data.checks[0].text.length < 1) return;
        // var temp = this.data.checks
        // for (var i = 0; i < temp.length; i++) {
        //     if (!temp[i] || !temp[i].text || temp[i].text == "" || !temp[i].amount || temp[i].amount < 1) {
        //         temp.splice(i, 1);
        //         i--;
        //         continue;
        //     }
        //     temp[i].text = temp[i].text.trim();
        //     if (temp[i].text.length < 1) {
        //         temp.splice(i, 1);
        //         i--;
        //     }
        // }
        // if (temp.length < 1) return;
        for(var i = 0; i < this.data.checks.length; i++){
            this.data.checks[i].text = this.data.checks[i].text.trim();
            if(this.data.checks[i].amount > 999){
              this.data.checks[i].amount = 999;
            }
            if(this.data.checks[i].amount < 0){
                this.data.checks[i].amount = 0;
            }
            if(this.data.checks[i].text.length < 1 || !this.data.checks[i].amount || this.data.checks[i].amount < 1){
              this.data.checks.splice(i,1);
              i--;
              console.log("Something should be happening");
            }
        }
        if(this.data.checks.length < 1) return;
        firebase.database().ref('/positions/').child(this.data.key).set(this.data).then(_ => {
            this.userInfo.activeData = this.data;
            this.dismiss(true);
        });
    }
    delete() {
        var alert = this.alertCtrl.create({
            title: this.translate.text.infoWindow.deleteAlertTitle,
            subTitle: this.translate.text.infoWindow.deleteAlertSubTitle,
            buttons: [{
                text: this.translate.text.infoWindow.delete,
                handler: data => {
                    this.deleteData();
                }
            }, this.translate.text.infoWindow.cancel]
        });
        alert.present();
    }
    //if selected, this post and all data associated with it will be deleted
    deleteData() {
        //checks to see if there are any images that need to be deleted
        var self = this;
        //check if there is an image
        firebase.database().ref('/positions/').child(this.data.key).once('value').then(function (snapshot) {
            if (snapshot.hasChild('url')) {
                //if image delete image then delete rest of report
                firebase.storage().ref('/images/').child("posts").child(self.data.refName).delete().then(() => {
                    self.deleteReport();
                });
                //if no image delete rest of report
            } else {
                self.deleteReport();
            }
        });
    }
    addAll(){
        this.loopArrays(this.data.checks, 1); 
    }
    subAll(){
        this.loopArrays(this.data.checks, -1);     
    }
    loopArrays(myArray, num){
    for(var i = 0; i < myArray.length; i++){
        var check = myArray[i];
        check.amount += num;
        if(check.amount > 999){
        check.amount = 999;
        }
        if(check.amount < 0){
        check.amount = 0;
        }
    }
    }
    convertToNumber(event):number {  
        var x = +event;
        x = Math.floor(x);
        if(x < 0){
            x = 0;
        }else if(x > 999){
            x = 999;
        }
        return x; 
    }
    //helper function for deleteDatat()
    deleteReport() {
        this.click.click('infoWindowDelete');
        var self = this;
        //delete each "resolve" image from db
        firebase.database().ref('/resolves/').child(this.data.key).once('value').then(snapshot => {
            //loop through resolve images and delete them from storage
            snapshot.forEach(function (item) {
                firebase.storage().ref('/images/').child("resolves").child(item.val().refName).delete();
            });
        }).then(() => {
            //delete the directory for resolve on this report
            firebase.database().ref('/resolves/').child(this.data.key).remove().then(() => {
                firebase.database().ref('/messages/').child(this.data.key).remove();
            }).then(() => {
                //update post #
                var userRating = firebase.database().ref('/userRating/').child(self.afAuth.auth.currentUser.uid)
                userRating.once('value', snap => {
                    userRating.child('posts').set(snap.val().posts - 1);
                }).then(_ => {
                    //delete root report
                    firebase.database().ref('/positions/').child(this.data.key).remove().then(() => {
                        this.dismiss(true);
                    });
                });
            });
        })
    }
}

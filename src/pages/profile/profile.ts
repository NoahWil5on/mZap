//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';

//image pop up import
import { ImageViewerController } from 'ionic-img-viewer';

//firebase imports
import { AngularFireAuth } from 'angularfire2/auth'
import * as firebase from 'firebase';


@IonicPage()
@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {

    reports: any = [];
    name: any = '';
    imgSrc: any = '';
    constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public afAuth:    AngularFireAuth, public translate: TranslatorProvider, public imageViewerCtrl: ImageViewerController) {
        
    }

    ionViewDidLoad() {
        var self = this;
        //fetch user posts from firebase
        firebase.database().ref('/positions/').orderByChild('email').equalTo(this.afAuth.auth.currentUser.email)
        .once('value').then(snapshot => {
            snapshot.forEach(function(item){
                //create object to hold data on each post
                var obj = {
                    type: item.val().type,
                    status: item.val().status,
                    description: item.val().description,
                    url: item.val().url
                }
                //translate type
                switch(item.val().type){
                    case 'bugs':
                        obj.type = self.translate.text.other.bug;
                        break;
                    case 'building':
                        obj.type = self.translate.text.other.building;
                        break;
                    case 'trash':
                        obj.type = self.translate.text.other.trash;
                        break;
                    case 'pest':
                        obj.type = self.translate.text.other.pest;
                        break;
                }
                //translate status
                switch(item.val().status){
                    case 'Complete':
                        obj.status = self.translate.text.other.complete;
                        break;
                    case 'To Do':
                        obj.status = self.translate.text.other.todo;
                        break;
                }
                //push post to front of array
                self.reports.unshift(obj);
            });
        })
        firebase.database().ref('users').child(this.afAuth.auth.currentUser.uid).once('value').then((snapshot) => {
            this.name = snapshot.val().name;
            this.imgSrc = snapshot.val().url;
        });
    }
    //show pop up image
    presentImage(image){
        let imageViewer = this.imageViewerCtrl.create(image);
        imageViewer.present();
    }
    //open menu
    openMenu(){
        this.menuCtrl.open();
    }
}

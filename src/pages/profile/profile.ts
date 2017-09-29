//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, ModalController } from 'ionic-angular';

//pages import
import { MapPage } from '../map/map';
import { EditProfilePage } from '../edit-profile/edit-profile';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info'
import { ClickProvider } from '../../providers/click/click';

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
    user: any = {};
    rating: any = {};
    theReports: any = "";

    constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, 
                 public afAuth:    AngularFireAuth, public translate: TranslatorProvider, 
                 public imageViewerCtrl: ImageViewerController, public userInfo: UserInfoProvider,
                public modalCtrl: ModalController, public click: ClickProvider) {
        
    }

    ionViewDidLoad() {
        this.reports = [];
        var self = this;
        //fetch user posts from firebase
        firebase.database().ref('/positions/').orderByChild('id').equalTo(this.userInfo.profileView)
        .once('value').then(snapshot => {
            snapshot.forEach(function(item){
                if(!item.val().show && self.afAuth.auth.currentUser.uid != self.userInfo.profileView) return
                //create object to hold data on each post
                var obj = {
                    type: item.val().type,
                    status: item.val().status,
                    description: item.val().description,
                    url: item.val().url,
                    lat: item.val().lat,
                    lng: item.val().lng
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
                    case 'cnd':
                        obj.type = self.translate.text.other.cnd;
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
        firebase.database().ref('users').child(this.userInfo.profileView).once('value').then((snapshot) => {
            this.user = snapshot.val();
        }).then(_ => {
            if(this.translate.text == this.translate.en){
                this.theReports = this.user.name + "'s Reports";
            }else{
                this.theReports = "Los informes de " + this.user.name;
            }
        });
        firebase.database().ref('userRating').child(this.userInfo.profileView).once('value').then((snapshot) => {
            if(snapshot.val()){
                this.rating = snapshot.val();
            }else{
                this.rating = {
                    posts: 0,
                    resolves: 0
                }
            }
        });
    }
    //Check if this is your own user profile
    checkProfile(){
        return (this.userInfo.profileView == this.afAuth.auth.currentUser.uid) ? true: false;
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
    //Bring up Edit Modal
    openEdit(){
        if(!this.checkProfile()) return;
        var editModal = this.modalCtrl.create(EditProfilePage, null);
        editModal.onDidDismiss(res => {
            if(res){
                this.ionViewDidLoad();
            }
        })
        editModal.present();
    }
    //bring user to location on map
    showOnMap(lat, lng){    
        this.click.click('profileShowOnMap');
        //remove filters and update menu pageState
        this.userInfo.filter = undefined;
        this.userInfo.pageState = 'map';
        
        //set zoom and position of map
        this.userInfo.lat = lat;
        this.userInfo.lng = lng;
        this.userInfo.zoom = 20;
        
        //go to map
        this.navCtrl.setRoot(MapPage);
    }
}

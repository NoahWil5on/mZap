//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController, ModalController } from 'ionic-angular';

//image viewer import
import { ImageViewerController } from 'ionic-img-viewer'

//import pages
import { MapPage } from '../map/map';
import { ProfilePage } from '../profile/profile';
import { FilterPage } from '../filter/filter';

//provider imports
import { TranslatorProvider } from '../../providers/translator/translator';
import { UserInfoProvider } from '../../providers/user-info/user-info';

//firebase imports
import * as firebase from 'firebase';

@IonicPage()
@Component({
    selector: 'page-reports',
    templateUrl: 'reports.html',
})
export class ReportsPage {

    reports: any = [];
    constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, 
                 public translate: TranslatorProvider, public loadCtrl: LoadingController,
                public userInfo: UserInfoProvider, public imageViewerCtrl: ImageViewerController,
                public modal: ModalController) {
    }

    ionViewDidLoad() {
        this.doLoad();
    }
    //check to see if posts is filtered out
    doCheck(item){
        if(!this.userInfo.filterReports) return true;
        let check = false;
        
        //filter by type
        for(var i = 0; i < this.userInfo.filterReports.type.length; i++){
            if(item.type == this.userInfo.filterReports.type[i]){
                check = true;
                break;
            }
        }
        if(!check) return false;
        check = false;
        
        //filter by status
        for(i = 0; i < this.userInfo.filterReports.status.length; i++){
            if(item.status == this.userInfo.filterReports.status[i]){
                check = true;
                break;
            }
        }
        if(!check) return false;   
        if(!item.likes){
            item.likes = 0;
        }
        //filter by rating
        if(item.likes <= this.userInfo.filterReports.upper &&
          item.likes >= this.userInfo.filterReports.lower){
            return true;
        }
        return false;
    }
    //Open filter modal
    openFilter(){
        var filterPage = this.modal.create(FilterPage, {target: 'reports'});
        filterPage.onDidDismiss(data => {
            if(data){
                this.navCtrl.setRoot(ReportsPage);
            }
        })
        filterPage.present();
    }
    //load in all posts
    doLoad(){
        var self = this;
        firebase.database().ref('/positions/').once('value').then(snapshot => {
            snapshot.forEach(function(item){
                //filter out results
                if(!self.doCheck(item.val())) return; 
                //create object to hold data on each post
                var obj = {
                    type: item.val().type,
                    status: item.val().status,
                    description: item.val().description,
                    name: item.val().name,
                    id: item.val().id,
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
                self.reports.unshift(obj); 
            });
        });
    }
    //go to location of point on map
    showOnMap(lat, lng){
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
    
    //Check out user's profile
    doProfile(id){
        this.userInfo.profileView = id;
        this.navCtrl.push(ProfilePage);
    }
    
    //pop up of image when image is clicked on
    presentImage(image){
        let imageViewer = this.imageViewerCtrl.create(image);
        imageViewer.present();
    }
    //open nav menu
    openMenu(){
        this.menuCtrl.open();
    }

}

//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';

//firebase imports
import * as firebase from 'firebase';

//providers import
import { TranslatorProvider } from '../../providers/translator/translator';
import { RatingProvider } from '../../providers/rating/rating';
import { UserInfoProvider } from '../../providers/user-info/user-info';
import { ClickProvider } from '../../providers/click/click';

//page imports
import { ProfilePage } from '../profile/profile';

@IonicPage()
@Component({
  selector: 'page-top-rated',
  templateUrl: 'top-rated.html'
})
export class TopRatedPage {

    users: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, 
               public loadingCtrl: LoadingController, public translate: TranslatorProvider, 
               public rating: RatingProvider, public userInfo: UserInfoProvider, public click: ClickProvider) {
  }
    //open nav menu
    openMenu(){
        this.click.click('topRatedMenu');
        this.menuCtrl.open();
    }
    ionViewDidLoad() {
        
        //look at and preserve the top 5 users on basis of visits
        /*
        */
        this.rating.calculateRating(this.callback, this);
    }
    callback(){
        var self = this;
        var ref = firebase.database().ref('/users/');
        ref.orderByChild("rating").once("value").then(function(snapshot) {
            snapshot.forEach(function(user){
                var imageURL = "../assets/profile.png";
                if(user.val().url){
                    imageURL = user.val().url;
                }
                //add user & user info to front of array
                self.users.unshift({
                    id: user.key,
                    name: user.val().name,
                    rating: user.val().rating,
                    img: imageURL,
                    place: "",
                });
            });
            self.users.sort(function(a, b){ return b.rating-a.rating });
            self.users = self.users.splice(0,5);
            for(var i = 0; i < 5; i++){
                self.users.place = "#"+ (i+1);
            }
        })
    }
    //Check out user's profile
    doProfile(id){
        this.click.click('topRatedViewProfile');
        this.userInfo.profileView = id;
        this.navCtrl.push(ProfilePage);
    }

}

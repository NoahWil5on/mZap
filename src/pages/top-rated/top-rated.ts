//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';

//firebase imports
import * as firebase from 'firebase';

//providers import
import { TranslatorProvider } from '../../providers/translator/translator';
import { RatingProvider } from '../../providers/rating/rating';

/**
 * Generated class for the TopRatedPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-top-rated',
  templateUrl: 'top-rated.html'
})
export class TopRatedPage {

    users: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, 
               public loadingCtrl: LoadingController, public translate: TranslatorProvider, 
               public rating: RatingProvider) {
  }
    //open nav menu
    openMenu(){
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
        ref.orderByChild("rating").limitToLast(5).once("value").then(function(snapshot) {
            snapshot.forEach(function(user){
                var imageURL = "http://www.placehold.it/100x100";
                if(user.val().url){
                    imageURL = user.val().url;
                }
                //add user & user info to front of array
                self.users.unshift({
                    name: user.val().name,
                    rating: user.val().rating,
                    img: imageURL
                });
            })
        })
    }

}

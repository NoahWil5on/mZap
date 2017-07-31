//vanilla ionic imports
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, LoadingController } from 'ionic-angular';

//firebase imports
import * as firebase from 'firebase';

//providers import
import { TranslatorProvider } from '../../providers/translator/translator';

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
               public loadingCtrl: LoadingController, public translate: TranslatorProvider) {
  }
    //open nav menu
    openMenu(){
        this.menuCtrl.open();
    }
    ionViewDidLoad() {
        let loader = this.loadingCtrl.create({
            content: this.translate.text.topRated.fetch
        });
        loader.present();
        var ref = firebase.database().ref('users/');
        var self = this;
        var i = 0;
        
        //look at and preserve the top 5 users on basis of visits
        ref.orderByChild("visits").limitToLast(5).on("child_added", function(snapshot) {
            var imageURL = "http://www.placehold.it/100x100";
            if(snapshot.val().url){
                imageURL = snapshot.val().url;
            }
            if(i < 5){
                //add user & user info to front of array
                self.users.unshift({
                    name: snapshot.val().name,
                    rating: snapshot.val().visits,
                    img: imageURL
                })
            }
            i++;
        });
        loader.dismiss();     
    }

}
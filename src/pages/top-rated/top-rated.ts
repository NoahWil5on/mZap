import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

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

    selfTop: boolean = false;
    users: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
      /*this.users = [
          {
              name: "Tom Cruise",
              rating: 5,
              img: "image"
          },
          {
              name: "Billy Joe",
              rating: 4,
              img: "image"
          },
          {
              name: "Deborah Name",
              rating: 4,
              img: "image"
          },
          {
              name: "Bruce Willis",
              rating: 3,
              img: "image"
          },
          {
              name: "Shane Wheeler",
              rating: 3,
              img: "image"
          },
          {
              name: "Sydney Crawfit",
              rating: 2,
              img: "image"
          },
          {
              name: "Samantha Jackson",
              rating: 2,
              img: "image"
          },
          {
              name: "Laura Bush",
              rating: 1,
              img: "image"
          }
      ]*/
  }

    ionViewDidLoad() {
        var ref = firebase.database().ref('users/');
        var self = this;
        var i = 0;
        ref.orderByChild("visits").limitToLast(5).on("child_added", function(snapshot) {
            var imageURL = "http://www.placehold.it/100x100";
            if(snapshot.val().url){
                imageURL = snapshot.val().url;
            }
            if(i < 5){
                self.users.unshift({
                    name: snapshot.val().name,
                    rating: snapshot.val().visits,
                    img: imageURL
                })
            }
            i++;
        });
        
    }

}

//vanilla ionic import
import { Injectable } from '@angular/core';

//firebase import
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class RatingProvider {

    likes: any = 0;
    posts: any = 0;
    postLikes: any = 0;
    resolves: any = 0;
    complete: any = 0;
    
    callback: any;
    scope: any;
    
    constructor(public afAuth: AngularFireAuth) {

    }
    calculateRating(callback, scope){
        this.scope = scope;
        this.callback = callback;
        if(this.afAuth.auth.currentUser){
            firebase.database().ref('/userRating/').once('value').then(snapshot => {
                if(snapshot.hasChild(this.afAuth.auth.currentUser.uid))
                    this.runRating();
                else{
                    this.callback.call(scope);
                }
            });
        }
        else{
            this.callback.call(scope)
        }
    }
    runRating(){
        var self = this;
        firebase.database().ref('/userRating/').child(this.afAuth.auth.currentUser.uid).once('value').then(snapshot => {
            if(snapshot.hasChild('likes')){
                this.likes = snapshot.val().likes
            }
            if(snapshot.hasChild('posts')){
                this.posts = snapshot.val().posts
            }
            if(snapshot.hasChild('postLikes')){
                this.postLikes = snapshot.val().postLikes
            }
            if(snapshot.hasChild('resolves')){
                this.resolves = snapshot.val().resolves
            }
            if(snapshot.hasChild('complete')){
                this.complete = snapshot.val().complete
            }
        }).then(_ => {
            self.saveRating();
        });
    }
    saveRating(){
        var self = this;
        var rating = (this.likes * .5) + (this.posts*2) + (this.postLikes) + (this.resolves * 3) + (this.complete);
        
        if(rating > 0)
            rating = Math.sqrt(rating);
        else{
            rating = 0;
        }
        //rating = 8.589348932;
        rating = rating.toFixed(2);
        
        firebase.database().ref('/users/').child(this.afAuth.auth.currentUser.uid).child('rating').set(rating)
        .then(_=> {
            self.callback.call(this.scope);
        });
    }
}

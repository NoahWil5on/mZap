//Vanilla ionic import
import { Injectable } from '@angular/core';

//firebase import
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class LikeProvider {

    constructor(public afAuth: AngularFireAuth) {

    }
    //takes post id, value of like (-1,1), and sends callback to tell map the new value
    like(post, callback){
        var self = this;
        var value = 0;
        //var valToAdd = value;
        var ref = firebase.database().ref('/positions/').child(post);
        if(!this.afAuth.auth.currentUser) return;
        //check if the user has already liked this post and what value they posted on it
        var user = firebase.database().ref(`/userLikes/${this.afAuth.auth.currentUser.uid}/likedPosts/${post}`);
        user.once('value',function(userSnapshot){
            //if user has liked the post and isn't changing their value return
            if(!userSnapshot.val()){
                value = 1;
            }else{
                if(Number.parseInt(userSnapshot.val()) == -1){
                    value = 1;
                }else{
                    value = -1;
                }
            }
            user.set(value).then(_ => {
                ref.once('value', function(snapshot){
                    //if this is the first time the post is receiving a like
                    if(!snapshot.hasChild('likes')){
                        ref.child('likes').set(value).then(_ => {
                            self.updateOtherUserLikes(snapshot.val().id,value);
                            self.updateLikes(post);
                            callback(value);
                        }); 
                    }
                    else{
                        var likes = Number.parseInt(snapshot.val().likes);
                        ref.child('likes').set(likes + value).then(_ => {
                            self.updateOtherUserLikes(snapshot.val().id,value);
                            if(!userSnapshot.val()){
                                self.updateLikes(post);
                            }
                            callback(likes + value);
                        });
                    }
                })
            });            
        });
        //if the user has already liked the post but this is a new value then the post should
        //be double valued. ex.) post starts at 0 and user 'A' likes it. Post should go to 1.
        //if user 'A' goes back and dislikes it post shouldn't go back to 0, it should go to -1
        //because if they had disliked it at 0 post would have gone to -1. so delta should be 2
        // if(userSnapshot.val() != undefined){
        //     valToAdd *= 2;
        // }
        // else{
        //     self.updateLikes();
        // }
    }
    updateLikes(post){
        var userRating = firebase.database().ref('/userRating/').child(this.afAuth.auth.currentUser.uid)
        userRating.once('value', snap => {
            if(!snap.hasChild('likes')){
                userRating.child('likes').set(1);
            }else{
                userRating.child('likes').set(snap.val().likes + 1);
            }
        });
        // firebase.database().ref(`/subscriptions/${this.afAuth.auth.currentUser.uid}/${post}`).once('value').then(snapshot => {
        //     var found = false;
        //     snapshot.forEach(item => {
        //         if(item.val() == this.afAuth.auth.currentUser.uid){
        //             found = true;
        //         }
        //     });
        //     if(!found){
        //         firebase.database().ref(`/subscriptions/${post}/${this.afAuth.auth.currentUser.uid}`).push(this.afAuth.auth.currentUser.uid);
        //     }
        // })
    }
    updateOtherUserLikes(uid,val){
        var userRating = firebase.database().ref('/userRating/').child(uid)
        userRating.once('value', snap => {
            if(!snap.hasChild('postLikes')){
                userRating.child('postLikes').set(val);
            }else{
                userRating.child('postLikes').set(snap.val().postLikes + val);
            }
        });
    }
    //check if the user has already liked this post before
    //used for styling
    //takes post ID and sends a callback of the user's like preference for this post
    likeable(post, callback){
        if(!this.afAuth.auth.currentUser) return;
        var user = firebase.database().ref(`/userLikes/${this.afAuth.auth.currentUser.uid}/likedPosts/${post}`);
        user.once('value',function(userSnapshot){
            if(userSnapshot.val()){
                callback(Number.parseInt(userSnapshot.val()));
            }
            else{
                callback(0);
            }
        });
    }
}

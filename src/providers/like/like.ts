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
    like(post, value, callback){
        var valToAdd = value;
        var ref = firebase.database().ref('/positions/').child(post);
        
        //check if the user has already liked this post and what value they posted on it
        var user = firebase.database().ref('/userLikes/').child(this.afAuth.auth.currentUser.uid).child('likedPosts').child(post);
        user.once('value',function(userSnapshot){
            //if user has liked the post and isn't changing their value return
            if(Number.parseInt(userSnapshot.val()) == value){
               return
            }
            else{
                //if this is the first time the post is receiving a like
                ref.once('value', function(snapshot){
                    if(!snapshot.hasChild('likes')){
                        ref.child('likes').set(valToAdd).then(_ => {
                            ref.child('likes').once('value', snap => {
                                callback(snap.val());
                            });
                        });                        
                    }
                    else{
                        var likes = Number.parseInt(snapshot.val().likes);
                        
                        //if the user has already liked the post but this is a new value then the post should
                        //be double valued. ex.) post starts at 0 and user 'A' likes it. Post should go to 1.
                        //if user 'A' goes back and dislikes it post shouldn't go back to 0, it should go to -1
                        //because if they had disliked it at 0 post would have gone to -1. so delta should be 2
                        if(userSnapshot.val() != undefined){
                            valToAdd *= 2;
                        }
                        ref.child('likes').set(likes + valToAdd).then(_ => {
                            ref.child('likes').once('value', snap => {
                                callback(snap.val());
                            });
                        });
                    }
                    //update user's like preference on this post
                    user.set(value);
                });
            }
        });
    }
    //check if the user has already liked this post before
    //used for styling
    //takes post ID and sends a callback of the user's like preference for this post
    likeable(post, callback){
        var user = firebase.database().ref('/userLikes/').child(this.afAuth.auth.currentUser.uid).child('likedPosts').child(post);
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

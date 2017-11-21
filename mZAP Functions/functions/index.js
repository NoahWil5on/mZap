const functions = require('firebase-functions');
const firebase = require("firebase/app");
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

const ref = admin.database().ref();

exports.commentTrigger = functions.database.ref('/messages/{postId}/{messageId}').onWrite(event => {
    var data = event.data.val();

    if(!data.id || data.id == "" || data.id == undefined || data.id == null) return
    return ref.child(`/subscriptions/${event.params.postId}`).once('value').then(snapshot => {
        var foundUser = false;
        if(!snapshot.val()){
            ref.child(`/subscriptions/${event.params.postId}`).push(data.id);
            return;
        }
        snapshot.forEach(function(element) {
            var id = element.val();
            if(id == data.id){
                foundUser = true;
                return;
            }
            checkNotify(id, 'notifyComments', data, event.params.postId);
        });
        if(!foundUser){
            ref.child(`/subscriptions/${event.params.postId}`).push(data.id);
            return;
        }
    })
});
exports.resolveTrigger = functions.database.ref('/resolves/{postId}/{resolveId}').onWrite(event => {
    var data = {};

    if(event.data.val().info){
        data.message = event.data.val().info;
    }
    else{
        data.message = "";
    }
    if(event.data.val().name){
        data.name = event.data.val().name;
    }
    if(event.data.val().id){
        data.id = event.data.val().id;
    }
    if(!data.id || data.id == "" || data.id == undefined || data.id == null) return
    return ref.child(`/subscriptions/${event.params.postId}`).once('value').then(snapshot => {
        var foundUser = false;
        if(!snapshot.val()){
            ref.child(`/subscriptions/${event.params.postId}`).push(data.id);
            return;
        }
        snapshot.forEach(function(element) {
            var id = element.val();
            if(id == data.id){
                foundUser = true;
                return;
            }
            checkNotify(id, 'notifyResolves', data, event.params.postId);
        });
        if(!foundUser){
            ref.child(`/subscriptions/${event.params.postId}`).push(data.id);
            return;
        }
        return;
    })
});
//in this single case you don't need to check if you are already subscribed to the post because it has just been
//created so no one can possibly be subscribed, no checks needed.
exports.postCreateTrigger = functions.database.ref('/positions/{postId}').onCreate(event => {
    var data = event.data.val();
    if(!data.id || data.id == "" || data.id == undefined || data.id == null) return;
    return ref.child(`/subscriptions/${event.params.postId}`).push(data.id);
});
exports.likeTrigger = functions.database.ref(`/userLikes/{userId}/likedPosts/{postId}`).onWrite(event => {
    var data = Number(event.data.val());
    return ref.child(`/subscriptions/${event.params.postId}`).once('value').then(snapshot => {
        var foundUser = false;
        var myElement;
        snapshot.forEach(function(element) {
            var id = element.val();
            if(id == event.params.userId){
                myElement = element;
                foundUser = true;
                return;
            }
        });
        //This was originally set up on toggle system: 
        //if last time you subscribed then this time you unsubscribe (and vise versa)
        //however if something weird happens in between, doubling checking the new 
        //'like' value they submitted will help prevent a false positive on a toggle
        if(!foundUser){
            if(data > 0){
                ref.child(`/subscriptions/${event.params.postId}`).push(event.params.userId);
            }
        }else if(myElement){
            if(data < 0){
                ref.child(`/subscriptions/${event.params.postId}/${myElement.key}`).remove();
            }
        }
    });
})
function checkNotify(id, notifyType, data, postId){
    if(!id || id == "" || id == undefined || id == null) return
    ref.child(`/users/${id}`).once('value', snapshot => {
        if(!snapshot.hasChild(notifyType)){
            ref.child(`/users/${id}`).update({
                notifyMyPosts: true,
                notifyComments: true,
                notifyResolves: true,
                notifyLikes: true
            });
            notify(id, notifyType, data, postId);
        }else{
            ref.child(`/positions/${postId}`).once('value', snap => {
                if(id == snap.val().id){
                    if(snapshot.val().notifyMyPosts)
                        notify(id, notifyType, data, postId);
                    return;
                }
                else if(snapshot.val()[notifyType] || snapshot.val().notifyLikes){
                    notify(id, notifyType, data, postId);
                }
            })
                        
        }
    })
}
function notify(id, notifyType, data, postId){
    ref.child(`/notifications/${id}/${postId}`).once('value', snapshot => {
        if(snapshot.hasChild(notifyType)){
            if(snapshot.val()[notifyType].seen){
                ref.child(`/notifications/${id}`).once('value', snap => {
                    if(!snap.hasChild('count')){
                        ref.child(`/notifications/${id}/count`).set(1);
                    }else{
                        ref.child(`/notifications/${id}`).update({
                            count: snap.val().count + 1
                        })
                    }
                })
            }
            ref.child(`/notifications/${id}/${postId}/${notifyType}`).update({
                message: data.message,
                name: data.name,
                seen: false,
                time: Date.now()
            }); 
        }else{
            ref.child(`/notifications/${id}`).once('value', snap => {
                if(!snap.hasChild('count')){
                    ref.child(`/notifications/${id}/count`).set(1);
                }else{
                    ref.child(`/notifications/${id}`).update({
                        count: snap.val().count + 1
                    })
                }
            }).then(_ => {
                ref.child(`/notifications/${id}/${postId}/${notifyType}`).set({
                    message: data.message,
                    name: data.name,
                    seen: false,
                    time: Date.now()
                });
            });
        }
    });
}
// var wroteData;
// exports.pushTrigger = functions.database.ref('/pushMessage/{messageId}').onWrite( event =>{
//     wroteData = event.data.val();

//     admin.database().ref('/pushTokens/').orderByChhild('uid').once('value').then(alltokens => {
//         var tokens = [];
//         alltokens.forEach(item => {
//             tokens.push(item.val());
//         })
//         var payload = {    
//             "notification":{
//                 "title":"Notification title",
//                 "body":"Notification body",
//                 "sound":"default",
//             },
//             "data":{
//                 "name": wroteData.sender,
//                 "message": wroteData.message,
//             },
//         }
//         return admin.messaging().sendToDevice(tokens, payload).then(res => {
//             console.log("Notifications Pushed");
//         }).catch(err => {
//             console.log(err);
//         })
//     })
// });

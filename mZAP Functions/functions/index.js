const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

// var config = {
//     apiKey: "AIzaSyAm-f7wqiP0Qa-FifoqrVa0rlCC1iZG3xk",
//     authDomain: "mzap-45cd2.firebaseapp.com",
//     databaseURL: "https://mzap-45cd2.firebaseio.com",
//     projectId: "mzap-45cd2",
//     storageBucket: "mzap-45cd2.appspot.com",
//     messagingSenderId: "550547782302"
//   };

// admin.initializeApp({
//     credential: admin.credential.cert({
//         projectId: '<APP_ID>',
//         clientEmail: "foo@<APP_ID>.iam.gserviceaccount.com",
//         privateKey: "-----BEGIN PRIVATE KEY-----\n<MY_PRIVATE_KEY>\n-----END PRIVATE KEY-----\n"
//       }),
//     databaseURL: config.databaseURL
//   });
admin.initializeApp();

const ref = admin.database().ref();

exports.reportTrigger = functions.database.ref('/reports/{userId}/{reportId}').onWrite((change, context) => {
    var data = change.after.val();

    var text = `${data.reporterText}\n\nSent From: ${data.reporterName}\nSender Email: ${data.reporterEmail}\n\nReport Details:\nPost ID:${data.postKey}\nUser ID:${data.postUserId}\nImage URL:${data.image}`;

    var transporter = nodemailer.createTransport(smtpTransport({
        service: 'yahoo',
        auth: {
            user: 'mzappers@yahoo.com',
            pass: 'mzap12345'
        }
    }));

    var mailOptions = {
        from: 'mzappers@yahoo.com',
        to: 'mzappers@yahoo.com',
        subject: 'mZAP Post Report',
        text: text
    };
    var mailOptions2 = {
        from: 'mzappers@yahoo.com',
        to: `${data.reporterEmail}`,
        subject: 'mZAP Post Report',
        text: `Hello ${data.reporterName}!\n\nWe have recieved your report and hope to resolve this issue shortly. Thank you for contributing to the community!\n\nSincerely,\nmZAP Team`
    };

    return transporter.sendMail(mailOptions).then(() => {
        return transporter.sendMail(mailOptions2).then(() => {
            return;
        })
    })
})
exports.shipCommentTrigger = functions.database.ref('/shipMessages/{postId}/{messageId}').onWrite((change, context) => {
    var data = change.after.val();

    if (!data.id || data.id == "" || data.id == undefined || data.id == null) return
    return ref.child(`/subscriptions/${context.params.postId}`).once('value').then(snapshot => {
        var foundUser = false;
        if (!snapshot.val()) {
            ref.child(`/subscriptions/${context.params.postId}`).push(data.id);
            return;
        }
        snapshot.forEach(function (element) {
            var id = element.val();
            if (id == data.id) {
                foundUser = true;
                return;
            }
            checkNotify(id, 'notifyComments', data, context.params.postId);
        });
        if (!foundUser) {
            ref.child(`/subscriptions/${context.params.postId}`).push(data.id);
            return;
        }
    })
});
exports.shipPostCreateTrigger = functions.database.ref('/ships/{shipId}/{postId}').onCreate((change, context) => {
    var data = change.val();
    if (!data.id || data.id == "" || data.id == undefined || data.id == null) return;
    return ref.child(`/subscriptions/${context.params.postId}`).push(data.id);
});
exports.shipLikeTrigger = functions.database.ref(`/userShipLikes/{userId}/likedPosts/{postId}`).onWrite((change, context) => {
    var data = Number(change.after.val());
    return ref.child(`/subscriptions/${context.params.postId}`).once('value').then(snapshot => {
        var foundUser = false;
        var myElement;
        snapshot.forEach(function (element) {
            var id = element.val();
            if (id == context.params.userId) {
                myElement = element;
                foundUser = true;
                return;
            }
        });
        if (!foundUser) {
            if (data > 0) {
                ref.child(`/subscriptions/${context.params.postId}`).push(context.params.userId);
            }
        } else if (myElement) {
            if (data <= 0) {
                ref.child(`/subscriptions/${context.params.postId}/${myElement.key}`).remove();
            }
        }
    });
})
exports.commentTrigger = functions.database.ref('/messages/{postId}/{messageId}').onWrite((change, context) => {
    var data = change.after.val();

    if (!data.id || data.id == "" || data.id == undefined || data.id == null) return
    return ref.child(`/subscriptions/${context.params.postId}`).once('value').then(snapshot => {
        var foundUser = false;
        if (!snapshot.val()) {
            ref.child(`/subscriptions/${context.params.postId}`).push(data.id);
            return;
        }
        snapshot.forEach(function (element) {
            var id = element.val();
            if (id == data.id) {
                foundUser = true;
                return;
            }
            checkNotify(id, 'notifyComments', data, context.params.postId);
        });
        if (!foundUser) {
            ref.child(`/subscriptions/${context.params.postId}`).push(data.id);
            return;
        }
    })
});
exports.resolveTrigger = functions.database.ref('/resolves/{postId}/{resolveId}').onWrite((change, context) => {
    var data = {};

    if (change.after.val().info) {
        data.message = change.after.val().info;
    }
    else {
        data.message = "";
    }
    if (change.after.val().name) {
        data.name = change.after.val().name;
    }
    if (change.after.val().id) {
        data.id = change.after.val().id;
    }
    if (!data.id || data.id == "" || data.id == undefined || data.id == null) return
    return ref.child(`/subscriptions/${context.params.postId}`).once('value').then(snapshot => {
        var foundUser = false;
        if (!snapshot.val()) {
            ref.child(`/subscriptions/${context.params.postId}`).push(data.id);
            return;
        }
        snapshot.forEach(function (element) {
            var id = element.val();
            if (id == data.id) {
                foundUser = true;
                return;
            }
            checkNotify(id, 'notifyResolves', data, context.params.postId);
        });
        if (!foundUser) {
            ref.child(`/subscriptions/${context.params.postId}`).push(data.id);
            return;
        }
        return;
    })
});
//in this single case you don't need to check if you are already subscribed to the post because it has just been
//created so no one can possibly be subscribed, no checks needed.
exports.postCreateTrigger = functions.database.ref('/positions/{postId}').onCreate((change, context) => {
    var data = change.val();
    if (!data.id || data.id == "" || data.id == undefined || data.id == null) return;
    return ref.child(`/subscriptions/${context.params.postId}`).push(data.id);
});
exports.likeTrigger = functions.database.ref(`/userLikes/{userId}/likedPosts/{postId}`).onWrite((change, context) => {
    var data = Number(change.after.val());
    return ref.child(`/subscriptions/${context.params.postId}`).once('value').then(snapshot => {
        var foundUser = false;
        var myElement;
        snapshot.forEach(function (element) {
            var id = element.val();
            if (id == context.params.userId) {
                myElement = element;
                foundUser = true;
                return;
            }
        });
        //This was originally set up on toggle system: 
        //if last time you subscribed then this time you unsubscribe (and vise versa)
        //however if something weird happens in between, doubling checking the new 
        //'like' value they submitted will help prevent a false positive on a toggle
        if (!foundUser) {
            if (data > 0) {
                ref.child(`/subscriptions/${context.params.postId}`).push(context.params.userId);
            }
        } else if (myElement) {
            if (data <= 0) {
                ref.child(`/subscriptions/${context.params.postId}/${myElement.key}`).remove();
            }
        }
    });
})
exports.shipTrigger = functions.database.ref(`/ships/{shipType}/{postId}`).onCreate((change, context) => {
    var myShip = context.params.shipType;
    var data = change.val();

    var start = data.start;
    var end = data.end;

    if(!(start == 'faj' || start == 'cul') || !(end == 'faj' || end == 'cul')){
        return Promise;
    }

    var time = new Date(Number(data.date));
    var seconds = 1000;
    var minutes = seconds * 60;
    var hours = minutes * 60;
    var myTime = time.getMilliseconds() + (time.getSeconds() * seconds) + (time.getMinutes() * minutes) + (time.getHours() * hours);

    var dayMod = (24 * hours);
    var timeZone = (4 * hours);
    myTime = (myTime - timeZone) % dayMod;
    var myDay = new Date(Number(data.date - timeZone)).getDay();
    var now = Date.now();

    var onTime = false;
    if(start == "faj"){
        onTime = FajStart(myDay, myTime);
    }else{
        onTime = CulStart(myDay, myTime);
    }
    
    return ref.child(`/shipScore/${myShip}/${now}`).set({
        date: now,
        onTime: onTime,
    });
    // return doTime(myDay, myShip, myTime);
});
exports.shipNotification = functions.https.onRequest((req, res) => {
    var now = Date.now();
    var ships = ['ship1', 'ship2', 'ship3', 'ship4'];
    ships.forEach(ship => {
        ref.child(`ships/${ship}`).limitToLast(1).once('value').then(snapshot => {
            snapshot.forEach(item => {
                var shipData = {
                    ship: item.val().ship,
                    end: item.val().end,
                    start: item.val().start,
                    lat: item.val().lat,
                    lng: item.val().lng,
                    date: item.val().date,
                    name: item.val().name,
                    id: item.val().id,
                    likes: item.val().likes,
                    key: item.val().key
                }
                // var data
                if(now < (shipData.date + (1000 * 60 * 10))){
                    sendNotification("", data, notifyType)
                }
            });
        })
    });
    return Promise;
});
exports.notifyShipTrigger = functions.database.ref(`/users/{userId}/notifyFerries`).onWrite((change, context) => {
    var data = change.after.val();
    var user = context.params.userId;
    return ref.child(`/users/${user}/token`).once('value', snap => {
        if (!snap.val()) return;
        if (data) {
            return admin.messaging().subscribeToTopic(snap.val(), 'ferries');
        } else {
            return admin.messaging().unsubscribeFromTopic(snap.val(), 'ferries');
        }
    })
});
function FajStart(day,time){
    var onTime = false;
    switch(day){
        case 0: 
            if(doTime(9,time) || doTime(15, time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 1:
            if(doTime(4,time) || doTime(9,time) || doTime(15, time) || doTime(17,time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 2:
            if(doTime(4,time) || doTime(9,time) || doTime(15, time) || doTime(17,time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 3:
            if(doTime(4,time) || doTime(9,time) || doTime(9.5,time) || doTime(15, time) || doTime(17,time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 4:
            if(doTime(4,time) || doTime(9,time) || doTime(15, time) || doTime(17,time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 5:
            if(doTime(4,time) || doTime(9,time) || doTime(9.5,time) || doTime(15, time) || doTime(17,time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 6:
            if(doTime(9,time) || doTime(15, time) || doTime(19, time)){
                onTime = true;
            }
            break;
    }
    return onTime;
}
function CulStart(day, time){
    var onTime = false;
    switch(day){
        case 0: 
            if(doTime(6.5,time) || doTime(13, time) || doTime(17, time)){
                onTime = true;
            }
            break;
        case 1:
            if(doTime(6.5,time) || doTime(13, time) || doTime(17, time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 2:
            if(doTime(6.5,time) || doTime(13, time) || doTime(17, time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 3:
            if(doTime(6.5,time) || doTime(7, time) || doTime(13, time) || doTime(17, time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 4:
            if(doTime(6.5,time) || doTime(13, time) || doTime(17, time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 5:
            if(doTime(6.5,time) || doTime(7, time) || doTime(13, time) || doTime(17, time) || doTime(19, time)){
                onTime = true;
            }
            break;
        case 6:
            if(doTime(6.5,time) || doTime(13, time) || doTime(17, time)){
                onTime = true;
            }
            break;
    }
    return onTime;
}
//target in hours into day
//time in milliseconds into day
function doTime(target, time) {
    var hours = 1000 * 60 * 60;
    target *= hours;
    var dayMod = (24 * hours);
    var maxMinutes = 15;
    var minMinutes = 30;
    var timeMax = (target + (1000 * 60 * maxMinutes)) % dayMod;
    var timeMin = (target - (1000 * 60 * minMinutes)) % dayMod;

    //addresses edge case created when we mod the max and min
    if(timeMax < timeMin){
        timeMax += dayMod;
        if(time < timeMin){
            time += dayMod;
        }
    }
    return (time < timeMax && time > timeMin);
    
}
function checkNotify(id, notifyType, data, postId) {
    var refLocation = "positions";

    if(data.postType && data.postType == "ships"){
        refLocation = `ships/${data.shipNumber}`;
    }
    if (!id || id == "" || id == undefined || id == null) return
    ref.child(`/users/${id}`).once('value', snapshot => {
        if (!snapshot.hasChild(notifyType)) {
            ref.child(`/users/${id}`).update({
                notifyMyPosts: true,
                notifyComments: true,
                notifyResolves: true,
                notifyLikes: true
            });
            notify(id, notifyType, data, postId);
        } else {
            ref.child(`/${refLocation}/${postId}`).once('value', snap => {
                if (id == snap.val().id) {
                    if (snapshot.val().notifyMyPosts)
                        notify(id, notifyType, data, postId);
                    return;
                }
                else if (snapshot.val()[notifyType] || snapshot.val().notifyLikes) {
                    notify(id, notifyType, data, postId);
                }
            })

        }
    })
}
function notify(id, notifyType, data, postId) {
    ref.child(`/notifications/${id}/${postId}`).once('value', snapshot => {
        if (snapshot.hasChild(notifyType)) {
            if (snapshot.val()[notifyType].seen) {
                ref.child(`/notifications/${id}`).once('value', snap => {
                    if (!snap.hasChild('count')) {
                        ref.child(`/notifications/${id}/count`).set(1);
                    } else {
                        ref.child(`/notifications/${id}`).update({
                            count: snap.val().count + 1
                        })
                    }
                })
            }
            sendNotification(id, data, notifyType);
            ref.child(`/notifications/${id}/${postId}/${notifyType}`).update({
                message: data.message,
                name: data.name,
                seen: false,
                time: Date.now()
            });
        } else {
            ref.child(`/notifications/${id}`).once('value', snap => {
                if (!snap.hasChild('count')) {
                    ref.child(`/notifications/${id}/count`).set(1);
                } else {
                    ref.child(`/notifications/${id}`).update({
                        count: snap.val().count + 1
                    })
                }
            }).then(_ => {
                sendNotification(id, data, notifyType);
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
function sendNotification(id, data, notifyType) {
    var header = "";
    message = data.message;
    myType = "";

    switch(notifyType){
        case 'notifyComments':
            header = "New message from " + data.name + ":";
            break;
        case 'notifyShip':
            header = "A Ferry has just arrived";
            myType = "ferry";
            break;
        default: 
            header = data.name + " has resolved a post."
            if (data.message != undefined && data.message != "") {
                message = '"' + message + '"';
            }
            break;
    }

    var payload = {
        notification: {
            title: header,
            body: message,
            sound: "default"
        },
        data: {
            type: myType,
        },
    };
    if(data.topic){
        payload.topic = data.topic;
        return admin.messaging().send(payload);
    }

    return ref.child(`/users/${id}`).once('value', snapshot => {
        let token = snapshot.val().pushToken;
        if (token && token != undefined && token != null) {
            return admin.messaging().sendToDevice(token, payload).then(response => {
            });
        } else {
            return;
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

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

exports.reportTrigger = functions.database.ref('/reports/{userId}/{reportId}').onWrite((change,context) => {
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
exports.commentTrigger = functions.database.ref('/messages/{postId}/{messageId}').onWrite((change,context) => {
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
exports.resolveTrigger = functions.database.ref('/resolves/{postId}/{resolveId}').onWrite((change,context) => {
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
            checkNotify(id, 'notifyResolves', data, evcontextent.params.postId);
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
exports.postCreateTrigger = functions.database.ref('/positions/{postId}').onCreate((change,context) => {
    var data = change.val();
    if (!data.id || data.id == "" || data.id == undefined || data.id == null) return;
    return ref.child(`/subscriptions/${context.params.postId}`).push(data.id);
});
exports.likeTrigger = functions.database.ref(`/userLikes/{userId}/likedPosts/{postId}`).onWrite((change,context) => {
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
            if (data < 0) {
                ref.child(`/subscriptions/${context.params.postId}/${myElement.key}`).remove();
            }
        }
    });
})
exports.shipTrigger = functions.database.ref(`/ships/{shipType}/{postId}`).onCreate((change,context) => {
    var myShip = context.params.shipType;
    var data = change.val();
    var time = new Date(Number(data.date));
    var seconds = 1000;
    var minutes = seconds * 60;
    var hours = minutes * 60;
    var myTime = time.getMilliseconds() + (time.getSeconds() * seconds) + (time.getMinutes() * minutes) + (time.getHours() * hours);

    var dayMod = (24 * hours);
    var timeZone = (4 * hours);
    myTime = (myTime - timeZone) % dayMod;

    var time1 = (10 * hours);
    return doTime(time1, myShip, myTime);
});
function doTime(target, ship, time){
    var hours = 1000 * 60 * 60;
    var dayMod = (24 * hours);
    var maxMinutes = 30;
    var minMinutes = 10;
    var timeMax = (target + (1000 * 60 * maxMinutes)) % dayMod;
    var timeMin = (target - (1000 * 60 * minMinutes)) % dayMod;

    if(time < timeMax && time > timeMin){
        return ref.child(`/shipScore/${ship}/record`).push({
            date: Date.now(),
            onTime: true,
        });
    }
    return ref.child(`/shipScore/${ship}/record`).push({
        date: Date.now(),
        onTime: false,
    });
}
function checkNotify(id, notifyType, data, postId) {
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
            ref.child(`/positions/${postId}`).once('value', snap => {
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

    if(notifyType == "notifyComments"){
        header = "New message from " + data.name + ":";
    }else{
        header = data.name + " has resolved a post."
        if(data.message != undefined && data.message != ""){
            message = '"' + message + '"';
        }
    }
    

    const payload = {
        notification: {
            title: header,
            body: message,
        },
        data: {
            type: "",
        }
    };
    
    ref.child(`/users/${id}`).once('value', snapshot => {
        let token = snapshot.val().pushToken;
        if (token && token != undefined && token != null) {
            return admin.messaging().sendToDevice(token, payload).then(response => {
            }).catch(error => {
            });
        }else{
            return;
        }
    }).catch(e => {
        return;
    })
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

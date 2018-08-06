var myKey = '';
var myReport = '';
var myPost = '';
var myRef = '';

var myReports;
var BreakException = {};

function getData(){ 
    firebase.database().ref(`reports`).orderByKey().once('value').then(snapshot => {
        var html = "";

        myReports = snapshot;
        snapshot.forEach(item => {
            var newHTML = `<div class="report${item.val().deleted ? ' deleted' : ''}${item.val().new ? ' new' : ''}">
                            <div class="holder-div">
                                <div class="div-3">
                                    <div style="margin-top: 30px">
                                        <label>Addressed</label>
                                        <input type="checkbox" ${item.val().seen ? 'checked' : ''} onChange='doSeen(event,"${item.key}")'/>
                                    </div>
                                </div>
                                <div class="div-6">
                                    <p><span>Reported By:</span> ${item.val().reporterName}</p>
                                    <p><span>Reporters ID:</span> ${item.val().reporterId}</p>
                                    <p><span>Post ID:</span> ${item.val().postKey}</p>
                                    <p><span>Poster's ID:</span> ${item.val().postUserId}</p>
                                </div>
                                <div class="div-3">
                                    <div>
                                        <button onClick='window.location.href = "${item.val().image}"'>View Image</button>
                                    </div>
                                    <div>
                                        <button onClick="openModal('positions','${item.val().postKey}','${item.key}','modal-delete')">Delete Post</button>
                                    </div>
                                    <div>
                                        <button onClick="openModal('reports','${item.val().postKey}','${item.key}','modal-delete')">Delete Report</button>
                                    </div>
                                </div>
                            </div>
                        </div>`
            html = `${newHTML}${html}`
            if(item.val().new){
                firebase.database().ref(`reports/${item.key}/new`).set(false);
            }
        });
        document.getElementById('reports').innerHTML = html;
    });
}
getData();

function openModal(ref, post, report, name){
    myRef = ref;
    myReport = report;
    myPost = post;
    switch(ref){
        case 'reports':
            myKey = report;
            break;
        case 'positions':
            myKey = post ;
            break;
        default:
            break;   
    }
    document.getElementById(name).style.display = 'block';
}
function doSeen(e, key){
    firebase.database().ref(`reports/${key}/seen`).set(e.target.checked);
}
function init(){
    var closeButton = document.getElementById('cancel');
    var deleteButton = document.getElementById('delete');
    var loginButton = document.getElementById('loginButton');
    var logoutButton = document.getElementById('logout');

    var email = document.getElementById('myEmail');
    var pass = document.getElementById('myPassword');

    logoutButton.onclick = function(){
        firebase.auth().signOut().then(() => {
            localStorage.removeItem('mzap_reports_email');
            localStorage.removeItem('mzap_reports_password');
            document.getElementById('login').style.display = 'block';
            document.getElementById('app').style.display = 'none';
        })
    }
    loginButton.onclick = function(e){
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(email.value,pass.value).then(() => {
            localStorage.setItem('mzap_reports_email', email.value);
            localStorage.setItem('mzap_reports_password', pass.value);
            id = firebase.auth().currentUser.uid;
            firebase.database().ref(`users/${id}`).once('value', snapshot => {
                if(snapshot.val().admin){
                    document.getElementById('login').style.display = 'none';
                    document.getElementById('app').style.display = 'block';
                }else{
                    document.getElementById('error').innerText = 'You must be an mZAP administrator to login.';
                }
            })
        });
    }
    closeButton.onclick = function(){
        document.getElementById('modal-delete').style.display = 'none';
    }
    deleteButton.onclick = function(){
        firebase.database().ref(`${myRef}/${myKey}`).remove().then(() => {
            if(myRef == 'positions'){
                var myPromises = [];
                myReports.forEach(item => {
                    if(item.val().postKey == myKey){
                        myPromises.push(firebase.database().ref(`reports/${item.key}/deleted`).set(true));
                    }
                });
                Promise.all(myPromises).then(() => {
                    getData();
                    document.getElementById('modal-delete').style.display = 'none';
                })                
            }else{
                getData();
                document.getElementById('modal-delete').style.display = 'none';
            }
        });
    }
    var tryEmail = localStorage.getItem('mzap_reports_email');
    var tryPassword = localStorage.getItem('mzap_reports_password');

    if(tryEmail && tryEmail != ''){
        firebase.auth().signInWithEmailAndPassword(tryEmail,tryPassword).then(() => {
            var user = firebase.auth().currentUser;
            if(user){
                firebase.database().ref(`users/${user.uid}`).once('value', snapshot => {
                    if(snapshot.val().admin){
                        document.getElementById('login').style.display = 'none';
                        document.getElementById('app').style.display = 'block';
                    }else{
                        document.getElementById('error').style.innerHTML = 'You must be an mZAP administrator to login.';
                    }
                })
            }
        });        
    }  
}
function openKeyModal(){
    var closeButton = document.getElementById('cancel-gen');
    var generateButton = document.getElementById('generate');
    var genNumber = document.getElementById('gen-number');

    getKeyNumber();
    var myPromises = [];

    document.getElementById('modal-keyGen').style.display = 'block';

    closeButton.onclick = function(){
        document.getElementById('modal-keyGen').style.display = 'none';
    }
    generateButton.onclick = function(){
        var num = Math.floor(genNumber.value);
        var now = Date.now() - (1000 * 60 * 120);

        if(!num || num < 1 || num > 100){
            return;
        }
        for(var i = 0; i < num; i++){
            var numVal = ('0' + i).slice(-2)
            var keyVal = makeid();
        
            keyVal = keyVal + '-' + numVal;
            var keyInfo = {
                keyVal: keyVal,
                time: now
            }

            myPromises.push(firebase.database().ref(`loginKeys`).push(keyInfo));
        }
        Promise.all(myPromises).then(() => {
            getKeyNumber();
        });
    }
}
function openGetKeyModal(){
    document.getElementById('keyVal').innerHTML = "";
    var closeButton = document.getElementById('cancel-get');
    var getKey = document.getElementById('get-key');

    getKeyNumber();

    document.getElementById('modal-getKey').style.display = 'block';

    closeButton.onclick = function(){
        document.getElementById('modal-getKey').style.display = 'none';
    }
    getKey.onclick = function(){
        doGetKey();
    }
}
function doGetKey(){
    var keyVal = document.getElementById('keyVal');

    var now = Date.now();
    firebase.database().ref(`loginKeys`).once('value').then(snapshot => {
        var key = undefined;
        var itemKey;
        try{
            snapshot.forEach(item => {
                if(item.val().time > (now - (1000 * 60 * 120))){
                    return;
                }else{
                    key = item.val().keyVal;
                    itemKey = item.key;
                    throw BreakException;
                }
            })
        }catch(e){
            if(e != BreakException) throw e;
        }
        if(key != undefined){
            keyVal.innerHTML = `key value: <span class="special">${key}</span>`;
            firebase.database().ref(`loginKeys/${itemKey}/time`).set(now);
        }else{
            keyVal.innerHTML = `We could not find any fresh key values`;
        }
    });
}
function getKeyNumber(){
    var keyNumbers = document.getElementsByClassName('keyNumber');
    
    firebase.database().ref(`loginKeys`).once('value').then(snapshot => {
        var num = 0;
        snapshot.forEach(item => {
            num++
        })
        for(var i = 0; i < keyNumbers.length; i++){
            keyNumbers[i].innerHTML = `There are currently <span class="special">${num}</span> available keys`;
        }  
    });
}
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  
    for (var i = 0; i < 3; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }
  
window.onload = init;
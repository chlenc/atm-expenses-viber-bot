const firebase = require("firebase");
firebase.initializeApp({
    serviceAccount: "./funnels-639c05f9da96.json",
    databaseURL: "https://funnels-61746.firebaseio.com/"
})

module.exports = {
    getData(path,callback){
        firebase.database().ref(path).once('value',function (snapshot) {
           var data = snapshot.val();
           if(data == null){
               callback({},true)
           }else {
               callback(data,null)
           }
        })
    },
    pushData (path, data){
        firebase.database().ref(path).push(data)
    },
    setData(path, data){
        firebase.database().ref(path).set(data)
    },
    updateData(path, data){
        firebase.database().ref(path).update(data)
    },
    removeData(path){
        firebase.database().ref(path).remove(data)
    }
    // getAllData(){
    //
    // },
}
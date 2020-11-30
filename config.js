import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyAg9cMXnLZ5ClT2SYrgP6aGG0TBQqQFJ7I",
    authDomain: "barter-system-7ed2f.firebaseapp.com",
    databaseURL: "https://barter-system-7ed2f.firebaseio.com",
    projectId: "barter-system-7ed2f",
    storageBucket: "barter-system-7ed2f.appspot.com",
    messagingSenderId: "539576668911",
    appId: "1:539576668911:web:da7ccb11f8a19e2bd2c11a"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();
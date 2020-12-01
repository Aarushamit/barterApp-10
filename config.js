import firebase from 'firebase';
require('@firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBXhcmqnM7tqgPB9w9QCDb9a8x9TxkHK3U",
  authDomain: "barterapp-1.firebaseapp.com",
  databaseURL: "https://barterapp-1.firebaseio.com",
  projectId: "barterapp-1",
  storageBucket: "barterapp-1.appspot.com",
  messagingSenderId: "702399188599",
  appId: "1:702399188599:web:a4f8f8d1efbed416b38072",
  measurementId: "G-P3S49VWQ13"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();

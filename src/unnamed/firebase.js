import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCwtDbBM0rNTXL_rWpOQGEfI4N4Aa_9MEc",
    authDomain: "unnamed-bb1b3.firebaseapp.com",
    projectId: "unnamed-bb1b3",
    storageBucket: "unnamed-bb1b3.appspot.com",
    messagingSenderId: "602306772735",
    appId: "1:602306772735:web:46b981af358e43a13796ca",
    measurementId: "G-84HHL6NNXK"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage};
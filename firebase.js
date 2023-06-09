// Import the functions you need from the SDKs you need
import  { initializeApp }  from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBf3mNNWv5fu-7PTrx8qKpPxzjANLJpStE",
  authDomain: "taxi-42299.firebaseapp.com",
  projectId: "taxi-42299",
  storageBucket: "taxi-42299.appspot.com",
  messagingSenderId: "949847517295",
  appId: "1:949847517295:web:8d2e717f007ec241e6459a",
  measurementId: "G-JGMKKV11NP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}


const auth = getAuth();

export { app, firebaseConfig, firebase, auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
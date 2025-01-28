// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaEht6QHwCBNzAQls7vT_nKD2sd8FKC9k",
  authDomain: "webb-691bc.firebaseapp.com",
  databaseURL: "https://webb-691bc-default-rtdb.firebaseio.com",
  projectId: "webb-691bc",
  storageBucket: "webb-691bc.firebasestorage.app",
  messagingSenderId: "622780809662",
  appId: "1:622780809662:web:4d620e797af5b4058979ef",
  measurementId: "G-Z2TNLLDD4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db};
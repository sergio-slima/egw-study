// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBRkEkSFU6NkRX3PLdlG2JZOB3pP_hOEMQ",
    authDomain: "egw-study-5f830.firebaseapp.com",
    projectId: "egw-study-5f830",
    storageBucket: "egw-study-5f830.appspot.com",
    messagingSenderId: "328569627376",
    appId: "1:328569627376:web:a244cb8411952158a11835"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB9JdJnG6ag5GR4KnrLs-ilIUxBRpyddjs",
    authDomain: "upvc-website.firebaseapp.com",
    projectId: "upvc-website",
    storageBucket: "upvc-website.appspot.com",
    messagingSenderId: "946558907638",
    appId: "1:946558907638:web:41b96ba97e7dd4bf64e8d7",
    measurementId: "G-5XFL2ZE0TQ"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

export const authWithGoogle = async () =>{
    let user = null;

    await signInWithPopup(auth,provider).then((result)=>{
        user= result.user;
    }).catch((error)=>{
        console.log(error);
    })
    return user;
}
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCfaXqI5VsPzNME_-mIpFp_1Yq6Ij9b9Xg",
    authDomain: "ssss-9348e.firebaseapp.com",
    projectId: "ssss-9348e",
    storageBucket: "ssss-9348e.firebasestorage.app",
    messagingSenderId: "354969438898",
    appId: "1:354969438898:web:3fe49633eb0cedafabd7ab",
    measurementId: "G-5CSTQVDTJ7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);


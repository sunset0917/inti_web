// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbY27g16MNfp9cafu99Fvcw8kmeB3k6v4",
  authDomain: "inti-e3de3.firebaseapp.com",
  projectId: "inti-e3de3",
  storageBucket: "inti-e3de3.firebasestorage.app",
  messagingSenderId: "59655025158",
  appId: "1:59655025158:web:f10b402bef763dc2064987",
  databaseURL: "https://inti-e3de3-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
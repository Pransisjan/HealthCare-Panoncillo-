import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyDVItiLfoa3BZJCyGdhS8jD6XpvFPYB0Lo",
  authDomain: "care-2931c.firebaseapp.com",
  projectId: "care-2931c",
  storageBucket: "care-2931c.firebasestorage.app",
  messagingSenderId: "297928287237",
  appId: "1:297928287237:web:2f5fc75695df32733ea86c"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app);   
export const storage = getStorage(app);


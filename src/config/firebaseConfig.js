import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDh3DJ6ukBEPJqWnEr5k48X49V-IX_IK0Q", 
  authDomain: "ai-etichs.firebaseapp.com",
   projectId: "ai-etichs",
   storageBucket: "ai-etichs.appspot.com",
   messagingSenderId: "37013663647",
   appId: "1:37013663647:web:3ac3c806341d6a3f5f97aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Storage
const storage = getStorage(app);

export { storage };

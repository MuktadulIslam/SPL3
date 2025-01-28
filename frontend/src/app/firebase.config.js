import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBReJY8G2P0gKg7TdzRymFSpfyNj6ARRFs",
  authDomain: "defectlens-41981.firebaseapp.com",
  projectId: "defectlens-41981",
  storageBucket: "defectlens-41981.firebasestorage.app",
  messagingSenderId: "708572091411",
  appId: "1:708572091411:web:8740abecc7ae25f3a1dbe6"
};
// Initialize Firebase
export const myApp = initializeApp(firebaseConfig);
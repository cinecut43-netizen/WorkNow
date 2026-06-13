import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBGxeFsHBUBsn3ONtUs1YjxPyOc8324SmY",
  authDomain: "worknow-2e1e3.firebaseapp.com",
  projectId: "worknow-2e1e3",
  storageBucket: "worknow-2e1e3.firebasestorage.app",
  messagingSenderId: "653674396714",
  appId: "1:653674396714:web:f12e488692c1141b4b9753",
  measurementId: "G-360DPV8RZ8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.db = db;
window.collection = collection;
window.getDocs = getDocs;
window.addDoc = addDoc;

console.log("Firebase подключен");

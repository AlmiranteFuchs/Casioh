import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAXJXyK6S5L70bp9feMknSsws3Dir2T6TA",
  authDomain: "casioh-cac08.firebaseapp.com",
  projectId: "casioh-cac08",
  storageBucket: "casioh-cac08.appspot.com",
  messagingSenderId: "445834787275",
  appId: "1:445834787275:web:679db1c4d21aaf3a4b1e4e"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };

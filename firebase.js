import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBABFWlm-RCUlZjYLLjVN_pxicZM0FdgPs",
  authDomain: "projetreactnative-78f7e.firebaseapp.com",
  projectId: "projetreactnative-78f7e",
  storageBucket: "projetreactnative-78f7e.firebasestorage.app",
  messagingSenderId: "1041957330751",
  appId: "1:1041957330751:web:415131c95d0071be11bd8a",
  measurementId: "G-M0L03HRJB8"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export default app;


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6nKFuHu6lVoHEgiRqKH3rWhJZFn0McgI",
  authDomain: "acomodoro-29361.firebaseapp.com",
  projectId: "acomodoro-29361",
  storageBucket: "acomodoro-29361.appspot.com",
  messagingSenderId: "841270568251",
  appId: "1:841270568251:web:be6d27dccd857f59bac31e",
  measurementId: "G-87G5TTZ4JZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
})
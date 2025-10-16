import { Platform } from 'react-native';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDc_nx0Kiwkr4o-uMa2qH7ylgTOTOw5gi0',
  authDomain: 'chat-app-ff38f.firebaseapp.com',
  projectId: 'chat-app-ff38f',
  storageBucket: 'chat-app-ff38f.firebasestorage.app',
  messagingSenderId: '64032007449',
  appId: '1:64032007449:web:40fc34d22fc0fd85e8d188',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { app, db, auth };

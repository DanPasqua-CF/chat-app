import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, Platform } from 'react-native';
import { getApp, getApps, initializeApp } from "firebase/app";
import { disableNetwork, enableNetwork, getFirestore } from "firebase/firestore";
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';
import { useNetInfo } from '@react-native-community/netinfo';

/* Screen imports */
import Start from './components/Start';
import Chat from './components/Chat';
import { useEffect } from 'react';

const firebaseConfig = {
    apiKey: 'AIzaSyDc_nx0Kiwkr4o-uMa2qH7ylgTOTOw5gi0',
    authDomain: 'chat-app-ff38f.firebaseapp.com',
    projectId: 'chat-app-ff38f',
    storageBucket: 'chat-app-ff38f.firebasestorage.app',
    messagingSenderId: '64032007449',
    appId: '1:64032007449:web:40fc34d22fc0fd85e8d188',
};

/* Initialize Firebase */
let app;
let db;
let auth;

// Check if Firebase is already initialized
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Initialize Firestore
db = getFirestore(app);
const storage = getStorage(app);
const netInfo = useNetInfo(app);

useEffect(() => {
  if (connectionStatus.isConnected === false) {
    Alert.alert("Connection Lost!");
    disableNetwork(db);
  } else if (connectionStatus.isConnected === true) {
    enableNetwork(db);
  }
}, [connectionStatus.isConnected]);

// Initialize Firebase Authentication with AsyncStorage persistence
if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {
  // For React Native, use initializeAuth with AsyncStorage
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch (error) {
    // If already initialized, just get it
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else {
      console.error("Auth initialization error:", error);
    }
  }
}

/* Create the navigator */
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start'>
          
          {/* Start screen */}
          <Stack.Screen name='Start'>
            {(props) => <Start auth={auth} {...props} />}
          </Stack.Screen>
          
          {/* Chat screen */}
          <Stack.Screen name='Chat'>
            {(props) => <Chat db={db} storage={storage} isConnected={netInfo.isConnected} {...props} />}
          </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style='auto' />
    </SafeAreaProvider>
  );
}

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Platform, Alert, View } from 'react-native';
import { useEffect } from 'react';
import { getApp, getApps, initializeApp } from "firebase/app";
import { disableNetwork, enableNetwork, getFirestore } from "firebase/firestore";
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';
import { useNetInfo } from '@react-native-community/netinfo';

/* Screen imports */
import Start from './components/Start';
import Chat from './components/Chat';

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

function AppContent() {
  const netInfo = useNetInfo();
  
  // Default to true if netInfo is not yet available
  const isConnected = netInfo.isConnected ?? true;

  useEffect(() => {
    if (netInfo.isConnected === false) {
      Alert.alert("Connection lost");
      disableNetwork(db);
    } else if (netInfo.isConnected === true) {
      enableNetwork(db);
    }
  }, [netInfo.isConnected]);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start'>
          <Stack.Screen name='Start'>
            {(props) => <Start auth={auth} {...props} />}
          </Stack.Screen>
          
          <Stack.Screen name='Chat'>
            {(props) => <Chat db={db} storage={storage} isConnected={isConnected} {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style='auto' />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <AppContent />
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
}

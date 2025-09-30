import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/* Create the navigator */
const Stack = createNativeStackNavigator();

/* Screen imports */
import Start from './components/Start';
import Chat from './components/Chat';

export default function App() {
  const firebaseConfig = {
    apiKey: 'AIzaSyDc_nx0Kiwkr4o-uMa2qH7ylgTOTOw5gi0',
    authDomain: 'chat-app-ff38f.firebaseapp.com',
    projectId: 'chat-app-ff38f',
    storageBucket: 'chat-app-ff38f.firebasestorage.app',
    messagingSenderId: '64032007449',
    appId: '1:64032007449:web:40fc34d22fc0fd85e8d188',
  };

  /* Initialize Firebase */
  const app = initializeApp(firebaseConfig);

  /* Initialize Cloud Firestore and get a reference to the service */
  const db = getFirestore(app);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start'>
          {/* Start screen */}
          <Stack.Screen
            name='Start'
            component={Start}
          />
          
          {/* Chat screen */}
          <Stack.Screen
            name='Chat'
          >
            {props => <Chat db={db} {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style='auto' />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

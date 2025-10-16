import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/* Screen imports */
import Start from './components/Start';
import Chat from './components/Chat';

/* Import Firestore */
import { db } from './firebase';

/* Create the navigator */
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Start'>
          {/* Start screen */}
          <Stack.Screen name='Start' component={Start} />
          
          {/* Chat screen */}
          <Stack.Screen name='Chat'>
            {props => <Chat db={db} {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style='auto' />
    </SafeAreaProvider>
  );
}

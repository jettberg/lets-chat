import "react-native-gesture-handler";
import React, { useEffect } from "react";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, disableNetwork, enableNetwork } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNetInfo } from "@react-native-community/netinfo";
import { Alert } from "react-native";
import { getStorage } from "firebase/storage";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";


const Stack = createNativeStackNavigator();

const App = () => {

  const firebaseConfig = {
    apiKey: "AIzaSyBlTEHi98xp-yFket14fB2AftPNuxKTiWA",
    authDomain: "lets-chat-c0638.firebaseapp.com",
    projectId: "lets-chat-c0638",
    storageBucket: "lets-chat-c0638.firebasestorage.app",
    messagingSenderId: "640077967893",
    appId: "1:640077967893:web:6db0b957b0a6224a97d41c"
  };
  // Initialize Firebase (only do this once, here at the root of the app)
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  const storage = getStorage(app);

  try {
    initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (e) {
    // ignore "already initialized" errors during Fast Refresh
  }

  // NetInfo: real-time connection status
  const connectionStatus = useNetInfo();

  // Enable/disable Firestore network based on connection
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection Lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ActionSheetProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Start">
            <Stack.Screen name="Start" component={Start} options={{ title: "Start" }} />
            <Stack.Screen name="Chat">
              {(props) => (
                <Chat
                  db={db}
                  storage={storage}
                  isConnected={connectionStatus.isConnected}
                  {...props}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
};

export default App;
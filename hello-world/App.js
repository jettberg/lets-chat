// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, View, Text, TextInput, Button, Alert, ScrollView } from "react-native";
import { useState } from 'react';
import React from "react";
import Start from "./components/Start";
import Chat from "./components/Chat";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ title: "Start" }}
        />
        <Stack.Screen name="Chat" component={Chat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
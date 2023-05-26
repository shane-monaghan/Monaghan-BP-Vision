import * as React from 'react';
import HomeScreen from './app/screens/HomeScreen';
import CameraScreen from './app/screens/CameraScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
        <Stack.Screen
          name = "Home"
          component = {HomeScreen}
        />
        <Stack.Screen
          name = "Camera"
          component = {CameraScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
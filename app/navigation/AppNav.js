import {View, Text, ActivityIndicator} from 'react-native'
import React, {useContext} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import TestScreen from '../screens/TestScreen';
import ImageTestScreen from '../screens/ImageTestScreen';
import GenericImageTestScreen from '../screens/GenericImageTestScreen';
import SevenPhotoScreen from '../screens/SevenPhotoScreen';
import CameraScreen2 from '../screens/CameraScreen2';
import PicturePreview from '../screens/PicturePreviewScreen';
import VideoScreen from '../screens/VideoScreen';
// import VideoPreview from '../screens/VideoPreviewScreen';
import PhotoVideoPreview from '../screens/PhotoVideoPreviewScreen';
import LoginScreen from '../screens/LoginScreen';
import DataScreen from '../screens/DataScreen';
import SavedSessionsScreen from '../screens/SavedSessionsScreen';
import SavedDatesScreen from '../screens/SavedDatesScreen';
import DataScreen2 from '../screens/DataScreen2';
import { ProcessedImagesProvider } from './CreateContext';

import { AuthContext } from '../context/AuthContext';
import HomeScreen2 from '../screens/HomeScreen2';
import SessionMenu from '../screens/SessionMenu';
import PicturePreview2 from '../screens/PicturePreviewScreen2';
import PhotoVideoPreview2 from '../screens/PhotoVideoPreviewScreen2';
import CameraScreen3 from '../screens/CameraScreen3';
import VideoScreen2 from '../screens/VideoScreen2';
import DataScreen3 from '../screens/DataScreen3';
import FinalHomeScreen from '../screens/FinalHomeScreen';
import FinalPatientInfoScreen from '../screens/FinalPatientInfoScreen';



const Stack = createNativeStackNavigator();

const AppNav = () => {
    const{isLoading, userToken} = useContext(AuthContext);

    if (isLoading){
        return(
            <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size={'large'}/>
            </View>
        )
    }
    return (
        <ProcessedImagesProvider>
            <NavigationContainer>
                {/* {userToken !== null ?  */}
                <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                    {/* FINISHED */}
                    <Stack.Screen name="Home" component={HomeScreen2} />
                    {/* FINISHED */}
                    <Stack.Screen name="PatientInfo" component={FinalPatientInfoScreen} />

                    <Stack.Screen name="SevenPhoto" component={SessionMenu} />
                    {/* FINISHED */}
                    <Stack.Screen name="Camera2" component={CameraScreen3} />
                    {/* FINISHED */}
                    <Stack.Screen name="PicturePreview" component={PicturePreview2} />
                    {/* FINISHED */}
                    <Stack.Screen name="VideoScreen" component={VideoScreen2} />
                    {/* FINISHED */}
                    <Stack.Screen name="PhotoVideoPreview" component={PhotoVideoPreview2} />

                    <Stack.Screen name="DataScreen" component={DataScreen3} />
                    <Stack.Screen name="SavedSessions" component={SavedSessionsScreen} />
                    <Stack.Screen name="SavedDates" component={SavedDatesScreen} />
                    <Stack.Screen name="DataScreen2" component={DataScreen2} />
                </Stack.Navigator> 
                {/* :

                //Set initial route to "Login" to use login screen
                    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    </Stack.Navigator>} */}
            </NavigationContainer>
        </ProcessedImagesProvider>
    )
}

export default AppNav;
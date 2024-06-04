import {React, useEffect, useState, useContext} from 'react';
import {StyleSheet, View, Image } from 'react-native';
import Button from '../../components/Button';
import { StatusBar } from 'expo-status-bar';
// import ImageViewer from '../../components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


// const logo = require('../assets/images/BP_logo.png')
const logo = require('../assets/images/eyeball.webp')

function HomeScreen({navigation}) {
    const {logout} = useContext(AuthContext);
    const route = useRoute();
    //const isFocused = useIsFocused();
    const [selectedImage, setSelectedImage] = useState(null);

    //When picture is sent from cameraScreen, update in HomeScreen
    useEffect(() =>{
      if(route.params && route.params.selectedImage){
        setSelectedImage(route.params.selectedImage);
      }
    }, [route.params]);

    //Bring up media library to choose picture
    const pickImageAsync = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });

    
        //If a picture is not selected, let the user know
        if (!result.canceled){
          setSelectedImage(result.assets[0].uri);
        } else {
          alert('You did not select an image');
        }
        };

    //Navigate to CameraScreen
    // function toCamera(){
    //   navigation.navigate('Camera', {setSelectedImage: setSelectedImage});
    // }

    // //Navigate to TestScreen
    // function toTest(){
    //   navigation.navigate('Test')
    // }

    // //Navigate to Image Test Screen
    // function toITScreen() {
    //   navigation.navigate('ITScreen', { selectedImage: { uri: selectedImage } });
    // } 


    function toSavedSessions(){
      navigation.navigate('SavedSessions')
    }

    //Navigate to Seven Photo Screen
    function toSPS(){
      navigation.navigate('SevenPhoto')
    }

    
    //HomeScreen Components
    return(
        <View style={styles.container}>
        <View style = {styles.imageContainer}>
          {/* <ImageViewer placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
          /> */}
          <Image resizeMode='cover' source={logo}/>
        </View>
        <View style = {styles.footerContainer}>
          <Button theme = "toCameraScreen" label = "Start a new session" onPress={(toSPS)} />
          <Button theme = "toGallery" label="View previous sessions" onPress={toSavedSessions} />
          {/* <Button label="Use default image" onPress = {() => setSelectedImage(null)} /> */}
          {/* <Button label="Test Page" onPress={(toTest)}/> */}
          {/* <Button label="To Image Test Screen" onPress={toITScreen}/> */}
          {/* <Button label="To Seven Photos" onPress={toSPS}/> */}
          {/* <Button label = "Logout" onPress = {()=> {logout()}}/> */}
        </View>
        <StatusBar style="auto" />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 2,
      backgroundColor: 'gray',
      alignItems: 'center',
    },
    imageContainer: {
      flex: 1,
      paddingTop: 100,
      left: -20,
      position: 'relative',
    },
    footerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    image: {
      width: 200,
      height: 200
    },
});
export default HomeScreen;
import {React, useEffect, useState, useContext} from 'react';
import {Text, ImageBackground, StyleSheet, View, Image } from 'react-native';
import Button from '../../components/Button';
import { StatusBar } from 'expo-status-bar';
// import ImageViewer from '../../components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';


// const logo = require('../assets/images/BP_logo.png')
const logo = require('../assets/images/eyeball.webp')
const backgroundImage = require('../assets/images/homeScreenBG.jpg')

function HomeScreen2({navigation}) {
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

    function toSavedSessions(){
      navigation.navigate('SavedSessions')
    }

    //Navigate to Seven Photo Screen
    function toSPS(){
      navigation.navigate('SevenPhoto')
    }

    return (
        <View style={styles.container}>
            <ImageBackground source={backgroundImage} resizeMode='cover' style={styles.image} blurRadius={10}>
                <View style={styles.overlay}>
                    <View style={styles.container}>
                        <Text style={[styles.text, styles.title]}>
                            <Text style={styles.bp}>BP</Text> VISION
                        </Text>
                        <Image source={logo} style={[styles.eyeball]}></Image>
                        <View style={styles.buttonContainer}>
                            <Button style={styles.newSession} theme = "toCameraScreen" label = "START A NEW SESSION" onPress={(toSPS)} />
                            <Button theme = "toGallery" label="VIEW PREVIOUS SESSIONS" onPress={toSavedSessions} />
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    overlay: {
        flex:1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    image: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    eyeball: {
        width: 200,
        height: 200,
        position: 'absolute',
        top: '27.5%',
        left: '25%'
        
    },
    buttonContainer: {
        position: 'absolute', 
        top: '15%', 
        left: 0, 
        right: 0, 
        bottom: 0, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    text: {
        flex: 1,
        justifyContent: 'center',
        alignContent:'center',
        fontFamily: 'Arial',
    },
    title: {
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'top',
        paddingTop: "35%",
        fontSize: 65,
        fontWeight: 'bold'
    },
    bp: {
        color: '#33ADF0'
    }
})
export default HomeScreen2;
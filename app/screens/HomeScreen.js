import {React, useEffect, useState} from 'react';
import {StyleSheet, View } from 'react-native';
import Button from '../../components/Button';
import { StatusBar } from 'expo-status-bar';
import ImageViewer from '../../components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';


const PlaceholderImage = require('../assets/images/background-image.png')

function HomeScreen({navigation}) {
    const route = useRoute();
    const isFocused = useIsFocused();
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() =>{
      if(isFocused && route.params && route.params.selectedImage){
        setSelectedImage(route.params.selectedImage);
      }
    }, [isFocused, route.params]);

    const pickImageAsync = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });

    
        if (!result.canceled){
          setSelectedImage(result.assets[0].uri);
        } else {
          alert('You did not select an image');
        }
        };

    //Switch to CameraScreen
    function toCamera(){
      navigation.navigate('Camera', {setSelectedImage: setSelectedImage});
    }


    const sendImage = async() => {
      const flaskURL = 'http://134.82.182.163:5000/'
      if (selectedImage){
        try{
            const response = await axios.post(flaskURL ,{
            selectedImage: selectedImage
          });
          setSelectedImage(response.data)
        }catch(error){
          console.log('Error sending image: ', error);
        }
      } else{
        alert('No image selected');
      }
    };
    //HomeScreen Components
    return(
        <View style={styles.container}>
        <View style = {styles.imageContainer}>
          <ImageViewer placeholderImageSource={PlaceholderImage}
          selectedImage={selectedImage}
          />
        </View>
        <View style = {styles.footerContainer}>
          <Button theme = "toCameraScreen" label = "Take a photo" onPress={(toCamera)} />
          <Button theme = "toGallery" label="Choose a photo" onPress={pickImageAsync} />
          <Button label="Use default image" onPress = {() => setSelectedImage(null)} />
          <Button label="Use this image" onPress={sendImage}/>
        </View>
        <StatusBar style="auto" />
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 3,
      backgroundColor: 'gray',
      alignItems: 'center',
    },
    imageContainer: {
      flex: 2,
      paddingTop: 100,
    },
    footerContainer: {
      flex: 1,
      alignItems: 'center',
    },
});
export default HomeScreen;
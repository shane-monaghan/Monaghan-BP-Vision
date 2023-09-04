import React, { useState } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import axios from 'axios';
import Button from '../../components/Button';
import * as FileSystem from 'expo-file-system';
import { Crypt, RSA } from 'hybrid-crypto-js';




function ImageTestScreen({ navigation, route }) {
  const { selectedImage } = route.params;
  const flaskURL = 'http://134.82.182.163:5000/';
  const [photo, setPhoto] = useState(null);
  const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);

  const crypt = new Crypt();
  const rsa = new RSA();


  const BWImage = async () => {
    try {
      const imageURI = selectedImage.uri; // Original URI of selected image
      const imageBase64 = await FileSystem.readAsStringAsync(imageURI, {
        encoding: FileSystem.EncodingType.Base64,
      }); // Read the selected image file as a base64-encoded string

      //Paste Here

  
      const response = await axios.post(flaskURL + 'grayscale', {
        encoded_image: imageBase64,
      }); // Send the base64-encoded image to the server for grayscale conversion
      base64_image = response.data.base64_image;
      setPhoto(base64_image);
      setIsBlackAndWhite(true);
    } catch (error) {
      console.log('Error sending image', error);
    }
  };

  const plotPoints = async() => {
    try{
      const imageURI = selectedImage.uri;
      const imageBase64 = await FileSystem.readAsStringAsync(imageURI, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await axios.post(flaskURL + 'plotPoints', {
        encoded_image: imageBase64,
      });
      base64_image = response.data.base64_image;
      setPhoto(base64_image);
      setIsBlackAndWhite(true);
    } catch (error) {
      console.log('Error sending image: ', error);
    }
  }
  
  const toColor = () => {
    setPhoto(null); // Clear the black and white photo
    setIsBlackAndWhite(false); // Update the state to indicate that color photo is shown
  };
  


  function toHome() {
    navigation.navigate('Home');
  }

  function toGenericTest(){
    navigation.navigate("genericImageTest")
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Conditionally render black and white or color photo */}
        {!isBlackAndWhite && selectedImage && <Image source={{ uri: selectedImage.uri }} style={styles.image} />}
        {isBlackAndWhite && photo && ( <Image source={{uri: `data:image/jpeg;base64,${photo}`}}style={styles.image} />)}
      </View>
      <View style={styles.midContainer}>
        {!isBlackAndWhite && <Button label="To Black and White" onPress={plotPoints} />}
        {isBlackAndWhite && <Button label= "To Color" onPress = {toColor}/>}
      </View>
      <View style={styles.footerContainer}>
        <Button label = "To Generic Image Test Screen" onPress={toGenericTest}/>
        <Button label ="To Num/Text Test Screen" onPress = {()=> navigation.navigate("Test")}/>
        <Button theme="home" onPress={toHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  midContainer: {
    marginTop: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  footerContainer: {
    alignContent: 'center',
  },
  imageContainer: {
    alignContent: 'center',
    alignSelf:'center',
  },
  image: {
    width: 400,
    height: 500,
    borderColor: 'black',
    borderWidth:4,
    borderRadius:20,
  },
});

export default ImageTestScreen;
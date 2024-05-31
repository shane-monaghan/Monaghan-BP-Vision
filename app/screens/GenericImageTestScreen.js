import React, { useState } from 'react';
import { StyleSheet, View, Image} from 'react-native';
import axios from 'axios';
import ImageViewer from '../../components/ImageViewer';
import Button from '../../components/Button';
import base64 from 'base-64';
import utf8 from 'utf8'

const PlaceholderImage = require('../assets/images/colorful_picture.jpg')

function GenericImageTestScreen({ navigation}) {
  // const flaskURL = 'http://134.82.182.163:5000/';
  const flaskURL = 'http://134.82.187.57:5000/';
  const [photo, setPhoto] = useState(null);


  function toHome() {
    navigation.navigate('Home');
  }

  const BWImage = async () =>{
    const response = await axios.post(flaskURL + 'generic_grayscale',{
        path: 'C:/Users/nwjoh/testing1/app/assets/images/colorful_picture.jpg',
      });
      base64_image = response.data.base64_image
      setPhoto(base64_image)
      console.log("Successfully converted to black and white");
  }

  const toColor = async () => {
    setPhoto(null)
    console.log("Successfully converted back to color")
  }


  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
      {photo ? (
          <Image style={styles.image} source={{ uri: `data:image/jpeg;base64,${photo}` }} />
        ) : (
          <Image style={styles.image} source={PlaceholderImage} />
        )}
      </View>
      <View style={styles.midContainer}>
        <Button label="To Black and White" onPress={BWImage} />
        <Button label="To Color" onPress={toColor}/>
      </View>
      <View style={styles.footerContainer}>
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
    marginBottom: 75,
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

export default GenericImageTestScreen;

import React, {useState} from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Button from '../../components/Button';

const noPic = require('../assets/images/noImageUploaded.png');

function PicturePreview({ navigation, route }) {
    const {pictures} = route.params;
    const [index, setIndex] = useState(0);
    const pictureTitles = [
        'Face at Rest',
        'Eyes Closed Gently',
        'Eyes Closed Forefully',
        'Eyebrows Elevated',
        'Nose Wrinkled',
        'Pursed Lips',
        'Big Smile',
    ]

  const downOne = () => {
    setIndex(index -1);
  };

  const upOne = () => {
    setIndex(index +1);
  };

  const goBack = () => {
    navigation.goBack();
  }

  if (index == 0){
    return (
        <View style={styles.container}>
          {pictures[index] ? (
          <Image style={styles.image} resizeMode='contain' source={{ uri: pictures[index] }} />
        ) : (
          <Image style={styles.image} resizeMode='contain' source={noPic} />
        )}
          <View style={styles.buttonContainer}>
            <Button theme = "right-arrow" onPress={upOne} />
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.text}>
                {pictureTitles[index]}
            </Text>
            <Button theme = "backButton" onPress={goBack}/>
          </View>
        </View>
      );
  }
  else if (index > 0 && index < 6){
    return (
        <View style={styles.container}>
          {pictures[index] ? (
          <Image style={styles.image} resizeMode='contain' source={{ uri: pictures[index] }} />
        ) : (
          <Image style={styles.image} resizeMode='contain' source={noPic} />
        )}
          <View style={styles.buttonContainer}>
            <Button theme="left-arrow" onPress={downOne} />
            <Button theme = "right-arrow" onPress={upOne} />
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.text}>
                {pictureTitles[index]}
            </Text>
            <Button theme = "backButton" onPress={goBack}/>
          </View>
        </View>
      );
  }

  else{
    return (
        <View style={styles.container}>
          {pictures[index] ? (
          <Image style={styles.image} resizeMode='contain' source={{ uri: pictures[index] }} />
        ) : (
          <Image style={styles.image} resizeMode='contain' source={noPic} />
        )}
          <View style={styles.buttonContainer}>
            <Button theme="left-arrow" onPress={downOne} />
          </View>
          <View style={styles.bottomRow}>
            <Text style={styles.text}>
                {pictureTitles[index]}
            </Text>
            <Button theme = "backButton" onPress={goBack}/>
          </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  image: {
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 15,
    width: 300,
    height: 600,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 40,
    width: 450,
    alignContent: 'center',
    justifyContent: 'space-evenly',
  },
  bottomRow:{
    width: 350,
    justifyContent: 'space-evenly',
    alignContent: 'center',
  },
  text:{
    fontSize: 30,
  }
});

export default PicturePreview;

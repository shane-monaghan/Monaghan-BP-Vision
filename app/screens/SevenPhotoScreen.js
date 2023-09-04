
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert, TextInput } from 'react-native';
import Button from '../../components/Button';
import * as ImagePicker from 'expo-image-picker';

function SevenPhotoScreen({ navigation }) {
  const [boxStates, setBoxStates] = useState([false, false, false, false, false, false, false]);
  const customTexts = [
    'Picture 1: Face at Rest',
    'Picture 2: Eyes Closed Gently',
    'Picture 3: Eyes Closed Forcefully',
    'Picture 4: Eyebrow Elevated',
    'Picture 5: Wrinkling of the Nose',
    'Picture 6: Pursed Lips',
    'Picture 7: Big Smile',
  ];
  const [pictures, setPictures] = useState([null, null, null, null, null, null, null]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const toggleBox = (index) => {
    const updatedBoxStates = [...boxStates];
    updatedBoxStates[index] = !updatedBoxStates[index];
    setBoxStates(updatedBoxStates);
  };

  function toHome() {
    navigation.navigate('Home');
  }

  const pickImageAsync = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    //If a picture is not selected, let the user know
    if (!result.cancelled) {
      const updatedPictures = [...pictures];
      updatedPictures[index] = result.assets[0].uri;
      setPictures(updatedPictures);
    } else {
      alert('You did not select an image');
    }
  };

  const toggleBoxAndNavigate = (index) => {
    Alert.alert(
      'Option',
      'Would you like to take a new picture or upload from your camera roll',
      [
        {
          text: 'Take Photo',
          onPress: () => {
            navigation.navigate('Camera2', { index, customText: customTexts[index], setPictures: setPictures, pictures: pictures });
          },
        },
        {
          text: 'Upload Photo',
          onPress: () => {
            pickImageAsync(index);
          },
        },
        // {
        //   text: 'Database?',
        //   onPress: () => {
        //     alert('DB button Pressed');
        //   },
        // },
      ]
    );
    const updatedBoxStates = [...boxStates];
    updatedBoxStates[index] = true;
    setBoxStates(updatedBoxStates);
  };

  const toPreview = (pictures) => {
    navigation.navigate('PicturePreview', { pictures: pictures });
  };

  const toVideo = (pictures) => {
    navigation.navigate('VideoScreen', { pictures: pictures, name: name, date: date });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Date"
        value={date}
        onChangeText={(text) => setDate(text)}
      />
      <View style={styles.contentContainer}>
        {boxStates.map((isChecked, index) => (
          <View key={index} style={styles.boxContainer}>
            <TouchableOpacity
              style={[styles.box, isChecked ? styles.checkedBox : null]}
              onPress={() => toggleBox(index)}
            />
            <TouchableOpacity style={styles.textButtonContainer} onPress={() => toggleBoxAndNavigate(index)}>
              <Text style={styles.textButton}>{customTexts[index]}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <View style={styles.bottomContainer}>
        <Button theme={'home'} onPress={toHome} />
        <Button theme={'checkbox'} onPress={() => toVideo(pictures)} />
        <Button theme="preview" onPress={() => toPreview(pictures)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 45,
    paddingLeft: 45,
    backgroundColor: 'gray',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  boxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: 20,
    marginBottom: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 45,
    width: '100%',
  },
  box: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  checkedBox: {
    backgroundColor: 'green',
  },
  textButton: {
    marginLeft: 10,
    fontSize: 20,
  },
  textInput: {
    width: 300,
    borderColor: 'black',
    height: 50,
    borderWidth: 3,
    borderRadius: 12,
    marginTop: 20,
    backgroundColor: 'white',
  },
});

export default SevenPhotoScreen;

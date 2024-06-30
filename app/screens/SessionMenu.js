import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert, TextInput } from 'react-native';
import Button from '../../components/Button';
import * as ImagePicker from 'expo-image-picker';
import { Header } from 'react-native/Libraries/NewAppScreen';

function SessionMenu({ navigation, route }) {
  const [boxStates, setBoxStates] = useState([false, false, false, false, false, false, false, false]);
  const customTexts = [
    'Face at Rest',
    'Eyes Closed Gently',
    'Eyes Closed Forcefully',
    'Eyebrow Elevated',
    'Wrinkling of the Nose',
    'Pursed Lips',
    'Big Smile',
    'Video',
  ];
  const [pictures, setPictures] = useState([null, null, null, null, null, null, null]);
  const [video, setVideo] = useState(undefined)
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

  const toPhotoVideoPreview = () => {
    navigation.navigate('PhotoVideoPreview', {
      videoUri: route.params ? route.params.videoUri : undefined,
      pictures: route.params.pictures,
      name: route.params.name,
      date: route.params.date,
    });
  };

  const pickImageAsync = async (index) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    //If a picture is not selected, let the user know
    if (result.assets) {
      const updatedPictures = [...pictures];
      updatedPictures[index] = result.assets[0].uri;
      setPictures(updatedPictures);
    } else {
      Alert.alert('Alert', 'You did not select an image',
      [
        {
          text: 'Acknowledge',
          onPress: () => {
            console.log('Acknowledged')
          }
        }
      ]
      );
      
    }
  };

  const toggleBoxAndNavigate = (index) => {
    if (index >= 0 && index < 7) {
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
        ]
      );
    }
    else {
      Alert.alert('Option', 'Would you like to record a new video?',
        [
          {
            text: 'Take Video',
            onPress: () => {
              toVideo(pictures)
            }
          },
          {
            text: 'Cancel',
            onPress: () => {
              console.log("Video Cancelled")
            }
          }
        ]
      );
    }
    
    const updatedBoxStates = [...boxStates];
    updatedBoxStates[index] = true;
    setBoxStates(updatedBoxStates);
  };

  const toPreview = (pictures) => {
    navigation.navigate('PicturePreview', { pictures: pictures });
  };

  const toVideo = (pictures) => {
    navigation.navigate('VideoScreen', { pictures: pictures, name: name, date: date, setVideo: setVideo, video: video });
  };

  return (
    <View style={styles.container}>
        <View>
            <Text style={[styles.text, styles.header]}>Session Menu</Text>
        </View>
        <View style={styles.line}></View>
        <View>
            <Text style={[styles.text, styles.subheader]}>Patient Name:</Text>
            <TextInput 
            style={styles.textInput} 
            placeholder='Patient Name...' 
            value={name} 
            onChangeText={(text) => setName(text)}
            />
            <Text style={[styles.text, styles.subheader]}>Session Date:</Text>
            <TextInput 
            style={styles.textInput} 
            placeholder="Today's Date..." 
            value={date} 
            onChangeText={(text) => setDate(text)}
            />
            <Text style={[styles.text, styles.subheader, styles.pictureHead]}>Content:</Text>
        </View>
        <View style={styles.contentContainer}>
            {boxStates.map((isChecked, index) => (
            <View key={index} style={styles.boxContainer}>
                <TouchableOpacity style={styles.textButtonContainer} onPress={() => toggleBoxAndNavigate(index)}>
                <Text style={styles.textButton}>{customTexts[index]}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={[styles.box, isChecked ? styles.checkedBox : null]}
                onPress={() => toggleBoxAndNavigate(index)}
                />
            </View>
            ))}
        </View>
        <View style={styles.recordVideoContainer}>
            {/*<Button theme={'recordVideo'} label="RECORD VIDEO" onPress={() => toVideo(pictures)} />*/}
            <Button theme="previewButton" label="PREVIEW" onPress={toPhotoVideoPreview} />
            <Button theme={'homeButton'} label="RETURN HOME" onPress={toHome} />
        </View>
    </View>
  );
}

styles = StyleSheet.create({
    container: {
        flex: 1
    },
    text: {
        fontFamily: 'Arial',
        color: '#00419D'
    },
    header: {
        fontWeight: 'bold',
        fontSize: '30%',
        paddingTop: '12.5%',
        paddingBottom: '2%',
        textAlign: 'center',
    },
    subheader: {
        fontWeight: 'bold',
        fontSize: '22.5%',
        paddingTop: '2.5%',
        paddingBottom: '2.5%',
        paddingLeft: '10%'
    },
    pictureHead: {
        paddingTop: '10%'
    },
    line: {
        borderBottomColor: '#00419D',
        borderBottomWidth: '3%'
    },
    checkBoxLine: {
        position: 'absolute',
        bottom: 0,
        borderBottomColor: '#00419D',
        borderBottomWidth: '3%'
    },
    textInput: {
        width: '90%',
        borderColor: '#00419D',
        borderWidth: '2%',
        borderRadius: 6,
        height: '10%', 
        color: '#00419D',
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    contentContainer: {
        position: 'absolute',
        top: 0,
        flexGrow: 1,
        paddingBottom: 120,
    },
    boxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        top: '130%',
        left: '4.5%',
        marginBottom: 20,
    },
    box: {
        position: 'absolute',
        left: '121%',
        width: '10%',
        height: '90%',
        borderWidth: 1,
        borderColor: '#00419D',
        backgroundColor: 'white',
        borderRadius: 6,
    },
    checkedBox: {
        backgroundColor: '#00419D',
    },
    textButton: {
        paddingLeft: '10%',
        fontSize: '22.5%',
        color: '#00419D'
    },
    recordVideoContainer: {
        positon: 'absolute',
        top: '30%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    previewButtonContainer: {
        position: 'absolute',
        top: '75%',
        
    }
});

export default SessionMenu;
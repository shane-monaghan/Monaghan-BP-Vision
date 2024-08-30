import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert, TextInput } from 'react-native';
import Button from '../../components/Button';
import * as ImagePicker from 'expo-image-picker';
import { Header } from 'react-native/Libraries/NewAppScreen';
import { useProcessedImages } from '../navigation/CreateContext';
import * as FileSystem from 'expo-file-system';
import Task from '../../components/Task';
import axios from 'axios';

function SessionMenu({ navigation, route }) {
  const flaskURL = 'http://134.82.187.57:5000/';
  const { processedImages, setProcessedImages } = useProcessedImages();
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
  const [showPatientInfo, setShowPatientInfo] = useState(1);
  const [video, setVideo] = useState(undefined)
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const toggleBox = (index) => {
    const updatedBoxStates = [...boxStates];
    updatedBoxStates[index] = !updatedBoxStates[index];
    setBoxStates(updatedBoxStates);
  };

  function toHome() {
    console.log(showPatientInfo);
    navigation.navigate('Home');
  }

  const toPhotoVideoPreview = () => {
    console.log(pictures)
    navigation.navigate('PhotoVideoPreview', {
      videoUri: route.params ? route.params.videoUri : undefined,
      pictures: route.params ? route.params.pictures : pictures,
      name: route.params ? route.params.name : "",
      date: route.params ? route.params.date : "",
    });
  };

  const plotImage = async (uri, index) => {
    try {
      const imageURI = uri; // Original URI of selected image
      const imageBase64 = await FileSystem.readAsStringAsync(imageURI, {
        encoding: FileSystem.EncodingType.Base64,
      }); // Read the selected image file as a base64-encoded string

      // Paste Here

      const response = await axios.post(flaskURL + 'plotPoints', {
        encoded_image: imageBase64,
      }); // Send the base64-encoded image to the server for grayscale conversion
      const base64_image = response.data.base64_image;
      // setBWPictures(prevState => [...prevState.slice(0, index), base64_image, ...prevState.slice(index + 1)]);
      const newProcessedImages = [...processedImages];
      newProcessedImages[index] = [base64_image];
      setProcessedImages(newProcessedImages);
    } catch (error) {
      console.log('Error sending image', error);
    }
    console.log("Finished Image: ", index + 1, "/ 7");
  }

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
      plotImage(updatedPictures[index], index);
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

  const goBack = () => {
    navigation.goBack();
  };

  const goBackMainMenu = () => {
    setProcessedImages([]);
    navigation.goBack();
  };

  const toVideo = (pictures) => {
    navigation.navigate('VideoScreen', { pictures: pictures, name: name, date: date, setVideo: setVideo, video: video });
  };

  if (showPatientInfo == 1) {
    return (
      <View style={styles.view1}>
        <View style={[styles.view2, styles.shadowProp]}>
          <Text style={styles.titleText}>SESSION INFO</Text>
        </View>
        <View style={styles.view3}>
          <View style={styles.view4}>
              <Text marginTop="3%" style={styles.subHeaderText}>Patient Name</Text>
            <TextInput
              style={[styles.view5, styles.shadowProp]}
              placeholder="Patient Name"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </View>
          <View style={styles.view6}>
            <Text style={styles.subHeaderText}>Date</Text>
            <TextInput
              style={[styles.view5, styles.shadowProp]}
              placeholder="Date"
              value={date}
              onChangeText={(date) => setDate(date)}
            />
          </View>
          <View alignItems="center" marginTop="5%">
              <Button theme="newDefaultButton" label="Next" onPress={() => setShowPatientInfo(2)}></Button>
              <Button theme="newDefaultButton" label="Go Back" onPress={goBackMainMenu}></Button>
          </View>
        </View>
      </View>
    );
  }
  else if (showPatientInfo == 2) {
    return (
      <View style={styles.container}>
        <View style={[styles.view2, styles.shadowProp]}>
          <Text style={styles.titleText}>CONTENT</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => toggleBoxAndNavigate(0)}>
            <Task label="Face at Rest" content={pictures[0]}></Task>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleBoxAndNavigate(1)}>
            <Task label="Eyes Closed (G)" content={pictures[1]}></Task>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleBoxAndNavigate(2)}>
            <Task label="Eyes Closed (F)" content={pictures[2]}></Task>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleBoxAndNavigate(3)}>
            <Task label="Eyebrows Elevated" content={pictures[3]}></Task>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleBoxAndNavigate(4)}>
            <Task label="Wrinkling of Nose" content={pictures[4]}></Task>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleBoxAndNavigate(5)}>
            <Task label="Pursed Lips" content={pictures[5]}></Task>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleBoxAndNavigate(6)}>
            <Task label="Big Smile" content={pictures[6]}></Task>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleBoxAndNavigate(7)}>
            <Task label="Video" content={route.params ? route.params.videoUri : null}></Task>
          </TouchableOpacity>
        </View>
        <View alignItems="center" marginTop="60%" flexDirection="row" alignSelf="center">
              <Button theme="newDefaultButton1" label="Go Back" onPress={() => setShowPatientInfo(1)}></Button>
              <Button theme="newDefaultButton1" label="Preview" onPress={toPhotoVideoPreview}></Button>
          </View>
      </View>
      
    );
  }
  else {
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
}

styles = StyleSheet.create({
  view1: {
    backgroundColor: "#ECECEC",
    display: "flex",
    maxWidth: 480,
    width: "100%",
    paddingBottom: 80,
    flexDirection: "column",
    alignItems: "stretch",
    color: "#4437D2",
    height: "100%"
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignContent: "center",
    height: "50%",
    marginTop: "2%"
  },
  view2: {
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#FFF",
    width: "100%",
    paddingTop: "15%",
    alignItems: "center",
    padding: "36px 60px 10px",
    font: "700 25px Verdana, sans-serif ",
  },
  view3: {
    display: "flex",
    marginTop: 36,
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: 20,
    fontWeight: "400",
    padding: "0 29px",
    justifyContent: "space-evenly",
    height: "40%"
  },
  view4: {
    fontFamily: "Verdana, sans-serif",
    alignItems: "center"
  },
  view5: {
    borderRadius: 10,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#FFF",
    marginTop: 16,
    flexShrink: 0,
    height: "26%",
    fontSize: "20%",
    textAlign: 'center',
    width: "80%"   
  },
  view6: {
    fontFamily: "Verdana, sans-serif",
    marginTop: 0,
    alignItems: "center"
  },
  view7: {
    borderRadius: 10,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#FFF",
    marginTop: 0,
    flexShrink: 0,
    height: 41,
  },
  view8: {
    fontFamily: "Verdana, sans-serif",
    borderRadius: 10,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    backgroundColor: "transparent",
    alignSelf: "center",
    marginTop: 57,
    width: 291,
    maxWidth: "100%",
    alignItems: "center",
    color: "#FFF",
    whiteSpace: "nowrap",
    justifyContent: "center",
    padding: "18px 60px",
  },
  titleText: {
    fontFamily: "Verdana, sans-serif",
    fontWeight: "800",
    color: "#4437D2",
    fontSize: "25%",
    marginLeft: 0,
    marginRight: 0,
    alignSelf: "center",
    paddingBottom: "1%"
  },
  subHeaderText: {
    fontFamily: "Verdana, sans-serif",
    alignSelf: "left",
    marginLeft: "5%",
    fontSize: "22.5%",
    fontWeight: "600",
    color: "#4437D2"
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
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
        top: "130%",
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
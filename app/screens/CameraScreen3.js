import { Camera, CameraType, FlashMode, CameraView } from 'expo-camera';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions } from 'react-native';
import Button from '../../components/Button';
import * as MediaLibrary from 'expo-media-library'
// // import * as FaceDetectorConstants from 'expo-face-detector';
import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-image-picker';


const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;


export default function CameraScreen3({navigation, route}) {
  const [type, setType] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  // const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const [detectedFaces, setDetectedFaces] = useState([]);
  const { index, customText } = route.params;

  //Create Camera
  let cameraRef = useRef(null);

  //Switch between front and back camera
  function toggleCameraType() {
    setType(current => (current === 'back' ? 'front' : 'back'));
  }

  //Switch flash on or off
  // function toggleFlash(){
  //   setFlash(
  //     flash === FlashMode.off? FlashMode.on: FlashMode.off
  //   );
  // }
  
  //Takes photo
  let takePhoto = async () => {
    try{
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);

  }
  catch (error){
    console.log('Error taking photo: ', error);
  }
  };

  const transferPhoto = () => {
    const updatedPictures = [...route.params.pictures];
    updatedPictures[index] = photo.uri;
    route.params.setPictures(updatedPictures);
    navigation.goBack();
  }

  //If a photo has been taken, switch from camera taking screen to photo management
  if (photo){
    let savePhoto= () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(()=> {
        setPhoto(undefined);
      })
    };

    return(
      <SafeAreaView style = {styles.container}>
        <Text style={styles.directionsText}>{customText}</Text>
        <Image 
          style = {[styles.preview, {borderWidth: 0, borderColor: "black", borderRadius: 0}]}
          resizeMode = "cover"
          source = {{ uri: "data:image/jpg;base64," + photo.base64}}
          />
          
        <View style = {styles.previewButtonContainer}>
          {mediaLibraryPermission ? <Button theme = "savePhoto" label = "Save Photo" onPress = {savePhoto}/> :undefined}
          {/* <Button aria-label = "To Home Screen" theme = "home" label = "Home" onPress={toHome}/> */}
          <Button theme = "trash" label = "Trash" onPress = {() => setPhoto(undefined)}/>
          <Button theme = "checkbox" onPress={transferPhoto}/>
        </View>
      </SafeAreaView>
    );
  }

  //When a face is detected, add it to the array of detected faces
  // const handleFacesDetected = ({faces}) => {
  //   if (faces.length > 0){
  //     //console.log('Face Detected: ', faces);
  //     setDetectedFaces(faces);  
  //   }
  // };


  //Before photo is taken/ if photo has been deleted or saved, show picture taking screen
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.directionsText}>{customText}</Text>
      <CameraView 
      ref = {cameraRef} 
      style={styles.camera} 
      facing={type} 
      // flashMode = {flash}
      // onFacesDetected = {handleFacesDetected}
      //   FaceDetectorSettings={{
      //     mode: FaceDetectorConstants.FaceDetectorMode.accurate,
      //     detectLandmarks: FaceDetectorConstants.FaceDetectorLandmarks.all,
      //     runClassifications: FaceDetectorConstants.FaceDetectorClassifications.none,
      //     minDetectionInterval: 100,
      //     tracking: true,
      //   }}
      // onCameraReady = {adjustCameraSize}
      >

        {/* Build box around persons face */}
        {/* {detectedFaces.map((face, index) => (
          <React.Fragment key={index}>
            <View 
              style={[styles.faceRectangle, 
                {
                left: face.bounds.origin.x,
                top: face.bounds.origin.y,
                width: face.bounds.size.width,
                height: face.bounds.size.height,
                },
              ]}
            >
            </View>
          </React.Fragment>
        ))} */}

        {/* <View style = {styles.buttonContainer}>
        {type === 'back' ?(
          flash === FlashMode.off ?(
            <Button theme = "flashOff" onPress={toggleFlash}/> 
          ) : (
            <Button theme = "flashOn" onPress={toggleFlash}/>
          )
          ): null}
        </View> */}

        <Image style ={styles.faceImage}
              resizeMode='cover'
              />
        <View style={styles.buttonContainer}>
          <Button theme = "backButton" onPress={() => navigation.goBack()}/>
          <Button theme = "takePic" onPress={takePhoto}/>
          {/* <Button theme = "home" onPress = {toHome}/> */}
          <Button theme = "flipCam" onPress={toggleCameraType}/>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    opacity: 1,
    width: '100%',
    paddingBottom: 25,
    height: windowHeight,
  },
  directionsText:{
    color: 'black',
    fontSize: '30%',
    fontFamily: 'Arial',
    color: 'white',
  },
  camera: {
    flex: 1,
    //width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    opacity: 1
  },
  preview: {
    flex: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    top: '76%',
    width: 450,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.75,
    margin: 30,
    padding: 50,
    alignSelf: 'center',
    justifyContent: 'space-evenly'
  },
  previewButtonContainer: {
    position: 'absolute',
    top: '83.5%',
    width: 450,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.75,
    margin: 30,
    padding: 50,
    alignSelf: 'center',
    justifyContent: 'space-evenly'
  },
  faceRectangle:{
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'red',
  },
  faceImage:{
    alignSelf: 'center',
    alignItems: 'center',
    height: 400,
    width: 400,
  },
});

// export default CameraScreen2;
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';

export default function CameraScreen2({navigation, route}) {
  let cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState();
  const {index, customText} = route.params;

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Text style={styles.text}>Take Picture</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 50,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});



// import { Camera, CameraType, FlashMode } from 'expo-camera';
// import React, { useEffect, useState, useRef } from 'react';
// import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions } from 'react-native';
// import Button from '../../components/Button';
// import * as MediaLibrary from 'expo-media-library'
// // // import * as FaceDetectorConstants from 'expo-face-detector';
// import { useNavigation } from '@react-navigation/native';
// import { useCameraPermissions } from 'expo-image-picker';


// const windowWidth = Dimensions.get('screen').width;
// const windowHeight = Dimensions.get('screen').height;


// function CameraScreen2({navigation, route}) {
//   const [type, setType] = useState(CameraType.back);
//   const [permission, requestPermission] = Camera.useCameraPermissions();
//   const [mediaLibraryPermission, requestMediaLibraryPermission] = useState();
//   const [photo, setPhoto] = useState();
//   const [flash, setFlash] = useState(FlashMode.off);
//   const [detectedFaces, setDetectedFaces] = useState([]);
//   const { index, customText } = route.params;

//   //Create Camera
//   let cameraRef = useRef(null);

//   //Switch between front and back camera
//   function toggleCameraType() {
//     setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
//   }

//   //Switch flash on or off
//   function toggleFlash(){
//     setFlash(
//       flash === FlashMode.off? FlashMode.on: FlashMode.off
//     );
//   }
  
//   //Takes photo
//   let takePhoto = async () => {
//     try{
//     let options = {
//       quality: 1,
//       base64: true,
//       exif: false,
//     };
//     let newPhoto = await cameraRef.current.takePictureAsync(options);
//     setPhoto(newPhoto);

//   }
//   catch (error){
//     console.log('Error taking photo: ', error);
//   }
//   };

//   const transferPhoto = () => {
//     const updatedPictures = [...route.params.pictures];
//     updatedPictures[index] = photo.uri;
//     route.params.setPictures(updatedPictures);
//     navigation.goBack();
//   }

//   //If a photo has been taken, switch from camera taking screen to photo management
//   if (photo){
//     let savePhoto= () => {
//       MediaLibrary.saveToLibraryAsync(photo.uri).then(()=> {
//         setPhoto(undefined);
//       })
//     };

//     return(
//       <SafeAreaView style = {styles.container}>
//         <Image 
//           style = {[styles.preview, {borderWidth: 4, borderColor: "black", borderRadius: 15}]}
//           resizeMode = "cover"
//           source = {{ uri: "data:image/jpg;base64," + photo.base64}}
//           />
          
//         <View style = {styles.previewButtonContainer}>
//           {mediaLibraryPermission ? <Button theme = "savePhoto" label = "Save Photo" onPress = {savePhoto}/> :undefined}
//           {/* <Button aria-label = "To Home Screen" theme = "home" label = "Home" onPress={toHome}/> */}
//           <Button theme = "checkbox" onPress={transferPhoto}/>
//           <Button theme = "trash" label = "Trash" onPress = {() => setPhoto(undefined)}/>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   //When a face is detected, add it to the array of detected faces
//   const handleFacesDetected = ({faces}) => {
//     if (faces.length > 0){
//       //console.log('Face Detected: ', faces);
//       setDetectedFaces(faces);  
//     }
//   };


//   //Before photo is taken/ if photo has been deleted or saved, show picture taking screen
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.directionsText}>{customText}</Text>
//       <Camera 
//       ref = {cameraRef} 
//       style={styles.camera} 
//       type={type} 
//       flashMode = {flash}
//       // onFacesDetected = {handleFacesDetected}
//       //   FaceDetectorSettings={{
//       //     mode: FaceDetectorConstants.FaceDetectorMode.accurate,
//       //     detectLandmarks: FaceDetectorConstants.FaceDetectorLandmarks.all,
//       //     runClassifications: FaceDetectorConstants.FaceDetectorClassifications.none,
//       //     minDetectionInterval: 100,
//       //     tracking: true,
//       //   }}
//         //onCameraReady = {adjustCameraSize}
//         >

//         {/* Build box around persons face */}
//         {/* {detectedFaces.map((face, index) => (
//           <React.Fragment key={index}>
//             <View 
//               style={[styles.faceRectangle, 
//                 {
//                 left: face.bounds.origin.x,
//                 top: face.bounds.origin.y,
//                 width: face.bounds.size.width,
//                 height: face.bounds.size.height,
//                 },
//               ]}
//             >
//             </View>
//           </React.Fragment>
//         ))} */}

//         <View style = {styles.buttonContainer}>
//         {type === CameraType.back ?(
//           flash === FlashMode.off ?(
//             <Button theme = "flashOff" onPress={toggleFlash}/> 
//           ) : (
//             <Button theme = "flashOn" onPress={toggleFlash}/>
//           )
//           ): null}
//         </View>

//         <Image style ={styles.faceImage}
//               source={require('../assets/face-outline.png')}
//               resizeMode='cover'
//               />
//         <View style={styles.buttonContainer}>
//           <Button theme = "flipCam" onPress={toggleCameraType}/>
//           <Button theme = "takePic" onPress={takePhoto}/>
//           {/* <Button theme = "home" onPress = {toHome}/> */}
//           <Button theme = "backButton" onPress={() => navigation.goBack()}/>
//         </View>
//         </Camera>
//     </SafeAreaView>
//   );
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: "grey",
//     width: windowWidth,
//     height: windowHeight,
//   },
//   directionsText:{
//     color: 'black',
//     fontSize: 20,
//   },
//   camera: {
//     flex: 1,
//     //width: windowWidth,
//     alignItems: 'center',
//     justifyContent: 'center',
//     overflow: 'hidden',
//   },
//   preview: {
//     flex: 20,
//     alignSelf: 'stretch',
//     alignItems: 'center',
//   },
//   buttonContainer: {
//     width: 450,
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'transparent',
//     margin: 30,
//     alignSelf: 'center',
//     justifyContent: 'space-evenly',
//   },
//   previewButtonContainer: {
//     width: 450,
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'transparent',
//     marginBottom: 12,
//     margin: 64,
//     alignSelf: 'center',
//     justifyContent: 'space-evenly',
//   },
//   faceRectangle:{
//     position: 'absolute',
//     borderWidth: 3,
//     borderColor: 'red',
//   },
//   faceImage:{
//     alignSelf: 'center',
//     alignItems: 'center',
//     height: 400,
//     width: 400,
//   },
// });

// export default CameraScreen2;
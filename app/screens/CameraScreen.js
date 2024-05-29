// import { Camera, CameraType, FlashMode } from 'expo-camera';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, Dimensions } from 'react-native';
import Button from '../../components/Button';
import * as MediaLibrary from 'expo-media-library'
// import * as FaceDetectorConstants from 'expo-face-detector';
import { useNavigation } from '@react-navigation/native';
import { useCameraPermissions } from 'expo-image-picker';


const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

// const {hasPermission, requestPermission} = useCameraPermissions();

function CameraScreen({navigation, route}) {
  const device = useCameraDevice('back');
  const {hasPermission} = useCameraPermissions()

  if (!hasPermission) return <PermissionPage />
  if (device == null) return <NoCameraDeviceError />
  return (
    <Camera 
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  )
}

export default CameraScreen;


// function CameraScreen({navigation, route}) {
//   const [type, setType] = useState(CameraType.back);
//   const [permission, requestPermission] = Camera.useCameraPermissions();
//   const [mediaLibraryPermission, requestMediaLibraryPermission] = useState();
//   const [photo, setPhoto] = useState();
//   const [flash, setFlash] = useState(FlashMode.off);
//   const [detectedFaces, setDetectedFaces] = useState([]);

//   //Create Camera
//   let cameraRef = useRef(null);

//   //Request media library permissions
//   useEffect(() => {
//     (async() =>{
//       const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
//       requestMediaLibraryPermission(mediaLibraryPermission.status === "granted");
//     })();
//   },[]);


//   //Blank screen until permissions granted
//   if (!permission) {
//     return <View />;
//   }

//   //Remind user to allow camera permissions
//   if (!permission.granted) {
//     return (
//       <View style={styles.container}>
//         <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
//         <Button onPress={requestPermission} label="grant permission" />
//       </View>
//     );
//   }

//   //Remind user to allow media library permissions
//   if (!mediaLibraryPermission){
//     return(<View style={styles.container}>
//       <Text style={{ textAlign: 'center' }}>We need your permission to access media library</Text>
//       <Button onPress={requestMediaLibraryPermission} label="grant permission" />
//     </View>
//     );
//   }

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

//     //Transfer photo from CameraScreen to HomeScreen after its taken
//     if (route.params && route.params.setSelectedImage){
//       route.params.setSelectedImage(newPhoto.uri);
//     }
//   }
//   catch (error){
//     console.log('Error taking photo: ', error);
//   }
//   };


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
//           <Button aria-label = "To Home Screen" theme = "home" label = "Home" onPress={toHome}/>
//           <Button theme = "trash" label = "Trash" onPress = {() => setPhoto(undefined)}/>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   //Return to HomeScreen
//   function toHome(){
//     navigation.navigate('Home', {photo: photo}
//   );}

//   //When a face is detected, add it to the array of detected faces
//   const handleFacesDetected = ({faces}) => {
//     if (faces.length > 0){
//       //console.log('Face Detected: ', faces);
//       setDetectedFaces(faces);  
//     }
//   };

//   // const adjustCameraSize = async () => {
//   //   if(cameraRef.current){
//   //     const ratios = await cameraRef.current.getSupportedRatiosAsync();
//   //     const previewRatio = ratios.find((ratio) => ratio ==='16:9')|| ratios[0];
//   //     cameraRef.current.setRatio(previewRatio);
//   //   }
//   // };

//   //Before photo is taken / if photo has been deleted or saved, show picture taking screen
//   return (
//     <SafeAreaView style={styles.container}>
//       <Camera 
//       ref = {cameraRef} 
//       style={styles.camera} 
//       type={type} 
//       flashMode = {flash}
//       onFacesDetected = {handleFacesDetected}
//         FaceDetectorSettings={{
//           mode: FaceDetectorConstants.FaceDetectorMode.accurate,
//           detectLandmarks: FaceDetectorConstants.FaceDetectorLandmarks.all,
//           runClassifications: FaceDetectorConstants.FaceDetectorClassifications.none,
//           minDetectionInterval: 100,
//           tracking: true,
//         }}
//         //onCameraReady = {adjustCameraSize}
//         >

//         {/* Build box around persons face */}
//         {detectedFaces.map((face, index) => (
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
//               {/* <Image style ={styles.faceImage}
//               source={require('../assets/face-outline.png')}
//               resizeMode='cover'
//               /> */}
//             </View>
//           </React.Fragment>
//         ))}

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
//           <Button theme = "home" onPress = {toHome}/>
//         </View>
//         </Camera>
//     </SafeAreaView>
//   );
// }

// // const calculateImageStyle = (faceBounds) => {
// //   const imageWidth = faceBounds.size.width;
// //   const imageHeight = faceBounds.size.height;

// //   return{
// //     width: imageWidth,
// //     height: imageHeight,
// //     position: 'absolute',
// //     alignSelf: 'center',
// //     top: faceBounds.origin.y,
// //     left: faceBounds.origin.x,
// //   };
// // };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: "grey",
//     width: windowWidth,
//     height: windowHeight,
//   },
//   camera: {
//     flex: 1,
//     width: windowWidth,
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

// export default CameraScreen;
import { Camera, CameraType, FlashMode } from 'expo-camera';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import Button from '../../components/Button';
import * as MediaLibrary from 'expo-media-library'
import * as FaceDetectorConstants from 'expo-face-detector';


function CameraScreen({navigation, route}) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [flash, setFlash] = useState(FlashMode.off);
  const [detectedFaces, setDetectedFaces] = useState([]);

  let cameraRef = useRef(null);

  useEffect(() => {
    (async() =>{
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      requestMediaLibraryPermission(mediaLibraryPermission.status === "granted");
    })();
  },[]);


  //Blank screen until permissions granted
  if (!permission) {
    return <View />;
  }

  //Remind user permissions are required
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} label="grant permission" />
      </View>
    );
  }

  if (!mediaLibraryPermission){
    return(<View style={styles.container}>
      <Text style={{ textAlign: 'center' }}>We need your permission to access media library</Text>
      <Button onPress={requestMediaLibraryPermission} label="grant permission" />
    </View>
    );
  }

  //Switch between front and back camera
  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  function toggleFlash(){
    setFlash(
      flash === FlashMode.off? FlashMode.on: FlashMode.off
    );
  }
  
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
    if (route.params && route.params.setSelectedImage){
      route.params.setSelectedImage(newPhoto.uri);
    }
  }
  catch (error){
    console.log('Error taking photo: ', error);
  }
  };

  if (photo){
    let savePhoto= () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(()=> {
        setPhoto(undefined);
      })
    };

    return(
      <SafeAreaView style = {styles.container}>
        <Image 
          style = {[styles.preview, {borderWidth: 4, borderColor: "black", borderRadius: 15}]}
          resizeMode = "cover"
          source = {{ uri: "data:image/jpg;base64," + photo.base64}}
          />
        <View style = {styles.buttonContainer}>
          {mediaLibraryPermission ? <Button theme = "savePhoto" label = "Save Photo" onPress = {savePhoto}/> :undefined}
          <Button theme = "home" label = "Home" onPress={toHome}/>
          <Button theme = "trash" label = "Trash" onPress = {() => setPhoto(undefined)}/>
        </View>
      </SafeAreaView>
    );
  }

  //Return to HomeScreen
  function toHome(){
    navigation.navigate('Home', {photo: photo}
  );}

  const handleFacesDetected = ({faces}) => {
    if (faces.length > 0){
      //console.log('Face Detected: ', faces);
      setDetectedFaces(faces);  
    }
    // for (const face of faces){
    //   const{landmarks} = face;
    //   //console.log("Landmarks", landmarks);
    // }
  };

  // const adjustCameraSize = async () => {
  //   if(cameraRef.current){
  //     const ratios = await cameraRef.current.getSupportedRatiosAsync();
  //     const previewRatio = ratios.find((ratio) => ratio ==='16:9')|| ratios[0];
  //     cameraRef.current.setRatio(previewRatio);
  //   }
  // };

  //CameraScreen components
  return (
    <View style={styles.container}>
      <Camera 
      ref = {cameraRef} 
      style={styles.camera} 
      type={type} 
      flashMode = {flash}
      onFacesDetected = {handleFacesDetected}
        FaceDetectorSettings={{
          mode: FaceDetectorConstants.FaceDetectorMode.accurate,
          detectLandmarks: FaceDetectorConstants.FaceDetectorLandmarks.all,
          runClassifications: FaceDetectorConstants.FaceDetectorClassifications.none,
          minDetectionInterval: 100,
          tracking: true,
        }}
        //onCameraReady = {adjustCameraSize}
        >
        {detectedFaces.map((face, index) => (
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
            />
          </React.Fragment>
        ))}
        
        <View style = {styles.buttonContainer}>
        {type === CameraType.back ?(
          flash === FlashMode.off ?(
            <Button theme = "flashOff" onPress={toggleFlash}/> 
          ) : (
            <Button theme = "flashOn" onPress={toggleFlash}/>
          )
          ): null}
        </View>


        <View style={styles.buttonContainer}>
          <Button theme = "flipCam" onPress={toggleCameraType}/>
          <Button theme = "takePic" onPress={takePhoto}/>
          <Button theme = "home" onPress = {toHome}/>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "grey",
    resizeMode: 'contain',
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 20,
    alignSelf: "stretch",
    alignItems: "center",
  },
  buttonContainer: {
    width: 450,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  faceRectangle:{
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'red',
  },
  landmark:{
    position: 'absolute',
    width: 6,
    height: 6,
    borderWidth: 6,
    borderColor: 'red',
  },
});

export default CameraScreen;
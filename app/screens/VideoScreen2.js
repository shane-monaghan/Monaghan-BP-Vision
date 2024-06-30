import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import Button from '../../components/Button';

function VideoScreen2({ navigation, route }) {
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(undefined);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [cameraType, setCameraType] = useState('back');
  const cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const microphonePermission = await Camera.requestMicrophonePermissionsAsync();
      setHasMicrophonePermission(microphonePermission.status === 'granted');
    })();
  }, []);

  if (hasMicrophonePermission === undefined) {
    return <Text>Permission to use microphone not granted</Text>;
  }

  const recordVideo = async () => {
    setIsRecording(true);
    const options = {
      quality: '1080p',
      maxDuration: 1, //Max length of video (seconds)
      mute: false,
    };
    try {
      const recordedVideo = await cameraRef.current.recordAsync(options);
      setVideo(recordedVideo);
      setIsRecording(false);
    } catch (error) {
      console.log(error);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  const toHome = () => {
    navigation.navigate('Home');
  };

  const goBack = () => {
    navigation.goBack();
  };

  const transferVideo = () => {
    navigation.navigate('SevenPhoto', {
      videoUri: video.uri,
      pictures: route.params.pictures,
      name: route.params.name,
      date: route.params.date
    })
  }

  const toPhotoVideoPreview = () => {
    navigation.navigate('PhotoVideoPreview', {
      videoUri: video.uri,
      pictures: route.params.pictures,
      name: route.params.name,
      date: route.params.date,
    });
  };

  if (video) {
    const saveVideo = async () => {
      try {
        await MediaLibrary.saveToLibraryAsync(video.uri);
      } catch (error) {
        console.log(error);
      }
    };
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.directionsText}>Video</Text>
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode='contain'
        />
        <View style={styles.previewButtonContainer}>
          <Button theme='trash' onPress={() => setVideo(undefined)} />
          <Button theme='savePhoto' onPress={saveVideo} />
          <Button theme='checkbox' onPress={transferVideo} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.directionsText}>Video</Text>
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={cameraType} ref={cameraRef} mode="video">
          <View style={styles.buttonContainer}>
            <Button theme='backButton' onPress={goBack} />
            <Button
              theme={isRecording ? 'stopRecording' : 'startRecording'}
              onPress={isRecording ? stopRecording : recordVideo}
            />
            <Button
              theme="flipCam"
              style = {styles.flipButton}
              onPress={() =>
                setCameraType(
                  cameraType === 'back'
                    ? 'front'
                    : 'back'
                )
              }
            >
            </Button>
          </View>
        </CameraView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
  },
  camera: {
    flex: 1,
    width: '100%',
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
    top: '81%',
    width: 450,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.75,
    margin: 30,
    padding: 50,
    alignSelf: 'center',
    justifyContent: 'space-evenly'
  },
  text: {
    color: 'white',
    paddingTop: 50,
    fontSize: 20,
  },
  video: {
    flex: 1,
    alignSelf: 'stretch',
  },
  directionsText:{
    color: 'black',
    fontSize: '30%',
    fontFamily: 'Arial',
    color: 'white',
  },
  faceImage: {
    position: 'absolute',
    alignSelf: 'center',
    top: '20%',
    height: 400,
    width: 400,
  },
  flipButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  flipButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VideoScreen2;

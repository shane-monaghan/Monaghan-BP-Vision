import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';
import Button from '../../components/Button';

function VideoScreen({ navigation, route }) {
  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState(undefined);
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
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
      mute: true,
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
        <Video
          style={styles.video}
          source={{ uri: video.uri }}
          useNativeControls
          resizeMode='contain'
        />
        <View style={styles.buttonContainer}>
          <Button theme='trash' onPress={() => setVideo(undefined)} />
          <Button theme='savePhoto' onPress={saveVideo} />
          <Button theme='checkbox' onPress={toPhotoVideoPreview} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <Image
            style={styles.faceImage}
            source={require('../assets/face-outline.png')}
            resizeMode='cover'
          />
          <View style={styles.bottomContainer}>
            <Button
              theme="flipCam"
              style = {styles.flipButton}
              onPress={() =>
                setCameraType(
                  cameraType === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                )
              }
            >
            </Button>
            <Button
              theme={isRecording ? 'stopRecording' : 'startRecording'}
              onPress={isRecording ? stopRecording : recordVideo}
            />
            <Button theme='backButton' onPress={goBack} />
          </View>
        </Camera>
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
    justifyContent: 'space-between',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 20,
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

export default VideoScreen;

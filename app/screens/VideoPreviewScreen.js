// import { StyleSheet, Text, View } from 'react-native';
// import React, { useState, useRef, Dimensions } from 'react';
// import Button from '../../components/Button';
// import { Video } from 'expo-av';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import * as FileSystem from 'expo-file-system';
// import axios from 'axios';


// function VideoPreview({ navigation, route }) {
//     const [video, setVideo] = useState({uri: route.params.videoUri});
//     const flaskURL = 'http://134.82.182.163:5000/';
//     const [isBlackAndWhite, setIsBlackAndWhite] = useState(false);

//     let toHome = async () => {
//         navigation.navigate("Home");
//     };

//     let toBW = async() => {
//         const videoURI = video.uri; // Original URI of Video
//         const videoBase64 = await FileSystem.readAsStringAsync(videoURI, {
//             encoding: FileSystem.EncodingType.Base64,
//         });
//         const response = await axios.post(flaskURL + 'videoGrayscale', {
//             encoded_video: videoBase64,
//           });
//         encodedOutput = response.data.encoded_output_video;
//         setVideo({ uri: 'data:video/mov;base64,${encodedOutput}'});
//         setIsBlackAndWhite(true);
//         console.log("Should be done")
//     }

//     return (
//         <SafeAreaView style={styles.container}>
//             <Video
//                 style={styles.video}
//                 source={video}
//                 useNativeControls
//                 resizeMode='contain'
//             />
//             <View style = {styles.bottomContainer}>
//                 <Button label = "To Black and White" onPress = {() => toBW(video.uri)}/>
//             </View>
//             <View style={styles.buttonContainer}>
//                 <Button theme="trash" onPress={() => setVideo(undefined)} />
//                 <Button theme="checkbox" onPress={toHome} />
//                 <Button theme="home" onPress={toHome} />
//             </View>
//         </SafeAreaView>
//     );
//     }
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'gray',
//         alignItems: 'center',
//     },
//     bottomContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         alignSelf:'center',
//         position:'relative',
//         width: 400,
//     },
//     buttonContainer: {
//         alignSelf: 'center',
//         justifyContent: 'space-evenly',
//         flexDirection: 'row',
//         paddingTop: 10,
//         width: 450,
//     },
//     text: {
//         color: 'white',
//         paddingTop: 50,
//         fontSize: 20,
//     },
//     video: {
//         flex: 1,
//         alignSelf: 'stretch',
//     },
// });

//   export default VideoPreview;
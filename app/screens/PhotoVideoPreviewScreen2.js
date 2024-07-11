import React, { useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Button from '../../components/Button';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useProcessedImages } from '../navigation/CreateContext';
import axios from 'axios';
import Swiper from 'react-native-swiper';


const noPic = require('../assets/images/imageNotFound.jpg');

function PhotoVideoPreview2({ navigation, route }) {
  const { pictures } = route.params;
  const [BWPictures, setBWPictures] = useState([null, null, null, null, null, null, null]);
  const { processedImages, setProcessedImages } = useProcessedImages();
  // const flaskURL = 'http://134.82.182.163:5000/'; //SCHOOL
  // const flaskURL = 'http://192.168.12.126:5000/'; // HOME
  // const flaskURL = 'http://134.82.163.84:5000/'; //SCHOOL 2
  const flaskURL = 'http://134.82.187.57:5000/';
  const [video, setVideo] = useState(route.params.videoUri);
  const [isPlotted, setIsPlotted] = useState(false);
  const [index, setIndex] = useState(-1);
  const pictureTitles = [
    'Face at Rest',
    'Eyes Closed Gently',
    'Eyes Closed Forcefully',
    'Eyebrows Elevated',
    'Wrinkling of the Nose',
    'Pursed Lips',
    'Big Smile',
    'Video',
  ];
  const plotted_video_src = require("../../pythonStuff/plottedVid.mov")

  const downOne = () => {
    setIndex(index - 1);
  };

  const upOne = () => {
    setIndex(index + 1);
  };

  const goBack = () => {
    navigation.goBack();
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
      setBWPictures(prevState => [...prevState.slice(0, index), base64_image, ...prevState.slice(index + 1)]);
    } catch (error) {
      console.log('Error sending image', error);
    }
    console.log("Finished Image: ", index + 1, "/ 7");
  }

  const plotPoints = async() => {
    alert("Plotting Points, this may take up to 10 minutes to complete")
    console.log("Starting");
    const startTime = new Date()
    for (let i = 0; i < 7; i++) {
      if (pictures[i] != null){
        // alert("Missing Photo \""+ pictureTitles[i]+ "\" Please take all photos before continuing");
        // return;
        await plotImage(pictures[i], i);
      }
    }
    if (video) {
      try {
        console.log("Starting Video");
        const videoURI = video;
        const videoBase64 = await FileSystem.readAsStringAsync(videoURI, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const response = await axios.post(flaskURL + 'plotVideo', {
          encoded_video: videoBase64,
        });
  
        //setVideo(gray_vid_src);
        const endTime = new Date();
        const elapsedMilliseconds = endTime - startTime;

        // Convert milliseconds to minutes and seconds
        const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;

        console.log("Elapsed time:", minutes, "minutes", seconds, "seconds");
        //navigation.navigate("DataScreen", {pictures: BWPictures})
      } catch (error) {
        console.error('Error converting video:', error);
      }
    }
    setIsPlotted(true);
  }

  // const convertToBlackAndWhite = async () => {
  //   console.log("Starting");

  //   for (let i = 0; i < 7; i++) {
  //     if (pictures[i] == null){
  //       alert("Missing Photo \""+ pictureTitles[i]+ "\" Please take all photos before continuing");
  //       return;
  //     }
  //     await BWImage(pictures[i], i);
  //   }

  //   if (!video) {
  //     return;
  //   }

  //   try {
  //     const videoURI = video;
  //     const videoBase64 = await FileSystem.readAsStringAsync(videoURI, {
  //       encoding: FileSystem.EncodingType.Base64,
  //     });
  //     const response = await axios.post(flaskURL + 'videoGrayscale', {
  //       encoded_video: videoBase64,
  //     });

  //     //setVideo(gray_vid_src);
  //     setIsPlotted(true);
  //     console.log("Done");
  //   } catch (error) {
  //     console.error('Error converting video:', error);
  //   }
  // };

  const revert = () => {
    setVideo(route.params.videoUri);
    setIsPlotted(false);
    setBWPictures([null, null, null, null, null, null, null]);
  };

  const toDataScreen = async () => {
    navigation.navigate("DataScreen", {
      originalPictures: pictures,
      pictures: BWPictures,
      name: route.params.name,
      date: route.params.date,
    });
  };
  
  if (index < 0) {
    return (
      <View style={styles.container}>
        <Swiper autoplay={false} removeClippedSubviews={false} loop={false} style={styles.wrapper} activeDotColor='#4733D2'>
          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[0].toUpperCase()}</Text>
            </View>
            {pictures[0] ? (
            processedImages[0] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[0]}` }} />
            ) : (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[0] }} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.contentDataContainer}>
                <Button theme="newDefaultButton1" label="Content Menu" onPress={goBack}></Button>
                <Button theme="newDefaultButton1" label="View Data" onPress={toDataScreen}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[1].toUpperCase()}</Text>
            </View>
            {pictures[1] ? (
            processedImages[1] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[1]}` }} />
            ) : (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[1] }} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.contentDataContainer}>
                <Button theme="newDefaultButton1" label="Content Menu" onPress={goBack}></Button>
                <Button theme="newDefaultButton1" label="View Data" onPress={toDataScreen}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[2].toUpperCase()}</Text>
            </View>
            {pictures[2] ? (
            processedImages[2] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[2]}` }} />
            ) : (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[2] }} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.contentDataContainer}>
                <Button theme="newDefaultButton1" label="Content Menu" onPress={goBack}></Button>
                <Button theme="newDefaultButton1" label="View Data" onPress={toDataScreen}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[3].toUpperCase()}</Text>
            </View>
            {pictures[3] ? (
            processedImages[3] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[3]}` }} />
            ) : (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[3] }} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.contentDataContainer}>
                <Button theme="newDefaultButton1" label="Content Menu" onPress={goBack}></Button>
                <Button theme="newDefaultButton1" label="View Data" onPress={toDataScreen}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[4].toUpperCase()}</Text>
            </View>
            {pictures[4] ? (
            processedImages[4] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[4]}` }} />
            ) : (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[4] }} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.contentDataContainer}>
                <Button theme="newDefaultButton1" label="Content Menu" onPress={goBack}></Button>
                <Button theme="newDefaultButton1" label="View Data" onPress={toDataScreen}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[5].toUpperCase()}</Text>
            </View>
            {pictures[5] ? (
            processedImages[5] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[5]}` }} />
            ) : (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[5] }} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.contentDataContainer}>
                <Button theme="newDefaultButton1" label="Content Menu" onPress={goBack}></Button>
                <Button theme="newDefaultButton1" label="View Data" onPress={toDataScreen}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[6].toUpperCase()}</Text>
            </View>
            {pictures[6] ? (
            processedImages[6] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[6]}` }} />
            ) : (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[6] }} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.contentDataContainer}>
                <Button theme="newDefaultButton1" label="Content Menu" onPress={goBack}></Button>
                <Button theme="newDefaultButton1" label="View Data" onPress={toDataScreen}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[7].toUpperCase()}</Text>
            </View>
            {video ? (
            !isPlotted ? (
            <Video style={styles.image} resizeMode='cover' useNativeControls source={{ uri: video }} />
            ) : (
            <Video style={styles.image} resizeMode='cover' useNativeControls source={plotted_video_src} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.contentDataContainer}>
                <Button theme="newDefaultButton1" label="Content Menu" onPress={goBack}></Button>
                <Button theme="newDefaultButton1" label="View Data" onPress={toDataScreen}></Button>
            </View>
          </View>
        </Swiper>
      </View>
    )
  }
  else if (index == 0) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.text, styles.header]}>{pictureTitles[index]}</Text>
            </View>
            <View style={styles.line}></View>
            {pictures[index] ? (
            processedImages[index] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[index]}` }} />
            ) : (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[index] }} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.oneArrowContainer}>
                <Button theme = "rightArrow" label="->" onPress={upOne} />
                <Button theme={'homeButton'} label="SESSION MENU" onPress={goBack} />
            </View>    
        </View>
    );
}
else if (index > 0 && index < 7) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.text, styles.header]}>{pictureTitles[index]}</Text>
            </View>
            <View style={styles.line}></View>
            {pictures[index] ? (
            processedImages[index] ? (
            <Image style={styles.image} resizeMode = "cover" source={{ uri: `data:image/jpeg;base64,${processedImages[index]}` }} />
            ) : (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[index] }} />
            )
            ) : (
          <Image style={styles.image} resizeMode='cover' source={noPic} />
        )}
            <View style={styles.buttonContainer}>
                <View style={styles.rowContainer}>
                    <Button theme = "rightArrow" label="<-" onPress={downOne} />
                    <Button theme = "rightArrow" label="->" onPress={upOne} />
                </View>
                <Button theme={'homeButton'} label="SESSION MENU" onPress={goBack} />
            </View>    
        </View>
    );
}
else {
    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.text, styles.header]}>{pictureTitles[index]}</Text>
            </View>
            <View style={styles.line}></View>
            {video ? (
            !isPlotted ? (
            <Video style={styles.image} resizeMode='cover' useNativeControls source={{ uri: video }} />
            ) : (
            <Video style={styles.image} resizeMode='cover' useNativeControls source={plotted_video_src} />
            )
            ) : (
            <Image style={styles.image} resizeMode='cover' source={noPic} />
            )}
            <View style={styles.oneArrowContainer}>
                <Button theme = "rightArrow" label="<-" onPress={downOne} />
                {!isPlotted ? (
                <Button theme = "homeButton" label="PLOT POINTS" onPress={plotPoints} />
                ) : (
                <Button theme = "homeButton" label="VIEW DATA" onPress={toDataScreen} />
                )}
            </View>    
        </View>
    );
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center'
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
    contentDataContainer: {
      flexDirection: "row",
      alignItems: "center",
      top: "-12.5%",
      justifyContent: "space-around",
      marginLeft: "auto",
      marginRight: 'auto'
    },
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.5,
      shadowRadius: 3,
    },
    rowContainer: {
        minHeight: '10%',
        flexDirection: 'row',
        marginBottom: -55
    },
    wrapper: {
    },
    line: {
        borderBottomColor: '#00419D',
        borderBottomWidth: '3%'
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
    image: {
        position: 'static',
        top: '-9%',
        marginTop: '25%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 3,
        borderColor: '#4437D2',
        width: 350,
        height: 622,
        borderRadius: "10%"
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
      oneArrowContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: '85%',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      buttonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: '88%',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
});

export default PhotoVideoPreview2;
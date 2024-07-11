import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from '../../components/Button';
import { Video } from 'expo-av';
import axios from 'axios';
import { useProcessedImages } from '../navigation/CreateContext';
import * as FileSystem from 'expo-file-system';
import Swiper from 'react-native-swiper';

const noPic = require('../assets/images/imageNotFound.jpg');

function DataScreen3({ navigation, route }) {
  const { processedImages, setProcessedImages } = useProcessedImages();
  const { pictures } = route.params;
  const { originalPictures } = route.params;
  // const flaskURL = 'http://134.82.182.163:5000/'; //SCHOOL
  // const flaskURL = 'http://192.168.12.126:5000/'; // HOME
  // const flaskURL = 'http://134.82.163.84:5000/'; //SCHOOL 2
  const flaskURL = 'http://134.82.187.57:5000/';
  const [landmarkData, setLandmarkData] = useState([
    null, null, null, null, null, null, null
  ]);
  const [isTesting, setTesting] = useState(true);
  const [video, setVideo] = useState([true]);
  const [index, setIndex] = useState(0);
  const [displayPlot, togglePlot] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedImagesCount, setFetchedImagesCount] = useState(0);
  const name = route.params.name
  const date = route.params.date
  const [startTime, setStartTime] = useState();

  const pictureTitles = [
    'Face at Rest',
    'Eyes Closed Gently',
    'Eyes Closed Forcefully',
    'Eyebrows Elevated',
    'Wrinkling of the Nose',
    'Pursed Lips',
    'Big Smile',
    'End of Session',
  ];
  const plotted_video_src = require("../../pythonStuff/plottedVid.mov");

  const downOne = () => {
    setIndex(index - 1);
  };

  const upOne = () => {
    setIndex(index + 1);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const toHome = () =>{
    navigation.navigate("Home")
  }
  const saveSession = async () => {
    try {
      // Check if the name already exists in AsyncStorage
      const savedSessions = await AsyncStorage.getItem('savedSessions');
      let sessions = savedSessions ? JSON.parse(savedSessions) : {};
  
      if (!sessions[name]) {
        // If the name doesn't exist, create a new entry with the name as the identifier
        sessions[name] = {};
      }
  
      // Create a new entry with the existing date as the identifier within the name entry
      sessions[name][date] = {
        originalPictures: originalPictures,
        pictures: pictures,
      };
  
      // Save the updated sessions object back to AsyncStorage
      await AsyncStorage.setItem('savedSessions', JSON.stringify(sessions));
  
      // Optionally, show a success message to the user
      alert('Session saved successfully!');
    } catch (error) {
      console.log('Error saving session:', error);
    }
  };
  

  const getData = async (uri, index) => {
    try {
      const imageURI = uri; // Original URI of selected image
      const imageBase64 = await FileSystem.readAsStringAsync(imageURI, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const response = await axios.post(flaskURL + 'getData', {
        encoded_image: imageBase64,
      });
      const results = response.data;
      setLandmarkData(prevState => [
        ...prevState.slice(0, index),
        results,
        ...prevState.slice(index + 1),
      ]);
      // console.log(landmarkData);
    } catch (error) {
      console.log('Error sending image', error);
    } finally {
      // Set isLoading to false when data fetching is completed
      // setIsLoading(false);
    }
  };

  useEffect(() => {
    if (fetchedImagesCount === 0){
      setStartTime(new Date())
    }
    const fetchImageData = async (fetchedImagesCount) => {
      try {
        setIsLoading(true);
        await getData(originalPictures[fetchedImagesCount], fetchedImagesCount);
        setIsLoading(false);

        setFetchedImagesCount(prevCount => prevCount + 1);
      } catch (error) {
        console.log('Error fetching image data', error);
        setIsLoading(false);
      }
    };
    
    // Check if we have fetched data for all images
    if (fetchedImagesCount < originalPictures.length) {
      console.log("Analyzing picture " + (fetchedImagesCount +1) + "/" + originalPictures.length)
      fetchImageData(fetchedImagesCount);
    }
    if (fetchedImagesCount === originalPictures.length){
      console.log("Finished computing data");
      const endTime = new Date();
      const elapsedMilliseconds = endTime - startTime;

      // Convert milliseconds to minutes and seconds
      const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
      const minutes = Math.floor(elapsedSeconds / 60);
      const seconds = elapsedSeconds % 60;

      console.log("Elapsed time:", minutes, "minutes", seconds, "seconds");
    }
  }, [fetchedImagesCount]);

  const truncateNumber = (number) => {
    const stringValue = number.toString();
    return stringValue.length > 12 ? stringValue.slice(0, 12) : stringValue;
  };

  const distsText = isLoading ? (
    <Text>Loading...</Text>
  ) : (
    landmarkData[index] && (
      <View style={styles.entryContainer}>
        {Object.keys(landmarkData[index].dists).map((key) => {
          const value = landmarkData[index].dists[key];
          const formattedValue = value !== undefined ? truncateNumber(value) : "N/A";
          return (
            <Text key={key} style={styles.entry}>
              {`${key}: ${formattedValue}`}
            </Text>
          );
        })}
      </View>
    )
  );

  const featuresText = isLoading ? (
    <Text>Loading...</Text>
  ) : (
    landmarkData[index] && (
      <View style={styles.entryContainer}>
        {Object.keys(landmarkData[index].features).map((key) => {
          const value = landmarkData[index].features[key];
          const formattedValue = value !== undefined ? truncateNumber(value) : "N/A";
          return (
            <Text key={key} style={styles.entry}>
              {`${key}: ${formattedValue}`}
            </Text>
          );
        })}
      </View>
    )
  );
  if (isTesting) {
    return (
      <View style={styles.container}>
        <Swiper loop={false} removeClippedSubviews={false} autoplay={false} style={styles.wrapper} activeDotColor='#4733D2' onIndexChanged={(newIndex) => setIndex(newIndex)}>
          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[0].toUpperCase()}</Text>
            </View>
            { processedImages[0] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[0]}` }} />
            ) 
            : (
            <Image style={[styles.image, styles.shadowProp]} resizeMode='cover' source={noPic} />
            )}
            <ScrollView style={[styles.resultBox, styles.shadowProp]}>
                <View style={styles.resultRow}>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Distances</Text>
                        {distsText}
                    </View>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Features</Text>
                        {featuresText}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.contentDataContainer}>
                <Button theme="newDefaultButton" label="Back To Preview" onPress={goBack}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[1].toUpperCase()}</Text>
            </View>
            { processedImages[1] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[1]}` }} />
            ) 
            : (
            <Image style={[styles.image, styles.shadowProp]} resizeMode='cover' source={noPic} />
            )}
            <ScrollView style={[styles.resultBox, styles.shadowProp]}>
                <View style={styles.resultRow}>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Distances</Text>
                        {distsText}
                    </View>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Features</Text>
                        {featuresText}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.contentDataContainer}>
              <Button theme="newDefaultButton" label="Back To Preview" onPress={goBack}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[2].toUpperCase()}</Text>
            </View>
            { processedImages[2] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[2]}` }} />
            ) 
            : (
            <Image style={[styles.image, styles.shadowProp]} resizeMode='cover' source={noPic} />
            )}
            <ScrollView style={[styles.resultBox, styles.shadowProp]}>
                <View style={styles.resultRow}>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Distances</Text>
                        {distsText}
                    </View>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Features</Text>
                        {featuresText}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.contentDataContainer}>
              <Button theme="newDefaultButton" label="Back To Preview" onPress={goBack}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[3].toUpperCase()}</Text>
            </View>
            { processedImages[3] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[3]}` }} />
            ) 
            : (
            <Image style={[styles.image, styles.shadowProp]} resizeMode='cover' source={noPic} />
            )}
            <ScrollView style={[styles.resultBox, styles.shadowProp]}>
                <View style={styles.resultRow}>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Distances</Text>
                        {distsText}
                    </View>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Features</Text>
                        {featuresText}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.contentDataContainer}>
              <Button theme="newDefaultButton" label="Back To Preview" onPress={goBack}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[4].toUpperCase()}</Text>
            </View>
            { processedImages[4] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[4]}` }} />
            ) 
            : (
            <Image style={[styles.image, styles.shadowProp]} resizeMode='cover' source={noPic} />
            )}
            <ScrollView style={[styles.resultBox, styles.shadowProp]}>
                <View style={styles.resultRow}>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Distances</Text>
                        {distsText}
                    </View>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Features</Text>
                        {featuresText}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.contentDataContainer}>
              <Button theme="newDefaultButton" label="Back To Preview" onPress={goBack}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[5].toUpperCase()}</Text>
            </View>
            { processedImages[5] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[5]}` }} />
            ) 
            : (
            <Image style={[styles.image, styles.shadowProp]} resizeMode='cover' source={noPic} />
            )}
            <ScrollView style={[styles.resultBox, styles.shadowProp]}>
                <View style={styles.resultRow}>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Distances</Text>
                        {distsText}
                    </View>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Features</Text>
                        {featuresText}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.contentDataContainer}>
              <Button theme="newDefaultButton" label="Back To Preview" onPress={goBack}></Button>
            </View>
          </View>

          <View>
            <View style={[styles.view2, styles.shadowProp]}>
              <Text style={styles.titleText}>{pictureTitles[6].toUpperCase()}</Text>
            </View>
            { processedImages[6] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: `data:image/jpeg;base64,${processedImages[6]}` }} />
            ) 
            : (
            <Image style={[styles.image, styles.shadowProp]} resizeMode='cover' source={noPic} />
            )}
            <ScrollView style={[styles.resultBox, styles.shadowProp]}>
                <View style={styles.resultRow}>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Distances</Text>
                        {distsText}
                    </View>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Features</Text>
                        {featuresText}
                    </View>
                </View>
            </ScrollView>
            <View style={styles.contentDataContainer}>
              <Button theme="newDefaultButton" label="Back To Preview" onPress={goBack}></Button>
            </View>
          </View>
        </Swiper>
      </View>
    )
  }
  else if (index === 0) {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, styles.header]}>{pictureTitles[index]}</Text>
            <View style={styles.line}></View>
            {pictures[index] ? 
                (
                displayPlot ? (
                <Image style={styles.image} resizeMode="cover" source={{ uri: `data:image/jpeg;base64,${processedImages[0]}` }} />
                )
            : <Image style={styles.image} resizeMode="cover" source={{ uri: originalPictures[index] }} />
                ): (
                <Image style={styles.image} resizeMode="contain" source={noPic} />
            )}
            <View style={styles.toggleButtonContainer}>
                <Button theme={'homeButton'} label="TOGGLE PLOT" onPress={() => displayPlot ? togglePlot(false) : togglePlot(true)} />
            </View> 
            <ScrollView style={styles.resultBox}>
                <View style={styles.resultRow}>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Distances</Text>
                        {distsText}
                    </View>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Features</Text>
                        {featuresText}
                    </View>
                </View>
            </ScrollView> 
            <View style={styles.oneArrowContainer}>
                <Button theme = "rightArrow" label="->" onPress={upOne} />
                <Button theme={'homeButton'} label="BACK TO PREVIEW" onPress={goBack} />
            </View>   
        </View>
    )
  }
  else if (index > 0 && index < 7) {
    return (
        <View style={styles.container}>
            <Text style={[styles.text, styles.header]}>{pictureTitles[index]}</Text>
            <View style={styles.line}></View>
            {pictures[index] ? 
                (
                displayPlot ? (
                <Image style={styles.image} resizeMode="cover" source={{ uri: `data:image/jpeg;base64,${pictures[index]}` }} />
                )
            : <Image style={styles.image} resizeMode="cover" source={{ uri: originalPictures[index] }} />
                ): (
                <Image style={styles.image} resizeMode="contain" source={noPic} />
            )}
            <View style={styles.toggleButtonContainer}>
                <Button theme={'homeButton'} label="TOGGLE PLOT" onPress={() => displayPlot ? togglePlot(false) : togglePlot(true)} />
            </View> 
            <ScrollView style={styles.resultBox}>
                <View style={styles.resultRow}>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Distances</Text>
                        {distsText}
                    </View>
                    <View style={styles.resultCol}>
                        <Text style={styles.resultHeader}>Features</Text>
                        {featuresText}
                    </View>
                </View>
            </ScrollView> 
            <View style={styles.buttonContainer}>
                <View style={styles.rowContainer}>
                    <Button theme = "rightArrow" label="<-" onPress={downOne} />
                    <Button theme = "rightArrow" label="->" onPress={upOne} />
                </View>
                <Button theme={'homeButton'} label="BACK TO PREVIEW" onPress={goBack} />
            </View>    
        </View>
    )
  }
  else {
    return (
        <View style={styles.container}>
          <View style={styles.endScreen}>
            <Text style={[styles.text, styles.header]}>
              Thank you for using           BP Vision!
            </Text>
          <View style={styles.buttonContainer2}>
            <Button theme = "saveSession" label="Save Session" onPress={saveSession}/>
            <Button theme="endHomeButton" label="Return Home" onPress = {toHome}/>
            <Button theme = "homeButton" label="<-" onPress={downOne} />
          </View>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
        backgroundColor: '#D9D9D9'
    },
    endScreen: {
      flex: 1,
      position: 'absolute',
      left: 0,
      right: 0,
      marginLeft: 'auto',
      marginRight: 'auto',
      top: '30%',
      justifyContent: 'space-evenly'
    },
    line: {
        borderBottomColor: '#00419D',
        borderBottomWidth: '3%'
    },
    text: {
        fontFamily: 'Verdana, sans-serif',
        color: '#4437D2',
        fontSize: "10%"
    },
    header: {
        fontWeight: 'bold',
        fontSize: '30%',
        paddingTop: '12.5%',
        paddingBottom: '2%',
        textAlign: 'center',
    },
    shadowProp: {
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.5,
      shadowRadius: 3,
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
    contentDataContainer: {
      flexDirection: "row",
      alignItems: "center",
      top: '80%',
      justifyContent: "space-around",
      marginLeft: "auto",
      marginRight: 'auto'
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
    image: {
        position: 'static',
        top: '-13%',
        marginTop: '25%',
        marginLeft: 'auto',
        marginRight: 'auto',
        borderWidth: 0,
        borderColor: '#00419D',
        width: '84%',
        height: '40%',
      },
    toggleButtonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: '53.25%',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    oneArrowContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: '88%',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      buttonContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: '91%',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto'
      },
      buttonContainer2: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        top: '100%',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto'
      },
      rowContainer: {
        minHeight: '10%',
        flexDirection: 'row',
        marginBottom: -55
      },
      resultBox: {
        position: 'absolute',
        flexDirection: 'column',
        borderColor: '#4437D2',
        borderWidth: '2%',
        borderRadius: "10%",
        top: '60%',
        width: '85%',
        height: '60%',
        left: '7.5%',
        marginLeft: 'auto',
        marginRight: 'auto',
        backgroundColor: 'white'
      },
      resultRow: {
        flexDirection: 'row',
        flex: 1, 
      },
      resultCol: {
        flex: 1,
        alignItems: 'left'
      },
      wrapper: {
      },
      resultHeader: {
        fontFamily: "Verdana, sans-serif",
        fontSize: "20%",
        fontWeight: 'bold',
        textDecorationLine: 'underline'
      },
      entry: {
        fontFamily: "Verdana, sans-serif",
        fontSize: "19%"
      }
});

export default DataScreen3;



import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from '../../components/Button';
import { Video } from 'expo-av';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';

const noPic = require('../assets/images/noImageUploaded.png');

function DataScreen2({ navigation, route }) {
  const { pictures } = route.params;
  const { originalPictures } = route.params;
  // const flaskURL = 'http://134.82.182.163:5000/'; // SCHOOL
  // const flaskURL = 'http://192.168.12.126:5000/'; // HOME
  const flaskURL = 'http://134.82.163.84:5000/'; //SCHOOL 2
  const [landmarkData, setLandmarkData] = useState([
    null, null, null, null, null, null, null
  ]);
  const [video, setVideo] = useState([true]);
  const [index, setIndex] = useState(0);
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
    'Video',
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
  

  if (index === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{pictureTitles[index]}</Text>
        <Image style={styles.leftImage} resizeMode="cover" source={{ uri: originalPictures[index] }} />
        {pictures[index] ? (
          <Image style={styles.image} resizeMode="cover" source={{ uri: `data:image/jpeg;base64,${pictures[index]}` }} />
        ) : (
          <Image style={styles.image} resizeMode="contain" source={noPic} />
        )}

        <ScrollView style={styles.resultsBox}>
          {/* <Button label="Get Results" onPress={() => getData(originalPictures[index], index)} /> */}
          <View style={styles.resultRow}>
            <View style={styles.resultColumn}>
              <Text style={styles.resultText}>Distances:</Text>
              {distsText}
            </View>
            <View style={styles.resultColumn}>
              <Text style={styles.resultText}>Features:</Text>
              {featuresText}
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button theme="right-arrow" onPress={upOne} />
        </View>
        <View style={styles.bottomRow}>
          <Button theme="backButton" onPress={goBack} />
        </View>
      </View>
    );
  } else if (index > 0 && index < 6) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{pictureTitles[index]}</Text>
        <Image style={styles.leftImage} resizeMode="cover" source={{ uri: originalPictures[index] }} />
        {pictures[index] ? (
          <Image style={styles.image} resizeMode="cover" source={{ uri: `data:image/jpeg;base64,${pictures[index]}` }} />
        ) : (
          <Image style={styles.image} resizeMode="contain" source={noPic} />
        )}
        <ScrollView style={styles.resultsBox}>
          {/* <Button label="Get Results" onPress={() => getData(originalPictures[index], index)} /> */}
          <View style={styles.resultRow}>
            <View style={styles.resultColumn}>
              <Text style={styles.resultText}>Distances:</Text>
              {distsText}
            </View>
            <View style={styles.resultColumn}>
              <Text style={styles.resultText}>Features:</Text>
              {featuresText}
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button theme="left-arrow" onPress={downOne} />
          <Button theme="right-arrow" onPress={upOne} />
        </View>
        <View style={styles.bottomRow}>
          <Button theme="backButton" onPress={goBack} />
        </View>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{pictureTitles[index]}</Text>
        <Image style={styles.leftImage} resizeMode="cover" source={{ uri: originalPictures[index] }} />
        {pictures[index] ? (
          <Image style={styles.image} resizeMode="cover" source={{ uri: `data:image/jpeg;base64,${pictures[index]}` }} />
        ) : (
          <Image style={styles.image} resizeMode="contain" source={noPic} />
        )}
        <ScrollView style={styles.resultsBox}>
          {/* <Button label="Get Results" onPress={() => getData(originalPictures[index], index)} /> */}
          <View style={styles.resultRow}>
            <View style={styles.resultColumn}>
              <Text style={styles.resultText}>Distances:</Text>
              {distsText}
            </View>
            <View style={styles.resultColumn}>
              <Text style={styles.resultText}>Features:</Text>
              {featuresText}
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button theme="left-arrow" onPress={downOne} />
        </View>
        <View style={styles.homeButton}>
           <Button theme="home" onPress={toHome}/>
        </View>
        <View style={styles.bottomRow}>
          <Button theme="backButton" onPress={goBack} />
        </View>
      </View>
      // <View style={styles.container}>
      //   <Text style={styles.text}>{pictureTitles[index]}</Text>
      //   {video[0] ? (
      //     <View style={[styles.videoContainer]}>
      //       <Video style={styles.video} resizeMode="contain" useNativeControls source={plotted_video_src} />
      //     </View>
      //   ) : (
      //     <Image style={styles.image} resizeMode="contain" source={noPic} />
      //   )}
      //   <View style ={styles.resultsBox}>
      //     <Text style = {styles.resultText}>Video Results Coming Soon :/</Text>
      //   </View>
      //   <View style={styles.buttonContainer}>
      //     <Button theme="left-arrow" onPress={downOne} />
      //   </View>
      //   <View style={styles.homeButton}>
      //     <Button theme="home" onPress={toHome}/>
      //   </View>
      //   <View style={styles.bottomRow}>
      //     <Button theme="backButton" onPress={goBack} />
      //   </View>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  videoContainer: {
    width: 150,
    height: 300,
    top: 0,
    left: 0,
    alignSelf: 'flex-start',
    position: 'absolute',
  },
  video: {
    width: 150,
    height: 300,
    top: 100,
    left: 20,
    alignSelf: 'flex-start',
    position: 'absolute',
  },
  image: {
    width: 150,
    height: 270,
    top: 115,
    right: 20,
    alignSelf: 'flex-start',
    position: 'absolute',
    borderColor: 'black',
    borderWidth:2,
    backgroundColor:'black',
    borderRadius: 15,
  },
  leftImage: {
    width: 150,
    height: 270,
    top: 115,
    left: 20,
    alignSelf: 'flex-start',
    position: 'absolute',
    borderColor: 'black',
    borderWidth:2,
    borderRadius: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: 450,
    bottom: 100,
    alignContent: 'center',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    position: 'absolute',
  },
  homeButton:{
    position: 'absolute',
    bottom: 50,
    left: 40,
    zIndex: 10,
  },
  bottomRow: {
    // width: 350,
    right: 40,
    bottom: 50,
    justifyContent: 'space-evenly',
    alignContent: 'center',
    position: 'absolute',
    // flexDirection: 'row',
  },
  text: {
    fontSize: 30,
    top: 65,
    position: 'absolute',
  },
  resultsBox: {
    top: 420,
    position: 'absolute',
    width: 400,
    height: 450,
    borderColor: 'black',
    borderWidth: 2,
    flexDirection: 'column', 
  },
  resultText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  resultRow: {
    flexDirection: 'row',
    flex: 1, 
  },
  resultColumn: {
    flex: 1,
  },
  imageResults: {
    fontSize: 20,
    top: 0,
    left: 0,
    position: 'absolute',
  },
  entry: {
    fontSize: 18,
    marginVertical: 4,
  },
  entryContainer: {
    flexDirection: 'column',
    alignSelt: 'flex-start',
    flex: 1,
  },
  saveSession:{
    alignSelf: 'center',
    top: 200,
  }
});

export default DataScreen2;



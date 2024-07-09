import {React, useEffect, useState, useContext} from 'react';
import {Text, ImageBackground, StyleSheet, View, Image } from 'react-native';
import Button from '../../components/Button';
import { StatusBar } from 'expo-status-bar';
// import ImageViewer from '../../components/ImageViewer';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function FinalHomeScreen({navigation}) {
    const {logout} = useContext(AuthContext);
    const route = useRoute();
    //const isFocused = useIsFocused();
    const [selectedImage, setSelectedImage] = useState(null);

    //When picture is sent from cameraScreen, update in HomeScreen
    useEffect(() =>{
      if(route.params && route.params.selectedImage){
        setSelectedImage(route.params.selectedImage);
      }
    }, [route.params]);

    function toSavedSessions(){
        navigation.navigate('SavedSessions')
    }

    //Navigate to Seven Photo Screen
    function toSPS(){
        navigation.navigate('PatientInfo')
    }

    return (
    <View style={styles.view1}>
      <View style={[styles.view2, styles.shadowProp]}>
        <View style={styles.view3}>
          <Text style={styles.titleText}>BP VISION</Text>
        </View>
        <Image
          resizeMode="auto"
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/0416dee6b94f00c7ed64c3665f3f6799f0743526419ccf1da40fa9afa7e5c47c?",
          }}
          style={styles.image1}
        />
      </View>
      <View style={styles.view4}>
        <Button style={styles.view4} theme="toCameraScreen" label="New Session" onPress={(toSPS)}/>
      </View>
      <View style={styles.view5}>
        <Button style={styles.view5} theme="toGallery" label="Load Session" onPress={(toSavedSessions)}/>
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    backgroundColor: "#FFF",
    display: "flex",
    maxWidth: 480,
    width: "100%",
    height: "100%",
    paddingBottom: 80,
    flexDirection: "column",
    alignItems: "center",
    fontSize: 20,
    color: "#FFF",
    fontWeight: "400",
    margin: "0 auto",
  },
  view2: {
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 1)",
    backgroundColor: "#4437D2",
    alignSelf: "stretch",
    display: "flex",
    width: "100%",
    height: "65%",
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: 50,
    fontWeight: "700",
    padding: "80px 42px 52px",
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  view3: {
    fontFamily: "Verdana, sans-serif",
    marginTop: "25%",
  },
  titleText: {
    fontFamily: "Verdana, sans-serif",
    fontWeight: "bold",
    color: "white",
    fontSize: "60%",
    marginLeft: 0,
    marginRight: 0,
    alignSelf: "center",
  },
  image1: {
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    alignSelf: "center",
    position: "relative",
    marginTop: 15,
    width: 256,
    maxWidth: "100%",
    aspectRatio: "1",
  },
  view4: {
    fontFamily: "Verdana, sans-serif",
    borderRadius: 10,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    backgroundColor: "transparent",
    marginTop: 15,
    width: "100%",
    maxWidth: 291,
    alignItems: "center",
    justifyContent: "center",
    padding: "18px 60px",
  },
  view5: {
    fontFamily: "Verdana, sans-serif",
    borderRadius: 10,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#4437D2",
    marginTop: 20,
    width: "100%",
    maxWidth: 291,
    alignItems: "center",
    justifyContent: "center",
    padding: "18px 60px",
  },
});

export default FinalHomeScreen;


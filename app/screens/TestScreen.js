import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import axios from 'axios'; //JS library used for making HTTP requests
import Button from '../../components/Button';
import utf8 from 'utf8'
import base64 from 'base-64'


function TestScreen({navigation}) {
  const [num, setNum] = useState(1);
  const [baseText, setBaseText] = useState("Reverse")
  const [txt,setTxt] = useState();
  const flaskURL = 'http://134.82.182.163:5000/';


  // Pause program until a response is generated
  // send two variables num and mult to server with route specified as multiply
  const timesTwo = async () => {
    try {
      const response = await axios.post(flaskURL + 'multiply', {
        num: { num },
        mult: 2
      });
      setNum(response.data.num);
    } catch (error) {
      console.log("Error sending num", error);
    }
  };

  // Pause program until a response is generated
  // send two variables num and mult to server with route specified as multiply
  const timesThree = async () => {
    try {
      const response = await axios.post(flaskURL + 'multiply', {
        num: { num },
        mult: 3
      });
      setNum(response.data.num);
    } catch (error) {
      console.log("Error sending num", error);
    }
  };

  //resets num to 1
  const resetNum = () => {
    setNum(1);
  };

  //Navigates to home screen
  function toHome(){
    navigation.navigate('Home');
  };

  const transferText = async () => {
    try{
      setTxt(baseText)
      var bytes = utf8.encode(txt);
      var encoded = base64.encode(bytes);
      const response = await axios.post(flaskURL + 'b64Txt', {
        encoded_txt: encoded,
    });
    setTxt(response.data.final);
    }catch (error){
      console.log("error with text", error);
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.numContainer}>
        <Text numberOfLines={1} style={styles.text}>
          {num}
        </Text>
      </View>
      <View style={styles.midContainer}>
        <Button label="x2" onPress={timesTwo} />
        <Button label="x3" onPress={timesThree} />
        <Button label="Reset" onPress={resetNum} />
      </View>
      <View style = {styles.btmContainer}>
        <Text style={{color: 'white'}}>
          {baseText}
        </Text>
        <Button theme="right-arrow" onPress={transferText}/>
        <Text style={{color:"white"}}>
          {txt}
        </Text>
      </View>
      <View style = {styles.footerContainer}>
        <Button theme="home" onPress={toHome}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  midContainer: {
    marginTop: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  btmContainer:{
    width: 450,
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: "row",
    alignSelf: 'center',
    justifyContent: 'space-evenly',
  },
  footerContainer:{
    alignContent:'center',
    justifyContent: 'space-evenly',
  },
  numContainer: {
    width: 200,
    height: 200,
    borderWidth: 4,
    borderColor: 'black',
    borderRadius: 100,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 40,
    color: 'blue'
  },
});

export default TestScreen;

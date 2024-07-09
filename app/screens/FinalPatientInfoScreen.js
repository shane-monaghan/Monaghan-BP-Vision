import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert, TextInput } from 'react-native';
import Button from '../../components/Button';
import * as ImagePicker from 'expo-image-picker';
import { Header } from 'react-native/Libraries/NewAppScreen';

function FinalPatientInfoScreen({navigation}) {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');

    function toSPS(){
        navigation.navigate('SevenPhoto', 
        {
        videoUri: null,
        pictures: [null, null, null, null, null, null, null],
        name: name,
        date: date
        }
        )
    }

  return (
    <View style={styles.view1}>
      <View style={[styles.view2, styles.shadowProp]}>
        <Text style={styles.titleText}>SESSION INFO</Text>
      </View>
      <View style={styles.view3}>
        <View style={styles.view4}>
            <Text style={styles.subHeaderText}>Patient Name</Text>
          <TextInput
            style={[styles.view5, styles.shadowProp]}
            placeholder="Patient Name"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View style={styles.view6}>
          <Text style={styles.subHeaderText}>Date</Text>
          <TextInput
            style={[styles.view5, styles.shadowProp]}
            placeholder="Date"
            value={date}
            onChangeText={(date) => setDate(date)}
          />
        </View>
        <View alignItems="center" marginTop="5%">
            <Button theme="newDefaultButton" label="Next" onPress={toSPS}></Button>
        </View>
        
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view1: {
    backgroundColor: "#ECECEC",
    display: "flex",
    maxWidth: 480,
    width: "100%",
    paddingBottom: 80,
    flexDirection: "column",
    alignItems: "stretch",
    color: "#4437D2",
    height: "100%"
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
  view3: {
    display: "flex",
    marginTop: 36,
    width: "100%",
    flexDirection: "column",
    alignItems: "stretch",
    fontSize: 20,
    fontWeight: "400",
    padding: "0 29px",
    justifyContent: "space-evenly",
    height: "40%"
  },
  view4: {
    fontFamily: "Verdana, sans-serif",
    alignItems: "center"
  },
  view5: {
    borderRadius: 10,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#FFF",
    marginTop: 16,
    flexShrink: 0,
    height: "26%",
    fontSize: "20%",
    textAlign: 'center',
    width: "80%"   
  },
  view6: {
    fontFamily: "Verdana, sans-serif",
    marginTop: 0,
    alignItems: "center"
  },
  view7: {
    borderRadius: 10,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    backgroundColor: "#FFF",
    marginTop: 0,
    flexShrink: 0,
    height: 41,
  },
  view8: {
    fontFamily: "Verdana, sans-serif",
    borderRadius: 10,
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    backgroundColor: "transparent",
    alignSelf: "center",
    marginTop: 57,
    width: 291,
    maxWidth: "100%",
    alignItems: "center",
    color: "#FFF",
    whiteSpace: "nowrap",
    justifyContent: "center",
    padding: "18px 60px",
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
  subHeaderText: {
    fontFamily: "Verdana, sans-serif",
    alignSelf: "left",
    marginLeft: "5%",
    fontSize: "22.5%",
    fontWeight: "600",
    color: "#4437D2"
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});

export default FinalPatientInfoScreen;


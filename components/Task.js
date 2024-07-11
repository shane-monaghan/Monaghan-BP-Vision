import * as React from "react";
import {
  FlatList,
  ScrollView,
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  TextInput,
} from "react-native";

export default function Task({label, content}) {
  return (
    <View style={styles.view}>
        <View style={[styles.background, styles.shadowProp]}>
            <View style={styles.container}>
                <View style={styles.bullet}></View>
                <Text style={styles.text}>{label}</Text>
                <View style={(!content || content === undefined) ? styles.box : styles.checkedBox}></View>
            </View> 
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignContent: "center",
    justifyContent: "center",
  },
  background: {
    marginTop: 15,
    backgroundColor: "white",
    borderRadius: "12%",
    width: 350,
    height: 70,
    alignContent: "center",
    justifyContent: "space-evenly",
    marginLeft: 'auto',
    marginRight: 'auto',
    flexDirection: "row",
    flexShrink: 0,
    flexGrow: 0
  },
  container: {
    width: "100%",
    backgroundColor: "transparent",
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  bullet: {
    backgroundColor: "#D9D9D9",
    width: "6%",
    height: "30%",
    marginLeft: "5%",
    borderRadius: "50%"
  },
  text: {
    color: "#4437D2",
    fontFamily: "Verdana, sans-serif",
    fontSize: "20%",
    marginLeft: "5%",
    flex: 1
  },
  box: {
    backgroundColor: "#D9D9D9",
    width: "13%",
    height: "65%",
    borderRadius: "5%",
    marginRight: "5%"
  },
  checkedBox: {
    backgroundColor: "#4437D2",
    width: "13%",
    height: "65%",
    borderRadius: "5%",
    marginRight: "5%"
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
});
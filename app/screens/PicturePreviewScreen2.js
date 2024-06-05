import React, {useState} from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import Button from '../../components/Button';

const noPic = require('../assets/images/noImageUploaded.png');

function PicturePreview2({ navigation, route }) {
    const {pictures} = route.params;
    const [index, setIndex] = useState(0);
    const pictureTitles = [
        'Face at Rest',
        'Eyes Closed Gently',
        'Eyes Closed Forefully',
        'Eyebrows Elevated',
        'Nose Wrinkled',
        'Pursed Lips',
        'Big Smile',
    ]

  const downOne = () => {
    setIndex(index -1);
  };

  const upOne = () => {
    setIndex(index +1);
  };

  const goBack = () => {
    navigation.goBack();
  }

if (index == 0) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={[styles.text, styles.header]}>{pictureTitles[index]}</Text>
            </View>
            <View style={styles.line}></View>
            {pictures[index] ? (
            <Image style={styles.image} resizeMode='cover' source={{ uri: pictures[index] }} />) 
            : (<Image style={styles.image} resizeMode='cover' source={noPic} />)}
            <View style={styles.oneArrowContainer}>
                <Button theme = "rightArrow" label="->" onPress={upOne} />
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
        </View>
    );
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center'
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
        borderColor: '#00419D',
        width: 350,
        height: 622
      },
      oneArrowContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        top: '85%',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto'
      }
});

export default PicturePreview2;
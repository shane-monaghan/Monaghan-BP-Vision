import { StyleSheet, View, Pressable, Text } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Button({ label, theme, onPress }) {

  //
  if (theme === "toCameraScreen"){
    return(
        <View style = {[styles.buttonContainer, {borderWidth: 4, borderColor: "black", borderRadius: 15}]}
    >
        <Pressable
         style = {[styles.button, {backgroundColor: "white"}]}
         onPress = {onPress}
         >
          <Ionicons
          name = "camera"
          size = {18}
          color = "#25292e"
          style = {styles.buttonIcon}
          />
          <Text style = {[styles.buttonLabel, {color: "#25292e"}]}>{label}</Text>  
         </Pressable>
    </View>
    );
  }
  else if (theme === "toGallery"){
    return(
      <View style = {[styles.buttonContainer, {borderWidth: 4, borderColor: "black", borderRadius: 15}]}>
        <Pressable 
        style = {[styles.button, {backgroundColor: "white"}]}
        onPress = {onPress}
        >
          <FontAwesome
          name = "picture-o"
          size = {18}
          color = "black"
          style = {styles.buttonIcon}/>
          <Text style = {[styles.buttonLabel, {color: "black"}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }
  else if (theme === "takePic"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress}>
      <FontAwesome
          name = "dot-circle-o"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }
  else if (theme === "flipCam"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress}>
      <Ionicons
          name = "sync-circle-outline"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }
  else if (theme === "home"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress}>
      <Ionicons
          name = "home"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }
  else if (theme === "trash"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress}>
      <Ionicons
          name = "trash"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }
  else if (theme === "savePhoto"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress}>
      <Ionicons
          name = "download-outline"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }
  else if (theme === "flashOn"){
    return(
      <View style={styles.flashButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress}>
      <Ionicons
          name = "md-flash-sharp"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }
  else if (theme === "flashOff"){
    return(
      <View style={styles.flashButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress}>
      <Ionicons
          name = "md-flash-off"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress= {onPress}>
        <Text style={[styles.buttonLabel, {color: "white"}]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  flashButtonContainer:{
    position: 'absolute',
    top:16,
    right: 45,
    flexDirection: 'row',
  },
  pictureButtonContainer:{
    width: 60,
    height: 60,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonIcon: {
    paddingRight: 8,
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});

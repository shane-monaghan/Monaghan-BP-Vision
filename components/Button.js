import { StyleSheet, View, Pressable, Text } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Button({ label, theme, onPress }) {

  //To Camera Screen button
  if (theme === "toCameraScreen"){
    return(
        //What container, and alternate settings for that container
        <View style = {[styles.buttonContainer, {borderWidth: 0, borderColor: "white", borderRadius: 15, margin: 30, marginTop: 85}]}
    >
        {/* Declare the button is pressable */}
        <Pressable
         style = {[styles.button, {backgroundColor: '#33ADF0'}]}
         onPress = {onPress}
         accessibilityLanguage='To Home'
         >

          {/* From Ionicons library, use camera picture, alternatively could use FontAwesome library as shown below */}
          <Ionicons
          name = "camera"
          size = {18}
          color = 'white'
          style = {styles.buttonIcon}
          />
          
          {/* Text styling */}
          <Text style = {[styles.buttonLabel, {color: "white"}]}>{label}</Text>  
         </Pressable>
    </View>
    );
  }

  //To gallery button
  else if (theme === "toGallery"){
    return(
      <View style = {[styles.buttonContainer, {borderWidth: 0, borderColor: '#33ADF0', borderRadius: 15}]}>
        <Pressable 
        style = {[styles.button, {backgroundColor: "white"}]}
        onPress = {onPress}
        >
          <FontAwesome
          name = "picture-o"
          size = {18}
          color = '#33ADF0'
          style = {styles.buttonIcon}/>
          <Text style = {[styles.buttonLabel, {color: '#33ADF0'}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }

  else if (theme === "saveSession"){
    return(
      <View style = {[styles.buttonContainer, {borderWidth: 0, borderColor: "black", borderRadius: 15}]}>
        <Pressable 
        style = {[styles.button, {backgroundColor: "white"}]}
        onPress = {onPress}
        >
          <FontAwesome
          name = "save"
          size = {18}
          color = "black"
          style = {styles.buttonIcon}/>
          <Text style = {[styles.buttonLabel, {color: "black"}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }

  // Record Video Button
  else if (theme === "recordVideo"){
    return(
      <View style = {styles.sessionMenuButtonContainer}>
        <Pressable 
        style = {[styles.button, {backgroundColor: "#00419D"}]}
        onPress = {onPress}
        >
          <Text style = {[styles.buttonLabel, {color: "white"}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }

  // Preview Button
  else if (theme === "previewButton"){
    return(
      <View style = {styles.sessionMenuButtonContainer}>
        <Pressable 
        style = {[styles.button, {backgroundColor: "white", borderWidth: 1, borderColor: "#00419D"}]}
        onPress = {onPress}
        >
          <Text style = {[styles.buttonLabel, {color: "#00419D"}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }

  // Home Button
  else if (theme === "homeButton"){
    return(
      <View style = {styles.sessionMenuButtonContainer}>
        <Pressable 
        style = {[styles.button, {backgroundColor: "#00419D"}]}
        onPress = {onPress}
        >
          <Text style = {[styles.buttonLabel, {color: "white"}]}>{label}</Text>
        </Pressable>
      </View>
    )
  }

  //Take picture button
  else if (theme === "takePic"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Take Picture Button'>
      <FontAwesome
          name = "dot-circle-o"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Flip camera direction button
  else if (theme === "flipCam"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Switch to Front or Back Camera Button'>
      <Ionicons
          name = "sync-circle-outline"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Back Button
  else if (theme === "backButton"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Go back to previous screen'>
      <Ionicons
          name = "ios-return-up-back"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  else if (theme === "checkbox"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Go back to previous screen'>
      <Ionicons
          name = "checkbox"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //To homescreen button
  else if (theme === "home"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Go to Home Page Button'>
      <Ionicons
          name = "home"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Trash button
  else if (theme === "trash"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Delete Photo Button'>
      <Ionicons
          name = "trash"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Right Arrow Button
  else if (theme === "right-arrow"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Transfer to right'>
      <Ionicons
          name = "md-arrow-forward-circle"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  else if (theme === "left-arrow"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Transfer to right'>
      <Ionicons
          name = "md-arrow-back-circle"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Login Button
  else if (theme === "login"){
    return(
      <View style={styles.loginButtonContainer}>
        <Pressable style={styles.loginButton} onPress= {onPress} accessible={true} accessibilityLabel='Login'>
          <Text> Login </Text>
        </Pressable>
      </View>
    )
  }
  else if (theme === "register"){
    return(
      <View style={styles.loginButtonContainer}>
        <Pressable style={styles.loginButton} onPress= {onPress} accessible={true} accessibilityLabel='Login'>
          <Text> Register </Text>
        </Pressable>
      </View>
    )
  }

  //Save photo button
  else if (theme === "savePhoto"){
    return(
      <View style={styles.pictureButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Save to Camera Roll Button'>
      <Ionicons
          name = "download-outline"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Start Recoding Button
  else if (theme === "startRecording"){
    return(
      <View style={styles.psButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Start recording button'>
      <FontAwesome
          name = "play-circle-o"
          size = {65}
          color = "green"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Stop Recording Button
  else if (theme === "stopRecording"){
    return(
      <View style={styles.psButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Stop recording button'>
      <FontAwesome
          name = "stop-circle-o"
          size = {65}
          color = "red"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Preview photos button
  else if (theme === "preview"){
    return(
      <View style={styles.previewTextContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Preview Photos'>
      <Text style={{color:'white', fontSize:20}}>
        Preview
      </Text>
      </Pressable>
    </View>
    )
  }

  //Flash on button (displayed when flash is on)
  else if (theme === "flashOn"){
    return(
      <View style={styles.flashButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Turn Flash Off Button'>
      <Ionicons
          name = "md-flash-sharp"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Flash off button (displayed when flash is off)
  else if (theme === "flashOff"){
    return(
      <View style={styles.flashButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress} accessible={true} accessibilityLabel='Turn Flash On Button'>
      <Ionicons
          name = "md-flash-off"
          size = {55}
          color = "white"
          style = {styles.buttonIcon}/>
      </Pressable>
    </View>
    )
  }

  //Generic button
  return (
    <View style={styles.textButtonContainer}>
      <Pressable style={styles.button} onPress= {onPress}>
        <Text style={[styles.buttonLabel, {color: "white"}]}>{label}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: 320,
    height: 60,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  sessionMenuButtonContainer: {
    width: 320,
    height: 60,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  textButtonContainer: {
    width: 320,
    height: 45,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  loginButtonContainer: {
    width: 90,
    height: 45,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    paddingBottom: 40,
  },
  loginButton: {
    width: 90,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 3,
    borderRadius: 12,
  },
  previewTextContainer:{
    width: 80,
    height: 60,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  psButtonContainer:{
    width: 60,
    height: 60,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
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
    fontSize: 20,
    fontWeight: 'bold'
  },
});

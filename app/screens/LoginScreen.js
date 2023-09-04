import React, { useState, useContext } from 'react';
import { View, Text, Image, TextInput, SafeAreaView, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Button from '../../components/Button';

const temp_logo = require('../assets/images/BP_logo.png');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, register } = useContext(AuthContext);
  const [needRegister, setNeedRegister] = useState(false);

  const handleLogin = () => {
    login(username, password);
  };

  const handleRegister = () => {
    register(username, password);
  };

  if (needRegister) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={{ height: 300 }} source={temp_logo} resizeMode="contain" />
          <Text style={{ marginTop: 30, fontSize: 28, fontWeight: '500' }}>Welcome</Text>
        </View>
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
          />
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <Button theme="register" onPress={handleRegister} />
          <Button
            label="Already have an account? Login here"
            onPress={() => setNeedRegister(false)}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <Image style={{ height: 300 }} source={temp_logo} resizeMode="contain" />
          <Text style={{ marginTop: 30, fontSize: 28, fontWeight: '500' }}>Welcome</Text>
        </View>
        <View style={styles.loginContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            value={username}
            onChangeText={text => setUsername(text)}
          />
          <TextInput
            style={styles.textInput}
            secureTextEntry={true}
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
          />
          <Button theme="login" onPress={handleLogin} />
          <Button
            label="Don't have an account? Register here."
            onPress={() => setNeedRegister(true)}
          />
        </View>
      </SafeAreaView>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textInput: {
    width: 300,
    borderColor: 'black',
    height: 50,
    borderWidth: 3,
    borderRadius: 12,
    marginTop: 20,
    backgroundColor: 'white',
  }
});

export default LoginScreen;

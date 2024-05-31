import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {createContext, useState, useEffect} from "react";
import axios from "axios";


export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState(null);
    // const flaskURL = 'http://134.82.182.163:5000/';
    // const flaskURL = 'http://134.82.163.84:5000/'; //SCHOOL 2
    const flaskURL = 'http://134.82.187.57:5000/';
    const [registeredUsers, setRegisteredUsers] = useState([]);

    const login = async (username, password) => {
        console.log("Username: ", username);
        console.log("Password: ", password);
        try {
          const response = await axios.post(flaskURL + 'login', {
            username: username,
            password: password,
          });
      
          const data = response.data;
      
          if (data.success) {
            setIsLoading(true);
            setUserToken(username);
            AsyncStorage.setItem('userToken', username);
            setIsLoading(false);
          } else {
            alert("Incorrect username/password");
            alert(data.message);
          }
        } catch (error) {
          console.log('Login Error: ', error);
        }
      };
      
      const register = async (username, password) => {
        try {
          const response = await axios.post(flaskURL + 'register', {
            username: username,
            password: password,
          });
      
          const data = response.data;
      
          if (data.success) {
            setRegisteredUsers([...registeredUsers, { username, password }]);
            setIsLoading(true);
            setUserToken(username);
            AsyncStorage.setItem('userToken', username);
            setIsLoading(false);
          } else {
            alert(data.message);
          }
        } catch (error) {
          console.log('Register Error: ', error);
        }
      };

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        AsyncStorage.removeItem('userToken');
        setIsLoading(false)
    }

    const isLoggedIn = async () => {
        try{
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem("userToken");
            setUserToken(userToken);
            setIsLoading(false);
        }catch(error){
            console.log("IsLoggedIn: ", error);
        }
    }

    const loadRegisteredUsers= async() => {
        try{
            const jsonUsers = await AsyncStorage.getItem('registeredUsers');
            if(jsonUsers){
                const users = JSON.parse(jsonUsers);
                setRegisteredUsers(users);
            }
        }catch(error){
            console.log("Error Loading Users: ", error);
        }
    }

    const saveRegisteredUsers = async() =>{
        try{
            const jsonUsers = JSON.stringify(registeredUsers);
            await AsyncStorage.setItem("registeredUsers", jsonUsers);
        } catch(error){
            console.log("Error saving users: ", error);
        }
    }



    useEffect(() => {
        isLoggedIn();
    }, []);

    useEffect(() => {
        loadRegisteredUsers();
    }, []);
    useEffect(() => {
        saveRegisteredUsers();
    }, [registeredUsers]);

    return(
        <AuthContext.Provider value = {{login, logout, register, isLoading, userToken}}>
            {children}
        </AuthContext.Provider>
    );
}
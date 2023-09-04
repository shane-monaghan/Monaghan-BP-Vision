import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/Button';

function SavedSessionsScreen({ navigation }) {
  const [savedSessions, setSavedSessions] = useState({});

  useEffect(() => {
    const fetchSavedSessions = async () => {
      try {
        const savedSessionsData = await AsyncStorage.getItem('savedSessions');
        if (savedSessionsData) {
          const sessions = JSON.parse(savedSessionsData);
          setSavedSessions(sessions);
        }
      } catch (error) {
        console.log('Error fetching saved sessions:', error);
      }
    };

    fetchSavedSessions();
  }, []);

  const renderSessionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.sessionItem}
      onPress={() => navigation.navigate('SavedDates', { name: item })}
    >
      <Text style={styles.sessionText}>{item}</Text>
    </TouchableOpacity>
  );

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerText}>Patients</Text>
        </View>
        <View style = {styles.sessionsContainer}>
            {Object.keys(savedSessions).length > 0 ? (
                <FlatList
                data={Object.keys(savedSessions)}
                renderItem={renderSessionItem}
                keyExtractor={(item) => item}
                />
            ) : (
                <Text>No saved sessions found.</Text>
            )}
        </View>
        <View style = {styles.backButton}>
            <Button theme = "backButton" onPress = {goBack}/>
        </View>
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
  },
  header: {
    top: 60,
    borderBottomColor: 'black',
    borderBottomWidth: 3,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    bottom: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  sessionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'gray',
    top: 80,
  },
  sessionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  sessionText: {
    fontSize: 18,
    color: 'black',
  },
});

export default SavedSessionsScreen;

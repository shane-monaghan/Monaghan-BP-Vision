
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../../components/Button';

function SavedDatesScreen({ navigation, route }) {
  const { name } = route.params;
  const [sessionDates, setSessionDates] = useState([]);

  useEffect(() => {
    const fetchSessionDates = async () => {
      try {
        const savedSessionsData = await AsyncStorage.getItem('savedSessions');
        if (savedSessionsData) {
          const sessions = JSON.parse(savedSessionsData);
          const dates = sessions[name] ? Object.keys(sessions[name]) : [];
          setSessionDates(dates);
        }
      } catch (error) {
        console.log('Error fetching session dates:', error);
      }
    };

    fetchSessionDates();
  }, [name]);

  const renderDateItem = ({ item }) => (
    <TouchableOpacity
      style={styles.dateItem}
      onPress={() => {
        // Perform any actions you want when a date is pressed
        // Get the savedSessions data from AsyncStorage
        AsyncStorage.getItem('savedSessions').then((data) => {
          const sessions = JSON.parse(data);
          const originalPictures = sessions[name][item].originalPictures;
          const pictures = sessions[name][item].pictures;
          
          // Navigate to DataScreen2 and pass the required data
          navigation.navigate('DataScreen2', {
            name: name,
            date: item,
            originalPictures: originalPictures,
            pictures: pictures,
          });
        }).catch((error) => {
          console.log('Error retrieving savedSessions:', error);
        });
      }}
    >
      <Text style={styles.dateText}>{item}</Text>
    </TouchableOpacity>
  );

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Dates</Text>
      </View>
      <View style={styles.sessionsContainer}>
        {sessionDates.length > 0 ? (
          <FlatList
            data={sessionDates}
            renderItem={renderDateItem}
            keyExtractor={(item) => item}
          />
        ) : (
          <Text style={styles.dateText}>No dates found for this session.</Text>
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
  dateItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  dateText: {
    fontSize: 18,
    color: 'black',
  },
  backButton: {
    bottom: 50,
  },
});

export default SavedDatesScreen;

import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {
  Avatar,
  Divider,
  ListItem as RNEListItem,
  Text,
} from 'react-native-elements';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import AgeIcon from '../assets/age.svg';
import InterestIcon from '../assets/heart.svg';
import LocationIcon from '../assets/location.svg';
import DislikeIcon from '../assets/dislike.svg';
import {Card} from 'react-native-paper';

const ListItem = ({navigation, singleMedia, myFilesOnly}) => {
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({username: 'fetching...'});
  const [additionData, setAdditionData] = useState({fullname: 'fetching...'});

  const fetchOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      // console.log('singlemedia', singleMedia);
      // console.log('user_id', singleMedia.user_id);
      const userData = await getUserById(singleMedia.user_id, token);
      // console.log('user data', userData);
      setOwner(userData);
      const allData = JSON.parse(userData.full_name);
      // console.log('addition data in listitem.js', allData);
      setAdditionData(allData);
    } catch (error) {
      Alert.alert([{text: 'Load owner failed'}]);
      console.error('fetch owner error', error);
      setOwner({username: '[not available]'});
      setAdditionData({fullname: '[not available]'});
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  return (
    <ScrollView>
      <RNEListItem
        onPress={() => {
          navigation.navigate('Single', {file: singleMedia});
        }}
      >
        <Card style={styles.card}>
          {!myFilesOnly && (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}
            >
              <Text style={styles.name}>{additionData.fullname}</Text>
              <DislikeIcon style={styles.x}></DislikeIcon>
            </View>
          )}
          <Avatar
            containerStyle={styles.avatar}
            source={{uri: uploadsUrl + singleMedia.thumbnails.w640}}
          ></Avatar>
          {!myFilesOnly && (
            <View style={{flexDirection: 'row'}}>
              <AgeIcon style={styles.ageIcon}></AgeIcon>
              <Text style={styles.text}>{additionData.age}</Text>
              <Divider
                orientation="vertical"
                style={{marginTop: 12, marginRight: 10}}
              />
              <LocationIcon style={styles.icons}></LocationIcon>
              <Text style={styles.text}>{additionData.location}</Text>
              <Divider
                orientation="vertical"
                style={{marginTop: 12, marginRight: 10}}
              />
              <InterestIcon style={styles.icons}></InterestIcon>
              <Text style={styles.text}>{additionData.interests}</Text>
            </View>
          )}
        </Card>
      </RNEListItem>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  name: {
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    width: '100%',
    height: 380,
    margin: 0,
    padding: 0,
    borderColor: '#EB6833',
    borderRadius: 10,
    borderWidth: 1,
  },
  avatar: {
    width: '100%',
    height: '75%',
  },
  text: {
    fontSize: 16,
    marginTop: 12,
    marginRight: 25,
  },
  icons: {
    marginTop: 12,
    marginRight: 5,
    marginLeft: 15,
  },
  x: {
    marginTop: 10,
    marginRight: 5,
  },
  ageIcon: {
    marginTop: 9,
    marginRight: 5,
    marginLeft: 25,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;

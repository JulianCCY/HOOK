/* eslint-disable camelcase */
import {
  View,
  Text,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Input, ListItem} from 'react-native-elements';
import {Button} from 'react-native-paper';
import {PropTypes} from 'prop-types';
import {SafeAreaView} from 'react-native';
import GlobalStyles from '../utils/GlobalStyles';
import {StatusBar} from 'expo-status-bar';
import {useMedia, useComment, useUser} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {AutoScrollFlatList} from 'react-native-autoscroll-flatlist';
import BackIcon from '../assets/back.svg';
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_500Medium,
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import AppLoading from 'expo-app-loading';
import SendIcon from '../assets/send.svg';

const SingleChat = ({route, navigation}) => {
  const {item} = route.params;

  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_500Medium,
    Poppins_400Regular,
  });

  const {loadMessage, setLoadMessage, user, token} = useContext(MainContext);

  const {getAllMediaByCurrentUserId, getMediaByUserId} = useMedia();
  const {getCommentByFileId, postComment} = useComment();
  const {getUserByToken} = useUser();

  const [additionData, setAdditionData] = useState({fullname: 'fetching...'});
  const [allMessage, setAllMessage] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [currentUserId, setCurrentUserId] = useState(user.user_id);
  const [hookUserId] = useState(item.user_id);
  const [seconds, setSeconds] = useState(0);

  const fetchAllMessage = async () => {
    try {
      // get string data of user (in full_name field)
      const allData = await JSON.parse(item.full_name);
      const myId = (await getUserByToken(token)).user_id;
      setCurrentUserId(myId);
      let messageHistory = [];

      // get messages from hook to current user in all files
      const userFiles = await getAllMediaByCurrentUserId(token);
      const userFilesId = userFiles.map((file) => file.file_id);
      for (const fileId of userFilesId) {
        let messageScraping = await getCommentByFileId(fileId);
        messageScraping = messageScraping.filter(
          (obj) => obj.user_id === hookUserId
        );
        messageHistory = messageHistory.concat(messageScraping);
      }

      // get messages from current user to hook in all files
      const hookFile = await getMediaByUserId(hookUserId);
      const hookFileId = hookFile.map((file) => file.file_id);

      for (const fileId of hookFileId) {
        let messageScraping = await getCommentByFileId(fileId);
        messageScraping = messageScraping.filter(
          (obj) => obj.user_id === currentUserId
        );
        messageHistory = messageHistory.concat(messageScraping);
      }

      // sort messages by time
      messageHistory.sort((a, b) => (a.comment_id > b.comment_id ? 1 : -1));
      setAllMessage(messageHistory);
      setAdditionData(allData);
    } catch (error) {
      console.log('Fetch all messages error', error);
    }
  };

  const sendMessage = async () => {
    // send message to hook's avatar file
    try {
      const hookUserId = item.user_id;
      const hookFile = await getMediaByUserId(hookUserId);
      const hookAvatarFile = hookFile.filter(
        (obj) => obj.title.toLowerCase() === 'avatar'
      );
      if (token) {
        if (newComment !== '') {
          await postComment(hookAvatarFile.pop().file_id, newComment, token);
          setLoadMessage(!loadMessage);
        } else {
          Alert.alert('Cannot send empty message.', 'Write something!');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // force reload in 0.5s
  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds === 100) {
        setSeconds(0);
      } else {
        setSeconds(seconds + 1);
      }
      fetchAllMessage();
    }, 500);
    return () => clearInterval(interval);
  }, [loadMessage]);

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        <SafeAreaView style={GlobalStyles.AndroidSafeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            style={styles.container}
            enabled
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: 10,
              }}
            >
              <BackIcon
                style={styles.back}
                onPress={() => {
                  navigation.navigate('Chat');
                }}
              ></BackIcon>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: '8%',
                }}
              >
                <Avatar
                  style={styles.avatar}
                  avatarStyle={{
                    borderRadius: 60,
                  }}
                  source={{uri: uploadsUrl + item.filename}}
                />
                <View style={{flexDirection: 'column', marginLeft: 10}}>
                  <Text style={styles.username}>{item.username}</Text>
                  <Text style={styles.interests}>
                    {typeof additionData.interests !== 'undefined'
                      ? additionData.interests !== 'none'
                        ? additionData.interests.split(',').length < 2
                          ? additionData.interests.split(',')[0]
                          : additionData.interests.split(',')[0] +
                            ', ' +
                            additionData.interests.split(',')[1]
                        : ''
                      : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* message content */}
            <AutoScrollFlatList
              style={{marginBottom: 20, marginTop: 20}}
              data={allMessage}
              keyExtractor={(item) => item.comment_id.toString()}
              renderItem={({item}) => (
                <ListItem
                  containerStyle={{
                    padding: 5,
                    marginLeft: 5,
                    marginRight: 5,
                  }}
                  style={
                    item.user_id === currentUserId
                      ? styles.currentList
                      : styles.none
                  }
                >
                  <View
                    style={
                      item.user_id === currentUserId
                        ? styles.current
                        : styles.hook
                    }
                  >
                    <Text
                      style={
                        item.user_id === currentUserId
                          ? styles.currentUser
                          : styles.hookUser
                      }
                    >
                      {item.comment}
                    </Text>
                  </View>
                </ListItem>
              )}
            />

            {/* input */}
            <View
              style={{
                marginBottom: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Input
                containerStyle={{
                  width: '80%',
                  height: 50,
                  borderColor: '#EDE0DA',
                  borderWidth: 1,
                  borderRadius: 10,
                  marginLeft: 15,
                }}
                inputStyle={styles.inputStyle}
                inputContainerStyle={{
                  borderBottomWidth: 0,
                }}
                value={newComment}
                autoCapitalize="none"
                placeholder="Type your message..."
                onChangeText={(value) => setNewComment(value)}
              />
              <Button
                icon={SendIcon}
                onPress={() => {
                  sendMessage();
                  setNewComment('');
                }}
              ></Button>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
        <StatusBar style="auto"></StatusBar>
      </>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    marginLeft: 20,
  },
  avatar: {
    height: 50,
    width: 50,
  },
  username: {
    fontSize: 18,
    fontFamily: 'Poppins_600SemiBold',
  },
  interests: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    color: '#7C7878',
  },
  current: {
    borderRadius: 15,
    backgroundColor: '#FFA04B',
  },
  currentList: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  currentUser: {
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'right',
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
  },
  hookUser: {
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'right',
    fontSize: 15,
    fontFamily: 'Poppins_500Medium',
  },
  hook: {
    borderRadius: 15,
    backgroundColor: '#FB848D',
  },
  none: {},
  inputStyle: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10,
    color: '#EB6833',
  },
});

SingleChat.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default SingleChat;

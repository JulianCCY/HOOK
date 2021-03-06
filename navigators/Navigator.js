import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '../views/Home';
import Profile from '../views/Profile';
import Single from '../views/Single';
import Login from '../views/Login';
import {MainContext} from '../contexts/MainContext';
import {Image} from 'react-native-elements';
import ModifyUser from '../views/ModifyUser';
import Chat from '../views/Chat';
import Like from '../views/Like';
import Search from '../views/Search';
import SingleChat from '../views/SingleChat';
import FirstLand from '../views/FirstLand';
import Instructions from '../views/Instructions';
import Preference from '../views/Preference';
import Interests from '../views/Interests';
import Upload from '../views/Upload';
import EditProfile from '../views/EditProfile';
import Match from '../views/Match';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          justifyContent: 'center',
          alignContent: 'center',
          height: '9%',
          border: 0,
          margin: 0,
          padding: 0,
        },
        tabBarIcon: ({focused}) => {
          if (route.name === 'Home') {
            return focused ? (
              <Image
                source={require('../assets/hookiconActive.png')}
                style={{height: 25, width: 25}}
              />
            ) : (
              <Image
                source={require('../assets/hookiconNotActive.png')}
                style={{height: 25, width: 25}}
              />
            );
          }

          if (route.name === 'Like') {
            return focused ? (
              <Image
                source={require('../assets/heartActive.png')}
                style={{height: 25, width: 25}}
              />
            ) : (
              <Image
                source={require('../assets/heartNotActive.png')}
                style={{height: 25, width: 25}}
              />
            );
          }

          if (route.name === 'Search') {
            return focused ? (
              <Image
                source={require('../assets/searchActive.png')}
                style={{height: 25, width: 25}}
              />
            ) : (
              <Image
                source={require('../assets/searchNotActive.png')}
                style={{height: 25, width: 25}}
              />
            );
          }

          if (route.name === 'Chat') {
            return focused ? (
              <Image
                source={require('../assets/chatActive.png')}
                style={{height: 25, width: 25}}
              />
            ) : (
              <Image
                source={require('../assets/chatNotActive.png')}
                style={{height: 25, width: 25}}
              />
            );
          }

          if (route.name === 'Profile') {
            return focused ? (
              <Image
                source={require('../assets/userActive.png')}
                style={{height: 25, width: 25}}
              />
            ) : (
              <Image
                source={require('../assets/userNotActive.png')}
                style={{height: 25, width: 25}}
              />
            );
          }
        },
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      ></Tab.Screen>
      <Tab.Screen
        name="Like"
        component={Like}
        options={{headerShown: false}}
      ></Tab.Screen>
      <Tab.Screen
        name="Search"
        component={Search}
        options={{headerShown: false}}
      ></Tab.Screen>
      <Tab.Screen
        name="Chat"
        component={Chat}
        options={{headerShown: false}}
      ></Tab.Screen>
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const {isLoggedIn, instruction} = useContext(MainContext);

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        instruction ? (
          <>
            <Stack.Screen
              name="Instructions"
              component={Instructions}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Main"
              component={TabScreen}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Single"
              component={Single}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Preferences"
              component={Preference}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Upload"
              component={Upload}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Edit Profile"
              component={EditProfile}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Modify user"
              component={ModifyUser}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Interests"
              component={Interests}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Match"
              component={Match}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="SingleChat"
              component={SingleChat}
              options={{headerShown: false}}
            ></Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={TabScreen}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Single"
              component={Single}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Preferences"
              component={Preference}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Upload"
              component={Upload}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Edit Profile"
              component={EditProfile}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Modify user"
              component={ModifyUser}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Instructions"
              component={Instructions}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Interests"
              component={Interests}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="Match"
              component={Match}
              options={{headerShown: false}}
            ></Stack.Screen>
            <Stack.Screen
              name="SingleChat"
              component={SingleChat}
              options={{headerShown: false}}
            ></Stack.Screen>
          </>
        )
      ) : (
        <>
          <Stack.Screen
            name="FirstLand"
            component={FirstLand}
            options={{headerShown: false}}
          ></Stack.Screen>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          ></Stack.Screen>
          <Stack.Screen
            name="SingleChat"
            component={SingleChat}
            options={{headerShown: false}}
          ></Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen></StackScreen>
    </NavigationContainer>
  );
};

export default Navigator;

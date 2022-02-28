/* eslint-disable max-len */
import React, {useContext} from 'react';
import {Button, Input} from 'react-native-elements';
import {Alert, View, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useLogin, useUser} from '../hooks/ApiHooks';
import {LinearGradient} from 'expo-linear-gradient';
import FullnameIcon from '../assets/fullname.svg';
import UserIcon from '../assets/userIcon.svg';
import PasswordIcon from '../assets/password.svg';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterForm = ({setFormToggle}) => {
  const {postUser, checkUsername} = useUser();
  const {postLogin} = useLogin();
  const {setInstruction, setUser, setIsLoggedIn} = useContext(MainContext);
  const {
    getValues,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  const onLogin = async (data) => {
    console.log(data);
    try {
      const userData = await postLogin(data);
      console.log('userData after register', userData);
      await AsyncStorage.setItem('userToken', userData.token);
      console.log('token after register', userData.token);
      setUser(userData.user);
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert('Fail', 'Username or password maybe wrong');
      console.error(error);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      delete data.password_again;
<<<<<<< HEAD
      // TODO: randomize email to post user
      data.email = 'test@a.fi';
=======
      const additionData = {
        deleted_hook: 0,
        fullname: data.username,
        work: 'none',
        job: 'none',
        interests: 'none',
        education_level: 'none',
        school: 'none',
        religious_beliefs: 'none',
        preference_drinking: 'none',
        gender: 'nonbinary',
        age: 0,
        height: 0,
        location: 'none',
        nationality: 'none',
        preference_smoking: 'none',
        family_plan: 'none',
        drinking: 'none',
        smoking: 'none',
        interested: 'nonbinary',
        preference_location: 'none',
        age_range: 'none',
        preference_distance: 0,
        preference_nationality: 'none',
        preference_religion: 'none',
        preference_height: 'none',
        pet: 'none',
        preference_pet: 'none',
        pets: 'none',
        dog_friend: 'none',
        hiking: 'none',
        books: 'none',
      };
      data.full_name = JSON.stringify(additionData);
      data.append('email', `${data.username}@additionData.fi`);
>>>>>>> 53751aa (login and register only allow for app's user)
      const userData = await postUser(data);
      setInstruction(true);
      console.log('register onSubmit', userData);
      if (userData) {
        setFormToggle(true);
        Alert.alert('Success', 'User created successfully! Please login!');
        delete data.full_name;
        delete data.email;
        console.log('data for login', data);
        onLogin(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      {/* <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          pattern: {
            value:
              /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: 'Please enter a valid email!',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="email"
            errorMessage={errors.email && errors.email.message}
          />
        )}
        name="email"
      /> */}
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 3,
            message: 'Username must be at least 3 characters',
          },
          validate: async (value) => {
            try {
              const available = await checkUsername(value);
              console.log('available', available);
              if (available) {
                return true;
              } else {
                return 'Username is already taken!';
              }
            } catch (error) {
              throw Error(error.message);
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            placeholder="username"
            errorMessage={errors.username && errors.username.message}
            leftIcon={<UserIcon />}
            leftIconContainerStyle={styles.userIcon}
          />
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          minLength: {
            value: 3,
            message: 'Full name must be at least 3 characters',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="words"
            placeholder="fullname"
            errorMessage={errors.full_name && errors.full_name.message}
            leftIcon={<FullnameIcon />}
            leftIconContainerStyle={styles.userIcon}
          />
        )}
        name="full_name"
      />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          minLength: {
            value: 5,
            message: 'Password must be at least 5 characters',
          },
          pattern: {
            value: /(?=.*[0-9])(?=.*[A-Z])/,
            message: 'One number and one capital letter required!',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="password"
            errorMessage={errors.password && errors.password.message}
            leftIcon={<PasswordIcon />}
            leftIconContainerStyle={styles.userIcon}
          />
        )}
        name="password"
      />
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'This is required.'},
          validate: async () => {
            const password1 = getValues('password');
            const password2 = getValues('password_again');
            if (password1 === password2) {
              return true;
            } else {
              return 'Password is not match!';
            }
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            secureTextEntry={true}
            placeholder="enter password again"
            errorMessage={
              errors.password_again && errors.password_again.message
            }
            leftIcon={<PasswordIcon />}
            leftIconContainerStyle={styles.userIcon}
          />
        )}
        name="password_again"
      />

      <Button
        title="REGISTER"
        onPress={handleSubmit(onSubmit)}
        buttonStyle={styles.button}
        ViewComponent={LinearGradient}
        linearGradientProps={{
          colors: ['#FF707B', '#FF934E'],
          start: {x: 0, y: 0},
          end: {x: 1, y: 0},
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    width: '60%',
    alignSelf: 'center',
    marginTop: 10,
    fontFamily: 'Poppins_700Bold',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    elevation: 4,
  },
  userIcon: {
    paddingRight: 10,
  },
});

RegisterForm.propTypes = {
  setFormToggle: PropTypes.func,
  navigation: PropTypes.object,
};

export default RegisterForm;

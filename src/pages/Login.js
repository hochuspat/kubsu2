import { View, StyleSheet, Text, TextInput, TouchableOpacity, Modal, ImageBackground } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';

import { useDispatch, useSelector } from "react-redux"
import { userAuthorized, userUnauthorized } from "../actions";

import * as SecureStore from 'expo-secure-store';

import useHttp from '../hooks/http.hook'
import { API_URL } from "@env"

export default function Login() {

  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()
  
  const { request } = useHttp()


  const [username, setUsername] = useState('s00000000@edu.kubsu.ru');
  const [password, setPassword] = useState('');

  const checkAuth = async () => {
    let token = await SecureStore.getItemAsync('authToken')
    if (token) {
      request(`${API_URL}/user/auth`, 'GET', null, {'Authorization': `Bearer ${token}`})
      .then(async res => {
        await SecureStore.setItemAsync('authToken', res.token)
        dispatch(userAuthorized())
      })
      .catch(e => console.log(e))
    } else {
      dispatch(userUnauthorized())
    }
  }

  const login = () => {
    request(`${API_URL}/user/login`, 'POST', {login: username, password})
    .then(async res => {
      await SecureStore.setItemAsync('authToken', res.token)
      dispatch(userAuthorized())
    })
    .catch(e => console.log(e))
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (

    <Modal
      visible={auth == 'unauthorized'}
      transparent
      animationType="slide"
    >
      <ImageBackground
        source={require('../images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Войдите в свой аккаунт</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Логин:</Text>
              <TextInput
                style={[styles.input, { color: '#9398A1' }]}
                value={username}
                onChangeText={setUsername}
                required
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Пароль:</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                required
              />
            </View>

            <TouchableOpacity style={styles.button} onPress={login}>
              <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>
          </View>
        </View>  
      </ImageBackground>

    </Modal>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
    width: '100%', 
    marginHorizontal: 0 
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    color: '#0E0F0F',
    marginBottom: 20,
    fontWeight: '500'
  },
  formGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  },
  label: {
    fontSize: 18,
    marginRight: 10
  },
  input: {
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    maxWidth: 300,
    backgroundColor: '#EEEEEF',
  },
  message: {
    fontSize: 18,
    marginVertical: 10
  },
  error: {
    color: 'red'
  }
});

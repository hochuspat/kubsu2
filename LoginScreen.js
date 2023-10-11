import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('s00000000@edu.kubsu.ru');  
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Попытка получить сохраненное имя пользователя при загрузке экрана
    const loadUsername = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem('username');
        if (savedUsername !== null) {
          setUsername(savedUsername);
        }
      } catch (error) {
        console.error('Ошибка при загрузке имени пользователя из AsyncStorage:', error);
      }
    };

    loadUsername();
  }, []);

  const handleSubmit = async () => {
    setMessage('');

    const requestData = {
      username: username,
      password: password
    };

    try {
      const response = await fetch('http://212.192.134.23/validate-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

        // Сохранение имени пользователя в AsyncStorage после успешной аутентификации
        await AsyncStorage.setItem('username', username);

        navigation.navigate('Мероприятия');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setMessage(error.message);
    }

    setPassword('');
  };

  return (
    <ImageBackground
      source={require('./Zastavka.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Добро пожаловать</Text>
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
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Войти</Text>
          </TouchableOpacity>
          {message && (
            <Text style={[styles.message, message.startsWith('Error') && styles.error]}>
              {message}
            </Text>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};
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
    marginBottom: 20
  },
  formGroup: {
    flexDirection: 'row',
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

export default LoginScreen;

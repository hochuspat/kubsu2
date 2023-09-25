import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [buttons, setButtons] = useState([]);

  useEffect(() => {
    fetch('http://192.168.0.59:3002/user')
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error(error));

    fetch('http://192.168.0.59:3002/buttons')
      .then((response) => response.json())
      .then((data) => setButtons(data))
      .catch((error) => console.error(error));
  }, []);


  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInUp" duration={1000} delay={500} style={styles.profileContainer}>
        <View style={styles.avatar}>
          {user.photo ? (
            <Image style={styles.avatarImage} source={{ uri: user.photo }} />
          ) : (
            <AntDesign name="user" size={54} color="#007BFF" />
          )}
        </View>
        <View style={styles.profile}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.info}>
            {user.faculty}, {user.course}
          </Text>
        </View>
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={1000} delay={500} style={styles.buttons}>
        {buttons.map((button, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate(button.screen)}>
            <View style={styles.buttonContainer}>
              <Image style={styles.buttonImage} source={{ uri: button.image }} />
              <View style={styles.buttonTextContainer}>
                <Text style={styles.buttonText}>{button.title}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </Animatable.View>
      <Animatable.View animation="fadeInUp" duration={1000} delay={500} style={styles.additionalOptions}>
        <TouchableOpacity
          onPress={() => {
            const telegramBotUrl = 'https://t.me/StudentsLifeKubsu_bot';

            Linking.openURL(telegramBotUrl)
              .catch((error) => {
                console.error('Ошибка при открытии ссылки: ', error);
              });
          }}
        >
          <View style={styles.additionalOptionsButton}>
            <Text style={styles.additionalOptionsButtonText}>Дополнительные возможности</Text>
          </View>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  profileContainer: {
    backgroundColor: '#323643',
    borderRadius: 12,
    width: '90%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  profile: {
    marginRight: 10,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 54,
    justifyContent: 'center',
  },
  avatarImage: {
    width: 54,
    height: 54,
    borderRadius: 54,
  },
  name: {
    color: '#FFF',
    fontFamily: 'Abel',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
  },
  info: {
    color: '#9398A1',
    fontFamily: 'Abel',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 12,
  },
  buttons: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  buttonImage: {
    width: 170,
    height: 160,
  },
  buttonTextContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  additionalOptions: {
    backgroundColor: '#323643',
    borderRadius: 12,
    width: '90%',
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 20,
  },
  additionalOptionsButton: {
    flex: 1,
    justifyContent: 'center',
  },
  additionalOptionsButtonText: {
    color: '#FFF',
    fontFamily: 'Abel',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
  },
});

export default ProfileScreen;


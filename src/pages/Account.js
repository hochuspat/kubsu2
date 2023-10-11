import { TouchableOpacity, View, Text, StyleSheet, Linking, Image  } from "react-native";
import { useDispatch, useSelector } from "react-redux"
import { userUnauthorized } from "../actions";
import * as SecureStore from 'expo-secure-store';
import { AntDesign } from '@expo/vector-icons';

const buttons = [
  { title: 'Зачетка', screen: 'Зачетка', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=10Ne3GPpapzlhYzHdrpxe-W5UjqJDKBKY' },
  { title: 'Курсы', screen: 'Курсы', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1isizqaFfAJAR__7Uws7WpPx34GqD9aiv' },
  { title: 'Навигатор', screen: 'Навигатор', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1VWw8yc6gNL0n-QWDRWOQVauHJ_SaFCN4' },
  { title: 'Где поесть', screen: 'Где поесть', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=168XV1yanqyvIDs9vwogX3lQ0QAHZO4Ph' },
  { title: 'Жилье', screen: 'Жилье', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1LINelgDDFHwMlKNgHMWW4ICmgehnohXm' },
  { title: 'Инфо', screen: 'Инфо', image: 'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1CMZ-i85zlyEEIQ8NQLmDFsWWDCO_O8oy' },
];


export default function Account({navigation}) {

  const auth  = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const logOut = async () => {
    await SecureStore.deleteItemAsync('authToken')    
    dispatch(userUnauthorized())
  }

  return (

    <View style={styles.container}>
        <View animation="fadeInUp" duration={1000} delay={500} style={styles.profileContainer}>
          <View style={styles.avatar}>        
            <AntDesign name="user" size={54} color="#007BFF" />
          </View>
          <View style={styles.profile}>
            <Text style={styles.name}>Иванов Иван</Text>
            <Text style={styles.info}>Экономический факультет, 1 курс</Text>
          </View>
          <TouchableOpacity onPress={logOut}>
            <Text style={{color: 'white'}}>Выйти</Text>
          </TouchableOpacity>
        </View>

      <View animation="fadeInUp" duration={1000} delay={500} style={styles.buttons}>
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
      </View>
      
      <View animation="fadeInUp" duration={1000} delay={500} style={styles.additionalOptions}>
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
      </View>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  profileContainer: {
    justifyContent: 'space-between',
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
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
  },
  info: {
    color: '#9398A1',
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
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
  },
});
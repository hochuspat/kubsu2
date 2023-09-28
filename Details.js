import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import Swiper from 'react-native-swiper';
import { Linking } from 'react-native';

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  ad: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  imageSlider: {
    height: 300,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#808080',
    marginVertical: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    fontSize: 14,
    color: '#000000',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  landlordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    margin: 10,
    borderRadius: 10,
  },
  landlordPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25, // Делаем круглой фотографию
    marginRight: 10,
  },
  landlordInfo: {
    flex: 1,
  },
  landlordName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  landlordContact: {
    fontSize: 16,
    color: '#808080',
  },
  contactButton: {
    backgroundColor: '#007BFF',
    borderRadius: 10,
    padding: 10,
  },
  contactButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
};

const infrastructureIcons = [
  'bus',
  'cart',
  'basket',
  'school',
  'restaurant',
  'car',
];

const Details = ({ route }) => {
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [landlord, setLandlord] = useState({
    name: '',
    photo: '',
    contact: '',
    telegramUsername: '',
  });

  const { id } = route.params;

  const getAd = async (id) => {
    try {
      const response = await fetch(`http://212.192.134.23/ads/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAd(data);
      setLoading(false);
    } catch (error) {
      setError('Ошибка при получении информации о квартире: ' + error.message);
      setLoading(false);
    }
  };

  const getLandlordData = async () => {
    try {
      const response = await fetch(`http://212.192.134.23/landlord`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setLandlord(data);
    } catch (error) {
      console.error('Ошибка при получении информации об арендодателе: ' + error.message);
    }
  };

  useEffect(() => {
    getAd(id);
    getLandlordData();
  }, [id]);

  if (loading) {
    return <Text>Loading…</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.ad}>
          <Swiper style={styles.imageSlider} showsButtons={true}>
            {ad.images.map((image, index) => (
              <View key={index}>
                <Image source={{ uri: image }} style={styles.image} />
              </View>
            ))}
          </Swiper>
          <Text style={styles.title}>{ad.title}</Text>
          <Text style={styles.description}>{ad.description}</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoItem}>Адрес: {ad.address}</Text>
          </View>
          <Text style={styles.infoItem}>Площадь: {ad.area} м2</Text>
          <Text> </Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoItem}>Комнаты: {ad.rooms}</Text>
            <Text style={styles.infoItem}>Этаж: {ad.floor}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoItem}>Балкон: {ad.balcony ? 'Да' : 'Нет'}</Text>
            <Text style={styles.infoItem}>Интернет: {ad.internet ? 'Да' : 'Нет'}</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoItem}>Мебель: {ad.furniture ? 'Да' : 'Нет'}</Text>
            <Text style={styles.infoItem}>Техника: {ad.appliances ? 'Да' : 'Нет'}</Text>
          </View>
          <Text> </Text>
          <Text style={styles.price}>Цена в сутки: {ad.price} руб.</Text>
        </View>

        <View style={styles.landlordContainer}>
  <Image source={{ uri: landlord.photo }} style={styles.landlordPhoto} />
  <View style={styles.landlordInfo}>
    <Text style={styles.landlordName}>{landlord.name}</Text>
    <Text style={styles.landlordContact}>{landlord.contact}</Text>
  </View>
  <View style={styles.contactButtonContainer}>
    <TouchableOpacity
      style={styles.contactButton}
      onPress={() => {
        if (landlord.telegramUsername) {
          const telegramURL = `https://t.me/${landlord.telegramUsername}`;
          Linking.openURL(telegramURL).catch((err) => {
            console.error('Ошибка при открытии ссылки в Telegram: ' + err);
          });
        } else {
          console.error('Имя пользователя Telegram не найдено');
        }
      }}
    >
      <Text style={styles.contactButtonText}>Связаться</Text>
    </TouchableOpacity>
  </View>
</View>


 <View
          style={{
            borderWidth: 1,
            borderColor: '#E0E0E0',
            padding: 10,
            marginHorizontal: 10,
            marginBottom: 10,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
          }}
        >
          <MapView
            style={{ width: 370, height: 300, borderRadius: 10 }}
            region={{
              latitude: ad.latitude, // Используйте координаты из объявления
              longitude: ad.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            initialRegion={{
              latitude: ad.latitude, // Используйте координаты из объявления
              longitude: ad.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: ad.latitude, // Используйте координаты из объявления
                longitude: ad.longitude,
              }}
            />
          </MapView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Details;


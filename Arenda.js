import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Video } from 'react-native';

const Arenda = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAds = async () => {
    try {
      const response = await fetch('http://10.1.0.244:3000/ads'); // Replace with your server IP
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAds(data);
      setLoading(false);
    } catch (error) {
      setError('Ошибка при получении карточек: ' + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get cards when the component mounts
    getAds();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View>
      <ScrollView>
        {/* Display advertisement cards */}
        <View>
          {ads.map((ad) => (
            <View key={ad.id} style={{ borderWidth: 1, padding: 10, margin: 10 }}>
              <Text>{ad.title}</Text>
              <Text>{ad.description}</Text>
              <Text>Цена: {ad.price} руб.</Text>


            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default Arenda;

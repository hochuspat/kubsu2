import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { Linking } from 'react-native';

const App = () => {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    // Функция для получения данных о стажировках с сервера
    const fetchInternships = async () => {
      try {
        const response = await fetch('http://212.192.134.23/internships'); // Замените URL на фактический адрес вашего сервера
        const data = await response.json();
        setInternships(data);
      } catch (error) {
        console.error('Ошибка при получении данных с сервера', error);
      }
    };

    fetchInternships();
  }, []);

const InternshipCard = ({ title, description, image, url }) => {
  return (
    <Card containerStyle={styles.card}>
      <Card.Image source={{ uri: image }} style={styles.cardImage} />
      <Card.Title style={styles.cardTitle}>{title}</Card.Title>
      <Text style={styles.cardDescription}>{description}</Text>
      <Button
        title="Подробнее"
        buttonStyle={styles.cardButton}
        onPress={() => Linking.openURL(url)}
      />
    </Card>
  );
};

return (
  <View style={styles.container}>
    <ScrollView>
      {internships.map((internship, index) => (
        <InternshipCard key={index} {...internship} />
      ))}
    </ScrollView>
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10, 
    elevation: 4, 
  },
  cardImage: {
    height: 200, 
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    marginTop: 8,
  },
  cardButton: {
    backgroundColor: '#007aff', 
    marginTop: 16,
  },
});

export default App;

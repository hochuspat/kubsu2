import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Linking } from 'react-native';
import { Card, Button } from 'react-native-elements';
import { FlatList } from 'react-native';
import { API_URL, SERVER_URL } from "@env"
import useHttp from '../hooks/http.hook'


export default function Internships() {

  const [internships, setInternships] = useState([]);
  const { request } = useHttp()


  const InternshipCard = ({ title, description, image, url }) => {
    return (
      <Card containerStyle={styles.card}>
        <Card.Image source={{ uri: `${SERVER_URL}/${image}` }} style={styles.cardImage} />
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

  useEffect(() => {
    request(`${API_URL}/internship`)
      .then(res => setInternships(res))
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data={internships}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <InternshipCard
            title={item.title}
            description={item.description}
            image={item.image}
            url={item.url}
          />
        )}
      />
    </View>
  )
}

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
    borderRadius: 10,
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
    borderRadius: 10,
  },
});
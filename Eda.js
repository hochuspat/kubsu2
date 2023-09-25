import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Image, Dimensions } from 'react-native';
import { Appbar, Button, Card, Title, Paragraph } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

const PRIMARY_COLOR = '#007BFF'; // Основной цвет

const PartnerCard = ({ partner }) => {
  return (
    <Animatable.View animation="fadeInUp" style={styles.card}>
      <Image
        source={{ uri: partner.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2} textAlign="center">
          {partner.name}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={2} textAlign="center">
          {partner.address}
        </Text>
        <Text style={styles.cardDiscount}>{partner.discount}</Text>
        <Text style={styles.cardInfo} numberOfLines={3}>
          {partner.info}
        </Text>
      </View>
    </Animatable.View>
  );
};


const PartnerList = ({ category, partners, onClose }) => {
  return (
    <Modal visible={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.listContainer}>
        <Appbar.Header >
          <Appbar.BackAction onPress={onClose} />
          <Appbar.Content title={category} />
        </Appbar.Header>
        <FlatList
          data={partners}
          renderItem={({ item }) => <PartnerCard partner={item} />}
          keyExtractor={(item) => item.id}
        />
        <Button mode="contained" style={styles.listButton} onPress={onClose}>
          Закрыть
        </Button>
      </View>
    </Modal>
  );
};

const CategoryButton = ({ category, onPress }) => {
  const getImageUrl = (category) => {
    const images = {
      'Столовые и буфеты КубГУ': 'https://img-fotki.yandex.ru/get/170627/17778574.1e1/0_c5e1b_ea8bfb18_orig',
      'Кофейни': 'https://biz-nes.ru/wp-content/uploads/2022/11/Novyj-proekt-2-3.jpg',
      'Продуктовые магазины': 'https://avatars.dzeninfra.ru/get-zen_doc/8251857/pub_6410d2849a58e114d17dfa8e_6410d2c29f9cb357f05ef58c/scale_1200',
    };
    return images[category];
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Card elevation={5} style={{ backgroundColor: '#FCFEFF' /* Новый цвет фона */ }}>
        <Card.Cover
          source={{ uri: getImageUrl(category) }}
          style={{ height: 120, /* Новая высота картинки */ }}
        />
        <Card.Content>
          <Title style={styles.buttonText}>{category}</Title>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};


const WhereToEat = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [partners, setPartners] = useState([]);

  const loadPartners = async (category) => {
    try {
      const response = await fetch(`http://192.168.0.59:3002/dataa`);
      const data = await response.json();
  
      const filteredData = data.filter((item) => item.category === category);
      setPartners(filteredData);
    } catch (error) {
      console.error('Ошибка при получении данных с сервера', error);
    }
  };
  

  const handleCategoryPress = (category) => {
    loadPartners(category);
    setSelectedCategory(category);
  };

  const handleListClose = () => {
    setSelectedCategory(null);
    setPartners([]);
  };

  const categories = ['Столовые и буфеты КубГУ', 'Кофейни', 'Продуктовые магазины'];

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {categories.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            onPress={() => handleCategoryPress(category)}
          />
        ))}
      </View>
      {selectedCategory && (
        <PartnerList
          category={selectedCategory}
          partners={partners}
          onClose={handleListClose}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,

  },
  button: {
    marginVertical: 8,
    width: 400,

  },
  buttonText: {
    fontSize: 16,
    color: '#323643', // Текст на кнопке будет белым
    textAlign: 'center',
    fontWeight: 'bold',

  },
  listContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listButton: {
    margin: 16,
    backgroundColor: '#007BFF',

  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardDiscount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f00',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardInfo: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});

export default WhereToEat;





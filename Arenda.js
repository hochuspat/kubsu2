import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
const Arenda = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceFilter, setPriceFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);
  const [filteredAds, setFilteredAds] = useState([]);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isSorjitelPressed, setIsSorjitelPressed] = useState(false);
  const [isKvartiraPressed, setIsKvartiraPressed] = useState(false);
  const [isFilterIconPressed, setIsFilterIconPressed] = useState(false);  
  const navigation = useNavigation(); 

  const getAds = async () => {
    try {
      const response = await fetch('http://212.192.134.23/ads');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setAds(data);
      setFilteredAds(data); 
      setLoading(false);
    } catch (error) {
      setError('Ошибка при получении карточек: ' + error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAds();
  }, []);

  const handlePriceFilterChange = (value) => {
    setPriceFilter(value);
    applyFilters(value, typeFilter);
  };

  const handleTypeFilterChange = (type) => {
    setTypeFilter(type);
    applyFilters(priceFilter, type);
  };

  const handleDetails = (id) => {
  navigation.navigate('Details', {id});
};
  const resetFilters = () => {
    setPriceFilter(null);
    setTypeFilter(null);
    setFilteredAds(ads); 
  };

  const applyFilters = (price, type) => {
    let filtered = ads;

    if (price !== null) {
      filtered = filtered.filter((ad) => ad.price <= price);
    }

    if (type) {
      filtered = filtered.filter((ad) => ad.type === type);
    }

    setFilteredAds(filtered);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => {
          setIsFilterVisible(!isFilterVisible);
          setIsFilterIconPressed(!isFilterIconPressed);
        }}
      >
        <AntDesign
          name="filter"
          size={24}
          color="#0099ff"
          style={styles.filterIcon}
          onPress={() => {
            setIsFilterIconPressed(!isFilterIconPressed);
            setIsFilterVisible(!isFilterVisible);
          }}
        />
      </TouchableOpacity>

      {isFilterVisible && (
        <View>
          <Text style={styles.filterLabel}>Цена до: {priceFilter || 'Любая'}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10000}
            step={10}
            value={priceFilter || 10000}
            onValueChange={handlePriceFilterChange}
            minimumTrackTintColor="#0099ff"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#0099ff"
            trackHeight={20}
          />

          <View style={styles.filterButtonContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                isSorjitelPressed ? styles.selectedFilterButton : null
              ]}
              onPress={() => {
                handleTypeFilterChange('сожитель');
                setIsSorjitelPressed(true);
                setIsKvartiraPressed(false);
              }}
            >
              <Text
                style={
                  isSorjitelPressed
                    ? styles.selectedFilterButtonText
                    : styles.filterButtonText
                }
              >
                Сожитель
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                isKvartiraPressed ? styles.selectedFilterButton : null
              ]}
              onPress={() => {
                handleTypeFilterChange('квартира');
                setIsKvartiraPressed(true);
                setIsSorjitelPressed(false);
              }}
            >
              <Text
                style={
                  isKvartiraPressed
                    ? styles.selectedFilterButtonText
                    : styles.filterButtonText
                }
              >
                Квартира
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={resetFilters}>
            <Text style={styles.cancelButtonText}>Отменить</Text>
          </TouchableOpacity>
        </View>
      )}
      <ScrollView >
        {filteredAds.map((ad) => (
          <View key={ad.id} style={styles.ad}>
            <Image source={{ uri: ad.img }} style={styles.image} />
            <Text style={styles.title}>{ad.title}</Text>
            <Text style={styles.description}>{ad.description}</Text>
            <Text style={styles.type}>{ad.type}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AntDesign name="enviroment" size={20} color="gray" />
              <Text> </Text>
              <Text>{ad.address}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>Цена в сутки: {ad.price} руб.</Text>
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => handleDetails(ad.id)}
              >
                <Text style={styles.contactButtonText}>Подробнее</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};


const styles = {
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  contactButton: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    alignItems: 'center',
    maxWidth: '70%',
  },
  contactButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  ad: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    margin: 10,
    marginBottom: 20,
    padding: 12,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
  },
  description: {
    fontSize: 14,
    color: '#808080',
    marginVertical: 10,
  },
  priceContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  filterButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0099ff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  filterButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0099ff',
    textAlign: 'center',
  },
  selectedFilterButton: {
    backgroundColor: '#007BFF',
    borderWidth: 1,
    borderColor: '#007BFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  selectedFilterButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#F6F7F8',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    borderWidth: 0,
  },
  cancelButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
  },
  slider: {
    width: '80%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    alignSelf: 'center',
    marginTop: 10,
  },
  type: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  filterIcon: {
    marginLeft: 5,
    alignSelf: 'center', 
  },
  
};

export default Arenda;

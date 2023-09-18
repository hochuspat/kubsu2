import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Linking,Button, ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Clipboard from 'expo-clipboard'
const CategoryFilter = ({ selectedCategory, onCategorySelect }) => {
  const categories = [
    { id: null, name: 'Все' },
    { id: 'Профком', name: 'Профком' },
    { id: 'Студсовет', name: 'Студсовет' },
    { id: 'СНО', name: 'СНО' },
    { id: 'МКДЦ', name: 'МКДЦ' },
    { id: 'Волонтерский центр', name: 'Волонтерский центр' },
    { id: 'Научная библиотека', name: 'Научная библиотека' },
    { id: 'Точка кипения', name: 'Точка кипения' },    
    { id: 'ФК КубГУ', name: 'ФК КубГУ' },

  ];

  return (
    <View style={styles.menu}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.menuItem,
              selectedCategory === category.id && styles.selectedMenuItem,
            ]}
            onPress={() => {
              onCategorySelect(category.id);
            }}
          >
            <Text
              style={[
                styles.menuItemText,
                selectedCategory === category.id && styles.selectedMenuItemText,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const MeropriatiaScreen = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [expandedNews, setExpandedNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favoriteNews, setFavoriteNews] = useState([]);
  const [selectedNewsIds, setSelectedNewsIds] = useState([]);
  useEffect(() => {
    fetchNews();
  }, [selectedCategory]);

  const fetchNews = () => {
    setRefreshing(true);
    let url = 'http://212.192.134.23/news';
    if (selectedCategory) {
      url += `?category=${selectedCategory}`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setNews(data);
  
        const filteredData = selectedCategory
          ? data.filter((item) => item.category === selectedCategory)
          : data;
          const updatedData = data.map((item) => {
            const faculty = item.faculty; 
            return { ...item, faculty };
          });
        const sortedData = filteredData.sort((a, b) => {
          const isAFavorite = favoriteNews.includes(a.id);
          const isBFavorite = favoriteNews.includes(b.id);
  
          if (isAFavorite && !isBFavorite) {
            return -1;
          } else if (!isAFavorite && isBFavorite) {
            return 1;
          } else {
            const aDate = new Date(a.date).getTime();
            const bDate = new Date(b.date).getTime();
            return aDate - bDate;
          }
        });
  
        setFilteredNews(sortedData);
        setRefreshing(false);
      })
      .catch((error) => {
        console.error('Ошибка при получении новостей:', error);
        setRefreshing(false);
      });
  };
  
  const handleFavoritePress = (itemId) => {
    if (favoriteNews.includes(itemId)) {
      setFavoriteNews(favoriteNews.filter((id) => id !== itemId));
    } else {
      setFavoriteNews([itemId, ...favoriteNews]);
    }
  };
  const facultyLinks = {
    'Биологический факультет': 'https://vk.com/proforganization_bf_kubsu',
    'Факультет архитектуры и дизайна': 'https://vk.com/prof_fad',
    'Факультет журналистики': 'https://vk.com/jour_sovet',
    'Факультет истории, социологии и международных отношений': 'https://vk.com/dekanatfismo',
    'Факультет компьютерных технологий и прикладной математики': 'https://vk.com/fktipm_kubsu',
    'Факультет математики и компьютерных наук': 'https://vk.com/studsovet_fmkn_kubsu',
    'Факультет педагогики, психологии и коммуникативистики': 'https://vk.com/fppk_kubsu',
    'Факультет романо-германской филологии': 'https://vk.com/rgphkubsu',
    'Факультет управления и психологии': 'https://vk.com/fupkubsu',
    'Факультет химии и высоких технологий': 'https://vk.com/kubsu_fhivt',
    'Физико-технический факультет': 'https://vk.com/ftf_kubsu',
    'Филологический факультет': 'https://vk.com/club186181459',
    'Экономический факультет': 'https://vk.com/econom_kubsu',
    'Юридический факультет': 'https://vk.com/law.kubsu',
    'Художественно-графический факультет': 'https://vk.com/prof_hgf',
    'Институт географии, геологии, туризма и сервиса': 'https://vk.com/kubsu_geo',
  };
  const handleRefresh = () => {
    fetchNews();
  };

  const handleNewsPress = (item) => {
    setSelectedNews(item);
    setModalVisible(true);
  };

  const toggleNewsExpansion = (itemId) => {
    if (isNewsExpanded(itemId)) {
      setExpandedNews(expandedNews.filter((id) => id !== itemId));
    } else {
      setExpandedNews([...expandedNews, itemId]);
    }
  };

  const isNewsExpanded = (itemId) => {
    return expandedNews.includes(itemId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const makeLinksClickable = (text) => {
    const pattern = /(?:^|\s)((?:https?:\/\/)?\w+(?:\.\w+)+(?:\/[\w./?%&=-]*)?)/gi;
    return text.split(pattern).map((part, index) => {
      if (part.match(pattern)) {
        return (
          <Text
            key={index}
            style={styles.linkText}
            onPress={() => Linking.openURL(part)}
          >
            {part}
          </Text>
        );
      }
      return part;
    });
  };
  
  const isNewsFavorite = (itemId) => {
    return favoriteNews.includes(itemId);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {filteredNews.map((item) => (
        <View key={item.id}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => handleNewsPress(item)}
          >
            <Image
              source={{ uri: `http://212.192.134.23/uploads/${item.image}` }}
              style={styles.image}
              resizeMode="contain"
            />
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.categoryContainer}>
  {item.category === 'Профком' ? (
    <TouchableOpacity onPress={() => Linking.openURL('https://vk.com/profcomkubsu')}>
      <Text style={styles.link}>{item.category}</Text>
    </TouchableOpacity>
  ) : item.category === 'Студсовет' ? (
    <TouchableOpacity onPress={() => Linking.openURL('https://vk.com/oso_kubsu')}>
      <Text style={styles.link}>{item.category}</Text>
    </TouchableOpacity>
  ) : item.category === 'СНО' ? (
    <TouchableOpacity onPress={() => Linking.openURL('https://vk.com/sno_kubsu')}>
      <Text style={styles.link}>{item.category}</Text>
    </TouchableOpacity>
  ) : item.category === 'Волонтерский центр' ? (
    <TouchableOpacity onPress={() => Linking.openURL('https://vk.com/vol.kubsu')}>
      <Text style={styles.link}>{item.category}</Text>
    </TouchableOpacity>
  ) : item.category === 'МКДЦ' ? (
    <TouchableOpacity onPress={() => Linking.openURL('https://vk.com/mkdc_kubsu')}>
      <Text style={styles.link}>{item.category}</Text>
    </TouchableOpacity>
  ) : item.category === 'Научная библиотека' ? (
    <TouchableOpacity onPress={() => Linking.openURL('https://vk.com/library_kubsu')}>
      <Text style={styles.link}>{item.category}</Text>
    </TouchableOpacity>                
  ) : item.category === 'Точка кипения' ? (
    <TouchableOpacity onPress={() => Linking.openURL('https://vk.com/tk_kubsu')}>
      <Text style={styles.link}>{item.category}</Text>
    </TouchableOpacity>
  ) : item.category === 'ФК КубГУ' ? (
    <TouchableOpacity onPress={() => Linking.openURL('https://vk.com/fckubsu')}>
      <Text style={styles.link}>{item.category}</Text>
    </TouchableOpacity>
  ) : (
    item.category
  )}
  {item.faculty && item.faculty in facultyLinks && (
    <TouchableOpacity onPress={() => Linking.openURL(facultyLinks[item.faculty])}>
      <Text style={styles.faculty}>{` (${item.faculty})`}</Text>
    </TouchableOpacity>
  )}
</View>

         
{isNewsExpanded(item.id) ? (
  <ScrollView style={styles.content}>
    <TouchableOpacity
      onPress={() => {}}
      onLongPress={async () => {
        await Clipboard.setStringAsync(item.content);
        ToastAndroid.show('Текст скопирован', ToastAndroid.SHORT);
      }}
    >
      <Text>{makeLinksClickable(item.content)}</Text>
    </TouchableOpacity>
  </ScrollView>
) : (
<Text style={styles.content}>{item.content.substring(0, 100)}...</Text>)}
            <View style={styles.cardBottom}>
              <Text style={styles.date}>{formatDate(item.date)}</Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => handleFavoritePress(item.id)}
              >
                <Icon
                  name={isNewsFavorite(item.id) ? 'heart' : 'heart-o'}
                  size={20}
                  color={isNewsFavorite(item.id) ? 'red' : 'gray'}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
  style={styles.readMoreButton}
  onPress={() => toggleNewsExpansion(item.id)}
>
  <Text style={styles.readMoreButtonText}>
    {isNewsExpanded(item.id) ? 'Свернуть' : 'Подробнее'}
  </Text>
</TouchableOpacity>

          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF', 
  },
  menu: {
    marginBottom: 16,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    backgroundColor: '#007AFF', 
    elevation: 2,
  },
  selectedMenuItem: {
    backgroundColor: '#FFFFFF', 
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', 
  },
  selectedMenuItemText: {
    color: '#007AFF', 
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007AFF', 
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden', 
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 4,
  },
   cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#ccc',
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  date: {
    fontSize: 14,
    color: '#888888',
  },
  
  readMoreButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  readMoreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  favoriteButton: {
    marginLeft: 8,
    
  },
  favoriteButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', 
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFFFF', 
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  modalImage: {
    width: '100%',
    height: 200,
    marginBottom: 8,
    borderRadius: 4,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalCategory: {
    fontSize: 18,
    color: '#888888',
    marginBottom: 8,
  },
  modalContent: {
    fontSize: 18,
    marginBottom: 8,
  },
  modalDate: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 16,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    borderRadius: 16,
    padding: 8,

  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
   faculty: {
    fontSize: 13,
    color: 'gray',

  },
});

export default MeropriatiaScreen;
import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { API_URL, SERVER_URL } from "@env"




const OrganizationItem = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.modalDescription, item)}>
      <View style={styles.item}>
        <Image source={{ uri:`${SERVER_URL}/${item.image}`}} style={styles.image} />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.moreButton}>Подробнее</Text>
      </View>
    </TouchableOpacity>
  );
};


class OrganizationList extends Component {
  state = {
    isModalVisible: false,
    currentOrganization: null,
    organizations: [], 
  };

  componentDidMount() {
    fetch(`${API_URL}/organization`)
      .then((response) => response.json())
      .then((data) => this.setState({ organizations: data })) 
      .catch((error) => console.error(error));
  }


  openModal = (modalDescription, organization) => {
    this.setState({ isModalVisible: true, currentOrganization: { ...organization, modalDescription } });
  };
  

  closeModal = () => {
    this.setState({ isModalVisible: false });
  };  
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Информация о студенческих организациях</Text>
        <FlatList
  data={this.state.organizations} 
  renderItem={({ item }) => (
    <OrganizationItem item={item} onPress={this.openModal} />
  )}
  keyExtractor={(item) => item.id.toString()}
/>
<Modal isVisible={this.state.isModalVisible} onBackdropPress={this.closeModal}>
          {this.state.currentOrganization && (
            <View style={styles.modalContainer}>
              <Image
                source={{ uri: `${SERVER_URL}/${this.state.currentOrganization.image}` }}
                style={styles.modalImage}
              />
              <Text style={styles.modalName}>{this.state.currentOrganization.name}</Text>
              <Text style={styles.modalDescription}>
                {this.state.currentOrganization.shortDescription}
              </Text>
              {/* <View style={styles.iconContainer}>
                {Object.keys(this.state.currentOrganization.socialLinks).map((socialMedia) => (
                  <TouchableOpacity
                    key={socialMedia}
                    onPress={() => Linking.openURL(this.state.currentOrganization.socialLinks[socialMedia])}
                  >
                    <Icon name={socialMedia} size={30} color="#3b5998" />
                  </TouchableOpacity>
                ))}
              </View> */}
              <TouchableOpacity onPress={this.closeModal} style={styles.closeButton}>
                <Icon name="close" size={25} color="#333" />
              </TouchableOpacity>
            </View>
          )}
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', 
    padding: 20, 
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  iconSeparator: {
    width: 10, 
  },
  
  item: {
    backgroundColor: '#fff', 
    borderRadius: 10,
    padding: 15,
    marginVertical: 10, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  image: {
    width: '100%', 
    aspectRatio: 16 / 9, 
    borderRadius: 10, 
    marginBottom: 10, 
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalCloseButton: {
    fontSize: 16,
    color: 'blue',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  
});


export default OrganizationList;

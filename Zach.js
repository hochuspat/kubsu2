// Импортируем React и React Native
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Создаем компонент App
const App = () => {
  // Возвращаем JSX-элемент, который отображает текст
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Здесь скоро появится ваша зачетка</Text>
    </View>
  );
};

// Создаем стили для компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007BFF',
  },
});

// Экспортируем компонент App
export default App;

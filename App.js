import React, { useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './LoginScreen';
import MeropriatiaScreen from './Meropriatia';
import Arenda from './Arenda';
import DetailsScreen from './Details';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      activeTintColor: 'blue',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen
      name="Мероприятия"
      component={MeropriatiaScreen}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'ios-calendar' : 'ios-calendar-outline'} size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="Аренда"
      component={Arenda}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'ios-home' : 'ios-home-outline'} size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = useCallback(() => {
    setLoggedIn(true); 
  }, []);

  return (
    <NavigationContainer>
      {loggedIn ? (
        <MainTabNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={({ navigation }) => ({
              headerShown: false,
              initialParams: {
                setLoggedIn: () => {
                  setLoggedIn(true);
                  navigation.navigate('Мероприятия');
                },
              },
            })}
          />
          <Stack.Screen name="Мероприятия" component={MainTabNavigator} />
          {/* Include the 'Details' screen in your stack navigator */}
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;





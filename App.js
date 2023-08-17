// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './LoginScreen';
import MeropriatiaScreen from './Meropriatia';
import Arenda from './Arenda';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Мероприятия') {
          iconName = focused ? 'ios-calendar' : 'ios-calendar-outline';
        } else if (route.name === 'Жилье') {
          iconName = focused ? 'ios-home' : 'ios-home-outline';
        }

        // Return the Ionicons component with the appropriate icon name
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Мероприятия" component={MeropriatiaScreen} />
    <Tab.Screen name="Жилье" component={Arenda} />
    {/* Add other screens here */}
  </Tab.Navigator>
);

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <NavigationContainer>
      {loggedIn ? (
        <MainTabNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            initialParams={{ setLoggedIn }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default App;


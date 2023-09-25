import React, { useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import LoginScreen from './LoginScreen';
import MeropriatiaScreen from './Meropriatia';
import Arenda from './Arenda';
import DetailsScreen from './Details';
import Raspisanie from './Raspisanie';
import LK from './LK';
import Stash from './Stash';
import Zach from './Zach';
import Navigat from './Navigat'
import Eda from './Eda'
import Kurs from './Kurs'
import Stud from './Stud'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    tabBarOptions={{
      activeTintColor: '#007BFF',
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
      name="Расписание"
      component={Raspisanie}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <AntDesign name='bars' size={size} color={color} />
        ),
      }}
    />
        <Tab.Screen
      name="Стажировки"
      component={Stash}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <AntDesign name='bulb1' size={size} color={color} />
        ),
      }}
    />
    <Tab.Screen
      name="ЛК"
      component={LK}
      options={{
        tabBarIcon: ({ focused, color, size }) => (
          <AntDesign name='user' size={size} color={color} />
        ),
      }}
    />
  </Tab.Navigator>
);

const ArendaStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Жилье" component={Arenda} />
  </Stack.Navigator>
);

const ZachStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Зачетка" component={Zach} />
  </Stack.Navigator>
);

const NavigatStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Навигатор" component={Navigat} />
  </Stack.Navigator>
);

const EdaStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Где поесть" component={Eda} />
  </Stack.Navigator>
);

const KursStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Курсы" component={Kurs} />
  </Stack.Navigator>
);

const StudStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Инфо" component={Stud} />
  </Stack.Navigator>
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
          <Stack.Screen name="Жилье" component={ArendaStack} />
          <Stack.Screen name="Зачетка" component={ZachStack} />
          <Stack.Screen name="Навигатор" component={NavigatStack} />
          <Stack.Screen name='Где поесть' component={EdaStack} />
          <Stack.Screen name="Курсы" component={KursStack} />
          <Stack.Screen name="Инфо" component={StudStack} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
export default App;








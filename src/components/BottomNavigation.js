import { createBottomTabNavigator, createStackNavigator } from '@react-navigation/bottom-tabs';

import Events from '../pages/Events';
import Schedule from '../pages/Schedule';
import Internships from '../pages/Internships';
import Account from '../pages/Account';

import { AntDesign } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {

  return (
    <Tab.Navigator
      screenOptions={{
        activeTintColor: '#007BFF',
        inactiveTintColor: 'grey',
      }}
    >
      <Tab.Screen
        name='Мероприятия'
        component={Events}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Ionicons
              name={focused ? 'ios-calendar' : 'ios-calendar-outline'}
              size={size}
              color={color}
            />
          )
        }}
      />

      <Tab.Screen
        name='Расписание'
        component={Schedule}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <AntDesign name='bars' size={size} color={color}/>
          ),
        }}
      />

      <Tab.Screen
        name='Стажировки'
        component={Internships}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <AntDesign name='bulb1' size={size} color={color}/>
          ),
        }}
      />

      <Tab.Screen
        name='Личный кабинет'
        component={Account}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <AntDesign name='user' size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

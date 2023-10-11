import Login from '../pages/Login';
import BottomNavigation from '../components/BottomNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import RecordBook from './RecordBook';
import { NavigationContainer } from "@react-navigation/native";
import Internships from './Internships';
import Ads from './Ads';
import AdDetails from './AdDetails';
import Navigator from './Navigator';
import Info from './Info';
import Food from './Food';
import Cources from './Cources'
const Stack = createStackNavigator();

export default function MainScreen() {

  return (
    <NavigationContainer>
      <Login/>
      <Stack.Navigator >
        <Stack.Screen options={{ headerShown: false }} name='Главная' component={BottomNavigation}/>
        <Stack.Screen name='Зачетка' component={RecordBook}></Stack.Screen>
        <Stack.Screen name='Курсы' component={Cources}></Stack.Screen>
        <Stack.Screen name='Жилье' component={Ads}></Stack.Screen>
        <Stack.Screen name='Детали' component={AdDetails}></Stack.Screen>
        <Stack.Screen name='Навигатор' component={Navigator}></Stack.Screen>
        <Stack.Screen name='Инфо' component={Info}></Stack.Screen>
        <Stack.Screen name='Где поесть' component={Food}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
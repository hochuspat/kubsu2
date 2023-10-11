import { NavigationContainer } from '@react-navigation/native';

import { Provider } from 'react-redux';

import store from './src/store';
import MainScreen from './src/pages/MainScreen';
import BottomNavigation from './src/components/BottomNavigation';

export default function App() {
  return (
    <Provider store={store}>
      <MainScreen/>
    </Provider>
  );
}

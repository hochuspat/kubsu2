import { StyleSheet, Text, View, Button } from 'react-native';
import Map from '../components/Navigator/src/Components/Map/Map'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Navigator() {

  return (
    <GestureHandlerRootView style={styles.container}>
      <Map></Map>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
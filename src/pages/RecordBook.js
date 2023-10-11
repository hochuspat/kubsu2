import { View, Text, StyleSheet } from "react-native";

export default function RecordBook () {
  return(
    <View style={styles.container}>
      <Text style={styles.text}>Здесь скоро появится ваша зачетка</Text>
    </View>
  )
}

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
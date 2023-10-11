import { View, Text } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue } from "react-native-reanimated";

const fontSize = 7;
const maxWidth = 100;

export default function Label({text, x, y, scale}) {

  const aScale = useDerivedValue(() => scale.value);

  const aStyle = useAnimatedStyle(() => ({
    opacity: aScale.value > 1 ? 0.8 : 0,
  }))


  return ( 
    <Animated.View style={[{
      position: 'absolute',
      top: y,
      left: x - maxWidth / 2,
      width: maxWidth,
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: 0.8
    }]}>
        <Text style={{
          marginTop: 4,
          paddingVertical: 2,
          paddingHorizontal: 5,
          
          backgroundColor: '#8dccf0',
          fontSize: fontSize,
          fontWeight: 600,
          textAlign: 'center',
          borderRadius: 5,
        }}>
          {text}
        </Text>
    </Animated.View>
  );
}

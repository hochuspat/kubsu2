import { View } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue } from "react-native-reanimated";


export default function Point({x, y, r, scale}) {

  const aScale = useDerivedValue(() => scale.value);

  const aStyle = useAnimatedStyle(() => ({
    opacity: aScale.value > 1 ? 1 : 0,
  }))

  return (
    <Animated.View style={[{
      position: 'absolute',
      width: r, 
      height: r,
      top: y - (r / 2),
      left: x - (r / 2),
      backgroundColor: '#456c87',
      borderRadius: r / 2
    }]}/>
  );
}

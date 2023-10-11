import { View } from "react-native";
import Animated, { useAnimatedStyle, useDerivedValue } from "react-native-reanimated";


const edgeWidth = 3;

export default function Edge({x1, y1, x2, y2, scale}) {
 
  const aScale = useDerivedValue(() => scale.value);

  const aStyle = useAnimatedStyle(() => ({
    width: Math.abs(x2 - x1) + edgeWidth / aScale.value,
    height: Math.abs(y2 - y1) + edgeWidth / aScale.value,
  }))

  return (
    <Animated.View style={[{
      position: 'absolute',
      width: Math.abs(x2 - x1) + 1, 
      height: Math.abs(y2 - y1) + 1,
      top: Math.min(y1, y2) - 0.5,
      left: Math.min(x1, x2) - 0.5,
      backgroundColor: '#32a852'
    }, aStyle]}/>
  );
}

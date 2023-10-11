import { useRef, cloneElement } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler, PinchGestureHandler } from "react-native-gesture-handler";
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming, withDecay } from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Manipulative({children, width, height, initial}) {

  const size = useRef({w: width, h: height});

  const mapPinch = useRef();
  const mapPan = useRef();
  const positionX = useSharedValue(initial ? -initial.x : -width / 2);
  const positionY = useSharedValue(initial ? -initial.y : -height / 2);

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform:
    [  
      {translateX: size.current.w / 2 * (scale.value - 1) + screenWidth / 2},
      {translateY: size.current.h / 2 * (scale.value - 1) + screenHeight / 2},
      {scale: scale.value},
    
      {translateX: positionX.value},
      {translateY: positionY.value},
    ]
  }));


  const center = (point) => {
    positionX.value = withTiming(-point.x);
    positionY.value = withTiming(-point.y);
    scale.value = withTiming(1.5)
  }

  const onPinchGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.scale = scale.value;
    },
    onActive: (e, ctx) => {
      scale.value = e.scale * ctx.scale;
    }
  });

  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.positionX = positionX.value;
      ctx.positionY = positionY.value;

      positionX.value = withTiming(ctx.positionX);
      positionY.value = withTiming(ctx.positionY);
    },
    onActive: (e, ctx) => {
      positionX.value = e.translationX / scale.value + ctx.positionX;
      positionY.value = e.translationY / scale.value + ctx.positionY;
    },
    onEnd: (e, ctx) => {
      positionX.value = e.translationX / scale.value + ctx.positionX;
      positionY.value = e.translationY / scale.value + ctx.positionY;

      positionX.value = withDecay({velocity: e.velocityX / (scale.value), velocityFactor: 0.5})
      positionY.value = withDecay({velocity: e.velocityY / (scale.value), velocityFactor: 0.5})
    }
  });

  return (
    <View style={styles.manipulative}>

       <PanGestureHandler ref={mapPan} simultaneousHandlers={mapPinch} onGestureEvent={onPanGestureEvent}>
        <Animated.View>
            <PinchGestureHandler ref={mapPinch} simultaneousHandlers={mapPan} onGestureEvent={onPinchGestureEvent}>
                <Animated.View style={[{width: width, height: height}, animatedStyle]}>
                  {cloneElement(children, { center: center, scale: scale })}               
                </Animated.View>
            </PinchGestureHandler>
        </Animated.View>
      </PanGestureHandler> 

    </View>
  );

}

const styles = StyleSheet.create({
  manipulative: {
    width: '100%',
    height: '100%',
    position: 'relative'
  },
});

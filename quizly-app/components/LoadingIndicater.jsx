import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const BALL_COUNT = 8; // Number of balls
const RADIUS = 20; // Radius of the circle
const BALL_SIZE = 10; // Size of each ball

const RotatingBallsLoader = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();
    return () => rotateAnimation.stop();
  }, [rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const renderBalls = () => {
    const balls = [];
    for (let i = 0; i < BALL_COUNT; i++) {
      const angle = (i * 2 * Math.PI) / BALL_COUNT;
      const x = RADIUS * Math.cos(angle);
      const y = RADIUS * Math.sin(angle);
      balls.push(
        <Animated.View
          key={i}
          style={[
            styles.ball,
            {
              transform: [
                { translateX: x },
                { translateY: y },
              ],
            },
          ]}
        />
      );
    }
    return balls;
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.circle,
          {
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      >
        {renderBalls()}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: RADIUS * 2 + BALL_SIZE,
    height: RADIUS * 2 + BALL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: RADIUS * 2,
    height: RADIUS * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ball: {
    position: 'absolute',
    width: BALL_SIZE,
    height: BALL_SIZE,
    borderRadius: BALL_SIZE / 2,
    backgroundColor: 'white',
  },
});

export default RotatingBallsLoader;

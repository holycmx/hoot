import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { typography } from '../constants/typography';

export default function SplashScreen({ onFinish }) {
  const foxScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textY = useRef(new Animated.Value(10)).current;
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(foxScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(textY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(barWidth, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(onFinish, 300);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.fox, { transform: [{ scale: foxScale }] }]}>
        🦊
      </Animated.Text>
      <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textY }] }}>
        <Text style={styles.logo}>Hoot</Text>
        <Text style={styles.sub}>Learn English · 영어 배우기</Text>
      </Animated.View>
      <View style={styles.barWrap}>
        <Animated.View style={[styles.bar, {
          width: barWidth.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          })
        }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fox: {
    fontSize: 96,
    marginBottom: 20,
  },
  logo: {
    fontSize: typography.hero,
    fontWeight: typography.black,
    color: colors.ink,
    letterSpacing: -2,
    textAlign: 'center',
  },
  sub: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.ink3,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  barWrap: {
    width: 72,
    height: 3,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginTop: 56,
    overflow: 'hidden',
  },
  bar: {
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});
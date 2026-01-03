import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from '../../theme';

const SpeakingIndicator = ({ visible, text }) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  // Animatie voor de balken
  const bar1 = useRef(new Animated.Value(0.3)).current;
  const bar2 = useRef(new Animated.Value(0.5)).current;
  const bar3 = useRef(new Animated.Value(0.7)).current;
  const bar4 = useRef(new Animated.Value(0.4)).current;
  const bar5 = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (visible) {
      // Fade in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Start bar animaties
      const animateBar = (barAnim, duration) => {
        return Animated.loop(
          Animated.sequence([
            Animated.timing(barAnim, {
              toValue: 1,
              duration: duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(barAnim, {
              toValue: 0.2,
              duration: duration,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
      };

      const animations = [
        animateBar(bar1, 400),
        animateBar(bar2, 350),
        animateBar(bar3, 450),
        animateBar(bar4, 380),
        animateBar(bar5, 420),
      ];

      animations.forEach(anim => anim.start());

      return () => {
        animations.forEach(anim => anim.stop());
      };
    } else {
      // Fade out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const bars = [bar1, bar2, bar3, bar4, bar5];

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
      pointerEvents="none"
    >
      <View style={[styles.content, { backgroundColor: theme.surface, shadowColor: theme.primary, borderColor: theme.primary + '40' }]}>
        <View style={styles.barsContainer}>
          {bars.map((bar, index) => (
            <Animated.View
              key={index}
              style={[
                styles.bar,
                { backgroundColor: theme.primary },
                {
                  transform: [{ scaleY: bar }],
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.speakingText, { color: theme.text }]} numberOfLines={2}>
          {text}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    borderRadius: 20,
    padding: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    maxWidth: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom: 12,
  },
  bar: {
    width: 6,
    height: 40,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  speakingText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default SpeakingIndicator;

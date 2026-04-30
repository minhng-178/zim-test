import React, { useCallback } from 'react';
import { Animated, Easing, Linking, Pressable, Text, View } from 'react-native';
import { FontAwesomeFreeSolid } from '@react-native-vector-icons/fontawesome-free-solid';

import styles from './styles';

interface OverlayLayerProps {
  overlayOpacity: Animated.Value;
  isVisible: boolean;
  captionTranslateX: Animated.AnimatedInterpolation<number>;
  textTranslateY: Animated.AnimatedInterpolation<number>;
  textReveal: Animated.Value;
  ctaTranslateY: Animated.AnimatedInterpolation<number>;
  ctaScale: Animated.Value;
  ctaReveal: Animated.Value;
  title: string;
  description: string;
  reduceMotion: boolean;
}

const OverlayLayer: React.FC<OverlayLayerProps> = ({
  overlayOpacity,
  isVisible,
  captionTranslateX,
  textTranslateY,
  textReveal,
  ctaTranslateY,
  ctaScale,
  ctaReveal,
  title,
  description,
  reduceMotion,
}) => {
  const handleCtaPress = () => Linking.openURL('https://zim.vn/');

  const handleCtaPressIn = useCallback(() => {
    Animated.timing(ctaScale, {
      toValue: 0.96,
      duration: reduceMotion ? 0 : 120,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [ctaScale, reduceMotion]);

  const handleCtaPressOut = useCallback(() => {
    Animated.timing(ctaScale, {
      toValue: 1,
      duration: reduceMotion ? 0 : 140,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [ctaScale, reduceMotion]);

  return (
    <Animated.View
      pointerEvents={isVisible ? 'auto' : 'none'}
      style={[styles.overlay, { opacity: overlayOpacity }]}
    >
      <View style={styles.overlayScrim} />
      <View style={styles.overlayGradient}>
        <Animated.View
          style={{
            transform: [
              { translateX: captionTranslateX },
              { translateY: textTranslateY },
            ],
            opacity: textReveal,
          }}
        >
          <Text style={styles.overlayTitle} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.overlayDescription} numberOfLines={3}>
            {description}
          </Text>
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ translateY: ctaTranslateY }, { scale: ctaScale }],
            opacity: ctaReveal,
          }}
        >
          <Pressable
            style={styles.ctaButton}
            onPress={handleCtaPress}
            onPressIn={handleCtaPressIn}
            onPressOut={handleCtaPressOut}
            accessibilityRole="button"
            accessibilityLabel={`Xem thêm: ${title}`}
          >
            <View style={styles.ctaContent}>
              <Text style={styles.ctaText}>Xem thêm</Text>
              <FontAwesomeFreeSolid
                name="arrow-right"
                size={12}
                color="#FFFFFF"
                style={styles.ctaIcon}
              />
            </View>
          </Pressable>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

export default React.memo(OverlayLayer);

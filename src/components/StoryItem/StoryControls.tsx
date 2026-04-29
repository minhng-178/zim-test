import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { FontAwesomeFreeSolid } from '@react-native-vector-icons/fontawesome-free-solid';

import styles from './styles';

interface StoryControlsProps {
  isMuted: boolean;
  isPaused: boolean;
  onToggleMute: () => void;
  onTogglePlay: () => void;
  reduceMotion?: boolean;
}

const StoryControls: React.FC<StoryControlsProps> = ({
  isMuted,
  isPaused,
  onToggleMute,
  onTogglePlay,
  reduceMotion = false,
}) => {
  const muteScale = useRef(new Animated.Value(1)).current;
  const playScale = useRef(new Animated.Value(1)).current;

  const pressInDuration = reduceMotion ? 0 : 120;
  const pressOutDuration = reduceMotion ? 0 : 140;

  const runPressIn = useCallback(
    (scale: Animated.Value) => {
      Animated.timing(scale, {
        toValue: 0.92,
        duration: pressInDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [pressInDuration],
  );

  const runPressOut = useCallback(
    (scale: Animated.Value) => {
      Animated.timing(scale, {
        toValue: 1,
        duration: pressOutDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    },
    [pressOutDuration],
  );

  const muteHandlers = useMemo(
    () => ({
      onPressIn: () => runPressIn(muteScale),
      onPressOut: () => runPressOut(muteScale),
    }),
    [muteScale, runPressIn, runPressOut],
  );

  const playHandlers = useMemo(
    () => ({
      onPressIn: () => runPressIn(playScale),
      onPressOut: () => runPressOut(playScale),
    }),
    [playScale, runPressIn, runPressOut],
  );

  return (
    <View pointerEvents="box-none" style={styles.controls}>
      <Animated.View
        style={[
          styles.muteButtonWrapper,
          { transform: [{ scale: muteScale }] },
        ]}
      >
        <Pressable
          style={styles.muteButton}
          onPress={onToggleMute}
          accessibilityRole="button"
          accessibilityLabel={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
          {...muteHandlers}
        >
          <FontAwesomeFreeSolid
            name={isMuted ? 'volume-xmark' : 'volume-high'}
            size={16}
            color="#FFFFFF"
          />
        </Pressable>
      </Animated.View>
      <Animated.View style={{ transform: [{ scale: playScale }] }}>
        <Pressable
          style={styles.playButton}
          onPress={onTogglePlay}
          accessibilityRole="button"
          accessibilityLabel={isPaused ? 'Phát video' : 'Dừng video'}
          {...playHandlers}
        >
          <FontAwesomeFreeSolid
            name={isPaused ? 'play' : 'pause'}
            size={22}
            color="#FFFFFF"
          />
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default React.memo(StoryControls);

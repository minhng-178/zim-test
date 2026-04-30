import React from 'react';
import { Animated, LayoutChangeEvent, View } from 'react-native';

import styles from './styles';

interface ProgressBarProps {
  progressTranslate: Animated.AnimatedInterpolation<number>;
  progressAnim: Animated.Value;
  onLayout: (event: LayoutChangeEvent) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progressTranslate,
  progressAnim,
  onLayout,
}) => (
  <View pointerEvents="none" style={styles.progressTrack} onLayout={onLayout}>
    <Animated.View
      style={[
        styles.progressFill,
        {
          transform: [
            { translateX: progressTranslate },
            { scaleX: progressAnim },
          ],
        },
      ]}
    />
  </View>
);

export default React.memo(ProgressBar);

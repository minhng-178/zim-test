import React from 'react';
import { Animated } from 'react-native';
import Video from 'react-native-video';
import type { OnLoadData, OnProgressData, VideoRef } from 'react-native-video';

import styles from './styles';

interface VideoLayerProps {
  videoRef: React.RefObject<VideoRef | null>;
  videoUrl: string;
  translateX?: Animated.AnimatedInterpolation<number>;
  isPaused: boolean;
  isMuted: boolean;
  onLoad?: (data: OnLoadData) => void;
  onProgress: (data: OnProgressData) => void;
  onEnd: () => void;
}

const VideoLayer: React.FC<VideoLayerProps> = ({
  videoRef,
  videoUrl,
  translateX,
  isPaused,
  isMuted,
  onLoad,
  onProgress,
  onEnd,
}) => (
  <Animated.View
    pointerEvents="none"
    style={[styles.video, translateX ? { transform: [{ translateX }] } : null]}
  >
    <Video
      ref={videoRef}
      source={{ uri: videoUrl }}
      style={styles.video}
      resizeMode="cover"
      controls={false}
      paused={isPaused}
      muted={isMuted}
      repeat={false}
      progressUpdateInterval={200}
      onLoad={onLoad}
      onProgress={onProgress}
      onEnd={onEnd}
      ignoreSilentSwitch="ignore"
    />
  </Animated.View>
);

export default React.memo(VideoLayer);

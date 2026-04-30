import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Linking,
  Pressable,
  useWindowDimensions,
  View,
} from 'react-native';
import type { OnLoadData, OnProgressData, VideoRef } from 'react-native-video';

import type { StoryData } from '@/data/mockData';
import {
  OVERLAY_ANIM_DURATION_NORMAL,
  SCALE_INACTIVE,
  SNAP_INTERVAL,
} from '@/lib/constant';
import styles from './styles';
import VideoLayer from '@/components/VideoLayer';
import OverlayLayer from '@/components/OverlayLayer';
import ProgressBar from '@/components/ProgressBar';
import StoryControls from '@/components/StoryControls';

interface StoryItemProps {
  item: StoryData;
  index: number;
  scrollX: Animated.Value;
  isActive: boolean;
  interactionResetCount: number;
  onVideoEnd?: (index: number) => void;
  isViewable: boolean; // reserved — lazy-load handled by FlatList windowSize
}

const StoryItem: React.FC<StoryItemProps> = ({
  item,
  index,
  scrollX,
  isActive,
  interactionResetCount,
  onVideoEnd,
}) => {
  const DEFAULT_VIDEO_SECONDS = 16;
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const thumbnailOpacity = useRef(new Animated.Value(0)).current;
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);
  const autoStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Requirement IV: lắng nghe prefers-reduced-motion để tắt animation khi cần
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => subscription.remove();
  }, []);

  const animDuration = reduceMotion ? 0 : OVERLAY_ANIM_DURATION_NORMAL;
  const overlayDelay = reduceMotion ? 0 : 80;

  const isLandscape = screenWidth > screenHeight;
  const isSmallScreen = Math.min(screenWidth, screenHeight) < 380;
  // parallaxMax = 0 khi reduceMotion để không gây chóng mặt cho người dùng nhạy cảm
  const parallaxMax = reduceMotion ? 0 : isSmallScreen ? 8 : isLandscape ? 10 : 14;

  const inputRange = [
    (index - 1) * SNAP_INTERVAL,
    index * SNAP_INTERVAL,
    (index + 1) * SNAP_INTERVAL,
  ];

  // Requirement II: chỉ dùng transform + opacity, useNativeDriver: true → 60fps trên UI thread
  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [SCALE_INACTIVE, 1.0, SCALE_INACTIVE],
    extrapolate: 'clamp', // tránh scale vượt giới hạn ở đầu/cuối danh sách
  });

  const imageTranslateX = scrollX.interpolate({
    inputRange,
    outputRange: [parallaxMax, 0, -parallaxMax],
    extrapolate: 'clamp',
  });

  const captionTranslateX = scrollX.interpolate({
    inputRange,
    outputRange: [-parallaxMax * 0.6, 0, parallaxMax * 0.6],
    extrapolate: 'clamp',
  });

  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const textReveal = useRef(new Animated.Value(0)).current;
  const ctaReveal = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef<VideoRef>(null);
  const endGuardRef = useRef(false); // ngăn handleVideoEnd gọi 2 lần khi onEnd + onProgress cùng fire
  const overlayVisibleRef = useRef(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const progressTranslate = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-(progressWidth || 0) / 2, 0],
  });

  const textTranslateY = textReveal.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  const ctaTranslateY = ctaReveal.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 0],
  });

  const showOverlay = useCallback(() => {
    if (overlayVisibleRef.current) {
      return;
    }
    overlayVisibleRef.current = true;
    setIsOverlayVisible(true);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: animDuration,
        delay: overlayDelay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(textReveal, {
        toValue: 1,
        duration: reduceMotion ? 0 : 180,
        delay: overlayDelay + 60,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ctaReveal, {
        toValue: 1,
        duration: reduceMotion ? 0 : 180,
        delay: overlayDelay + 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [animDuration, ctaReveal, overlayDelay, overlayOpacity, reduceMotion, textReveal]);

  const hideOverlay = useCallback(() => {
    overlayVisibleRef.current = false;
    setIsOverlayVisible(false);
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: animDuration, useNativeDriver: true }),
      Animated.timing(textReveal, { toValue: 0, duration: animDuration, useNativeDriver: true }),
      Animated.timing(ctaReveal, { toValue: 0, duration: animDuration, useNativeDriver: true }),
    ]).start();
  }, [animDuration, ctaReveal, overlayOpacity, textReveal]);

  const handleThumbnailLoad = useCallback(() => {
    setIsThumbnailLoaded(true);
    Animated.timing(thumbnailOpacity, {
      toValue: 1,
      duration: reduceMotion ? 0 : 260,
      delay: reduceMotion ? 0 : 120,
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, thumbnailOpacity]);

  const handleVideoEnd = useCallback(() => {
    if (!isActive) {
      return;
    }
    videoRef.current?.seek?.(0);
    progressAnim.setValue(0);
    endGuardRef.current = true;
    setIsVideoActive(false);
    setIsPaused(true);
    thumbnailOpacity.setValue(1);
    onVideoEnd?.(index);
  }, [index, isActive, onVideoEnd, progressAnim]);

  const handleVideoLoad = useCallback((data: OnLoadData) => {
    if (data?.duration && data.duration > 0) {
      setVideoDuration(data.duration);
    }
  }, []);

  const handleProgress = useCallback(
    (data: OnProgressData) => {
      const duration = videoDuration ?? DEFAULT_VIDEO_SECONDS;
      const current = Math.min(data.currentTime, duration);
      const ratio = duration > 0 ? Math.min(current / duration, 1) : 0;
      progressAnim.setValue(ratio);
      if (data.currentTime >= duration && !endGuardRef.current) {
        handleVideoEnd();
      }
    },
    [handleVideoEnd, progressAnim, videoDuration],
  );

  useEffect(() => {
    if (interactionResetCount > 0) {
      hideOverlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactionResetCount]);

  useEffect(() => {
    if (!isActive) {
      setIsVideoActive(false);
      setIsPaused(true);
      progressAnim.setValue(0);
      if (isThumbnailLoaded) {
        thumbnailOpacity.setValue(1);
      }
      hideOverlay();
    }
  }, [isActive, hideOverlay, isThumbnailLoaded, thumbnailOpacity, progressAnim]);

  useEffect(() => {
    if (!isActive) {
      setIsPaused(true);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) {
      if (autoStartTimeoutRef.current) {
        clearTimeout(autoStartTimeoutRef.current);
        autoStartTimeoutRef.current = null;
      }
      return;
    }
    if (isVideoActive) {
      return;
    }
    if (autoStartTimeoutRef.current) {
      clearTimeout(autoStartTimeoutRef.current);
    }
    autoStartTimeoutRef.current = setTimeout(
      () => {
        setIsVideoActive(true);
        setIsPaused(false);
        endGuardRef.current = false;
      },
      reduceMotion ? 0 : 350,
    );
    return () => {
      if (autoStartTimeoutRef.current) {
        clearTimeout(autoStartTimeoutRef.current);
        autoStartTimeoutRef.current = null;
      }
    };
  }, [isActive, isVideoActive, reduceMotion]);

  useEffect(() => {
    if (isVideoActive) {
      return;
    }
    if (isThumbnailLoaded) {
      thumbnailOpacity.setValue(1);
    } else {
      thumbnailOpacity.setValue(0);
    }
  }, [isThumbnailLoaded, isVideoActive, thumbnailOpacity]);

  const startVideo = useCallback(() => {
    if (!isActive) {
      return;
    }
    setIsVideoActive(true);
    setIsPaused(false);
    endGuardRef.current = false;
    hideOverlay();
  }, [hideOverlay, isActive]);

  const togglePlay = useCallback(() => {
    if (!isVideoActive) {
      startVideo();
      return;
    }
    setIsPaused(prev => !prev);
  }, [isVideoActive, startVideo]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const handlePress = useCallback(() => {
    if (!overlayVisibleRef.current) {
      showOverlay();
      return;
    }
    // Requirement IV: tap 2 = điều hướng → mở link rồi đóng overlay
    if (item.ctaUrl) {
      Linking.openURL(item.ctaUrl);
    }
    hideOverlay();
  }, [hideOverlay, item.ctaUrl, showOverlay]);

  const shouldRenderVideo = isActive && isVideoActive;

  return (
    <Animated.View
      style={[
        styles.container,
        shouldRenderVideo && styles.activeBorder,
        isFocused && styles.containerFocused,
        { transform: [{ perspective: 800 }, { scale }] },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onFocus={() => { setIsFocused(true); showOverlay(); }}
        onBlur={() => { setIsFocused(false); hideOverlay(); }}
        focusable
        style={styles.pressable}
        accessibilityRole="button"
        accessibilityLabel={`Xem story: ${item.title}`}
        accessibilityHint="Chạm lần 1 để xem chi tiết, chạm lần 2 để mở link. Vuốt sang để xem story tiếp theo"
      >
        {shouldRenderVideo ? (
          <VideoLayer
            videoRef={videoRef}
            videoUrl={item.videoUrl}
            translateX={imageTranslateX}
            isPaused={isPaused}
            isMuted={isMuted}
            onLoad={handleVideoLoad}
            onProgress={handleProgress}
            onEnd={handleVideoEnd}
          />
        ) : (
          <Animated.Image
            source={{
              uri: screenWidth >= 414 ? item.thumbnailUrlLarge : item.thumbnailUrlSmall,
              cache: 'default',
            }}
            style={[
              styles.thumbnail,
              { opacity: thumbnailOpacity },
              { transform: [{ translateX: imageTranslateX }] },
            ]}
            resizeMode="cover"
            fadeDuration={200}
            onLoad={handleThumbnailLoad}
          />
        )}

        <View style={styles.baseGradient} />

        <OverlayLayer
          overlayOpacity={overlayOpacity}
          isVisible={isOverlayVisible}
          captionTranslateX={captionTranslateX}
          textTranslateY={textTranslateY}
          textReveal={textReveal}
          ctaTranslateY={ctaTranslateY}
          ctaScale={ctaScale}
          ctaReveal={ctaReveal}
          title={item.title}
          description={item.description}
          reduceMotion={reduceMotion}
        />

        {(isOverlayVisible || shouldRenderVideo) && (
          <StoryControls
            isMuted={isMuted}
            isPaused={isPaused}
            onToggleMute={toggleMute}
            onTogglePlay={togglePlay}
            reduceMotion={reduceMotion}
          />
        )}

        {shouldRenderVideo && (
          <ProgressBar
            progressTranslate={progressTranslate}
            progressAnim={progressAnim}
            onLayout={event => setProgressWidth(event.nativeEvent.layout.width)}
          />
        )}
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(StoryItem);

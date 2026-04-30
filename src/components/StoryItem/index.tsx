/**
 * StoryItem.tsx
 *
 * Component con hiển thị từng thẻ trong Carousel "Khoảnh khắc đáng nhớ".
 *
 * Trách nhiệm:
 *  1. Nhận `scrollX` (Animated.Value) và `index` từ component cha để tính
 *     hiệu ứng scale Cover Flow (item giữa to nhất, hai bên nhỏ hơn).
 *  2. Quản lý trạng thái "hover" nội bộ:
 *     - Chạm lần 1: animate Overlay opacity 0 → 1.
 *     - Chạm lần 2: log điều hướng + reset overlay.
 *  3. Tuân thủ AccessibilityInfo.isReduceMotionEnabled():
 *     nếu người dùng bật "Reduce Motion", mọi animation duration → 0.
 *
 * ⚠️  QUAN TRỌNG VỀ NATIVE DRIVER:
 *  - `transform: [{ scale }]` và `opacity` đều chạy hoàn toàn trên UI thread
 *    (không tốn JavaScript frame) khi useNativeDriver: true.
 *  - Tuyệt đối KHÔNG animate width/height/left/right vì chúng yêu cầu layout
 *    pass (reflow) và không tương thích với useNativeDriver.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
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

// ─── Props ───────────────────────────────────────────────────────────────────

interface StoryItemProps {
  item: StoryData;
  /** Vị trí 0-based của item trong danh sách. */
  index: number;
  /**
   * Animated.Value theo dõi contentOffset.x của FlatList.
   * Được map trực tiếp từ Animated.event — luôn cập nhật trên UI thread.
   */
  scrollX: Animated.Value;
  /**
   * true khi item này đang ở giữa màn hình (active trong carousel).
   * Khi chuyển sang false (swipe đi xong), overlay tự động ẩn — backup fallback.
   */
  isActive: boolean;
  /**
   * Tăng mỗi khi carousel cần đóng overlay: bắt đầu kéo hoặc chạm vùng trống.
   * StoryItem dùng giá trị này để reset overlay ngay lập tức.
   */
  interactionResetCount: number;
  /** Callback để auto chuyển sang video tiếp theo khi video kết thúc. */
  onVideoEnd?: (index: number) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

const StoryItem: React.FC<StoryItemProps> = ({
  item,
  index,
  scrollX,
  isActive,
  interactionResetCount,
  onVideoEnd,
}) => {
  const DEFAULT_VIDEO_SECONDS = 16;
  // ── 1. Accessibility: Reduce Motion ──────────────────────────────────────
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
  const autoStartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    // Kiểm tra trạng thái Reduce Motion lúc mount.
    AccessibilityInfo.isReduceMotionEnabled().then(enabled => {
      setReduceMotion(enabled);
    });

    // Lắng nghe thay đổi realtime trong Settings (iOS 13+ / Android).
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      enabled => {
        setReduceMotion(enabled);
      },
    );

    return () => subscription.remove();
  }, []);

  /** Duration thực tế: 0 nếu người dùng yêu cầu giảm chuyển động. */
  const animDuration = reduceMotion ? 0 : OVERLAY_ANIM_DURATION_NORMAL;
  const overlayDelay = reduceMotion ? 0 : 80;

  const isLandscape = screenWidth > screenHeight;
  const isSmallScreen = Math.min(screenWidth, screenHeight) < 380;
  const parallaxMax = reduceMotion
    ? 0
    : isSmallScreen
    ? 8
    : isLandscape
    ? 10
    : 14;

  // ── 2. Scale Animation (Cover Flow) ──────────────────────────────────────
  /**
   * Tính toán inputRange dựa trên vị trí (index) của item trong danh sách.
   *
   * Khi scrollX = (index - 1) * SNAP_INTERVAL → item bên trái đang active.
   * Khi scrollX = index * SNAP_INTERVAL           → item NÀY đang active.
   * Khi scrollX = (index + 1) * SNAP_INTERVAL    → item bên phải đang active.
   *
   * interpolate() sẽ nội suy scale từ SCALE_INACTIVE → 1.0 → SCALE_INACTIVE
   * khi người dùng vuốt qua item này.
   */
  const inputRange = [
    (index - 1) * SNAP_INTERVAL, // item bên trái active → item này thu nhỏ
    index * SNAP_INTERVAL, // item NÀY active → scale đạt tối đa
    (index + 1) * SNAP_INTERVAL, // item bên phải active → item này thu nhỏ
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [SCALE_INACTIVE, 1.0, SCALE_INACTIVE],
    /**
     * extrapolate: 'clamp' đảm bảo scale KHÔNG vượt ra ngoài khoảng
     * [SCALE_INACTIVE, 1.0] dù người dùng cuộn quá đầu/cuối danh sách.
     */
    extrapolate: 'clamp',
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

  // ── 3. Overlay Reveal Animation ───────────────────────────────────────────
  /**
   * overlayOpacity: Animated.Value dùng cho lớp overlay tối.
   * - 0 = ẩn hoàn toàn (trạng thái ban đầu).
   * - 1 = hiển thị đầy đủ (sau lần chạm đầu tiên).
   *
   * Dùng useRef để giá trị không bị reset qua mỗi lần render.
   */
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const textReveal = useRef(new Animated.Value(0)).current;
  const ctaReveal = useRef(new Animated.Value(0)).current;
  const ctaScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const videoRef = useRef<VideoRef>(null);
  const endGuardRef = useRef(false);

  /** true khi overlay đang hiển thị (sau lần chạm 1). */
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
  }, [
    animDuration,
    ctaReveal,
    overlayDelay,
    overlayOpacity,
    reduceMotion,
    textReveal,
  ]);

  const hideOverlay = useCallback(() => {
    overlayVisibleRef.current = false;
    setIsOverlayVisible(false);
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: animDuration,
        useNativeDriver: true,
      }),
      Animated.timing(textReveal, {
        toValue: 0,
        duration: animDuration,
        useNativeDriver: true,
      }),
      Animated.timing(ctaReveal, {
        toValue: 0,
        duration: animDuration,
        useNativeDriver: true,
      }),
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

  /**
   * Reset overlay NGay LậP TỨC khi người dùng bắt đầu drag trên FlatList.
   *
   * interactionResetCount thay đổi khi carousel cần đóng overlay — fire sớm hơn nhiều so với
   * onMomentumScrollEnd. Người dùng vừa chạm vào là overlay biến mất,
   * không có cảm giác "overlay trễ rồi mới ẩn".
   */
  useEffect(() => {
    if (interactionResetCount > 0) {
      hideOverlay();
    }
    // interactionResetCount là dependency duy nhất — chỉ react khi có yêu cầu reset.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactionResetCount]);

  /**
   * Backup: Ẩn overlay khi item không còn active (sau khi scroll dừng hẳn).
   * Xử lý edge-case: người dùng drag nhẹ không gây scroll nhưng item
   * thay đổi (ví dụ: programmatic scroll).
   */
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
  }, [
    isActive,
    hideOverlay,
    isThumbnailLoaded,
    thumbnailOpacity,
    progressAnim,
  ]);

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
    if (!isVideoActive) {
      startVideo();
      return;
    }
    hideOverlay();
  }, [hideOverlay, isVideoActive, showOverlay, startVideo]);

  const shouldRenderVideo = isActive && isVideoActive;

  // ── 4. Render ─────────────────────────────────────────────────────────────
  return (
    /**
     * Animated.View bên ngoài áp dụng hiệu ứng scale (Cover Flow).
     * Quan trọng: transform được điều khiển bởi Animated.Value từ FlatList
     * → hoàn toàn trên Native thread, không tốn JS frame.
     */
    <Animated.View
      style={[
        styles.container,
        shouldRenderVideo && styles.activeBorder,
        {
          transform: [{ perspective: 800 }, { scale }],
        },
      ]}
    >
      <Pressable
        onPress={handlePress}
        onFocus={() => {
          setIsFocused(true);
          showOverlay();
        }}
        onBlur={() => {
          setIsFocused(false);
          hideOverlay();
        }}
        focusable
        style={[styles.pressable, isFocused && styles.pressableFocused]}
        accessibilityRole="button"
        accessibilityLabel={`Xem story: ${item.title}`}
        accessibilityHint="Chạm lần 1 để xem chi tiết, chạm lần 2 để điều hướng. Vuốt sang để xem story tiếp theo"
      >
        {/* ── Thumbnail / Video ── */}
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
            source={{ uri: item.thumbnailUrl, cache: 'default' }}
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

        {/* ── Lớp gradient tối nền (luôn hiển thị nhẹ để bảo đảm contrast) ── */}
        <View style={styles.baseGradient} />

        {/* ── Overlay Reveal (điều khiển bằng Animated opacity) ── */}
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
            onLayout={event => {
              setProgressWidth(event.nativeEvent.layout.width);
            }}
          />
        )}
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(StoryItem);

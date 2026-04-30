import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
  ListRenderItemInfo,
  Platform,
  Pressable,
  Text,
  View,
  ViewToken,
} from 'react-native';

import { MEMORABLE_MOMENTS_DATA, StoryData } from '@/data/mockData';
import StoryItem from '@/components/StoryItem';
import styles from './styles';
import { ITEM_SPACING, ITEM_WIDTH, SNAP_INTERVAL } from '@/lib/constant';

const INITIAL_SCREEN_WIDTH = Dimensions.get('window').width;
const getHorizontalPadding = (sw: number) => (sw - ITEM_WIDTH) / 2;

const MemorableMoments: React.FC = () => {
  const listRef = useRef<Animated.FlatList<StoryData> | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Animated.event maps contentOffset.x → scrollX trực tiếp trên UI thread,
  // không qua JS bridge → scale Cover Flow mượt 60fps dù JS thread bận.
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true },
  );

  const initialIndex = Math.floor(MEMORABLE_MOMENTS_DATA.length / 2);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isListReady, setIsListReady] = useState(false);
  const [interactionResetCount, setInteractionResetCount] = useState(0);
  const activeIndexRef = useRef(initialIndex);

  const scrollToCenteredIndex = useCallback(
    (targetIndex: number, animated: boolean) => {
      listRef.current?.scrollToIndex({
        index: targetIndex,
        animated,
        viewPosition: 0.5,
      });
    },
    [],
  );

  const handleVideoEnd = useCallback(
    (index: number) => {
      const nextIndex = (index + 1) % MEMORABLE_MOMENTS_DATA.length;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollToCenteredIndex(nextIndex, true);
    },
    [scrollToCenteredIndex],
  );

  const [visibleIds, setVisibleIds] = useState<Set<string>>(() => new Set());

  const updateVisibleIds = useCallback((nextIds: Set<string>) => {
    setVisibleIds(prev => {
      if (prev.size === nextIds.size) {
        let isSame = true;
        nextIds.forEach(id => {
          if (!prev.has(id)) {
            isSame = false;
          }
        });
        if (isSame) {
          return prev;
        }
      }
      return nextIds;
    });
  }, []);

  const viewabilityConfig = useMemo(
    () => ({ itemVisiblePercentThreshold: 60 }),
    [],
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const next = new Set(
        viewableItems
          .filter(item => item.isViewable)
          .map(item => (item.item as StoryData).id),
      );
      updateVisibleIds(next);
    },
  ).current;

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<StoryData>) => (
      <StoryItem
        item={item}
        index={index}
        scrollX={scrollX}
        isActive={activeIndex === index}
        isViewable={visibleIds.has(item.id)}
        interactionResetCount={interactionResetCount}
        onVideoEnd={handleVideoEnd}
      />
    ),
    [scrollX, activeIndex, visibleIds, interactionResetCount, handleVideoEnd],
  );

  const keyExtractor = useCallback((item: StoryData) => item.id, []);

  const [screenWidth, setScreenWidth] = useState(INITIAL_SCREEN_WIDTH);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  const horizontalPadding = getHorizontalPadding(screenWidth);
  const contentPadding = Math.max(0, horizontalPadding - ITEM_SPACING / 2);

  useEffect(() => {
    if (!isListReady) {
      return;
    }
    scrollToCenteredIndex(activeIndexRef.current, false);
    scrollX.setValue(activeIndexRef.current * SNAP_INTERVAL);
  }, [isListReady, scrollToCenteredIndex, screenWidth, scrollX]);

  const onScrollBeginDrag = useCallback(() => {
    setInteractionResetCount(c => c + 1);
  }, []);

  const dismissOverlay = useCallback(() => {
    setInteractionResetCount(c => c + 1);
  }, []);

  useEffect(() => {
    let lastCallMs = 0;
    const listenerId = scrollX.addListener(({ value }) => {
      const now = Date.now();
      // Throttle ~60fps để tránh setState thừa khi scrollEventThrottle=1 trên iOS
      if (now - lastCallMs < 16) {
        return;
      }
      lastCallMs = now;
      const idx = Math.round(value / SNAP_INTERVAL);
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
    });
    return () => scrollX.removeListener(listenerId);
  }, [scrollX]);

  // Accuracy fallback: đảm bảo index chính xác sau khi scroll dừng hẳn
  const onMomentumScrollEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
      activeIndexRef.current = index;
      setActiveIndex(index);
    },
    [],
  );

  // offset phải cộng contentPadding để getItemLayout khớp với contentContainerStyle
  const getItemLayout = useCallback(
    (_: ArrayLike<StoryData> | null | undefined, index: number) => ({
      length: SNAP_INTERVAL,
      offset: contentPadding + SNAP_INTERVAL * index,
      index,
    }),
    [contentPadding],
  );

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>6607 Khoảnh khắc đáng nhớ</Text>
        <Text style={styles.sectionSubtitle}>
          Hàng ngàn khoảnh khắc đáng nhớ về hành trình học tập thú vị luôn được
          ZIM ghi lại mỗi ngày tại 21 trung tâm Anh Ngữ ZIM trên toàn quốc.
        </Text>
      </View>

      <View style={styles.carouselShell}>
        <Pressable
          style={styles.carouselDismissLayer}
          onPress={dismissOverlay}
          accessible={false}
        />
        <Animated.FlatList<StoryData>
          ref={listRef}
          data={MEMORABLE_MOMENTS_DATA}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          initialScrollIndex={initialIndex}
          onLayout={() => setIsListReady(true)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: contentPadding }}
          snapToInterval={SNAP_INTERVAL}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollBeginDrag={onScrollBeginDrag}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onScroll={onScroll}
          // scrollEventThrottle=1 trên iOS để scale animation đủ mượt;
          // tăng lên 16 sẽ gây giật nhẹ khi scroll nhanh
          scrollEventThrottle={Platform.OS === 'ios' ? 1 : 16}
          // removeClippedSubviews giảm bộ nhớ GPU; có thể gây flicker trên Android cũ
          removeClippedSubviews
          initialNumToRender={3}
          maxToRenderPerBatch={2}
          windowSize={5}
        />
      </View>
    </View>
  );
};

export default React.memo(MemorableMoments);

/**
 * MemorableMoments.tsx
 *
 * Component cha quản lý Carousel "Khoảnh khắc đáng nhớ" của ZIM.
 *
 * Kiến trúc:
 *  - FlatList nằm ngang với snapToInterval để snap từng item.
 *  - Animated.event map contentOffset.x → scrollX (Animated.Value).
 *  - scrollX được truyền xuống từng StoryItem để tính scale Cover Flow.
 *
 * Tại sao dùng Animated.event thay vì onScroll callback thường?
 *  → Animated.event với useNativeDriver: true cho phép cầu nối Native
 *    trực tiếp nhận event từ UI thread, KHÔNG cần routing qua JS bridge.
 *    Kết quả: scale animation mượt 60fps dù JS thread đang bận.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ListRenderItemInfo,
  Platform,
  Pressable,
  Text,
  View,
} from 'react-native';

import { MEMORABLE_MOMENTS_DATA, StoryData } from '@/data/mockData';
import StoryItem from '@/components/StoryItem';
import styles from './styles';
import { ITEM_SPACING, ITEM_WIDTH, SNAP_INTERVAL } from '@/lib/constant';

/**
 * Giá trị khởi tạo — sẽ được cập nhật tự động khi xoay màn hình.
 * (Xem: Dimensions.addEventListener bên trong component.)
 */
const INITIAL_SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * ⚠️  Công thức này chỉ dùng để tính GIÁ TRỊ KHỚI TẠ.
 * Giá trị thực tế khi xoay màn hình được tính lại từ `screenWidth` state.
 */
const getHorizontalPadding = (sw: number) => (sw - ITEM_WIDTH) / 2;

// ─── Component ───────────────────────────────────────────────────────────────

const MemorableMoments: React.FC = () => {
  const listRef = useRef<Animated.FlatList<StoryData> | null>(null);
  /**
   * scrollX theo dõi contentOffset.x của FlatList.
   *
   * Dùng useRef để giữ cùng một Animated.Value instance qua mọi render —
   * tránh tạo lại instance mới làm gián đoạn animation đang chạy.
   *
   * Giá trị này được map trực tiếp từ Animated.event (xem bên dưới),
   * nên nó luôn được cập nhật trên UI thread mà không qua JS bridge.
   */
  const scrollX = useRef(new Animated.Value(0)).current;

  /**
   * onScroll handler được tạo bằng Animated.event.
   *
   * Cơ chế hoạt động:
   *  - Animated.event nhận một "mapping array" mô tả cách lấy giá trị
   *    từ native event và gán vào Animated.Value.
   *  - `nativeEvent.contentOffset.x` → `scrollX`
   *  - `useNativeDriver: true`: cầu nối animation chạy hoàn toàn trên
   *    UI thread, bỏ qua JS bridge → đây là chìa khoá để đạt 60fps.
   *
   * ⚠️  useNativeDriver: true với Animated.event yêu cầu truyền handler
   *    này vào prop `onScroll` của ScrollView/FlatList — không thể dùng
   *    với Animated.Value.addListener() theo cách thủ công.
   */
  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: true },
  );

  /**
   * activeIndex: dot đang active trong pagination.
   */
  const initialIndex = Math.floor(MEMORABLE_MOMENTS_DATA.length / 2);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isListReady, setIsListReady] = useState(false);

  /**
   * interactionResetCount: tăng mỗi khi carousel cần đóng overlay.
   */
  const [interactionResetCount, setInteractionResetCount] = useState(0);

  /**
   * activeIndexRef: ref lưu giá trị activeIndex hiện tại.
   * Dùng trong addListener để tránh closure stale và giảm setState thừa.
   */
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

  /**
   * renderItem: Render từng StoryItem.
   *
   * - isActive: cho StoryItem biết nó có đang ở giữa màn hình không.
   * - interactionResetCount: tăng mỗi khi người dùng kéo hoặc chạm vùng trống.
   */
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<StoryData>) => (
      <StoryItem
        item={item}
        index={index}
        scrollX={scrollX}
        isActive={activeIndex === index}
        interactionResetCount={interactionResetCount}
        onVideoEnd={handleVideoEnd}
      />
    ),
    [scrollX, activeIndex, interactionResetCount, handleVideoEnd],
  );

  /**
   * keyExtractor: Dùng id để FlatList tối ưu reconciliation.
   */
  const keyExtractor = useCallback((item: StoryData) => item.id, []);

  /**
   * screenWidth: chiều rộng màn hình hiện tại.
   *
   * Dùng useState thay vì hằng số tĩnh để hỗ trợ xoay màn hình
   * (Portrait ↔ Landscape). Khi xoay, Dimensions.addEventListener 'change'
   * sẽ cập nhật state → FlatList re-render với padding mới chính xác.
   */
  const [screenWidth, setScreenWidth] = useState(INITIAL_SCREEN_WIDTH);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => subscription.remove();
  }, []);

  // Padding được tính lại mỗi khi screenWidth thay đổi.
  const horizontalPadding = getHorizontalPadding(screenWidth);
  const contentPadding = Math.max(0, horizontalPadding - ITEM_SPACING / 2);

  useEffect(() => {
    if (!isListReady) {
      return;
    }
    scrollToCenteredIndex(activeIndexRef.current, false);
    scrollX.setValue(activeIndexRef.current * SNAP_INTERVAL);
  }, [isListReady, scrollToCenteredIndex, screenWidth, scrollX]);

  /**
   * onScrollBeginDrag: fire ngay khi ngón tay chạm và bắt đầu kéo.
   * Thời điểm này sớm nhất có thể detect scroll intent.
   */
  const onScrollBeginDrag = useCallback(() => {
    setInteractionResetCount(c => c + 1);
  }, []);

  const dismissOverlay = useCallback(() => {
    setInteractionResetCount(c => c + 1);
  }, []);

  /**
   * scrollX.addListener: Cập nhật activeIndex REALTIME trong khi scroll.
   *
   * Tại sao cần addListener thay vì chỉ onMomentumScrollEnd?
   *  → onMomentumScrollEnd chỉ fire sau khi deceleration XONG — có độ trễ
   *    rõ ràng đặc biệt trên Android. addListener cập nhật tại mỗi frame
   *    scroll → dots đổi màu đúng thời điểm item snap vào giữa.
   *
   * Math.round(value / SNAP_INTERVAL): chỉ đổi index khi scroll quá 50%
   * khoảng cách giữa 2 snap point — tránh nhảy lúà hại.
   *
   * Kiểm tra `idx !== activeIndexRef.current` trước setState để không
   * trigger re-render không cần thiết khi index chưa đổi.
   */
  useEffect(() => {
    const listenerId = scrollX.addListener(({ value }) => {
      const idx = Math.round(value / SNAP_INTERVAL);
      if (idx !== activeIndexRef.current) {
        activeIndexRef.current = idx;
        setActiveIndex(idx);
      }
    });
    return () => scrollX.removeListener(listenerId);
  }, [scrollX]);

  /**
   * onMomentumScrollEnd: Accuracy fallback sau khi scroll dừng hẳn.
   * Đảm bảo index cuối cùng luôn chính xác dù addListener có bỏ sót
   * frame nào đó (hiếm nhưng có thể xảy ra khi JS thread tắc ngữn).
   */
  const onMomentumScrollEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { x: number } } }) => {
      const index = Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL);
      activeIndexRef.current = index;
      setActiveIndex(index);
    },
    [],
  );

  /**
   * getItemLayout: Cung cấp kích thước item tĩnh để FlatList KHÔNG cần
   * đo dynamic khi scroll. Cải thiện hiệu năng khởi tạo và scroll.
   *
   * offset phải tính cả paddingHorizontal của contentContainerStyle.
   * contentPadding động theo screenWidth để đúng cả khi xoay màn hình.
   */
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
      {/* ── Tiêu đề section ── */}
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>6607 Khoảnh khắc đáng nhớ</Text>
        <Text style={styles.sectionSubtitle}>
          Hàng ngàn khoảnh khắc đáng nhớ về hành trình học tập thú vị luôn được
          ZIM ghi lại mỗi ngày tại 21 trung tâm Anh Ngữ ZIM trên toàn quốc.
        </Text>
      </View>

      {/* ── Carousel FlatList ── */}
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
          onLayout={() => {
            setIsListReady(true);
          }}
          /**
           * horizontal: true → FlatList cuộn ngang.
           */
          horizontal
          /**
           * showsHorizontalScrollIndicator: false → ẩn thanh cuộn,
           * giao diện sạch hơn.
           */
          showsHorizontalScrollIndicator={false}
          /**
           * contentContainerStyle với paddingHorizontal để item đầu/cuối
           * có thể được đưa vào tâm màn hình khi active.
           */
          contentContainerStyle={{
            paddingHorizontal: contentPadding,
          }}
          /**
           * snapToInterval: Khoảng cách mỗi lần "snap" khi người dùng thả tay.
           * Giá trị = ITEM_WIDTH + ITEM_SPACING (khoảng cách giữa điểm neo).
           */
          snapToInterval={SNAP_INTERVAL}
          /**
           * decelerationRate="fast": Giảm tốc nhanh sau khi thả,
           * kết hợp với snapToInterval tạo cảm giác snap chắc chắn.
           * Trên iOS, "fast" ≈ 0.99; Android mặc định đã nhanh hơn iOS.
           */
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollBeginDrag={onScrollBeginDrag}
          /**
           * onScroll: Animated.event handler map contentOffset.x → scrollX.
           * scrollEventThrottle={1}: Trên iOS, cho phép nhận event mỗi 1pt di chuyển
           * để animation scale đủ mượt. Trên Android, không cần thiết nhưng vô hại.
           *
           * ⚠️  Nếu tăng scrollEventThrottle lên 16 (1 frame), animation sẽ
           *    bị "giật" nhẹ trên iOS khi scroll nhanh.
           */
          onScroll={onScroll}
          scrollEventThrottle={Platform.OS === 'ios' ? 1 : 16}
          /**
           * removeClippedSubviews: true → React Native sẽ detach view
           * nằm ngoài viewport khỏi layout tree, giảm bộ nhớ GPU.
           * Lưu ý: có thể gây flicker trên một số Android cũ; test kỹ trước khi dùng.
           */
          removeClippedSubviews
          /**
           * initialNumToRender: Số item render ban đầu.
           * 3 vừa đủ để hiển thị item đầu + hai bên trong viewport.
           */
          initialNumToRender={3}
          /**
           * maxToRenderPerBatch: Số item render tối đa trong mỗi batch.
           * Giữ thấp (2) để không block JS thread khi render lần đầu.
           */
          maxToRenderPerBatch={2}
          /**
           * windowSize: Số màn hình (x viewport) được giữ trong bộ nhớ.
           * windowSize={5} = 2 màn hình trước + hiện tại + 2 màn hình sau.
           */
          windowSize={5}
        />
      </View>
    </View>
  );
};

export default React.memo(MemorableMoments);

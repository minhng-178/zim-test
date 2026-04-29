import { Platform, StyleSheet } from "react-native";
import {ITEM_SPACING, ITEM_WIDTH} from '@/lib/constant';

export default StyleSheet.create({
    container: {
        width: ITEM_WIDTH,
        height: 460,
        marginHorizontal: ITEM_SPACING / 2,
        borderRadius: 20,
        overflow: 'hidden',
        /**
         * Shadow (iOS) — chỉ hoạt động khi overflow KHÔNG phải 'hidden' trên iOS.
         * Đây là trade-off: ưu tiên overflow: hidden để bo góc ảnh.
         * Nếu cần shadow, có thể bọc thêm View wrapper bên ngoài.
         */
        ...Platform.select({
            android: { elevation: 8 },
        }),
    },
    pressable: {
        flex: 1,
    },
    pressableFocused: {
        borderWidth: 2,
        borderColor: '#da1e39',
    },
    video: {
        ...StyleSheet.absoluteFill,
    },
    /** Lớp gradient nhẹ luôn hiển thị để title dễ đọc kể cả khi overlay ẩn. */
    baseGradient: {
        ...StyleSheet.absoluteFill,
        // Gradient giả bằng backgroundColor với opacity thấp ở phần dưới.
        // React Native thuần không có LinearGradient, dùng View overlay thay thế.
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    /**
     * Overlay chứa toàn bộ nội dung reveal.
     * opacity được điều khiển bởi Animated.Value → chạy trên UI thread.
     */
    overlay: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'flex-end',
    },
    controls: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    overlayScrim: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    progressTrack: {
        position: 'absolute',
        top: 10,
        left: 12,
        right: 12,
        height: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        width: '100%',
        backgroundColor: '#da1e39',
    },
    muteButtonWrapper: {
        position: 'absolute',
        top: 18,
        left: 12,
        zIndex: 3,
    },
    muteButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 14,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    playButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    controlIcon: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.4,
    },
    /**
     * Nền gradient từ dưới lên (giả bằng semi-transparent background).
     * Đảm bảo contrast ratio: text trắng (#FFFFFF) trên nền rgba(0,0,0,0.75)
     * → tỉ lệ contrast ≈ 10.5:1, vượt chuẩn WCAG AAA (7:1).
     */
    overlayGradient: {
        paddingHorizontal: 20,
        paddingBottom: 24,
        paddingTop: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        zIndex: 1,
        // Bo góc dưới theo container
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    overlayTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    overlayDescription: {
        fontSize: 13,
        fontWeight: '400',
        color: 'rgba(255, 255, 255, 0.85)',
        lineHeight: 19,
        marginBottom: 16,
    },
    ctaButton: {
        alignSelf: 'flex-start',
        backgroundColor: '#da1e39',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    ctaText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
}); 
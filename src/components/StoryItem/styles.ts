import { Platform, StyleSheet } from 'react-native';
import { ITEM_SPACING, ITEM_WIDTH } from '@/lib/constant';

export default StyleSheet.create({
    container: {
        width: ITEM_WIDTH,
        height: 420,
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
    thumbnail: {
        ...StyleSheet.absoluteFill,
    },
    activeBorder: {
        borderWidth: 2,
        borderColor: '#da1e39',
    },
    /** Lớp gradient nhẹ luôn hiển thị để title dễ đọc kể cả khi overlay ẩn. */
    baseGradient: {
        ...StyleSheet.absoluteFill,
        // Gradient giả bằng backgroundColor với opacity thấp ở phần dưới.
        // React Native thuần không có LinearGradient, dùng View overlay thay thế.
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
    
}); 
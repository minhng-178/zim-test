import { Platform, StyleSheet } from 'react-native';
import { ITEM_SPACING, ITEM_WIDTH } from '@/lib/constant';

export default StyleSheet.create({
    container: {
        width: ITEM_WIDTH,
        height: 420,
        marginHorizontal: ITEM_SPACING / 2,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#111111', // fallback khi ảnh chưa load, tránh nền trắng trên Android
        ...Platform.select({
            android: { elevation: 8 },
        }),
    },
    pressable: {
        flex: 1,
    },
    containerFocused: {
        borderWidth: 3,
        borderColor: '#FFD700',
        ...Platform.select({
            android: { elevation: 12 },
            ios: {
                shadowColor: '#FFD700',
                shadowOpacity: 0.6,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 0 },
            },
        }),
    },
    thumbnail: {
        ...StyleSheet.absoluteFill,
    },
    activeBorder: {
        borderWidth: 2,
        borderColor: '#da1e39',
    },
    baseGradient: {
        ...StyleSheet.absoluteFill,
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
    },
}); 
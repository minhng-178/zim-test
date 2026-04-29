import { StyleSheet } from "react-native";

export default StyleSheet.create({
    section: {
        paddingVertical: 32,
        backgroundColor: '#FFFFFF',
    },
    carouselShell: {
        position: 'relative',
    },
    carouselDismissLayer: {
        ...StyleSheet.absoluteFill,
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#da1e39',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111111',
        letterSpacing: -0.5,
        marginBottom: 10,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        lineHeight: 21,
    },
});
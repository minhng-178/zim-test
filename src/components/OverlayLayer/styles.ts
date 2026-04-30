import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  overlayScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  overlayGradient: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    zIndex: 1,
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
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  ctaIcon: {
    marginLeft: 6,
  },
});

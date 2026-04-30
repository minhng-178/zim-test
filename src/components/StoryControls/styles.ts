import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  controls: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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
});

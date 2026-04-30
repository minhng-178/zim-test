import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
});

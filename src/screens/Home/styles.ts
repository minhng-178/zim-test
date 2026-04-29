import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 4,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: '#da1e39',
    letterSpacing: -1,
  },
  footer: {
    marginTop: 32,
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.45)',
  },
});

export default styles;

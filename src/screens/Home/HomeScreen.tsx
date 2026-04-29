/**
 * HomeScreen.tsx
 *
 * Màn hình chính của ứng dụng ZIM Academy.
 * Bao gồm header logo, section MemorableMoments và footer.
 */

import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MemorableMoments from '@/components/MemorableMoments';
import styles from './styles';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.topBar}>
          <Text style={styles.logo}>ZIM Academy</Text>
        </View>

        {/* Section "Khoảnh khắc đáng nhớ" */}
        <MemorableMoments />

        {/* Spacer cuối trang */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 ZIM Academy. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

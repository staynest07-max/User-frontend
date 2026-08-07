import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Button, colors, spacing, radius } from '@/design-system';
import { useAppStore } from '@/stores/appStore';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Find your next home',
    body: 'Verified PGs with the calm of a well-kept apartment—not a noisy listings board.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
  },
  {
    id: '2',
    title: 'Safety you can feel',
    body: 'Women-friendly filters, CCTV, biometric entry, and transparent verification badges.',
    image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=80',
  },
  {
    id: '3',
    title: 'Visit with confidence',
    body: 'Enquire, schedule visits, and see full costs before you commit. No surprises.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = React.useState(0);
  const listRef = useRef<FlatList>(null);
  const setRole = useAppStore((s) => s.setRole);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(i);
  };

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom + spacing.lg }]}>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <View style={styles.hero}>
              <Image source={{ uri: item.image }} style={StyleSheet.absoluteFill} contentFit="cover" />
              <LinearGradient
                colors={['transparent', 'rgba(250,248,244,0.2)', colors.background]}
                style={StyleSheet.absoluteFill}
              />
            </View>
            <View style={styles.copy}>
              <Text variant="captionMedium" color={colors.primaryDark} style={styles.brand}>
                STAYNEST
              </Text>
              <Text variant="display" style={{ marginTop: spacing.sm }}>
                {item.title}
              </Text>
              <Text variant="bodyLarge" color={colors.textSecondary} style={{ marginTop: spacing.lg }}>
                {item.body}
              </Text>
            </View>
          </View>
        )}
      />

      <View style={styles.dots}>
        {slides.map((s, i) => (
          <View key={s.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>

      <View style={[styles.actions, { paddingHorizontal: spacing['2xl'] }]}>
        <Button
          title={index < slides.length - 1 ? 'Continue' : 'Get started'}
          fullWidth
          size="lg"
          onPress={() => {
            if (index < slides.length - 1) {
              listRef.current?.scrollToIndex({ index: index + 1, animated: true });
            } else {
              router.push('/(onboarding)/preferences');
            }
          }}
        />
        <Button
          title="Continue as guest"
          variant="ghost"
          fullWidth
          onPress={() => {
            useAppStore.getState().continueAsGuest();
            useAppStore.getState().completeOnboarding();
            router.replace('/(user)/(tabs)');
          }}
        />
        <Button
          title="I’m a PG owner"
          variant="outline"
          fullWidth
          onPress={() => {
            setRole('merchant');
            router.push('/(auth)/login');
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  hero: {
    height: Dimensions.get('window').height * 0.48,
    backgroundColor: colors.surfaceMuted,
  },
  copy: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.xl,
  },
  brand: {
    letterSpacing: 3,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderStrong,
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.primary,
    borderRadius: radius.chip,
  },
  actions: { gap: spacing.sm },
});

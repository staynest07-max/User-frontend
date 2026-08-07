import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Text, Button, Chip, Input, colors, spacing } from '@/design-system';
import { properties } from '@/data/mock';
import { addDays, format } from 'date-fns';

const times = ['10:00 AM', '11:30 AM', '1:00 PM', '4:00 PM', '5:30 PM', '6:30 PM'];

export default function BookVisitScreen() {
  const { id, room } = useLocalSearchParams<{ id: string; room?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const property = properties.find((p) => p.id === id);
  const dates = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(new Date(), i + 1)),
    []
  );
  const [dateIdx, setDateIdx] = useState(0);
  const [time, setTime] = useState(times[1]);
  const [roomId, setRoomId] = useState(room || property?.roomTypes[0]?.id);
  const [note, setNote] = useState('');

  if (!property) return null;

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing['2xl'], paddingBottom: 120 }}>
        <Pressable onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={22} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <Text variant="h2">Book a visit</Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginTop: spacing.sm }}>
          {property.name} · {property.area}
        </Text>

        <Text variant="h4" style={styles.section}>
          Preferred date
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {dates.map((d, i) => (
            <Chip
              key={d.toISOString()}
              label={format(d, 'EEE d MMM')}
              selected={dateIdx === i}
              onPress={() => setDateIdx(i)}
            />
          ))}
        </ScrollView>

        <Text variant="h4" style={styles.section}>
          Time
        </Text>
        <View style={styles.wrap}>
          {times.map((t) => (
            <Chip key={t} label={t} selected={time === t} onPress={() => setTime(t)} />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          Room interest
        </Text>
        <View style={styles.wrap}>
          {property.roomTypes.map((r) => (
            <Chip
              key={r.id}
              label={r.name}
              selected={roomId === r.id}
              onPress={() => setRoomId(r.id)}
            />
          ))}
        </View>

        <Text variant="h4" style={styles.section}>
          Note for owner
        </Text>
        <Input
          placeholder="Anything the owner should know…"
          value={note}
          onChangeText={setNote}
          multiline
          style={{ minHeight: 88, textAlignVertical: 'top' }}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
        <Button
          title="Request visit"
          fullWidth
          size="lg"
          onPress={() =>
            router.replace({
              pathname: '/(user)/booking-success',
              params: {
                type: 'visit',
                name: property.name,
                date: format(dates[dateIdx], 'd MMM yyyy'),
                time,
              },
            })
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  back: { width: 44, height: 44, justifyContent: 'center', marginBottom: spacing.sm },
  section: { marginTop: spacing['2xl'], marginBottom: spacing.md },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  footer: {
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});

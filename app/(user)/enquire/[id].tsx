import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { z } from 'zod';
import { Text, Button, Chip, Input, ErrorState, Skeleton, colors, spacing } from '@/design-system';
import { usePublicPgDetail } from '@/features/publicPgs/hooks/usePublicPgs';
import { useCreateEnquiry } from '@/features/engagement/hooks/useEnquiries';

const schema = z.object({ message: z.string().trim().min(1, 'Please enter a message').max(2000), moveInDate: z.union([z.literal(''), z.iso.date('Use YYYY-MM-DD')]) });
export default function EnquireScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const router: any = useRouter(); const insets = useSafeAreaInsets(); const pg = usePublicPgDetail(id); const create = useCreateEnquiry();
  const [roomType, setRoomType] = useState(''); const [message, setMessage] = useState('Hi, I am interested in this PG. Please share current availability.'); const [moveInDate, setMoveInDate] = useState(''); const [errors, setErrors] = useState<Record<string,string>>({});
  if (pg.isPending) return <View style={styles.center}><Skeleton height={300} /></View>;
  if (pg.isError || !pg.data) return <View style={styles.center}><ErrorState description="This home could not be loaded." onRetry={() => void pg.refetch()} /></View>;
  const roomTypes = [...new Set([...pg.data.rooms.map((x) => x.roomType), ...pg.data.availability.map((x) => x.roomType)])];
  const submit = () => { const parsed = schema.safeParse({ message, moveInDate }); if (!parsed.success) { setErrors(Object.fromEntries(parsed.error.issues.map((x) => [String(x.path[0]), x.message]))); return; } setErrors({}); create.mutate({ pgId: pg.data.id, message: parsed.data.message, roomType: roomType || undefined, moveInDate: parsed.data.moveInDate || undefined }, { onSuccess: (result) => router.replace(`/(user)/enquiries/${result.id}`) }); };
  return <View style={[styles.root, { paddingTop: insets.top + spacing.md }]}><ScrollView contentContainerStyle={styles.body}><Pressable onPress={() => router.back()} style={styles.back}><ArrowLeft size={22} color={colors.textPrimary} /></Pressable><Text variant="h2">Send enquiry</Text><Text variant="body" color={colors.textSecondary}>{pg.data.name}</Text>{roomTypes.length ? <><Text variant="h4" style={styles.section}>Room type</Text><View style={styles.wrap}>{roomTypes.map((x) => <Chip key={x} label={x} selected={roomType === x} onPress={() => setRoomType(x)} />)}</View></> : null}<Input label="Preferred move-in date" placeholder="YYYY-MM-DD" value={moveInDate} onChangeText={setMoveInDate} error={errors.moveInDate} /><Input label="Message" value={message} onChangeText={setMessage} multiline style={styles.message} error={errors.message} />{create.isError ? <Text variant="caption" color={colors.error}>Your enquiry could not be sent. Please review the details and try again.</Text> : null}</ScrollView><View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}><Button title="Send enquiry" fullWidth size="lg" loading={create.isPending} onPress={submit} /></View></View>;
}
const styles = StyleSheet.create({ root: { flex: 1, backgroundColor: colors.background }, center: { flex: 1, justifyContent: 'center', padding: spacing['2xl'] }, body: { paddingHorizontal: spacing['2xl'], paddingBottom: 140, gap: spacing.lg }, back: { width: 44, height: 44, justifyContent: 'center' }, section: { marginTop: spacing.md }, wrap: { flexDirection: 'row', flexWrap: 'wrap' }, message: { minHeight: 120, textAlignVertical: 'top' }, footer: { paddingHorizontal: spacing['2xl'], paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border } });

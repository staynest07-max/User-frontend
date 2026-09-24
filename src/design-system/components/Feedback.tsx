import React from 'react';
import { View, StyleSheet, Pressable, Modal, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { colors, radius, spacing, elevation } from '../tokens';
import { Text } from './Text';

export function Chip({
  label,
  selected,
  onPress,
  icon,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
}) {
  const content = (
    <>
      {icon}
      <Text
        variant="captionMedium"
        color={selected ? colors.primaryDark : colors.textSecondary}
        style={icon ? { marginLeft: 6 } : undefined}
      >
        {label}
      </Text>
    </>
  );

  if (!onPress) {
    return <View style={[styles.chip, selected && styles.chipSelected]}>{content}</View>;
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      {content}
    </Pressable>
  );
}

export function Badge({
  label,
  tone = 'neutral',
}: {
  label: string;
  tone?: 'neutral' | 'success' | 'warning' | 'error' | 'info' | 'primary';
}) {
  const toneMap = {
    neutral: { bg: colors.surfaceMuted, fg: colors.textSecondary },
    success: { bg: colors.successLight, fg: colors.success },
    warning: { bg: colors.warningLight, fg: '#B8860B' },
    error: { bg: colors.errorLight, fg: colors.error },
    info: { bg: colors.infoLight, fg: colors.info },
    primary: { bg: colors.primaryLight, fg: colors.primaryDark },
  }[tone];

  return (
    <View style={[styles.badge, { backgroundColor: toneMap.bg }]}>
      <Text variant="smallMedium" color={toneMap.fg}>
        {label}
      </Text>
    </View>
  );
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  height = 0.72,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
}) {
  const insets = useSafeAreaInsets();
  const sheetH = Dimensions.get('window').height * height;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Dismiss" />
        <View
          style={[styles.sheet, { height: sheetH, paddingBottom: insets.bottom + spacing.lg }, elevation.float]}
        >
          <View style={styles.handle} />
          {title ? (
            <View style={styles.sheetHeader}>
              <Text variant="h3">{title}</Text>
              <Pressable onPress={onClose} hitSlop={12} accessibilityLabel="Close">
                <X size={22} color={colors.textSecondary} strokeWidth={2} />
              </Pressable>
            </View>
          ) : null}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing['3xl'] }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export function Skeleton({
  width,
  height,
  radius: r = radius.md,
  style,
}: {
  width?: number | string;
  height: number;
  radius?: number;
  style?: object;
}) {
  return (
    <View
      style={[
        {
          width: width ?? '100%',
          height,
          borderRadius: r,
          backgroundColor: colors.surfaceMuted,
        },
        style,
      ]}
    />
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}) {
  return (
    <View style={styles.empty}>
      <View style={styles.emptyIcon}>{icon}</View>
      <Text variant="h3" align="center">
        {title}
      </Text>
      <Text variant="body" color={colors.textSecondary} align="center" style={{ marginTop: spacing.sm }}>
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Pressable onPress={onAction} style={styles.emptyBtn}>
          <Text variant="button" color={colors.primaryDark}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn’t load this right now. Please try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      actionLabel="Try again"
      onAction={onRetry}
    />
  );
}

export function Screen({
  children,
  padded = true,
  style,
}: {
  children: React.ReactNode;
  padded?: boolean;
  style?: object;
}) {
  return (
    <View style={[styles.screen, padded && { paddingHorizontal: spacing['2xl'] }, style]}>
      {children}
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="h4">{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="captionMedium" color={colors.primaryDark}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.chip,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    minHeight: 36,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.chip,
    alignSelf: 'flex-start',
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: spacing.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing['4xl'],
    gap: spacing.xs,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyBtn: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.md,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.control,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
});

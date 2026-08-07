import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Search, Heart, CalendarDays, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { colors, spacing, radius, elevation, Text } from '@/design-system';

function TabIcon({
  label,
  focused,
  children,
}: {
  label: string;
  focused: boolean;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.tabItem}>
      {children}
      <Text
        variant="smallMedium"
        color={focused ? colors.primaryDark : colors.textTertiary}
        style={{ marginTop: 4, fontSize: 11 }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function UserTabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          left: spacing.lg,
          right: spacing.lg,
          bottom: Math.max(insets.bottom, spacing.sm),
          height: 68,
          borderRadius: radius['3xl'],
          backgroundColor: colors.glass,
          borderTopWidth: 0,
          paddingBottom: 0,
          ...elevation.nav,
          overflow: 'hidden',
        },
        tabBarBackground: () => (
          <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" focused={focused}>
              <Home size={22} color={focused ? colors.primary : colors.textTertiary} strokeWidth={2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Search" focused={focused}>
              <Search size={22} color={focused ? colors.primary : colors.textTertiary} strokeWidth={2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Saved" focused={focused}>
              <Heart size={22} color={focused ? colors.primary : colors.textTertiary} strokeWidth={2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Visits" focused={focused}>
              <CalendarDays size={22} color={focused ? colors.primary : colors.textTertiary} strokeWidth={2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Profile" focused={focused}>
              <User size={22} color={focused ? colors.primary : colors.textTertiary} strokeWidth={2} />
            </TabIcon>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: { alignItems: 'center', justifyContent: 'center', minWidth: 56 },
});

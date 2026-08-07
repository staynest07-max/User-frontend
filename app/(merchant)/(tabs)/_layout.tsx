import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Building2, Inbox, CalendarDays, User } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { colors, spacing, radius, elevation, Text } from '@/design-system';

function TabIcon({ label, focused, children }: { label: string; focused: boolean; children: React.ReactNode }) {
  return (
    <View style={{ alignItems: 'center', minWidth: 56 }}>
      {children}
      <Text variant="smallMedium" color={focused ? colors.primaryDark : colors.textTertiary} style={{ marginTop: 4, fontSize: 11 }}>
        {label}
      </Text>
    </View>
  );
}

export default function MerchantTabs() {
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
          ...elevation.nav,
          overflow: 'hidden',
        },
        tabBarBackground: () => <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Home" focused={focused}>
              <LayoutDashboard size={22} color={focused ? colors.primary : colors.textTertiary} strokeWidth={2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="listings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="PGs" focused={focused}>
              <Building2 size={22} color={focused ? colors.primary : colors.textTertiary} strokeWidth={2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="enquiries"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="Leads" focused={focused}>
              <Inbox size={22} color={focused ? colors.primary : colors.textTertiary} strokeWidth={2} />
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="visits"
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

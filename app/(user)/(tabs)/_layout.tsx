import React from 'react';
import { View, StyleSheet } from 'react-native';
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
        numberOfLines={1}
        style={styles.tabLabel}
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
          height: 72,
          borderRadius: radius['3xl'],
          backgroundColor: colors.glass,
          borderTopWidth: 0,
          borderTopColor: 'transparent',
          paddingHorizontal: spacing.xs,
          paddingTop: 0,
          paddingBottom: 0,
          elevation: 0,
          ...elevation.nav,
          overflow: 'hidden',
        },
        tabBarItemStyle: {
          flex: 1,
          height: 72,
          padding: 0,
          margin: 0,
        },
        tabBarIconStyle: {
          width: '100%',
          height: 72,
          marginTop: 0,
          marginBottom: 0,
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
  tabItem: {
    width: '100%',
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 11,
    lineHeight: 14,
    textAlign: 'center',
  },
});

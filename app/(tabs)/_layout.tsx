import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

function TabIcon({ name, focused }: { name: any; focused: boolean }) {
  return (
    <View style={[ti.wrap, focused && ti.active]}>
      <Ionicons name={focused ? name : `${name}-outline`} size={22} color={focused ? COLORS.primary : COLORS.textMuted} />
    </View>
  );
}
const ti = StyleSheet.create({
  wrap: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  active: { backgroundColor: COLORS.primaryLight },
});

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textMuted,
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopColor: '#e5e7eb',
        height: Platform.OS === 'ios' ? 84 : 64,
        paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        paddingTop: 6,
      },
      tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginTop: -2 },
    }}>
      <Tabs.Screen name="index" options={{ title: 'หน้าหลัก', tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }} />
      <Tabs.Screen name="explore" options={{ title: 'สำรวจ', tabBarIcon: ({ focused }) => <TabIcon name="compass" focused={focused} /> }} />
      <Tabs.Screen name="social" options={{ title: 'ชุมชน', tabBarIcon: ({ focused }) => <TabIcon name="people" focused={focused} /> }} />
    </Tabs>
  );
}

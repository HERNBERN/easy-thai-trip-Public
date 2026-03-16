import { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { BackHeader, EmptyState } from '@/components/ui';

interface Notif {
  id: string; type: string; title: string; message: string;
  is_read: boolean; created_at: string;
}

const typeIcon: Record<string, any> = {
  like: 'heart', comment: 'chatbubble', trip: 'airplane', default: 'notifications',
};
const typeColor: Record<string, string> = {
  like: COLORS.danger, comment: COLORS.accent, trip: COLORS.primary, default: COLORS.textMuted,
};

const timeAgo = (d: string) => {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 60) return `${m} นาทีที่แล้ว`;
  if (m < 1440) return `${Math.floor(m / 60)} ชั่วโมงที่แล้ว`;
  return `${Math.floor(m / 1440)} วันที่แล้ว`;
};

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifs(); }, []);

  const fetchNotifs = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace('/auth'); return; }
    const { data } = await supabase.from('notifications')
      .select('*').eq('user_id', session.user.id)
      .order('created_at', { ascending: false }).limit(50);
    setNotifs((data as Notif[]) || []);
    setLoading(false);
  };

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifs(p => p.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const markAllRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from('notifications').update({ is_read: true })
      .eq('user_id', session.user.id).eq('is_read', false);
    setNotifs(p => p.map(n => ({ ...n, is_read: true })));
  };

  const unreadCount = notifs.filter(n => !n.is_read).length;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <BackHeader title="การแจ้งเตือน" subtitle={unreadCount > 0 ? `${unreadCount} ใหม่` : 'ทั้งหมด'} onBack={() => router.back()}
        rightIcon={unreadCount > 0 ? 'checkmark-done-outline' : undefined} onRight={markAllRead} />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList data={notifs} keyExtractor={n => n.id}
          contentContainerStyle={{ padding: 14, gap: 8, paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: n }) => {
            const icon = typeIcon[n.type] || typeIcon.default;
            const color = typeColor[n.type] || typeColor.default;
            return (
              <TouchableOpacity onPress={() => markRead(n.id)} activeOpacity={0.85}
                style={[s.card, !n.is_read && s.cardUnread]}>
                <View style={[s.iconWrap, { backgroundColor: color + '18' }]}>
                  <Ionicons name={icon} size={22} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.title}>{n.title}</Text>
                  <Text style={s.msg} numberOfLines={2}>{n.message}</Text>
                  <Text style={s.time}>{timeAgo(n.created_at)}</Text>
                </View>
                {!n.is_read && <View style={s.dot} />}
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <EmptyState icon="notifications-off-outline" title="ยังไม่มีการแจ้งเตือน" subtitle="เมื่อมีคนถูกใจหรือแสดงความคิดเห็นโพสต์ของคุณ จะแจ้งเตือนที่นี่" />
          }
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: 14, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.borderLight },
  cardUnread: { borderColor: COLORS.primary + '40', backgroundColor: COLORS.primaryLight },
  iconWrap: { width: 46, height: 46, borderRadius: RADIUS.lg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  title: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  msg: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 4 },
  time: { fontSize: 11, color: COLORS.textMuted },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary, flexShrink: 0 },
});

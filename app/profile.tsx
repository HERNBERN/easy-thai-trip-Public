import { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { Avatar, Card, Button } from '@/components/ui';

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [trips, setTrips] = useState<any[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace('/auth'); return; }
    const [profileRes, tripsRes, postsRes, notifRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('user_id', session.user.id).single(),
      supabase.from('trips').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }),
      supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id),
      supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id).eq('is_read', false),
    ]);
    setProfile(profileRes.data);
    setTrips(tripsRes.data || []);
    setPostCount((postsRes as any).count || 0);
    setUnread((notifRes as any).count || 0);
    setNewName(profileRes.data?.name || '');
    setLoading(false);
  };

  const saveName = async () => {
    if (!newName.trim()) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from('profiles').update({ name: newName.trim() }).eq('user_id', session.user.id);
    setProfile((p: any) => ({ ...p, name: newName.trim() }));
    setEditingName(false);
  };

  // Upload profile image
  const pickAndUploadImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('ต้องการสิทธิ์เข้าถึงรูปภาพ');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.7 });
    if (result.canceled) return;
    setUploading(true);
    try {
      const { uri } = result.assets[0];
      const response = await fetch(uri);
      const blob = await response.blob();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');
      const fileExt = uri.split('.').pop();
      const fileName = `avatar_${session.user.id}_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, blob, { upsert: true, contentType: blob.type });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const avatarUrl = data.publicUrl;
      await supabase.from('profiles').update({ avatar_url: avatarUrl }).eq('user_id', session.user.id);
      setProfile((p: any) => ({ ...p, avatar_url: avatarUrl }));
    } catch (e) {
      Alert.alert('อัปโหลดรูปไม่สำเร็จ', e.message || 'เกิดข้อผิดพลาด');
    }
    setUploading(false);
  };

  const handleLogout = () => Alert.alert('ออกจากระบบ', 'ยืนยันการออกจากระบบ?', [
    { text: 'ยกเลิก', style: 'cancel' },
    { text: 'ออกจากระบบ', style: 'destructive', onPress: async () => { await supabase.auth.signOut(); router.replace('/'); } },
  ]);

  const uniqueProvinces = [...new Set(trips.map(t => t.province))].length;
  const styleLabels: Record<string, string> = { nature: '🌿', culture: '🏛', adventure: '🏔', relaxation: '🧘', food: '🍜', shopping: '🛍' };

  if (loading) return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={s.backBtn}>
          <Ionicons name="chevron-back" size={26} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>โปรไฟล์</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} style={s.backBtn}>
          <Ionicons name="settings-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Card */}
        <LinearGradient colors={['#064b80', '#0667a6']} style={s.profileBanner}>
          <View style={s.avatarWrap}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={{ width: 82, height: 82, borderRadius: 41, backgroundColor: '#eee' }} />
            ) : (
              <Avatar name={profile?.name || 'U'} size={82} />
            )}
            <TouchableOpacity style={s.editAvatarBtn} onPress={pickAndUploadImage} disabled={uploading}>
              {uploading ? <ActivityIndicator color="#fff" size={16} /> : <Ionicons name="camera" size={16} color="#fff" />}
            </TouchableOpacity>
          </View>
          {editingName ? (
            <View style={s.editNameRow}>
              <TextInput style={s.nameInput} value={newName} onChangeText={setNewName} autoFocus selectTextOnFocus />
              <TouchableOpacity onPress={saveName} style={s.nameBtn}><Ionicons name="checkmark" size={22} color={COLORS.primary} /></TouchableOpacity>
              <TouchableOpacity onPress={() => setEditingName(false)} style={s.nameBtn}><Ionicons name="close" size={22} color={COLORS.textMuted} /></TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => setEditingName(true)} style={s.nameRow}>
              <Text style={s.profileName}>{profile?.name || 'ไม่ระบุชื่อ'}</Text>
              <Ionicons name="pencil" size={14} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          )}
          <Text style={s.profileEmail}>{profile?.email}</Text>
        </LinearGradient>

        {/* Stats */}
        <View style={s.statsRow}>
          {[
            { label: 'ทริป', value: trips.length, icon: 'airplane', color: COLORS.primary },
            { label: 'โพสต์', value: postCount, icon: 'chatbubble-ellipses', color: COLORS.accent },
            { label: 'จังหวัด', value: uniqueProvinces, icon: 'location', color: '#f59e0b' },
          ].map(stat => (
            <Card key={stat.label} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: stat.color + '18' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={s.statValue}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </Card>
          ))}
        </View>

        {/* Menu */}
        <View style={s.sec}>
          <Card style={{ overflow: 'hidden' }}>
            {[
              { icon: 'notifications', label: 'การแจ้งเตือน', sub: unread > 0 ? `${unread} ใหม่` : 'ไม่มีการแจ้งเตือนใหม่', badge: unread, color: COLORS.primary, path: '/notifications' },
              { icon: 'chatbubble-ellipses', label: 'แชทกับ AI', sub: 'วางแผนทริปกับ AI ได้เลย', color: COLORS.accent, path: '/chat' },
              { icon: 'settings', label: 'การตั้งค่า', sub: 'ธีม ภาษา การแจ้งเตือน', color: '#6b7280', path: '/settings' },
              { icon: 'shield-checkmark', label: 'นโยบายความเป็นส่วนตัว', sub: 'ข้อมูลและความปลอดภัย', color: '#6b7280', path: null },
            ].map((item, idx, arr) => (
              <TouchableOpacity key={item.label} onPress={() => item.path && router.push(item.path as any)}
                style={[s.menuRow, idx < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: COLORS.borderLight }]} activeOpacity={0.7}>
                <View style={[s.menuIcon, { backgroundColor: item.color + '18' }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.menuLabel}>{item.label}</Text>
                  <Text style={s.menuSub}>{item.sub}</Text>
                </View>
                {item.badge ? (
                  <View style={s.menuBadge}><Text style={s.menuBadgeTxt}>{item.badge}</Text></View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
                )}
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* Trips */}
        {trips.length > 0 && (
          <View style={s.sec}>
            <Text style={s.secTitle}>ทริปทั้งหมด ({trips.length})</Text>
            {trips.map(trip => (
              <Card key={trip.id} onPress={() => router.push(`/trip/${trip.id}`)} style={{ flexDirection: 'row', alignItems: 'center', padding: 13, marginBottom: 8, gap: 12 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 18 }}>{styleLabels[trip.travel_style] || '📍'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text }}>{trip.province}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 1 }}>{trip.start_date} → {trip.end_date}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
              </Card>
            ))}
          </View>
        )}

        {/* Logout */}
        <View style={[s.sec, { marginTop: 4 }]}>
          <Button label="ออกจากระบบ" onPress={handleLogout} variant="danger" icon="log-out-outline" />
        </View>
        <Text style={{ textAlign: 'center', fontSize: 12, color: COLORS.textMuted, paddingTop: 8 }}>เที่ยวง่ายสไตล์ฉัน v1.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  profileBanner: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24 },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  profileName: { fontSize: 22, fontWeight: '800', color: '#fff' },
  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  editNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  nameInput: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 8, fontSize: 17, color: '#fff', minWidth: 180 },
  nameBtn: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  statsRow: { flexDirection: 'row', gap: 10, margin: 16 },
  statCard: { flex: 1, padding: 14, alignItems: 'center', gap: 4 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statValue: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  sec: { paddingHorizontal: 16, marginBottom: 12 },
  secTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  menuSub: { fontSize: 12, color: COLORS.textMuted },
  menuBadge: { backgroundColor: COLORS.danger, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  menuBadgeTxt: { fontSize: 11, fontWeight: '800', color: '#fff' },
});

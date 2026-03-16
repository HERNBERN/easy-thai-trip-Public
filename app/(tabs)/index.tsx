import React, { useEffect, useState, useCallback } from 'react'; 
import usePlaceImage from '@/lib/usePlaceImage';

// Child component for trip card
function TripCardImage({ trip }) {
  const { uri, loading, error } = usePlaceImage({ name: trip.province, province: trip.province });
  if (loading) return <ActivityIndicator size="small" color={COLORS.primary} style={{ width: 72, height: 72 }} />;
  if (uri) return (
    <ImageBackground source={{ uri }} style={{ width: 72, height: 72, borderRadius: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} imageStyle={{ borderRadius: 14 }}>
      {error && <Text style={{ fontSize: 10, color: 'red', position: 'absolute', bottom: 2 }}>รูปไม่ตรง Google</Text>}
    </ImageBackground>
  );
  return (
    <LinearGradient colors={['#ecfdf5', '#f0fdf4']} style={{ width: 72, height: 72, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
      {error && <Text style={{ fontSize: 10, color: 'red', position: 'absolute', bottom: 2 }}>รูปไม่ตรง Google</Text>}
    </LinearGradient>
  );
}

// Child component for Top5 card
function Top5CardImage({ place, i }) {
  const { uri, loading, error } = usePlaceImage(place);
  if (loading) return <View style={{ width: '100%', height: 160, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="small" color={COLORS.primary} /></View>;
  if (uri) return <ImageBackground source={{ uri }} style={{ width: '100%', height: 160, justifyContent: 'flex-end' }} imageStyle={{ borderRadius: 20 }}><View style={{ backgroundColor: 'rgba(0,0,0,0.32)', borderBottomLeftRadius: 20, borderBottomRightRadius: 20, padding: 10 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}><View style={[s.rank, i === 0 && { backgroundColor: '#fef3c7' }, i === 1 && { backgroundColor: '#f1f5f9' }, i === 2 && { backgroundColor: '#fff7ed' }]}><Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.text }}>{i + 1}</Text></View><Text style={{ fontSize: 28 }}>{categories.find(c => c.places.includes(place))?.emoji || '📍'}</Text></View><Text style={{ fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 2, lineHeight: 18 }} numberOfLines={2}>{place.name}</Text><Text style={{ fontSize: 11, color: '#e0e7ef', marginBottom: 2 }} numberOfLines={1}>📍 {place.province}</Text><RatingStars rating={place.rating} />{error && <Text style={{ fontSize: 10, color: 'red', marginTop: 2 }}>รูปไม่ตรง Google</Text>}</View></ImageBackground>;
  return <View style={{ height: 160, justifyContent: 'flex-end', backgroundColor: '#e0e7ef', borderRadius: 20 }}><View style={{ padding: 10 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}><View style={[s.rank, i === 0 && { backgroundColor: '#fef3c7' }, i === 1 && { backgroundColor: '#f1f5f9' }, i === 2 && { backgroundColor: '#fff7ed' }]}><Text style={{ fontSize: 11, fontWeight: '800', color: COLORS.text }}>{i + 1}</Text></View><Text style={{ fontSize: 28 }}>{categories.find(c => c.places.includes(place))?.emoji || '📍'}</Text></View><Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2, lineHeight: 18 }} numberOfLines={2}>{place.name}</Text><Text style={{ fontSize: 11, color: COLORS.primary, marginBottom: 2 }} numberOfLines={1}>📍 {place.province}</Text><RatingStars rating={place.rating} />{error && <Text style={{ fontSize: 10, color: 'red', marginTop: 2 }}>รูปไม่ตรง Google</Text>}</View></View>;
}

// เพิ่ม hook สำหรับดึงรูปภาพถ้าไม่มี image_url
function Top5PlaceModal({ place, onClose }) {
  const { uri } = usePlaceImage(place);
  const imageUri = place?.image_url || uri;
  return (
    <Modal visible={!!place} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '90%', maxWidth: 400 }}>
          {imageUri ? (
            <ImageBackground source={{ uri: imageUri }} style={{ width: '100%', height: 160, borderRadius: 16, marginBottom: 14 }} imageStyle={{ borderRadius: 16 }} />
          ) : (
            <View style={{ width: '100%', height: 160, backgroundColor: '#ccc', borderRadius: 16, marginBottom: 14, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="image-outline" size={40} color="#fff" />
            </View>
          )}
          <Text style={{ fontWeight: '700', fontSize: 18, color: COLORS.primary, marginBottom: 6 }}>{place?.name}</Text>
          <Text style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>📍 {place?.province}</Text>
          <Text style={{ fontSize: 14, color: COLORS.text, marginBottom: 12 }}>{place?.description}</Text>
          <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
            <Text style={{ color: COLORS.danger, fontWeight: '700', fontSize: 15 }}>ปิด</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

import { Modal, ImageBackground } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { Avatar, SectionHeader, Card, RatingStars, EmptyState } from '@/components/ui';
import ProvinceWheel from '@/components/ProvinceWheel';
import { categories } from '@/data/places';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const STYLE_LABELS: Record<string, string> = { nature: '🌿 ธรรมชาติ', culture: '🏛 วัฒนธรรม', adventure: '🏔 ผจญภัย', relaxation: '🧘 พักผ่อน', food: '🍜 อาหาร', shopping: '🛍 ช้อปปิ้ง' };

export default function HomeScreen() {
  // ...existing code...
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [unread, setUnread] = useState(0);
  const [selectedTopPlace, setSelectedTopPlace] = useState<any|null>(null);
  // รวม Top 5 ทุกหมวด (rating สูงสุด)
  const allPlaces = categories.flatMap(c => c.places);
  const top5All = [...allPlaces].sort((a, b) => b.rating - a.rating).slice(0, 5);
  // No hook calls in loops or callbacks!

  useFocusEffect(useCallback(() => { fetchData(); }, []));

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.replace('/auth'); return; }
    const [profileRes, tripsRes, notifRes] = await Promise.all([
      supabase.from('profiles').select('name').eq('user_id', session.user.id).single(),
      supabase.from('trips').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(5),
      supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', session.user.id).eq('is_read', false),
    ]);
    setUserName(profileRes.data?.name || '');
    setTrips(tripsRes.data || []);
    setUnread((notifRes as any).count || 0);
    setLoading(false); setRefreshing(false);
  };

  const deleteTrip = (id: string) => Alert.alert('ลบทริป', 'ยืนยันลบทริปนี้?', [
    { text: 'ยกเลิก', style: 'cancel' },
    { text: 'ลบ', style: 'destructive', onPress: async () => {
      const { data: days } = await supabase.from('trip_days').select('id').eq('trip_id', id);
      if (days?.length) {
        await supabase.from('trip_activities').delete().in('trip_day_id', days.map((d: any) => d.id));
        await supabase.from('trip_days').delete().eq('trip_id', id);
      }
      await supabase.from('trips').delete().eq('id', id);
      setTrips(p => p.filter(t => t.id !== id));
    }},
  ]);

  const activeCat = categories.find(c => c.id === activeCategory) || categories[0];
  const top5 = [...activeCat.places].sort((a, b) => b.rating - a.rating).slice(0, 5);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'อรุณสวัสดิ์ 🌅' : hour < 17 ? 'สวัสดีตอนบ่าย ☀️' : 'สวัสดีตอนเย็น 🌙';

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>{greeting}</Text>
          <Text style={s.userName}>{userName || 'นักเดินทาง'}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={s.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.text} />
            {unread > 0 && <View style={s.badge}><Text style={s.badgeText}>{unread > 9 ? '9+' : unread}</Text></View>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Avatar name={userName} size={40} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={COLORS.primary} />}>

        {/* Hero */}
        <View style={{ padding: 16, gap: 12 }}>
          <TouchableOpacity onPress={() => router.push('/create-trip')} activeOpacity={0.9}>
            <LinearGradient colors={['#064b80', '#0667a6', '#0875bb']} style={s.hero} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={{ flex: 1 }}>
                <Text style={s.heroLabel}>✨ AI Trip Planner</Text>
                <Text style={s.heroTitle}>ไปไหนดี?{'\n'}ให้ AI วางแผนให้!</Text>
                <View style={s.heroChip}>
                  <Ionicons name="sparkles" size={11} color="#fff" />
                  <Text style={s.heroChipTxt}>เลือกจังหวัด → AI จัดให้ทันที</Text>
                </View>
              </View>
              <Text style={{ fontSize: 64 }}>🗺️</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* ลบปุ่ม quick action: ถาม AI, สำรวจ, ชุมชน, โปรไฟล์ */}
        </View>

        {/* Trips */}
        <View style={s.sec}>
          <SectionHeader title="ทริปของฉัน" action={trips.length > 0 ? 'ดูทั้งหมด' : undefined} onAction={() => router.push('/profile')} />
          {loading ? <View style={{ height: 72, backgroundColor: '#e5e7eb', borderRadius: 16 }} /> :
            trips.length === 0 ? (
              <Card><EmptyState icon="airplane-outline" title="ยังไม่มีทริป" subtitle="กด 'ไปไหนดี' แล้วให้ AI จัดทริปให้เลย!" action="สร้างทริปแรก" onAction={() => router.push('/create-trip')} /></Card>
            ) : trips.map((trip, idx) => (
              <Card key={trip.id} onPress={() => router.push(`/trip/${trip.id}`)} style={{ flexDirection: 'row', alignItems: 'center', padding: 0, marginBottom: 8, gap: 12, overflow: 'hidden' }}>
                <TripCardImage trip={trip} />
                <View style={{ flex: 1, padding: 14 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 2 }}>{trip.province}</Text>
                  <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{trip.start_date} → {trip.end_date}</Text>
                  {trip.travel_style && <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: '600', marginTop: 2 }}>{STYLE_LABELS[trip.travel_style] || trip.travel_style}</Text>}
                </View>
                <TouchableOpacity onPress={() => deleteTrip(trip.id)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.borderLight, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
                </TouchableOpacity>
              </Card>
            ))
          }
        </View>

        {/* Top 5 สถานที่ท่องเที่ยว (ตามหมวดหมู่) */}
        <View style={s.sec}>
          <SectionHeader title={`Top 5 ${activeCat.label}`} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {top5.map((place, i) => (
              <TouchableOpacity key={`${place.name}-${i}`} onPress={() => setSelectedTopPlace(place)} activeOpacity={0.88}
                style={{ width: 148, backgroundColor: '#fff', borderRadius: 20, padding: 0, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.borderLight, overflow: 'hidden' }}>
                <Top5CardImage place={place} i={i} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* หมวดหมู่เลือกได้ */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }} contentContainerStyle={{ gap: 8 }}>
            {categories.map(cat => (
              <TouchableOpacity key={cat.id} onPress={() => setActiveCategory(cat.id)} style={[s.catChip, activeCategory === cat.id && s.catChipOn]}>
                <Text style={[s.catChipTxt, activeCategory === cat.id && { color: '#fff' }]}>{cat.emoji} {cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {/* Modal รายละเอียดสถานที่ */}
          <Modal visible={!!selectedTopPlace} transparent animationType="fade" onRequestClose={() => setSelectedTopPlace(null)}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '90%', maxWidth: 400 }}>
                {selectedTopPlace?.image_url ? (
                  <ImageBackground source={{ uri: selectedTopPlace.image_url }} style={{ width: '100%', height: 160, borderRadius: 16, marginBottom: 14 }} imageStyle={{ borderRadius: 16 }} />
                ) : (
                  <View style={{ width: '100%', height: 160, backgroundColor: '#ccc', borderRadius: 16, marginBottom: 14, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="image-outline" size={40} color="#fff" />
                  </View>
                )}
                <Text style={{ fontWeight: '700', fontSize: 18, color: COLORS.primary, marginBottom: 6 }}>{selectedTopPlace?.name}</Text>
                <Text style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>📍 {selectedTopPlace?.province}</Text>
                <Text style={{ fontSize: 14, color: COLORS.text, marginBottom: 12 }}>{selectedTopPlace?.description}</Text>
                <TouchableOpacity onPress={() => setSelectedTopPlace(null)} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
                  <Text style={{ color: COLORS.danger, fontWeight: '700', fontSize: 15 }}>ปิด</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
        {/* วงล้อสุ่มจังหวัด (Province Wheel) */}
        <View style={{ marginHorizontal: 16, marginTop: 18, marginBottom: 8, backgroundColor: '#fff', borderRadius: 20, ...SHADOW.sm, padding: 10 }}>
          <ProvinceWheel
            provinces={categories.flatMap(c => c.places.map(p => p.province)).filter((v, i, a) => a.indexOf(v) === i)}
            onSelect={(province) => router.push({ pathname: '/create-trip', params: { province } })}
          />
        </View>

        {/* ...existing code... */}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  greeting: { fontSize: 12, color: COLORS.textMuted, marginBottom: 1 },
  userName: { fontSize: 19, fontWeight: '800', color: COLORS.text },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 3, right: 3, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { fontSize: 9, fontWeight: '800', color: '#fff' },
  hero: { borderRadius: 24, padding: 22, flexDirection: 'row', alignItems: 'center' },
  heroLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginBottom: 6 },
  heroTitle: { fontSize: 22, fontWeight: '800', color: '#fff', lineHeight: 30, marginBottom: 14 },
  heroChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6, alignSelf: 'flex-start' },
  heroChipTxt: { fontSize: 11, color: '#fff', fontWeight: '600' },
  quick: { flex: 1, alignItems: 'center', gap: 6 },
  quickIcon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 11, fontWeight: '600', color: COLORS.textSecondary },
  sec: { paddingHorizontal: 16, marginTop: 8, marginBottom: 4 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 99, backgroundColor: COLORS.borderLight },
  catChipOn: { backgroundColor: COLORS.primary },
  catChipTxt: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  rank: { width: 26, height: 26, borderRadius: 8, backgroundColor: COLORS.borderLight, alignItems: 'center', justifyContent: 'center' },
});

// Google Place Photo fetcher (เหมือน Explore)
const googlePhotoCache = {};
async function fetchGooglePlacePhoto(placeName, province) {
  const cacheKey = `${placeName}|${province}`;
  if (googlePhotoCache[cacheKey]) return googlePhotoCache[cacheKey];
  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(placeName + ' ' + province)}&inputtype=textquery&fields=place_id&key=AIzaSyC3RzxkPBJybASXf2Y-zWLYu5NQ-J-m5_U`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const placeId = searchData.candidates?.[0]?.place_id;
    if (!placeId) return null;
    const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photo&key=AIzaSyC3RzxkPBJybASXf2Y-zWLYu5NQ-J-m5_U`;
    const detailRes = await fetch(detailUrl);
    const detailData = await detailRes.json();
    const photoRef = detailData.result?.photos?.[0]?.photo_reference;
    if (!photoRef) return null;
    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=AIzaSyC3RzxkPBJybASXf2Y-zWLYu5NQ-J-m5_U`;
    googlePhotoCache[cacheKey] = photoUrl;
    return photoUrl;
  } catch {
    return null;
  }
}


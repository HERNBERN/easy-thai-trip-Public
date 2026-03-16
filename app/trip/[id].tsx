// ── trip/[id].tsx ────────────────────────────────────────
import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, TextInput, ImageBackground } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { BackHeader, Card, RatingStars } from '@/components/ui';
import usePlaceImage from '@/lib/usePlaceImage';
import { Modal, FlatList } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const catEmoji: Record<string, string> = { cafe: '☕', restaurant: '🍜', tourist_attraction: '📸', shopping: '🛍', nature: '🌿', default: '📍' };
const catColor: Record<string, string> = { cafe: '#fef3c7', restaurant: '#fff7ed', tourist_attraction: '#ede9fe', shopping: '#fce7f3', nature: '#d1fae5', default: '#f3f4f6' };
const catTextColor: Record<string, string> = { cafe: '#d97706', restaurant: '#ea580c', tourist_attraction: '#7c3aed', shopping: '#db2777', nature: '#059669', default: '#6b7280' };

export default function TripResultScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [trip, setTrip] = useState<any>(null);
  const [days, setDays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [placeModal, setPlaceModal] = useState<{ actId: string, visible: boolean } | null>(null);
  const [allPlaces, setAllPlaces] = useState<any[]>([]); // สมมติว่ามี dataset สถานที่
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => { if (id) fetch(); }, [id]);

  useEffect(() => {
    // โหลด dataset สถานที่ (mock หรือ fetch จริง)
    if (trip?.province) {
      // ตัวอย่าง mock: สมมติว่ามี places ในจังหวัดนี้
      setAllPlaces([
        { name: 'วัดพระธาตุ', province: trip.province },
        { name: 'น้ำตกสวย', province: trip.province },
        { name: 'คาเฟ่ริมแม่น้ำ', province: trip.province },
        { name: 'พิพิธภัณฑ์ท้องถิ่น', province: trip.province },
        { name: 'ตลาดกลางคืน', province: trip.province }
      ]);
      // ถ้า fetch จริง: fetch('https://your-cdn.com/places_dataset.json').then(...)
    }
  }, [trip?.province]);

  const fetch = async () => {
    const { data: t } = await supabase.from('trips').select('*').eq('id', id).single();
    if (!t) { router.replace('/(tabs)'); return; }
    setTrip(t);
    const { data: d } = await supabase.from('trip_days').select('*').eq('trip_id', id).order('day_number');
    if (d) {
      const dwa = await Promise.all(d.map(async day => {
        const { data: acts } = await supabase.from('trip_activities').select('*').eq('trip_day_id', day.id).order('order_index');
        return { ...day, activities: acts || [] };
      }));
      setDays(dwa);
    }
    setLoading(false);
  };

  const saveEdit = async (actId: string) => {
    if (!editName.trim()) return;
    await supabase.from('trip_activities').update({ place_name: editName.trim() }).eq('id', actId);
    setEditId(null); fetch();
  };

  const del = (actId: string) => Alert.alert('ลบกิจกรรม', 'ต้องการลบ?', [
    { text: 'ยกเลิก', style: 'cancel' },
    { text: 'ลบ', style: 'destructive', onPress: async () => { await supabase.from('trip_activities').delete().eq('id', actId); fetch(); } },
  ]);

  if (loading) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }} edges={['top']}>
      <BackHeader title={`ทริป ${trip?.province}`} subtitle={`${trip?.start_date} → ${trip?.end_date}`} onBack={() => router.replace('/(tabs)')} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {trip?.ai_summary && (
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 16, ...SHADOW.sm, borderLeftWidth: 4, borderLeftColor: COLORS.primary }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.primary, marginBottom: 6 }}>✨ AI สรุปทริป</Text>
            <Text style={{ fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 }}>{trip.ai_summary}</Text>
          </View>
        )}
        {days.map((day, di) => (
          <View key={day.id} style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <LinearGradient colors={COLORS.gradPrimary} style={{ width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 14 }}>{day.day_number}</Text>
              </LinearGradient>
              <View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>วันที่ {day.day_number}</Text>
                <Text style={{ fontSize: 12, color: COLORS.textMuted }}>{day.date}</Text>
              </View>
            </View>
            <View style={{ borderLeftWidth: 2, borderLeftColor: COLORS.primaryLight, marginLeft: 19, paddingLeft: 18 }}>
              {day.activities.map((act: any, ai: number) => (
                <View key={act.id}>
                  {act.travel_time_minutes && ai > 0 && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6 }}>
                      <Ionicons name="car-outline" size={13} color={COLORS.textMuted} />
                      <Text style={{ fontSize: 11, color: COLORS.textMuted }}>~{act.travel_time_minutes} นาที</Text>
                    </View>
                  )}
                  <Card style={{ padding: 13, marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {/* รูปภาพสถานที่ */}
                    <PlaceImage name={act.place_name} province={trip?.province} category={act.category} />
                    {/* ...เดิม... */}
                    <View style={{ flex: 1 }}>
                      {editId === act.id ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <TextInput style={{ flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5, fontSize: 13, color: COLORS.text }} value={editName} onChangeText={setEditName} autoFocus />
                          <TouchableOpacity onPress={() => saveEdit(act.id)}><Ionicons name="checkmark-circle" size={24} color={COLORS.primary} /></TouchableOpacity>
                          <TouchableOpacity onPress={() => setEditId(null)}><Ionicons name="close-circle" size={24} color={COLORS.textMuted} /></TouchableOpacity>
                        </View>
                      ) : (
                        <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 }}>{act.place_name}</Text>
                      )}
                      {act.start_time && <Text style={{ fontSize: 11, color: COLORS.textMuted }}>🕐 {act.start_time?.slice(0,5)} - {act.end_time?.slice(0,5)}</Text>}
                      {act.category && <View style={{ alignSelf: 'flex-start', backgroundColor: catColor[act.category] || '#f3f4f6', borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2, marginTop: 4 }}><Text style={{ fontSize: 10, fontWeight: '600', color: catTextColor[act.category] || '#6b7280' }}>{act.category}</Text></View>}
                    </View>
                    <View style={{ gap: 6 }}>
                      <TouchableOpacity onPress={() => { setEditId(act.id); setEditName(act.place_name); setPlaceModal({ actId: act.id, visible: true }); }} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="pencil" size={14} color={COLORS.textSecondary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => del(act.id)} style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name="trash" size={14} color={COLORS.danger} />
                      </TouchableOpacity>
                    </View>
                  </Card>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Modal เลือกสถานที่และเวลา */}
      {placeModal?.visible && (
        <Modal visible transparent animationType="slide" onRequestClose={() => setPlaceModal(null)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, width: '90%', maxWidth: 400 }}>
              <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 10 }}>เลือกสถานที่ในจังหวัด {trip?.province}</Text>
              <FlatList
                data={allPlaces.filter(p => p.province === trip?.province)}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => { setSelectedPlace(item); setEditName(item.name); }} style={{ padding: 10, backgroundColor: selectedPlace?.name === item.name ? COLORS.primaryLight : '#f3f4f6', borderRadius: 8, marginBottom: 6 }}>
                    <Text style={{ fontSize: 15 }}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 200, marginBottom: 10 }}
              />
              <Text style={{ fontSize: 13, marginBottom: 4 }}>เลือกเวลา</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                <TouchableOpacity onPress={() => setShowStartPicker(true)} style={{ flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, padding: 8, justifyContent: 'center' }}>
                  <Text style={{ color: startTime ? COLORS.text : COLORS.textMuted }}>{startTime ? startTime : 'เริ่ม'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEndPicker(true)} style={{ flex: 1, borderWidth: 1, borderColor: COLORS.primary, borderRadius: 8, padding: 8, justifyContent: 'center' }}>
                  <Text style={{ color: endTime ? COLORS.text : COLORS.textMuted }}>{endTime ? endTime : 'สิ้นสุด'}</Text>
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={showStartPicker}
                mode="time"
                onConfirm={date => { setShowStartPicker(false); setStartTime(date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })); }}
                onCancel={() => setShowStartPicker(false)}
              />
              <DateTimePickerModal
                isVisible={showEndPicker}
                mode="time"
                onConfirm={date => { setShowEndPicker(false); setEndTime(date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })); }}
                onCancel={() => setShowEndPicker(false)}
              />
              <TouchableOpacity onPress={async () => {
                // update activity
                await supabase.from('trip_activities').update({ place_name: selectedPlace?.name, start_time: startTime, end_time: endTime }).eq('id', placeModal.actId);
                setPlaceModal(null); setEditId(null); setSelectedPlace(null); setStartTime(''); setEndTime('');
                fetch();
              }} style={{ backgroundColor: COLORS.primary, borderRadius: 8, padding: 12, alignItems: 'center', marginBottom: 8 }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>บันทึก</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setPlaceModal(null)} style={{ alignSelf: 'flex-end', marginTop: 8 }}>
                <Text style={{ color: COLORS.danger, fontWeight: '700' }}>ปิด</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// เพิ่มคอมโพเนนต์ PlaceImage
function PlaceImage({ name, province, category }) {
  const { uri, loading } = usePlaceImage({ name, province });
  if (loading) return <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="small" color={COLORS.primary} /></View>;
  if (uri) return <ImageBackground source={{ uri }} style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden' }} imageStyle={{ borderRadius: 12 }} />;
  return <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: catColor[category || 'default'] || '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 20 }}>{catEmoji[category || 'default']}</Text></View>;
}

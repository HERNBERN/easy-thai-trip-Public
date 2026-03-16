import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { categories } from '@/data/places';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';

const PLACE_SUGGESTIONS = [
  'ดอยอินทนนท์', 'ภูชี้ฟ้า', 'เกาะสิมิลัน', 'เกาะพีพี',
  'วัดร่องขุ่น', 'เกาะหลีเป๊ะ', 'หาดไร่เลย์', 'เกาะเต่า',
  'เกาะสมุย', 'หาดป่าตอง', 'เขาใหญ่', 'ดอยแม่สลอง',
];

export default function CreatePostScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selCats, setSelCats] = useState<string[]>([]);
  const [selPlaces, setSelPlaces] = useState<string[]>([]);
  const [placeInput, setPlaceInput] = useState('');
  const [posting, setPosting] = useState(false);

  const toggleCat = (id: string) =>
    setSelCats(p => p.includes(id) ? p.filter(c => c !== id) : [...p, id]);

  const addPlace = (p: string) => {
    const t = p.trim();
    if (t && !selPlaces.includes(t)) setSelPlaces(prev => [...prev, t]);
    setPlaceInput('');
  };

  const handlePost = async () => {
    if (!content.trim()) { Alert.alert('กรุณาเขียนเนื้อหาก่อน'); return; }
    setPosting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/auth'); return; }
      const { error } = await supabase.from('posts').insert({
        user_id: session.user.id,
        content: content.trim(),
        category_tags: selCats,
        place_tags: selPlaces,
        image_urls: [],
      });
      if (error) throw error;
      router.replace('/(tabs)/social');
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e.message);
    } finally { setPosting(false); }
  };

  const suggestions = PLACE_SUGGESTIONS.filter(p => !selPlaces.includes(p) && (placeInput === '' || p.includes(placeInput))).slice(0, 6);
  const charCount = content.length;
  const maxChars = 500;

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>สร้างโพสต์</Text>
        <TouchableOpacity onPress={handlePost} disabled={posting || !content.trim()}
          style={[s.postBtn, (!content.trim() || posting) && { opacity: 0.45 }]} activeOpacity={0.85}>
          {posting
            ? <ActivityIndicator size="small" color="#fff" />
            : <>
                <Ionicons name="paper-plane" size={15} color="#fff" />
                <Text style={s.postBtnTxt}>โพสต์</Text>
              </>
          }
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Content box */}
        <View style={s.contentCard}>
          <TextInput style={s.contentInput} placeholder="เล่าเรื่องราวการเดินทาง แชร์ประสบการณ์ หรือแนะนำสถานที่..." value={content} onChangeText={t => setContent(t.slice(0, maxChars))} multiline numberOfLines={7} placeholderTextColor={COLORS.textMuted} textAlignVertical="top" />
          <View style={s.charRow}>
            <View style={s.charBar}>
              <View style={[s.charFill, { width: `${(charCount / maxChars) * 100}%`, backgroundColor: charCount > maxChars * 0.9 ? COLORS.danger : COLORS.primary }]} />
            </View>
            <Text style={[s.charCount, charCount > maxChars * 0.9 && { color: COLORS.danger }]}>{charCount}/{maxChars}</Text>
          </View>
        </View>

        {/* Category Tags */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="pricetag-outline" size={18} color={COLORS.primary} />
            <Text style={s.cardTitle}>แท็กหมวดหมู่</Text>
          </View>
          <View style={s.tagsWrap}>
            {categories.map(cat => (
              <TouchableOpacity key={cat.id} onPress={() => toggleCat(cat.id)} activeOpacity={0.8}
                style={[s.catTag, selCats.includes(cat.id) && s.catTagOn]}>
                <Text style={{ fontSize: 14 }}>{cat.emoji}</Text>
                <Text style={[s.catTagTxt, selCats.includes(cat.id) && { color: '#fff' }]}>{cat.label}</Text>
                {selCats.includes(cat.id) && <Ionicons name="checkmark" size={13} color="#fff" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Place Tags */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ionicons name="location-outline" size={18} color={COLORS.primary} />
            <Text style={s.cardTitle}>แท็กสถานที่</Text>
          </View>

          {selPlaces.length > 0 && (
            <View style={[s.tagsWrap, { marginBottom: 12 }]}>
              {selPlaces.map(p => (
                <View key={p} style={s.placeTag}>
                  <Ionicons name="location" size={12} color={COLORS.primary} />
                  <Text style={s.placeTxt}>{p}</Text>
                  <TouchableOpacity onPress={() => setSelPlaces(prev => prev.filter(x => x !== p))}>
                    <Ionicons name="close" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={s.placeInputRow}>
            <TextInput style={s.placeInput} placeholder="พิมพ์ชื่อสถานที่..." value={placeInput}
              onChangeText={setPlaceInput} onSubmitEditing={() => addPlace(placeInput)}
              placeholderTextColor={COLORS.textMuted} returnKeyType="done" />
            <TouchableOpacity onPress={() => addPlace(placeInput)} disabled={!placeInput.trim()} style={[s.addBtn, !placeInput.trim() && { opacity: 0.4 }]}>
              <Text style={s.addBtnTxt}>เพิ่ม</Text>
            </TouchableOpacity>
          </View>

          {suggestions.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 6 }}>แนะนำ</Text>
              <View style={s.tagsWrap}>
                {suggestions.map(p => (
                  <TouchableOpacity key={p} onPress={() => addPlace(p)} style={s.suggChip} activeOpacity={0.8}>
                    <Ionicons name="add" size={13} color={COLORS.accent} />
                    <Text style={s.suggTxt}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Tips */}
        <View style={s.tipCard}>
          <Ionicons name="bulb-outline" size={16} color={COLORS.warning} />
          <Text style={s.tipTxt}>เพิ่มแท็กสถานที่และหมวดหมู่ เพื่อให้คนอื่นค้นพบโพสต์ของคุณง่ายขึ้น</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  postBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 16, paddingVertical: 9 },
  postBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  contentCard: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: 16, marginBottom: 12, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.borderLight },
  contentInput: { fontSize: 15, color: COLORS.text, minHeight: 130, lineHeight: 23 },
  charRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  charBar: { flex: 1, height: 3, backgroundColor: COLORS.borderLight, borderRadius: 2, overflow: 'hidden' },
  charFill: { height: '100%', borderRadius: 2 },
  charCount: { fontSize: 11, color: COLORS.textMuted, fontWeight: '600' },
  card: { backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: 16, marginBottom: 12, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.borderLight },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catTag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.bg, borderRadius: RADIUS.full, paddingHorizontal: 12, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.border },
  catTagOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catTagTxt: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  placeTag: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 6 },
  placeTxt: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  placeInputRow: { flexDirection: 'row', gap: 8 },
  placeInput: { flex: 1, backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  addBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  addBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
  suggChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ede9fe', borderRadius: RADIUS.full, paddingHorizontal: 10, paddingVertical: 6 },
  suggTxt: { fontSize: 12, color: COLORS.accent, fontWeight: '500' },
  tipCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#fffbeb', borderRadius: RADIUS.lg, padding: 13, borderWidth: 1, borderColor: '#fde68a' },
  tipTxt: { flex: 1, fontSize: 12, color: '#92400e', lineHeight: 18 },
});

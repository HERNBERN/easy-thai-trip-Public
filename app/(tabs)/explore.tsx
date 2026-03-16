import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { categories } from '@/data/places';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { RatingStars, EmptyState, Badge } from '@/components/ui';

const { width } = Dimensions.get('window');
// ใช้เฉพาะสถานที่จาก CURATED_NATURE, CURATED_CULTURE, CURATED_CAFE
import { categories as allCategories } from '@/data/places';
const curatedCategoryIds = ['nature', 'culture', 'cafe'];
const allPlaces = allCategories
  .filter(cat => curatedCategoryIds.includes(cat.id))
  .flatMap(cat => cat.places.map(p => ({ ...p, categoryId: cat.id, categoryLabel: cat.label, categoryEmoji: cat.emoji })));

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'name'>('rating');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let r = allPlaces;
    if (query.trim()) { const q = query.toLowerCase(); r = r.filter(p => p.name.toLowerCase().includes(q) || p.province.toLowerCase().includes(q)); }
    if (selectedCat) r = r.filter(p => p.categoryId === selectedCat);
    if (selectedProvince) r = r.filter(p => p.province === selectedProvince);
    return sortBy === 'rating' ? [...r].sort((a, b) => b.rating - a.rating) : [...r].sort((a, b) => a.name.localeCompare(b.name, 'th'));
  }, [query, selectedCat, selectedProvince, sortBy]);


  // Cache สำหรับ Google Photo URL
  const googlePhotoCache = useRef<{ [key: string]: string }>({});

  // ดึงรูปจาก Google Maps API กรณีไม่มี image_url
  async function fetchGooglePlacePhoto(placeName: string, province: string): Promise<string | null> {
    const cacheKey = `${placeName}|${province}`;
    if (googlePhotoCache.current[cacheKey]) return googlePhotoCache.current[cacheKey];
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
      googlePhotoCache.current[cacheKey] = photoUrl;
      return photoUrl;
    } catch {
      return null;
    }
  }

  // Custom Image component ที่โหลดเฉพาะ image_url หรือ Google Photo ถ้าไม่มี image_url
  const PlaceImage = ({ item }: { item: typeof filtered[0] }) => {
    const [uri, setUri] = React.useState(item.image_url || '');
    const [loading, setLoading] = React.useState(!item.image_url);
    React.useEffect(() => {
      let mounted = true;
      async function load() {
        if (!item.image_url) {
          setLoading(true);
          const url = await fetchGooglePlacePhoto(item.name, item.province);
          if (mounted && url) setUri(url);
          setLoading(false);
        }
      }
      load();
      return () => { mounted = false; };
    }, [item.name, item.province, item.image_url]);
    if (loading) return (
      <View style={s.cardImgWrap}>
        <View style={s.imgLoading}><Ionicons name="image-outline" size={28} color={COLORS.textMuted} /></View>
      </View>
    );
    if (uri) return (
      <View style={s.cardImgWrap}>
        <Image source={{ uri }} style={s.cardImg} resizeMode="cover" />
      </View>
    );
    return (
      <View style={s.cardImgWrap}>
        <View style={[s.imgFallback, { backgroundColor: selectedCat === item.categoryId ? COLORS.primaryLight : COLORS.bg }]}> 
          <Text style={{ fontSize: 28 }}>{item.categoryEmoji}</Text>
        </View>
      </View>
    );
  };

  const renderItem = useCallback(({ item }: { item: typeof filtered[0] }) => (
    <TouchableOpacity onPress={() => router.push(`/place/${item.categoryId}/${encodeURIComponent(item.name)}`)} activeOpacity={0.7} style={s.card}>
      <PlaceImage item={item} />
      <View style={{ flex: 1, minHeight: 90, justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
          <Text style={s.cardName} numberOfLines={2}>{item.name}</Text>
          <RatingStars rating={item.rating} />
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2, marginBottom: 2 }}>
          <View style={s.tagCat}><Text style={s.tagCatText}>{item.categoryLabel}</Text></View>
          <View style={s.tagProvince}><Text style={s.tagProvinceText}>{item.province}</Text></View>
          <View style={s.tagRating}><Text style={s.tagRatingText}>⭐ {item.rating}</Text></View>
        </View>
        <Text style={s.cardDesc} numberOfLines={2}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  ), [selectedCat]);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>สำรวจสถานที่</Text>
        <Text style={s.headerSub}>{filtered.length.toLocaleString()} แห่งทั่วไทย</Text>
        <Text style={[s.headerSub, { fontSize: 12, color: COLORS.textMuted }]}>ทั้งหมดในระบบ: {allPlaces.length.toLocaleString()} แห่ง</Text>
      </View>

      {/* Search + Filters */}
      <View style={s.searchWrap}>
        <View style={s.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput style={s.searchInput} placeholder="ค้นหาชื่อสถานที่ จังหวัด..." value={query} onChangeText={setQuery} placeholderTextColor={COLORS.textMuted} returnKeyType="search" />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.textMuted, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="close" size={13} color="#fff" />
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* Sort, Category, Province filters in searchWrap */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {/* Sort */}
          <TouchableOpacity onPress={() => setSortBy('rating')} style={[s.sortBtn, sortBy === 'rating' && s.sortBtnOn]}>
            <Ionicons name="star" size={13} color={sortBy === 'rating' ? '#fff' : COLORS.textMuted} />
            <Text style={[s.sortTxt, sortBy === 'rating' && { color: '#fff' }]}>คะแนน</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSortBy('name')} style={[s.sortBtn, sortBy === 'name' && s.sortBtnOn]}>
            <Ionicons name="text" size={13} color={sortBy === 'name' ? '#fff' : COLORS.textMuted} />
            <Text style={[s.sortTxt, sortBy === 'name' && { color: '#fff' }]}>ชื่อ</Text>
          </TouchableOpacity>
          {/* Category filter */}
          <FlatList horizontal data={[{ id: null, label: 'ทั้งหมด', emoji: '🌐' }, ...categories] as any[]}
            showsHorizontalScrollIndicator={false} keyExtractor={c => String(c.id)}
            contentContainerStyle={{ gap: 8 }}
            style={{ maxHeight: 40 }}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedCat(item.id)} activeOpacity={0.8}
                style={[s.catChip, selectedCat === item.id && s.catChipOn, { minWidth: 80 }]}> 
                <Text style={{ fontSize: 15 }}>{item.emoji}</Text>
                <Text style={[s.catChipTxt, selectedCat === item.id && { color: '#fff' }]}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          {/* Province filter */}
          <FlatList horizontal data={[{ province: null }, ...Array.from(new Set(allPlaces.map(p => p.province))).sort().map(p => ({ province: p }))]}
            showsHorizontalScrollIndicator={false} keyExtractor={p => String(p.province)}
            contentContainerStyle={{ gap: 8 }}
            style={{ maxHeight: 40 }}
            renderItem={({ item }) => (
              item.province === null ? (
                <TouchableOpacity onPress={() => setSelectedProvince(null)} style={[s.catChip, !selectedProvince && s.catChipOn, { minWidth: 90 }]}> 
                  <Text style={{ fontSize: 14 }}>🗺️</Text>
                  <Text style={[s.catChipTxt, !selectedProvince && { color: '#fff' }]}>ทุกจังหวัด</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setSelectedProvince(item.province)} activeOpacity={0.8}
                  style={[s.catChip, selectedProvince === item.province && s.catChipOn, { minWidth: 90 }]}> 
                  <Text style={{ fontSize: 13 }}>🏞️</Text>
                  <Text style={[s.catChipTxt, selectedProvince === item.province && { color: '#fff' }]}>{item.province}</Text>
                </TouchableOpacity>
              )
            )}
          />
        </View>
      </View>

      {/* Results */}
      <FlatList
        data={filtered.slice(0, 150)}
        keyExtractor={(item, i) => `${item.categoryId}-${item.name}-${i}`}
        contentContainerStyle={{ padding: 14, paddingBottom: 24, gap: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ListEmptyComponent={
          <EmptyState icon="search-outline" title="ไม่พบสถานที่" subtitle="ลองค้นหาด้วยคำอื่น หรือเปลี่ยนหมวดหมู่" />
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  headerSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  searchWrap: { backgroundColor: '#fff', paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, borderRadius: RADIUS.xl, paddingHorizontal: 14, height: 46, gap: 10, borderWidth: 1, borderColor: COLORS.border },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  sortRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADIUS.full, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border },
  sortBtnOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  sortTxt: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, height: 36 },
  catChipOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipTxt: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: RADIUS.xl, padding: 10, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.borderLight, marginBottom: 10, minHeight: 90 },
  cardImgWrap: { width: 74, height: 74, borderRadius: 18, overflow: 'hidden', marginRight: 14, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  cardImg: { width: '100%', height: '100%', borderRadius: 18 },
  imgLoading: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
  imgFallback: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' },
  cardName: { fontSize: 15, fontWeight: '700', color: COLORS.text, flex: 1, marginRight: 8, lineHeight: 20 },
  cardDesc: { fontSize: 12.5, color: COLORS.textMuted, lineHeight: 17, marginTop: 2 },
  tagCat: { backgroundColor: COLORS.primaryLight, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2, marginRight: 4 },
  tagCatText: { fontSize: 11.5, color: COLORS.primary },
  tagProvince: { backgroundColor: COLORS.bg, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2, marginRight: 4, borderWidth: 1, borderColor: COLORS.borderLight },
  tagProvinceText: { fontSize: 11.5, color: COLORS.textSecondary },
  tagRating: { backgroundColor: COLORS.bg, borderRadius: 8, paddingHorizontal: 7, paddingVertical: 2, borderWidth: 1, borderColor: COLORS.borderLight },
  tagRatingText: { fontSize: 11.5, color: COLORS.textSecondary },
});

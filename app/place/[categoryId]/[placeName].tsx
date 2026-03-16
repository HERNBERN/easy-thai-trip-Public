import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Share } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { categories } from '@/data/places';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { BackHeader, RatingStars, Card, Button } from '@/components/ui';

export default function PlaceDetailScreen() {
  const router = useRouter();
  const { categoryId, placeName } = useLocalSearchParams<{ categoryId: string; placeName: string }>();
  const category = categories.find(c => c.id === categoryId);
  const place = category?.places.find(p => p.name === decodeURIComponent(placeName || ''));

  if (!category || !place) return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg }} edges={['top']}>
      <Text style={{ color: COLORS.textMuted }}>ไม่พบสถานที่</Text>
    </SafeAreaView>
  );

  const openMaps = () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.province + ' ประเทศไทย')}`);
  const sharePlace = () => Share.share({ message: `${place.name} - ${place.province}\n${place.description}\n\nวางแผนทริปด้วย เที่ยวง่ายสไตล์ฉัน!` });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }} edges={['top']}>
      <BackHeader title={place.name} onBack={() => router.back()} rightIcon="share-outline" onRight={sharePlace} />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={['#064e3b', '#0d9488']} style={s.hero}>
          <Text style={s.heroEmoji}>{category.emoji}</Text>
          <Text style={s.heroName}>{place.name}</Text>
          <View style={s.heroMeta}>
            <View style={s.locationChip}>
              <Ionicons name="location" size={13} color="#fff" />
              <Text style={s.locationTxt}>{place.province}</Text>
            </View>
            <View style={s.ratingChip}>
              <Ionicons name="star" size={13} color={COLORS.warning} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.warning }}>{place.rating}</Text>
            </View>
          </View>
          <View style={s.catChip}>
            <Text style={s.catChipTxt}>{category.emoji} {category.label}</Text>
          </View>
        </LinearGradient>

        <View style={{ padding: 16, gap: 12 }}>
          {/* Description */}
          <Card style={{ padding: 18 }}>
            <Text style={s.secTitle}>📖 รายละเอียด</Text>
            <Text style={s.desc}>{place.description}</Text>
          </Card>

          {/* Info Grid */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Card style={{ flex: 1, padding: 14, alignItems: 'center', gap: 6 }}>
              <Ionicons name="location" size={22} color={COLORS.primary} />
              <Text style={{ fontSize: 11, color: COLORS.textMuted, textAlign: 'center' }}>จังหวัด</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text, textAlign: 'center' }}>{place.province}</Text>
            </Card>
            <Card style={{ flex: 1, padding: 14, alignItems: 'center', gap: 6 }}>
              <Ionicons name="star" size={22} color={COLORS.warning} />
              <Text style={{ fontSize: 11, color: COLORS.textMuted }}>คะแนน</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text }}>{place.rating} / 5.0</Text>
            </Card>
            <Card style={{ flex: 1, padding: 14, alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 22 }}>{category.emoji}</Text>
              <Text style={{ fontSize: 11, color: COLORS.textMuted, textAlign: 'center' }}>ประเภท</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.text, textAlign: 'center' }} numberOfLines={2}>{category.label}</Text>
            </Card>
          </View>

          {/* Actions */}
          <TouchableOpacity onPress={openMaps} activeOpacity={0.85}>
            <Card style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 }}>
              <LinearGradient colors={['#0ea5e9', '#0284c7']} style={{ width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="navigate" size={22} color="#fff" />
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>เปิดใน Google Maps</Text>
                <Text style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>นำทางไปยังสถานที่</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
            </Card>
          </TouchableOpacity>

          <Button label={`วางแผนทริปไป ${place.province}`} onPress={() => router.push(`/create-trip?province=${encodeURIComponent(place.province)}`)} icon="sparkles" variant="outline" size="lg" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  hero: { padding: 28, paddingTop: 32, alignItems: 'center' },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroName: { fontSize: 24, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12, lineHeight: 32 },
  heroMeta: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  locationChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
  locationTxt: { fontSize: 13, color: '#fff', fontWeight: '600' },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 },
  catChip: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 7 },
  catChipTxt: { fontSize: 13, color: '#fff', fontWeight: '600' },
  secTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  desc: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
});

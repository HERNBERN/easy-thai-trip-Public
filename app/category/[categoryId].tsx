import { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ImageBackground,
  ActivityIndicator
} from 'react-native';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { categories } from '@/data/places';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { BackHeader, Card, RatingStars, EmptyState } from '@/components/ui';
import usePlaceImage from '@/lib/usePlaceImage';



/* ============================= */
/* Category Place Image */
/* ============================= */

function CategoryPlaceImage({ place }: any) {

  const { uri, loading } = usePlaceImage(place);

  if (loading)
    return (
      <View style={{ height: 120, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    );

  if (uri)
    return (
      <ImageBackground
        source={{ uri }}
        style={{ height: 120, borderRadius: 16 }}
        imageStyle={{ borderRadius: 16 }}
      />
    );

  return (
    <View
      style={{
        height: 120,
        borderRadius: 16,
        backgroundColor: '#e5e7eb'
      }}
    />
  );
}



/* ============================= */
/* Screen */
/* ============================= */

export default function CategoryScreen() {

  const router = useRouter();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  const [search, setSearch] = useState('');

  const category = categories.find(c => c.id === categoryId);

  const filtered = useMemo(() => {

    if (!category) return [];

    const q = search.toLowerCase();

    return q
      ? category.places.filter(
          p =>
            p.name.toLowerCase().includes(q) ||
            p.province.toLowerCase().includes(q)
        )
      : category.places;

  }, [category, search]);



  if (!category)
    return (
      <View style={styles.notfound}>
        <Text style={{ color: COLORS.textMuted }}>ไม่พบหมวดหมู่</Text>
      </View>
    );



  return (

    <SafeAreaView style={styles.container} edges={['top']}>


      <BackHeader
        title={category.label}
        subtitle={`${filtered.length} สถานที่`}
        onBack={() => router.back()}
      />

      {/* Sticker/Emoji หมวดหมู่ใหญ่ */}
      <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 8 }}>
        <Text style={{ fontSize: 64, marginBottom: 0 }}>{category.emoji}</Text>
      </View>



{/* ============================= */
/* Search */
/* ============================= */}

      <View style={styles.searchBar}>

        <View style={styles.searchBox}>

          <Ionicons name="search" size={16} color={COLORS.textMuted} />

          <TextInput
            style={styles.input}
            placeholder="ค้นหาชื่อหรือจังหวัด..."
            value={search}
            onChangeText={setSearch}
            placeholderTextColor={COLORS.textMuted}
          />

          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}

        </View>

      </View>



{/* ============================= */
/* Places List */
/* ============================= */}

      <FlatList
        data={filtered}
        keyExtractor={(item, i) => `${item.name}-${i}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 14, gap: 12, paddingBottom: 24 }}

        renderItem={({ item }) => (

          <Card
            onPress={() =>
              router.push(`/place/${category.id}/${encodeURIComponent(item.name)}`)
            }
            style={{ padding: 10 }}
          >

{/* Image */}

            <CategoryPlaceImage place={item} />

{/* Name */}

            <Text
              style={{
                fontWeight: '700',
                marginTop: 8,
                fontSize: 15
              }}
            >
              {item.name}
            </Text>

{/* Province */}

            <Text style={{ fontSize: 12, marginTop: 2 }}>
              📍 {item.province}
            </Text>

{/* Rating */}

            <View style={{ marginTop: 4 }}>
              <RatingStars rating={item.rating} />
            </View>

{/* Description */}

            <Text
              numberOfLines={2}
              style={{
                fontSize: 12,
                marginTop: 4,
                color: COLORS.textMuted
              }}
            >
              {item.description}
            </Text>

          </Card>

        )}

        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="ไม่พบสถานที่"
            subtitle="ลองค้นหาด้วยคำอื่น"
          />
        }

      />

    </SafeAreaView>

  );
}



/* ============================= */
/* Styles */
/* ============================= */

const styles = StyleSheet.create({

container: {
  flex: 1,
  backgroundColor: COLORS.bg
},

notfound: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: COLORS.bg
},

searchBar: {
  paddingHorizontal: 16,
  paddingVertical: 10,
  backgroundColor: '#fff',
  borderBottomWidth: 1,
  borderBottomColor: COLORS.borderLight
},

searchBox: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: COLORS.bg,
  borderRadius: RADIUS.xl,
  paddingHorizontal: 14,
  height: 44,
  gap: 10,
  borderWidth: 1,
  borderColor: COLORS.border
},

input: {
  flex: 1,
  fontSize: 14,
  color: COLORS.text
}

});
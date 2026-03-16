import React from 'react';
// ...existing code...
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { categories } from '@/data/places';

function TripCard(
  {
    trip,
    onDelete,
    onPress,
    fetchGooglePlacePhoto,
    STYLE_LABELS
  }: {
    trip: any,
    onDelete: (id: string) => void,
    onPress: () => void,
    fetchGooglePlacePhoto: (name: string, province: string) => Promise<string | null>,
    STYLE_LABELS: Record<string, string>
  }
) {
  let tripPlaces: Array<any> = [];
  for (const cat of categories) {
    if (cat.places && Array.isArray(cat.places)) {
      tripPlaces = tripPlaces.concat(cat.places.filter((p: any) => p && p.province === trip.province));
    }
  }
  const randomPlace = tripPlaces.length > 0 ? tripPlaces[Math.floor(Math.random() * tripPlaces.length)] : null;
  // fallback fetchGooglePlacePhoto if not provided
  const fetchPhoto = fetchGooglePlacePhoto || (() => Promise.resolve(null));
  const [imgUri, setImgUri] = React.useState(randomPlace?.image_url || '');
  const [imgLoading, setImgLoading] = React.useState(!randomPlace?.image_url);
  React.useEffect(() => {
    let mounted = true;
    if (randomPlace) {
      if (randomPlace.image_url) {
        setImgUri(randomPlace.image_url);
        setImgLoading(false);
      } else {
        setImgLoading(true);
        fetchPhoto(randomPlace.name, randomPlace.province).then(url => {
          if (mounted && url) setImgUri(url);
          setImgLoading(false);
        });
      }
    } else {
      setImgUri('');
      setImgLoading(false);
    }
    return () => { mounted = false; };
  }, [randomPlace]);
  return (
    <Card onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', padding: 8, marginBottom: 6, gap: 8, minHeight: 60 }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primaryLight }}>
        {imgLoading ? (
          <View style={{ width: 36, height: 36, backgroundColor: '#eee' }} />
        ) : imgUri ? (
          <Image source={{ uri: imgUri }} style={{ width: 36, height: 36 }} resizeMode="cover" />
        ) : (
          <Text style={{ fontSize: 18 }}>📍</Text>
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 }}>{trip.province}</Text>
        <Text style={{ fontSize: 10, color: COLORS.textMuted }}>{trip.start_date} → {trip.end_date}</Text>
        {trip.travel_style && <Text style={{ fontSize: 10, color: COLORS.primary, fontWeight: '600', marginTop: 2 }}>{STYLE_LABELS[trip.travel_style] || trip.travel_style}</Text>}
      </View>
      <TouchableOpacity onPress={() => onDelete(trip.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.borderLight, alignItems: 'center', justifyContent: 'center' }}>
        <Ionicons name="trash-outline" size={14} color={COLORS.textMuted} />
      </TouchableOpacity>
    </Card>
  );
}

export default TripCard;

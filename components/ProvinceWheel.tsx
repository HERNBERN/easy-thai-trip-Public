import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProvinceWheelProps {
  provinces: string[];
  onSelect: (province: string) => void;
}

export default function ProvinceWheel({ provinces, onSelect }: ProvinceWheelProps) {
  const [selected, setSelected] = useState<string | null>(null);

  // Shuffle provinces for random selection
  const handleRandom = () => {
    if (provinces.length === 0) return;
    const randomProvince = provinces[Math.floor(Math.random() * provinces.length)];
    setSelected(randomProvince);
    onSelect(randomProvince);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>สุ่มจังหวัด</Text>
      <TouchableOpacity style={styles.button} onPress={handleRandom}>
        <Ionicons name="refresh" size={20} color="#0ea5e9" />
        <Text style={styles.buttonText}>สุ่มเลย!</Text>
      </TouchableOpacity>
      {selected && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedText}>จังหวัดที่สุ่มได้: {selected}</Text>
        </View>
      )}
      <FlatList
        data={provinces}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.provinceChip, selected === item && styles.provinceChipSelected]}
            onPress={() => {
              setSelected(item);
              onSelect(item);
            }}
          >
            <Text style={[styles.provinceText, selected === item && styles.provinceTextSelected]}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ gap: 8, marginTop: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 8 },
  title: { fontSize: 14, fontWeight: '700', color: '#0ea5e9', marginBottom: 6 },
  button: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f2fe', borderRadius: 99, paddingHorizontal: 16, paddingVertical: 8, marginBottom: 8 },
  buttonText: { fontSize: 13, fontWeight: '600', color: '#0ea5e9', marginLeft: 6 },
  selectedBox: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 8, marginVertical: 8 },
  selectedText: { fontSize: 13, color: '#059669', fontWeight: '700' },
  provinceChip: { backgroundColor: '#f1f5f9', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 8 },
  provinceChipSelected: { backgroundColor: '#0ea5e9' },
  provinceText: { fontSize: 12, color: '#334155', fontWeight: '600' },
  provinceTextSelected: { color: '#fff' },
});

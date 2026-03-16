import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

interface SearchFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    query: string;
    province: string | null;
    rating: number | null;
    category: string | null;
  }) => void;
  provinces: string[];
  categories: { id: string; label: string; emoji: string }[];
}

export default function SearchFilterModal({ visible, onClose, onApply, provinces, categories }: SearchFilterModalProps) {
  const [query, setQuery] = useState('');
  const [province, setProvince] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const handleApply = () => {
    onApply({ query, province, rating, category });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>ค้นหาสถานที่</Text>
          <TextInput
            style={styles.input}
            placeholder="ค้นหาชื่อสถานที่..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={COLORS.textMuted}
          />
          <Text style={styles.label}>จังหวัด</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
            <TouchableOpacity onPress={() => setProvince(null)} style={[styles.tag, !province && styles.tagActive]}>
              <Text style={[styles.tagText, !province && styles.tagTextActive]}>ทั้งหมด</Text>
            </TouchableOpacity>
            {provinces.map(p => (
              <TouchableOpacity key={p} onPress={() => setProvince(p)} style={[styles.tag, province === p && styles.tagActive]}>
                <Text style={[styles.tagText, province === p && styles.tagTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text style={styles.label}>คะแนน</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
            {[5, 4, 3].map(r => (
              <TouchableOpacity key={r} onPress={() => setRating(r)} style={[styles.tag, rating === r && styles.tagActive]}>
                <Text style={[styles.tagText, rating === r && styles.tagTextActive]}>{r} ดาวขึ้นไป</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setRating(null)} style={[styles.tag, rating === null && styles.tagActive]}>
              <Text style={[styles.tagText, rating === null && styles.tagTextActive]}>ทั้งหมด</Text>
            </TouchableOpacity>
          </ScrollView>
          <Text style={styles.label}>หมวดหมู่</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
            <TouchableOpacity onPress={() => setCategory(null)} style={[styles.tag, !category && styles.tagActive]}>
              <Text style={[styles.tagText, !category && styles.tagTextActive]}>ทั้งหมด</Text>
            </TouchableOpacity>
            {categories.map(cat => (
              <TouchableOpacity key={cat.id} onPress={() => setCategory(cat.id)} style={[styles.tag, category === cat.id && styles.tagActive]}>
                <Text style={[styles.tagText, category === cat.id && styles.tagTextActive]}>{cat.emoji} {cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={handleApply} style={styles.applyBtn}>
            <Text style={styles.applyBtnText}>ค้นหา</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: '#fff', borderRadius: 24, padding: 24, width: '90%', maxWidth: 400, position: 'relative' },
  title: { fontWeight: '700', fontSize: 18, color: COLORS.primary, marginBottom: 16 },
  input: { borderWidth: 1, borderColor: COLORS.borderLight, borderRadius: 10, padding: 10, fontSize: 15, marginBottom: 16, color: COLORS.text },
  label: { fontWeight: '600', fontSize: 15, marginTop: 10, marginBottom: 8 },
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  tag: { backgroundColor: COLORS.bg, borderRadius: 99, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1, borderColor: COLORS.border, marginRight: 6 },
  tagActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tagText: { fontSize: 13, color: COLORS.textMuted },
  tagTextActive: { color: '#fff', fontWeight: '700' },
  applyBtn: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center', marginTop: 18 },
  applyBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  closeBtn: { position: 'absolute', top: 12, right: 12 },
});

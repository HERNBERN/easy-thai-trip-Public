import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { BackHeader } from '@/components/ui';

const PROVINCES = ['กรุงเทพมหานคร','กระบี่','กาญจนบุรี','กาฬสินธุ์','กำแพงเพชร','ขอนแก่น','จันทบุรี','ฉะเชิงเทรา','ชลบุรี','ชัยนาท','ชัยภูมิ','ชุมพร','เชียงราย','เชียงใหม่','ตรัง','ตราด','ตาก','นครนายก','นครปฐม','นครพนม','นครราชสีมา','นครศรีธรรมราช','นครสวรรค์','นนทบุรี','นราธิวาส','น่าน','บึงกาฬ','บุรีรัมย์','ปทุมธานี','ประจวบคีรีขันธ์','ปราจีนบุรี','ปัตตานี','พระนครศรีอยุธยา','พังงา','พัทลุง','พิจิตร','พิษณุโลก','เพชรบุรี','เพชรบูรณ์','แพร่','ภูเก็ต','มหาสารคาม','มุกดาหาร','แม่ฮ่องสอน','ยโสธร','ยะลา','ร้อยเอ็ด','ระนอง','ระยอง','ราชบุรี','ลพบุรี','ลำปาง','ลำพูน','เลย','ศรีสะเกษ','สกลนคร','สงขลา','สตูล','สมุทรปราการ','สมุทรสงคราม','สมุทรสาคร','สระแก้ว','สระบุรี','สิงห์บุรี','สุโขทัย','สุพรรณบุรี','สุราษฎร์ธานี','สุรินทร์','หนองคาย','หนองบัวลำภู','อ่างทอง','อำนาจเจริญ','อุดรธานี','อุตรดิตถ์','อุทัยธานี','อุบลราชธานี'];
const STYLES = [{ v:'nature',l:'🌿 ธรรมชาติ',d:'ภูเขา น้ำตก ทะเล' },{ v:'culture',l:'🏛 วัฒนธรรม',d:'วัด ประวัติศาสตร์' },{ v:'adventure',l:'🏔 ผจญภัย',d:'ดำน้ำ ปีนเขา' },{ v:'relaxation',l:'🧘 พักผ่อน',d:'สปา รีสอร์ท' },{ v:'food',l:'🍜 อาหาร',d:'ตลาด คาเฟ่' },{ v:'shopping',l:'🛍 ช้อปปิ้ง',d:'ของฝาก ของดี' }];
const BUDGETS = [{ v:'budget',l:'💚 ประหยัด',d:'< 1,000 ฿/วัน' },{ v:'moderate',l:'💛 ปานกลาง',d:'1,000-3,000 ฿/วัน' },{ v:'premium',l:'🧡 พรีเมียม',d:'3,000-5,000 ฿/วัน' },{ v:'luxury',l:'❤️ หรูหรา',d:'> 5,000 ฿/วัน' }];

const today = new Date();
const fmtDate = (d: Date) => d.toISOString().split('T')[0];

export default function CreateTripScreen() {
  const router = useRouter();
  const { province: preProvince } = useLocalSearchParams<{ province?: string }>();
  const [province, setProvince] = useState(preProvince || '');
  const [showProvinces, setShowProvinces] = useState(false);
  const [searchProv, setSearchProv] = useState('');
  const [startDate, setStartDate] = useState(fmtDate(today));
  const [endDate, setEndDate] = useState(fmtDate(new Date(today.getTime() + 2 * 86400000)));
  const [travelStyle, setTravelStyle] = useState('');
  const [budget, setBudget] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(1);

  const filteredProvs = PROVINCES.filter(p => p.includes(searchProv));

  const handleGenerate = async () => {
    if (!province || !startDate || !endDate || !travelStyle || !budget) { Alert.alert('กรุณากรอกข้อมูลให้ครบทุกขั้นตอน'); return; }
    if (startDate > endDate) { Alert.alert('วันเริ่มต้นต้องไม่เกินวันสิ้นสุด'); return; }
    setGenerating(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { Alert.alert('กรุณาเข้าสู่ระบบก่อน'); router.replace('/auth'); return; }
      const res = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/generate-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ province, startDate, endDate, travelStyle, budget, specialRequest }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error || 'เกิดข้อผิดพลาด'); }
      const result = await res.json();
      router.replace(`/trip/${result.tripId}`);
    } catch (e: any) { Alert.alert('เกิดข้อผิดพลาด', e.message); }
    finally { setGenerating(false); }
  };

  const days = Math.max(1, Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) + 1);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <BackHeader title="สร้างทริปใหม่" subtitle={`ขั้นตอน ${step}/3`} onBack={() => step > 1 ? setStep(step - 1) : router.back()} />

      {/* Progress */}
      <View style={s.progress}>
        {[1,2,3].map(n => (
          <View key={n} style={[s.progressStep, n <= step && s.progressStepOn]}>
            {n < step ? <Ionicons name="checkmark" size={14} color="#fff" /> : <Text style={[s.progressTxt, n <= step && { color: '#fff' }]}>{n}</Text>}
          </View>
        ))}
        <View style={s.progressLine} /><View style={[s.progressLine, step >= 2 && s.progressLineOn]} /><View style={[s.progressLine, step >= 3 && s.progressLineOn]} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Step 1: Province + Dates */}
        {step === 1 && (
          <View style={s.stepCard}>
            <Text style={s.stepTitle}>📍 เลือกจังหวัดและวันเดินทาง</Text>

            <Text style={s.label}>จังหวัด</Text>
            <TouchableOpacity onPress={() => setShowProvinces(!showProvinces)} style={[s.picker, province && s.pickerFilled]}>
              <Ionicons name="location-outline" size={18} color={province ? COLORS.primary : COLORS.textMuted} />
              <Text style={[s.pickerTxt, province && { color: COLORS.text, fontWeight: '600' }]}>{province || 'เลือกจังหวัด...'}</Text>
              <Ionicons name={showProvinces ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.textMuted} />
            </TouchableOpacity>

            {showProvinces && (
              <View style={s.dropdown}>
                <View style={s.dropdownSearch}>
                  <Ionicons name="search" size={16} color={COLORS.textMuted} />
                  <TextInput style={s.dropdownInput} placeholder="ค้นหาจังหวัด..." value={searchProv} onChangeText={setSearchProv} placeholderTextColor={COLORS.textMuted} />
                </View>
                <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {filteredProvs.map(p => (
                    <TouchableOpacity key={p} onPress={() => { setProvince(p); setShowProvinces(false); setSearchProv(''); }} style={[s.dropdownItem, province === p && s.dropdownItemOn]}>
                      <Text style={{ color: province === p ? COLORS.primary : COLORS.text, fontWeight: province === p ? '700' : '400', fontSize: 15 }}>{p}</Text>
                      {province === p && <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>วันเริ่มต้น</Text>
                <View style={s.dateBox}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                  <TextInput style={s.dateInput} value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" placeholderTextColor={COLORS.textMuted} />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.label}>วันสิ้นสุด</Text>
                <View style={s.dateBox}>
                  <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
                  <TextInput style={s.dateInput} value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" placeholderTextColor={COLORS.textMuted} />
                </View>
              </View>
            </View>

            {startDate && endDate && (
              <View style={s.daysBadge}>
                <Ionicons name="time-outline" size={16} color={COLORS.primary} />
                <Text style={s.daysBadgeTxt}>{days} วัน {days - 1} คืน</Text>
              </View>
            )}
          </View>
        )}

        {/* Step 2: Travel Style */}
        {step === 2 && (
          <View style={s.stepCard}>
            <Text style={s.stepTitle}>🎒 สไตล์การเที่ยว</Text>
            <Text style={s.stepSub}>เลือกประเภทที่ชอบ AI จะวางแผนให้เหมาะ</Text>
            <View style={s.grid}>
              {STYLES.map(style => (
                <TouchableOpacity key={style.v} onPress={() => setTravelStyle(style.v)} activeOpacity={0.8}
                  style={[s.optCard, travelStyle === style.v && s.optCardOn]}>
                  <Text style={s.optEmoji}>{style.l.split(' ')[0]}</Text>
                  <Text style={[s.optLabel, travelStyle === style.v && { color: COLORS.primary }]}>{style.l.substring(3)}</Text>
                  <Text style={s.optDesc}>{style.d}</Text>
                  {travelStyle === style.v && <View style={s.optCheck}><Ionicons name="checkmark-circle" size={18} color={COLORS.primary} /></View>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Budget + Special */}
        {step === 3 && (
          <View style={s.stepCard}>
            <Text style={s.stepTitle}>💰 งบประมาณและคำขอพิเศษ</Text>
            <View style={s.grid}>
              {BUDGETS.map(b => (
                <TouchableOpacity key={b.v} onPress={() => setBudget(b.v)} activeOpacity={0.8}
                  style={[s.optCard, budget === b.v && s.optCardOn]}>
                  <Text style={s.optEmoji}>{b.l.split(' ')[0]}</Text>
                  <Text style={[s.optLabel, budget === b.v && { color: COLORS.primary }]}>{b.l.substring(3)}</Text>
                  <Text style={s.optDesc}>{b.d}</Text>
                  {budget === b.v && <View style={s.optCheck}><Ionicons name="checkmark-circle" size={18} color={COLORS.primary} /></View>}
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[s.label, { marginTop: 16 }]}>คำขอพิเศษ (ไม่บังคับ)</Text>
            <TextInput style={s.textarea} placeholder="เช่น อยากไปคาเฟ่วิวสวย มีสัตว์เลี้ยงไปด้วย..." value={specialRequest} onChangeText={setSpecialRequest} multiline numberOfLines={4} placeholderTextColor={COLORS.textMuted} textAlignVertical="top" />

            {/* Summary */}
            <View style={s.summary}>
              <Text style={s.summaryTitle}>สรุปทริป</Text>
              <Text style={s.summaryRow}>📍 {province} • {days} วัน</Text>
              <Text style={s.summaryRow}>{STYLES.find(s => s.v === travelStyle)?.l} • {BUDGETS.find(b => b.v === budget)?.l}</Text>
            </View>
          </View>
        )}

        {/* Navigation */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
          {step > 1 && (
            <TouchableOpacity onPress={() => setStep(step - 1)} style={s.prevBtn}>
              <Ionicons name="arrow-back" size={20} color={COLORS.textSecondary} />
              <Text style={s.prevTxt}>ย้อนกลับ</Text>
            </TouchableOpacity>
          )}
          {step < 3 ? (
            <TouchableOpacity onPress={() => {
              if (step === 1 && (!province || !startDate || !endDate)) { Alert.alert('กรุณาเลือกจังหวัดและวันที่'); return; }
              if (step === 2 && !travelStyle) { Alert.alert('กรุณาเลือกสไตล์การเที่ยว'); return; }
              setStep(step + 1);
            }} activeOpacity={0.85} style={{ flex: 1 }}>
              <LinearGradient colors={COLORS.gradPrimary} style={s.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={s.nextTxt}>ถัดไป</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleGenerate} disabled={generating} style={{ flex: 1, opacity: generating ? 0.7 : 1 }} activeOpacity={0.85}>
              <LinearGradient colors={COLORS.gradPrimary} style={s.nextBtn} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {generating ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="sparkles" size={20} color="#fff" />}
                <Text style={s.nextTxt}>{generating ? 'AI กำลังวางแผน...' : 'สร้างทริป!'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  progress: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  progressStep: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.borderLight, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  progressStepOn: { backgroundColor: COLORS.primary },
  progressTxt: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted },
  progressLine: { flex: 1, height: 2, backgroundColor: COLORS.borderLight, marginHorizontal: -4 },
  progressLineOn: { backgroundColor: COLORS.primary },
  stepCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, marginBottom: 16, ...SHADOW.sm },
  stepTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  stepSub: { fontSize: 13, color: COLORS.textMuted, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8, marginTop: 4 },
  picker: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, paddingHorizontal: 14, height: 50, borderWidth: 1.5, borderColor: COLORS.border },
  pickerFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  pickerTxt: { flex: 1, fontSize: 15, color: COLORS.textMuted },
  dropdown: { backgroundColor: '#fff', borderRadius: RADIUS.lg, borderWidth: 1, borderColor: COLORS.border, marginTop: 6, overflow: 'hidden', ...SHADOW.sm },
  dropdownSearch: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.bg },
  dropdownInput: { flex: 1, fontSize: 14, color: COLORS.text },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  dropdownItemOn: { backgroundColor: COLORS.primaryLight },
  dateBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, paddingHorizontal: 12, height: 46, borderWidth: 1, borderColor: COLORS.border },
  dateInput: { flex: 1, fontSize: 14, color: COLORS.text },
  daysBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 8, marginTop: 10, alignSelf: 'flex-start' },
  daysBadgeTxt: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  optCard: { width: '47%', backgroundColor: COLORS.bg, borderRadius: RADIUS.xl, padding: 14, borderWidth: 2, borderColor: COLORS.border, position: 'relative' },
  optCardOn: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  optEmoji: { fontSize: 26, marginBottom: 6 },
  optLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  optDesc: { fontSize: 11, color: COLORS.textMuted },
  optCheck: { position: 'absolute', top: 10, right: 10 },
  textarea: { backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, padding: 14, fontSize: 14, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border, minHeight: 90 },
  summary: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, padding: 14, marginTop: 16, gap: 4 },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: COLORS.primaryDark, marginBottom: 4 },
  summaryRow: { fontSize: 14, color: COLORS.text, fontWeight: '500' },
  prevBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fff', borderRadius: RADIUS.full, paddingHorizontal: 20, paddingVertical: 16, borderWidth: 1, borderColor: COLORS.border },
  prevTxt: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: RADIUS.full, paddingVertical: 16 },
  nextTxt: { fontSize: 16, fontWeight: '700', color: '#fff' },
});

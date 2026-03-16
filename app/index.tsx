import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2563eb' },
  content: { flex: 1, padding: 24, justifyContent: 'flex-start' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  logoBtn: { backgroundColor: '#0ea5e9', borderRadius: 99, paddingHorizontal: 16, paddingVertical: 6 },
  loginBtn: { backgroundColor: '#fff', borderRadius: 99, paddingHorizontal: 18, paddingVertical: 6 },
  logoTxt: { color: '#fff', fontWeight: '700', fontSize: 15 },
  loginTxt: { color: '#0ea5e9', fontWeight: '700', fontSize: 15 },
  center: { alignItems: 'center', marginBottom: 18 },
  mainTitle: { color: '#fff', fontWeight: '800', fontSize: 38, marginBottom: 0 },
  subTitle: { color: '#38bdf8', fontWeight: '800', fontSize: 38, marginBottom: 10 },
  desc: { color: '#fff', fontSize: 15, textAlign: 'center', marginBottom: 18 },
  startBtn: { backgroundColor: '#0ea5e9', borderRadius: 99, paddingHorizontal: 36, paddingVertical: 14, marginBottom: 10 },
  startTxt: { color: '#fff', fontWeight: '800', fontSize: 18 },
  freeTxt: { color: '#fff', fontSize: 13, marginBottom: 18 },
  statsBox: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 18, padding: 18, marginBottom: 18 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  stat: { alignItems: 'center' },
  statNum: { color: '#fff', fontWeight: '800', fontSize: 22 },
  statLabel: { color: '#fff', fontSize: 13 },
  sectionTitle: { color: '#fff', fontWeight: '700', fontSize: 18, marginBottom: 10 },
  featuresRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  featureBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.10)', borderRadius: 14, padding: 14, alignItems: 'center' },
  featureTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 6 },
  featureDesc: { color: '#fff', fontSize: 13, textAlign: 'center' },
});

export default function LandingScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.container}>
      <LinearGradient colors={["#2563eb", "#1e40af", "#0ea5e9"]} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <View style={s.content}>
        <View style={s.row}>
          <TouchableOpacity style={s.logoBtn}>
            <Text style={s.logoTxt}>เที่ยวง่ายสไตล์ฉัน</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/auth')} style={s.loginBtn}>
            <Text style={s.loginTxt}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
        <View style={s.center}>
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 6 }}>★ AI Travel Planner สำหรับเที่ยวไทย</Text>
          <Text style={s.mainTitle}>เที่ยวง่าย</Text>
          <Text style={s.subTitle}>สไตล์ฉัน</Text>
          <Text style={s.desc}>
            วางแผนท่องเที่ยวทั่วไทย 77 จังหวัด ด้วย AI อัจฉริยะ เพียงเลือกจังหวัด สไตล์ และงบประมาณ
          </Text>
          <TouchableOpacity onPress={() => router.push('/auth')} style={s.startBtn}>
            <Text style={s.startTxt}>✨ เริ่มวางแผนฟรี!</Text>
          </TouchableOpacity>
          <Text style={s.freeTxt}>ไม่มีค่าใช้จ่าย • ใช้งานได้ทันที</Text>
        </View>
        <View style={s.statsBox}>
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statNum}>77</Text>
              <Text style={s.statLabel}>จังหวัด</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statNum}>3,000+</Text>
              <Text style={s.statLabel}>สถานที่</Text>
            </View>
            <View style={s.stat}>
              <Text style={s.statNum}>AI</Text>
              <Text style={s.statLabel}>วางแผน</Text>
            </View>
          </View>
        </View>
        <Text style={s.sectionTitle}>ครบทุกความต้องการ</Text>
        <View style={s.featuresRow}>
          <View style={s.featureBox}>
            <Text style={s.featureTitle}>AI วางแผนให้</Text>
            <Text style={s.featureDesc}>เลือกจังหวัด สไตล์ งบฯ ง่ายๆ รับแผน AI อัตโนมัติ</Text>
          </View>
          <View style={s.featureBox}>
            <Text style={s.featureTitle}>แผนที่และเส้นทาง</Text>
            <Text style={s.featureDesc}>แผนที่รวมทริปพร้อมเส้นทางเดินทางสะดวก</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
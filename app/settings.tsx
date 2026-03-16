import { useState, useEffect } from 'react';
import {
  View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { BackHeader, Card, Divider } from '@/components/ui';

interface Settings { notifications: boolean; darkMode: boolean; language: 'th' | 'en'; }

const DEFAULT_SETTINGS: Settings = { notifications: true, darkMode: false, language: 'th' };

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem('app_settings').then(v => {
      if (v) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(v) });
    });
  }, []);

  const update = async (key: keyof Settings, value: any) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    await AsyncStorage.setItem('app_settings', JSON.stringify(next));
  };

  const deleteAccount = () => Alert.alert('ลบบัญชี', 'การลบบัญชีไม่สามารถย้อนกลับได้ ต้องการดำเนินการต่อ?', [
    { text: 'ยกเลิก', style: 'cancel' },
    { text: 'ลบบัญชี', style: 'destructive', onPress: () => Alert.alert('แจ้งเตือน', 'กรุณาติดต่อ support@easythaitrip.com เพื่อดำเนินการลบบัญชี') },
  ]);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <BackHeader title="การตั้งค่า" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Preferences */}
        <Text style={s.sectionLabel}>การตั้งค่าทั่วไป</Text>
        <Card style={{ overflow: 'hidden', marginBottom: 20 }}>
          {/* Notifications */}
          <View style={s.row}>
            <View style={[s.rowIcon, { backgroundColor: '#ffe4e6' }]}>
              <Ionicons name="notifications" size={20} color={COLORS.danger} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>การแจ้งเตือน</Text>
              <Text style={s.rowSub}>รับแจ้งเตือนไลค์และคอมเมนต์</Text>
            </View>
            <Switch value={settings.notifications} onValueChange={v => update('notifications', v)}
              trackColor={{ false: COLORS.borderLight, true: COLORS.primary + '80' }} thumbColor={settings.notifications ? COLORS.primary : '#fff'} />
          </View>
          <Divider />
          {/* Dark mode */}
          <View style={s.row}>
            <View style={[s.rowIcon, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="moon" size={20} color={COLORS.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>โหมดมืด</Text>
              <Text style={s.rowSub}>เปลี่ยนธีมเป็นโหมดกลางคืน</Text>
            </View>
            <Switch value={settings.darkMode} onValueChange={v => update('darkMode', v)}
              trackColor={{ false: COLORS.borderLight, true: COLORS.accent + '80' }} thumbColor={settings.darkMode ? COLORS.accent : '#fff'} />
          </View>
          <Divider />
          {/* Language */}
          <View style={s.row}>
            <View style={[s.rowIcon, { backgroundColor: '#d1fae5' }]}>
              <Ionicons name="globe" size={20} color={COLORS.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.rowLabel}>ภาษา</Text>
              <Text style={s.rowSub}>{settings.language === 'th' ? 'ภาษาไทย' : 'English'}</Text>
            </View>
            <TouchableOpacity onPress={() => update('language', settings.language === 'th' ? 'en' : 'th')}
              style={s.langBtn}>
              <Text style={s.langBtnTxt}>{settings.language === 'th' ? 'EN' : 'TH'}</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Account */}
        <Text style={s.sectionLabel}>บัญชีและความเป็นส่วนตัว</Text>
        <Card style={{ overflow: 'hidden', marginBottom: 20 }}>
          {[
            { icon: 'shield-checkmark', color: '#d1fae5', iconColor: COLORS.primary, label: 'นโยบายความเป็นส่วนตัว', sub: 'อ่านนโยบายการใช้ข้อมูล' },
            { icon: 'document-text', color: '#ede9fe', iconColor: COLORS.accent, label: 'เงื่อนไขการใช้บริการ', sub: 'ข้อกำหนดและเงื่อนไข' },
            { icon: 'help-circle', color: '#fef3c7', iconColor: '#f59e0b', label: 'ศูนย์ช่วยเหลือ', sub: 'FAQ และการติดต่อ' },
          ].map((item, idx, arr) => (
            <View key={item.label}>
              <TouchableOpacity style={s.row} activeOpacity={0.7}>
                <View style={[s.rowIcon, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon as any} size={20} color={item.iconColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.rowLabel}>{item.label}</Text>
                  <Text style={s.rowSub}>{item.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.textLight} />
              </TouchableOpacity>
              {idx < arr.length - 1 && <Divider />}
            </View>
          ))}
        </Card>

        {/* App Info */}
        <Card style={{ padding: 16, marginBottom: 20 }}>
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.textMuted }}>เที่ยวง่ายสไตล์ฉัน</Text>
            <Text style={{ fontSize: 12, color: COLORS.textMuted }}>เวอร์ชัน 1.0.0 (SDK 54)</Text>
          </View>
        </Card>

        {/* Danger zone */}
        <TouchableOpacity onPress={deleteAccount} style={s.deleteBtn} activeOpacity={0.8}>
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
          <Text style={s.deleteBtnTxt}>ลบบัญชี</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 8, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  rowIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  rowLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  rowSub: { fontSize: 12, color: COLORS.textMuted },
  langBtn: { backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.lg, paddingHorizontal: 14, paddingVertical: 7 },
  langBtnTxt: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff1f2', borderRadius: RADIUS.xl, paddingVertical: 16, borderWidth: 1, borderColor: '#fecdd3' },
  deleteBtnTxt: { fontSize: 15, fontWeight: '700', color: COLORS.danger },
});

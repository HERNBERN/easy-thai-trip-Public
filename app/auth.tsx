import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) { Alert.alert('กรุณากรอกข้อมูลให้ครบ'); return; }
    if (!isLogin && !name.trim()) { Alert.alert('กรุณากรอกชื่อ'); return; }
    if (password.length < 6) { Alert.alert('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'); return; }
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) {
          if (error.message?.includes('Invalid login credentials')) {
            Alert.alert('กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ', 'โปรดตรวจสอบอีเมลและกดยืนยันก่อนเข้าสู่ระบบ');
            return;
          }
          throw error;
        }
        router.replace('/(tabs)');
      } else {
        const { error } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim() } } });
        if (error) {
          if (error.message?.includes('already registered')) {
            Alert.alert('อีเมลนี้ถูกใช้แล้ว', 'กรุณาเข้าสู่ระบบหรือใช้เมลอื่น');
            return;
          }
          throw error;
        }
        Alert.alert('สมัครสมาชิกสำเร็จ! 🎉', 'กรุณาตรวจสอบอีเมลเพื่อยืนยัน แล้วเข้าสู่ระบบ', [{ text: 'ตกลง', onPress: () => setIsLogin(true) }]);
      }
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e.message || 'กรุณาลองใหม่');
    } finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#2563eb', '#1e40af', '#0ea5e9']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Logo */}
          <View style={s.logo}>
            <View style={s.logoIcon}><Ionicons name="airplane" size={32} color={COLORS.primary} /></View>
            <Text style={s.logoTitle}>เที่ยวง่ายสไตล์ฉัน</Text>
            <Text style={s.logoSub}>AI Travel Planner สำหรับเที่ยวไทย</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            {/* Toggle */}
            <View style={s.toggle}>
              <TouchableOpacity onPress={() => setIsLogin(true)} style={[s.toggleBtn, isLogin && s.toggleBtnOn]}>
                <Text style={[s.toggleTxt, isLogin && s.toggleTxtOn]}>เข้าสู่ระบบ</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsLogin(false)} style={[s.toggleBtn, !isLogin && s.toggleBtnOn]}>
                <Text style={[s.toggleTxt, !isLogin && s.toggleTxtOn]}>สมัครสมาชิก</Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={s.field}>
                <Text style={s.label}>ชื่อ-นามสกุล</Text>
                <View style={s.inputWrap}>
                  <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={s.inputIcon} />
                  <TextInput style={s.input} placeholder="ชื่อของคุณ" value={name} onChangeText={setName} placeholderTextColor={COLORS.textMuted} />
                </View>
              </View>
            )}

            <View style={s.field}>
              <Text style={s.label}>อีเมล</Text>
              <View style={s.inputWrap}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={s.inputIcon} />
                <TextInput style={s.input} placeholder="your@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} placeholderTextColor={COLORS.textMuted} />
              </View>
            </View>

            <View style={s.field}>
              <Text style={s.label}>รหัสผ่าน</Text>
              <View style={s.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={s.inputIcon} />
                <TextInput style={[s.input, { flex: 1 }]} placeholder="อย่างน้อย 6 ตัวอักษร" value={password} onChangeText={setPassword} secureTextEntry={!showPw} placeholderTextColor={COLORS.textMuted} />
                <TouchableOpacity onPress={() => setShowPw(!showPw)} style={{ padding: 4 }}>
                  <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={18} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              {isLogin && (
                <TouchableOpacity onPress={() => router.push('/reset-password')} style={{ marginTop: 8, alignSelf: 'flex-end' }}>
                  <Text style={{ color: '#2563eb', fontSize: 14, fontWeight: '600' }}>รีเซ็ตรหัสผ่าน</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity onPress={handleSubmit} disabled={loading} style={[s.submitBtn, loading && { opacity: 0.7 }]} activeOpacity={0.85}>
              <LinearGradient colors={COLORS.gradPrimary} style={s.submitGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                {loading ? <ActivityIndicator color="#fff" /> : (
                  <>
                    <Ionicons name={isLogin ? 'log-in-outline' : 'person-add-outline'} size={20} color="#fff" />
                    <Text style={s.submitTxt}>{isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/')} style={s.backLink}>
            <Ionicons name="arrow-back" size={16} color="rgba(255,255,255,0.7)" />
            <Text style={s.backLinkTxt}>กลับหน้าแรก</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logo: { alignItems: 'center', marginBottom: 32 },
  logoIcon: { width: 72, height: 72, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginBottom: 4 },
  logoSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 24, ...SHADOW.lg },
  toggle: { flexDirection: 'row', backgroundColor: COLORS.bg, borderRadius: RADIUS.xl, padding: 4, marginBottom: 24 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.lg, alignItems: 'center' },
  toggleBtnOn: { backgroundColor: '#fff', ...SHADOW.sm },
  toggleTxt: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  toggleTxtOn: { color: COLORS.text, fontWeight: '700' },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, paddingHorizontal: 14, height: 50, borderWidth: 1, borderColor: COLORS.border },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  submitBtn: { marginTop: 8 },
  submitGrad: { borderRadius: RADIUS.full, height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  backLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 },
  backLinkTxt: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
});

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('กรุณากรอกอีเมล');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) throw error;
      Alert.alert('ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว', 'กรุณาตรวจสอบอีเมลของคุณ');
      router.push('/auth');
    } catch (e: any) {
      Alert.alert('เกิดข้อผิดพลาด', e.message || 'กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#2563eb', '#1e40af', '#0ea5e9']} style={StyleSheet.absoluteFill} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
      <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.card}>
          <Text style={styles.title}>รีเซ็ตรหัสผ่าน</Text>
          <Text style={styles.desc}>กรอกอีเมลที่ใช้สมัครสมาชิก ระบบจะส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณ</Text>
          <View style={styles.inputWrap}>
            <Ionicons name="mail-outline" size={18} color="#2563eb" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#2563eb"
            />
          </View>
          <TouchableOpacity onPress={handleReset} disabled={loading} style={styles.submitBtn}>
            <Text style={styles.submitTxt}>{loading ? 'กำลังส่ง...' : 'ส่งลิงก์รีเซ็ต'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/auth')} style={styles.backLink}>
            <Text style={styles.backLinkTxt}>กลับเข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 28, padding: 24, marginHorizontal: 24, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: '#2563eb', marginBottom: 8 },
  desc: { fontSize: 14, color: '#2563eb', marginBottom: 18, textAlign: 'center' },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0e7ff', borderRadius: 16, paddingHorizontal: 14, height: 50, marginBottom: 16 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#2563eb' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 99, paddingHorizontal: 32, paddingVertical: 12, marginBottom: 10 },
  submitTxt: { color: '#fff', fontWeight: '700', fontSize: 16 },
  backLink: { marginTop: 8 },
  backLinkTxt: { color: '#2563eb', fontSize: 14 },
});

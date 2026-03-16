import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  FlatList, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { BackHeader } from '@/components/ui';

interface Message { role: 'user' | 'assistant'; content: string; }

const SUGGESTIONS = [
  'ที่เที่ยวเชียงใหม่ 3 วัน 2 คืน',
  'หาดทรายสวยภาคใต้มีที่ไหนบ้าง?',
  'ทริปครอบครัวเด็กเล็กไปไหนดี?',
  'ช่วงหน้าหนาวควรไปไหน?',
];

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'สวัสดีครับ! 🏖️ ผมเป็น AI ผู้ช่วยวางแผนท่องเที่ยวไทย\n\nถามอะไรได้เลยครับ เช่น:\n• แนะนำที่เที่ยวในจังหวัดไหน\n• วางแผนทริปกี่วันกี่คืน\n• งบประมาณเท่าไหร่ดี' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const send = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    const userMsg: Message = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    try {
      console.log('EXPO_PUBLIC_SUPABASE_URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
      const resp = await fetch(`${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}` },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || data.content?.[0]?.text || 'ขออภัย เกิดข้อผิดพลาด กรุณาลองใหม่';
      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: '❌ ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบอินเทอร์เน็ต' }]);
    } finally {
      setLoading(false);
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <BackHeader title="แชทกับ AI" subtitle="ผู้ช่วยวางแผนท่องเที่ยว" onBack={() => router.back()} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        <FlatList ref={flatRef} data={messages} keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatRef.current?.scrollToEnd()}
          ListHeaderComponent={messages.length === 1 ? (
            <View style={{ marginBottom: 8 }}>
              <Text style={s.suggestionTitle}>💡 ลองถามเลย</Text>
              <View style={s.suggestionsWrap}>
                {SUGGESTIONS.map(q => (
                  <TouchableOpacity key={q} onPress={() => send(q)} style={s.suggestionChip} activeOpacity={0.8}>
                    <Text style={s.suggestionTxt}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : null}
          renderItem={({ item: msg }) => (
            <View style={[s.msgRow, msg.role === 'user' && s.msgRowUser]}>
              {msg.role === 'assistant' && (
                <LinearGradient colors={COLORS.gradPrimary} style={s.botAvatar}>
                  <Ionicons name="sparkles" size={15} color="#fff" />
                </LinearGradient>
              )}
              <View style={[s.bubble, msg.role === 'user' ? s.bubbleUser : s.bubbleBot]}>
                <Text style={[s.bubbleTxt, msg.role === 'user' && { color: '#fff' }]}>{msg.content}</Text>
              </View>
            </View>
          )}
          ListFooterComponent={loading ? (
            <View style={s.msgRow}>
              <LinearGradient colors={COLORS.gradPrimary} style={s.botAvatar}>
                <Ionicons name="sparkles" size={15} color="#fff" />
              </LinearGradient>
              <View style={[s.bubbleBot, { padding: 14 }]}>
                <ActivityIndicator size="small" color={COLORS.primary} />
              </View>
            </View>
          ) : null}
        />

        <View style={s.inputBar}>
          <TextInput style={s.input} value={input} onChangeText={setInput}
            placeholder="ถามเกี่ยวกับการท่องเที่ยว..." placeholderTextColor={COLORS.textMuted}
            multiline maxLength={500} returnKeyType="send" onSubmitEditing={() => send()} />
          <TouchableOpacity onPress={() => send()} disabled={loading || !input.trim()}
            style={[s.sendBtn, (!input.trim() || loading) && { opacity: 0.4 }]} activeOpacity={0.8}>
            <LinearGradient colors={COLORS.gradPrimary} style={s.sendGrad}>
              <Ionicons name="send" size={17} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  suggestionTitle: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, marginBottom: 8 },
  suggestionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  suggestionChip: { backgroundColor: '#fff', borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: COLORS.border, ...SHADOW.sm },
  suggestionTxt: { fontSize: 13, color: COLORS.text, fontWeight: '500' },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  botAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 2, flexShrink: 0 },
  bubble: { maxWidth: '80%', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleBot: { backgroundColor: '#fff', ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.borderLight, borderBottomLeftRadius: 4 },
  bubbleUser: { backgroundColor: COLORS.primary, borderBottomRightRadius: 4 },
  bubbleTxt: { fontSize: 14, color: COLORS.text, lineHeight: 21 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, paddingBottom: Platform.OS === 'ios' ? 20 : 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  input: { flex: 1, backgroundColor: COLORS.bg, borderRadius: RADIUS.xl, paddingHorizontal: 16, paddingVertical: 10, fontSize: 14, color: COLORS.text, maxHeight: 100, borderWidth: 1, borderColor: COLORS.border, lineHeight: 20 },
  sendBtn: { flexShrink: 0 },
  sendGrad: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});

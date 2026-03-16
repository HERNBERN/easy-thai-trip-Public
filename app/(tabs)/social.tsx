import { useEffect, useState, useCallback } from 'react';
import usePlaceImage from '@/lib/usePlaceImage';
// Child component for place tag image
function PlaceTagImage({ placeName, province }) {
  const { uri, loading, error } = usePlaceImage({ name: placeName, province });
  if (loading) return <ActivityIndicator size="small" color={COLORS.primary} style={{ width: 32, height: 32 }} />;
  if (uri) return <ImageBackground source={{ uri }} style={{ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }} imageStyle={{ borderRadius: 8 }}><Text style={{ fontSize: 14, color: '#fff', textShadowColor: '#0008', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8 }}>📍</Text>{error && <Text style={{ fontSize: 8, color: 'red', position: 'absolute', bottom: 2 }}>รูปไม่ตรง Google</Text>}</ImageBackground>;
  return <LinearGradient colors={['#ecfdf5', '#f0fdf4']} style={{ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontSize: 14 }}>📍</Text>{error && <Text style={{ fontSize: 8, color: 'red', position: 'absolute', bottom: 2 }}>รูปไม่ตรง Google</Text>}</LinearGradient>;
}
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';
import { Avatar, EmptyState } from '@/components/ui';

interface Post { id: string; content: string; image_urls: string[] | null; place_tags: string[] | null; category_tags: string[] | null; created_at: string; user_id: string; profile?: { name: string | null } | null; likesCount: number; commentsCount: number; isLiked: boolean; }
interface Comment { id: string; content: string; created_at: string; user_id: string; profile?: { name: string | null } | null; }

const timeAgo = (d: string) => { const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000); return m < 60 ? `${m}น.` : m < 1440 ? `${Math.floor(m / 60)}ชม.` : `${Math.floor(m / 1440)}วัน`; };

export default function SocialScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useFocusEffect(useCallback(() => { fetchPosts(); }, []));

  const fetchPosts = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUserId(session?.user?.id || null);
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false }).limit(30);
    if (!data) { setLoading(false); return; }
    const userIds = [...new Set(data.map((p: any) => p.user_id))];
    const postIds = data.map((p: any) => p.id);
    const [profiles, likes, myLikes, commentCounts] = await Promise.all([
      supabase.from('profiles').select('user_id, name').in('user_id', userIds),
      supabase.from('post_likes').select('post_id').in('post_id', postIds),
      session ? supabase.from('post_likes').select('post_id').eq('user_id', session.user.id).in('post_id', postIds) : Promise.resolve({ data: [] }),
      supabase.from('post_comments').select('post_id').in('post_id', postIds),
    ]);
    const pm = new Map(profiles.data?.map((p: any) => [p.user_id, p]) || []);
    const lc: Record<string, number> = {}; likes.data?.forEach((l: any) => { lc[l.post_id] = (lc[l.post_id] || 0) + 1; });
    const cc: Record<string, number> = {}; (commentCounts.data as any[])?.forEach((c: any) => { cc[c.post_id] = (cc[c.post_id] || 0) + 1; });
    const ml = new Set(myLikes.data?.map((l: any) => l.post_id) || []);
    setPosts(data.map((p: any) => ({ ...p, profile: pm.get(p.user_id) || null, likesCount: lc[p.id] || 0, commentsCount: cc[p.id] || 0, isLiked: ml.has(p.id) })));
    setLoading(false);
  };

  const handleLike = async (postId: string) => {
    if (!userId) { Alert.alert('กรุณาเข้าสู่ระบบก่อน'); return; }
    const post = posts.find(p => p.id === postId)!;
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1 } : p));
    if (post.isLiked) { await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', userId); }
    else { await supabase.from('post_likes').insert({ post_id: postId, user_id: userId }); }
  };

  const openComments = async (postId: string) => {
    if (expandedPost === postId) { setExpandedPost(null); return; }
    setExpandedPost(postId); setCommentLoading(true);
    const { data } = await supabase.from('post_comments').select('*').eq('post_id', postId).order('created_at', { ascending: true });
    if (data?.length) {
      const uids = [...new Set(data.map((c: any) => c.user_id))];
      const { data: profs } = await supabase.from('profiles').select('user_id, name').in('user_id', uids);
      const pm = new Map(profs?.map((p: any) => [p.user_id, p]) || []);
      setComments(data.map((c: any) => ({ ...c, profile: pm.get(c.user_id) || null })));
    } else { setComments([]); }
    setCommentLoading(false);
  };

  const sendComment = async (postId: string) => {
    if (!userId || !commentInput.trim()) return;
    setSending(true);
    const { data } = await supabase.from('post_comments').insert({ post_id: postId, user_id: userId, content: commentInput.trim() }).select().single();
    if (data) {
      const { data: prof } = await supabase.from('profiles').select('user_id, name').eq('user_id', userId).single();
      setComments(prev => [...prev, { ...data, profile: prof || null }]);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p));
      setCommentInput('');
    }
    setSending(false);
  };

  const renderPost = ({ item: post }: { item: Post }) => (
    <View style={s.post}>
      {/* Header */}
      <View style={s.postHead}>
        <Avatar name={post.profile?.name || 'U'} size={38} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.postAuthor}>{post.profile?.name || 'ผู้ใช้'}</Text>
          <Text style={s.postTime}>{timeAgo(post.created_at)}</Text>
        </View>
      </View>

      {/* Image */}
      {post.image_urls?.[0] && <Image source={{ uri: post.image_urls[0] }} style={s.postImg} resizeMode="cover" />}

      {/* Content */}
      <View style={s.postBody}>
        <Text style={s.postContent} numberOfLines={5}>{post.content}</Text>
        {/* Tags */}
        {(post.place_tags?.length || post.category_tags?.length) ? (
          <View style={s.tagsRow}>
            {post.place_tags?.map(t => (
              <View key={t} style={s.placeTag}>
                <PlaceTagImage placeName={t} province={t} />
                <Text style={s.placeTagTxt}>{t}</Text>
              </View>
            ))}
            {post.category_tags?.map(t => <View key={t} style={s.catTag}><Text style={s.catTagTxt}>{t}</Text></View>)}
          </View>
        ) : null}
        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity onPress={() => handleLike(post.id)} style={s.actionBtn} activeOpacity={0.7}>
            <Ionicons name={post.isLiked ? 'heart' : 'heart-outline'} size={22} color={post.isLiked ? COLORS.danger : COLORS.textMuted} />
            {post.likesCount > 0 && <Text style={[s.actionTxt, post.isLiked && { color: COLORS.danger }]}>{post.likesCount}</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openComments(post.id)} style={s.actionBtn} activeOpacity={0.7}>
            <Ionicons name={expandedPost === post.id ? 'chatbubble' : 'chatbubble-outline'} size={20} color={expandedPost === post.id ? COLORS.accent : COLORS.textMuted} />
            {post.commentsCount > 0 && <Text style={[s.actionTxt, expandedPost === post.id && { color: COLORS.accent }]}>{post.commentsCount}</Text>}
          </TouchableOpacity>
        </View>

        {/* Comments section */}
        {expandedPost === post.id && (
          <View style={s.commentSec}>
            {commentLoading ? <ActivityIndicator size="small" color={COLORS.primary} style={{ paddingVertical: 12 }} /> :
              comments.length === 0 ? <Text style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: 13, paddingVertical: 8 }}>ยังไม่มีความคิดเห็น</Text> :
              comments.map(c => (
                <View key={c.id} style={s.comment}>
                  <Avatar name={c.profile?.name || 'U'} size={28} />
                  <View style={s.commentBubble}>
                    <Text style={s.commentAuthor}>{c.profile?.name || 'ผู้ใช้'}</Text>
                    <Text style={s.commentText}>{c.content}</Text>
                  </View>
                </View>
              ))
            }
            <View style={s.commentInput}>
              <TextInput style={s.commentBox} placeholder="เขียนความคิดเห็น..." value={commentInput} onChangeText={setCommentInput} placeholderTextColor={COLORS.textMuted} />
              <TouchableOpacity onPress={() => sendComment(post.id)} disabled={sending || !commentInput.trim()} style={[s.sendBtn, (!commentInput.trim() || sending) && { opacity: 0.45 }]}>
                {sending ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={16} color="#fff" />}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>ชุมชนนักเที่ยว</Text>
        <TouchableOpacity onPress={() => router.push('/create-post')} style={s.newPostBtn} activeOpacity={0.85}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={s.newPostTxt}>โพสต์</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <FlatList data={posts} keyExtractor={p => p.id} renderItem={renderPost} showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, padding: 14, paddingBottom: 24 }}
            ListEmptyComponent={<EmptyState icon="chatbubbles-outline" title="ยังไม่มีโพสต์" subtitle="เป็นคนแรกที่แชร์ประสบการณ์เที่ยว!" action="สร้างโพสต์แรก" onAction={() => router.push('/create-post')} />}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  newPostBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.primary, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 9 },
  newPostTxt: { color: '#fff', fontWeight: '700', fontSize: 14 },
  post: { backgroundColor: '#fff', borderRadius: RADIUS.xl, overflow: 'hidden', ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.borderLight },
  postHead: { flexDirection: 'row', alignItems: 'center', padding: 14, paddingBottom: 10 },
  postAuthor: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  postTime: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },
  postImg: { width: '100%', height: 220 },
  postBody: { padding: 14 },
  postContent: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  placeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryLight, borderRadius: RADIUS.full, paddingHorizontal: 9, paddingVertical: 4 },
  placeTagTxt: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
  catTag: { backgroundColor: '#ede9fe', borderRadius: RADIUS.full, paddingHorizontal: 9, paddingVertical: 4 },
  catTagTxt: { fontSize: 11, color: COLORS.accent, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 18, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionTxt: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  commentSec: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
  comment: { flexDirection: 'row', gap: 8, marginBottom: 10, alignItems: 'flex-start' },
  commentBubble: { flex: 1, backgroundColor: COLORS.bg, borderRadius: RADIUS.lg, paddingHorizontal: 12, paddingVertical: 8 },
  commentAuthor: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  commentText: { fontSize: 13, color: COLORS.text, lineHeight: 19 },
  commentInput: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  commentBox: { flex: 1, backgroundColor: COLORS.bg, borderRadius: RADIUS.full, paddingHorizontal: 14, paddingVertical: 9, fontSize: 14, color: COLORS.text, borderWidth: 1, borderColor: COLORS.border },
  sendBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
});

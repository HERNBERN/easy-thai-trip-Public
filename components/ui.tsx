import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
  ViewStyle, TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOW } from '@/constants/theme';

// ── Button ──────────────────────────────────────────────
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}
export function Button({ label, onPress, variant = 'primary', size = 'md', icon, loading, disabled, style }: ButtonProps) {
  const h = size === 'sm' ? 38 : size === 'lg' ? 56 : 48;
  const fs = size === 'sm' ? 13 : size === 'lg' ? 17 : 15;
  const px = size === 'sm' ? 14 : size === 'lg' ? 28 : 20;
  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.82} style={[{ opacity: isDisabled ? 0.55 : 1 }, style]}>
        <LinearGradient colors={COLORS.gradPrimary} style={[btn.base, { height: h, paddingHorizontal: px }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          {loading ? <ActivityIndicator color="#fff" size="small" /> : (
            <>
              {icon && <Ionicons name={icon} size={fs + 2} color="#fff" style={{ marginRight: 6 }} />}
              <Text style={[btn.textPrimary, { fontSize: fs }]}>{label}</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  if (variant === 'danger') {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.82} style={[btn.base, btn.danger, { height: h, paddingHorizontal: px }, style]}>
        {icon && <Ionicons name={icon} size={fs + 2} color={COLORS.danger} style={{ marginRight: 6 }} />}
        <Text style={[btn.textDanger, { fontSize: fs }]}>{label}</Text>
      </TouchableOpacity>
    );
  }
  if (variant === 'outline') {
    return (
      <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.82} style={[btn.base, btn.outline, { height: h, paddingHorizontal: px, opacity: isDisabled ? 0.55 : 1 }, style]}>
        {icon && <Ionicons name={icon} size={fs + 2} color={COLORS.primary} style={{ marginRight: 6 }} />}
        <Text style={[btn.textOutline, { fontSize: fs }]}>{label}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.7} style={[btn.base, { height: h, paddingHorizontal: px, opacity: isDisabled ? 0.55 : 1 }, style]}>
      {icon && <Ionicons name={icon} size={fs + 2} color={COLORS.textMuted} style={{ marginRight: 6 }} />}
      <Text style={[btn.textGhost, { fontSize: fs }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const btn = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: RADIUS.full },
  outline: { borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: 'transparent' },
  danger: { borderWidth: 1.5, borderColor: COLORS.danger, backgroundColor: COLORS.dangerLight },
  textPrimary: { color: '#fff', fontWeight: '700' },
  textOutline: { color: COLORS.primary, fontWeight: '700' },
  textDanger: { color: COLORS.danger, fontWeight: '700' },
  textGhost: { color: COLORS.textMuted, fontWeight: '600' },
});

// ── Card ──────────────────────────────────────────────
interface CardProps { children: React.ReactNode; style?: ViewStyle; onPress?: () => void; }
export function Card({ children, style, onPress }: CardProps) {
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.88} style={[card.base, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[card.base, style]}>{children}</View>;
}
const card = StyleSheet.create({
  base: { backgroundColor: COLORS.card, borderRadius: RADIUS.xl, ...SHADOW.sm, borderWidth: 1, borderColor: COLORS.borderLight },
});

// ── SectionHeader ───────────────────────────────────────
interface SectionHeaderProps { title: string; action?: string; onAction?: () => void; style?: ViewStyle; }
export function SectionHeader({ title, action, onAction, style }: SectionHeaderProps) {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }, style]}>
      <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.text }}>{title}</Text>
      {action && <TouchableOpacity onPress={onAction}><Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: '600' }}>{action}</Text></TouchableOpacity>}
    </View>
  );
}

// ── Badge ───────────────────────────────────────────────
interface BadgeProps { label: string; color?: string; bgColor?: string; size?: 'sm' | 'md'; }
export function Badge({ label, color = COLORS.primary, bgColor = COLORS.primaryLight, size = 'md' }: BadgeProps) {
  const fs = size === 'sm' ? 10 : 12;
  return (
    <View style={{ backgroundColor: bgColor, borderRadius: RADIUS.full, paddingHorizontal: size === 'sm' ? 8 : 10, paddingVertical: size === 'sm' ? 3 : 5, alignSelf: 'flex-start' }}>
      <Text style={{ fontSize: fs, fontWeight: '600', color }}>{label}</Text>
    </View>
  );
}

// ── EmptyState ──────────────────────────────────────────
interface EmptyStateProps { icon: keyof typeof Ionicons.glyphMap; title: string; subtitle?: string; action?: string; onAction?: () => void; }
export function EmptyState({ icon, title, subtitle, action, onAction }: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48, paddingHorizontal: 32 }}>
      <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <Ionicons name={icon} size={32} color={COLORS.primary} />
      </View>
      <Text style={{ fontSize: 17, fontWeight: '700', color: COLORS.text, textAlign: 'center', marginBottom: 6 }}>{title}</Text>
      {subtitle && <Text style={{ fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 20, marginBottom: 20 }}>{subtitle}</Text>}
      {action && <Button label={action} onPress={onAction!} size="md" />}
    </View>
  );
}

// ── BackHeader ──────────────────────────────────────────
interface BackHeaderProps { title: string; subtitle?: string; onBack: () => void; rightIcon?: keyof typeof Ionicons.glyphMap; onRight?: () => void; }
export function BackHeader({ title, subtitle, onBack, rightIcon, onRight }: BackHeaderProps) {
  return (
    <View style={bh.wrap}>
      <TouchableOpacity onPress={onBack} style={bh.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Ionicons name="chevron-back" size={26} color={COLORS.text} />
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={bh.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={bh.sub} numberOfLines={1}>{subtitle}</Text>}
      </View>
      {rightIcon ? (
        <TouchableOpacity onPress={onRight} style={bh.rightBtn}>
          <Ionicons name={rightIcon} size={22} color={COLORS.primary} />
        </TouchableOpacity>
      ) : <View style={{ width: 44 }} />}
    </View>
  );
}
const bh = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 10, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  backBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  rightBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.text },
  sub: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
});

// ── RatingStars ─────────────────────────────────────────
export function RatingStars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Ionicons name="star" size={13} color={COLORS.warning} />
      <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.warning }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

// ── Avatar ──────────────────────────────────────────────
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  return (
    <LinearGradient colors={COLORS.gradPrimary} style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontWeight: '800', fontSize: size * 0.38 }}>{(name || 'U').charAt(0).toUpperCase()}</Text>
    </LinearGradient>
  );
}

// ── Divider ─────────────────────────────────────────────
export function Divider({ style }: { style?: ViewStyle }) {
  return <View style={[{ height: 1, backgroundColor: COLORS.borderLight }, style]} />;
}

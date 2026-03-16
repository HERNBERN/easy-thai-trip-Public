import React, { useRef } from 'react';
import { Animated, PanResponder, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';

export default function DraggableChatButton({ onPress }: { onPress: () => void }) {
  const pan = useRef(new Animated.ValueXY({ x: 16, y: 16 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([
        null,
        { dx: pan.x, dy: pan.y }
      ], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        // Snap to edge logic (optional)
        Animated.spring(pan, {
          toValue: { x: pan.x._value < 200 ? 16 : 300, y: pan.y._value },
          useNativeDriver: false
        }).start();
      }
    })
  ).current;
  return (
    <Animated.View style={{ position: 'absolute', left: pan.x, top: pan.y, zIndex: 99 }} {...panResponder.panHandlers}>
      <TouchableOpacity onPress={onPress} style={{ backgroundColor: COLORS.accent, borderRadius: 24, padding: 10, elevation: 4, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6 }} activeOpacity={0.85}>
        <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}
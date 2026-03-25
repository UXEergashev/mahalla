import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useData } from '../../context/DataContext';

const CATEGORIES = [
  { id: 'repair', label: 'Ta\'mirlash', icon: 'construct', color: '#EF4444' },
  { id: 'education', label: 'Ta\'lim', icon: 'school', color: '#3B82F6' },
  { id: 'it', label: 'IT', icon: 'laptop', color: '#8B5CF6' },
  { id: 'beauty', label: 'Go\'zallik', icon: 'cut', color: '#EC4899' },
  { id: 'home', label: 'Uy', icon: 'home', color: '#10B981' },
  { id: 'transport', label: 'Transport', icon: 'car', color: '#F59E0B' },
  { id: 'food', label: 'Ovqat', icon: 'restaurant', color: '#F97316' },
  { id: 'health', label: 'Sog\'liq', icon: 'medical', color: '#06B6D4' },
];

export default function AllRequestsScreen({ navigation }) {
  const { requests } = useData();

  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradient.hero} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textInverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Barcha e'lonlar</Text>
        <Text style={styles.headerSub}>{requests.length} ta e'lon mavjud</Text>
      </LinearGradient>

      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const cat = CATEGORIES.find(c => c.id === item.category);
          return (
            <View style={styles.card}>
              <View style={[styles.catIcon, { backgroundColor: (cat?.color || COLORS.primary) + '20' }]}>
                <Ionicons name={cat?.icon || 'help'} size={22} color={cat?.color || COLORS.primary} />
              </View>
              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                {item.description ? (
                  <Text style={styles.desc} numberOfLines={2}>{item.description}</Text>
                ) : null}
                <View style={styles.meta}>
                  <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>{item.mahalla}</Text>
                  <Text style={styles.dot}>•</Text>
                  <Ionicons name="person-outline" size={12} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>{item.userName}</Text>
                </View>
                <View style={[styles.catBadge, { backgroundColor: (cat?.color || COLORS.primary) + '15' }]}>
                  <Text style={[styles.catBadgeText, { color: cat?.color || COLORS.primary }]}>
                    {cat?.label || item.category}
                  </Text>
                </View>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="document-text-outline" size={60} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>Hali e'lon yo'q</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 18, padding: 14, marginBottom: 12, ...SHADOWS.small },
  catIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  content: { flex: 1 },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  desc: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, lineHeight: 18 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  dot: { color: COLORS.textMuted },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  catBadgeText: { fontSize: 11, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 16, color: COLORS.textMuted, marginTop: 12 },
});

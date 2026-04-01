import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, Image, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useData } from '../../context/DataContext';
import { ALL_MAHALLAHS } from '../../constants/mahallahs';

const CATEGORIES = [
  { id: 'all', label: 'Barchasi', icon: 'apps' },
  { id: 'repair', label: 'Ta\'mirlash', icon: 'construct' },
  { id: 'education', label: 'Ta\'lim', icon: 'school' },
  { id: 'it', label: 'IT', icon: 'laptop' },
  { id: 'beauty', label: 'Go\'zallik', icon: 'cut' },
  { id: 'home', label: 'Uy', icon: 'home' },
  { id: 'transport', label: 'Transport', icon: 'car' },
  { id: 'food', label: 'Ovqat', icon: 'restaurant' },
  { id: 'health', label: 'Sog\'liq', icon: 'medical' },
];

const MAHALLAHS = ALL_MAHALLAHS;

const SORT_OPTIONS = [
  { id: 'rating', label: 'Reyting' },
  { id: 'reviews', label: 'Sharhlar' },
  { id: 'newest', label: 'Yangi' },
];

function StarRating({ rating, size = 12 }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons key={i} name={i <= Math.round(rating) ? "star" : "star-outline"} size={size} color={COLORS.star} />
      ))}
    </View>
  );
}

function ProviderCard({ provider, onPress }) {
  const categoryColor = COLORS.categories[provider.category] || COLORS.primary;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarWrap}>
          {provider.avatar ? (
            <Image source={{ uri: provider.avatar }} style={styles.avatar} />
          ) : (
            <LinearGradient colors={[categoryColor + 'CC', categoryColor]} style={styles.avatar}>
              <Text style={styles.avatarInitial}>{provider.name.charAt(0)}</Text>
            </LinearGradient>
          )}
          {provider.available && <View style={styles.availableDot} />}
        </View>
        <View style={styles.cardMeta}>
          <View style={styles.nameRow}>
            <Text style={styles.cardName}>{provider.name}</Text>
            {provider.verified && <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />}
          </View>
          <Text style={styles.cardProfession}>{provider.profession}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{provider.mahalla}</Text>
          </View>
        </View>
        <View style={[styles.catBadge, { backgroundColor: categoryColor + '20' }]}>
          <Text style={[styles.catBadgeText, { color: categoryColor }]}>
            {CATEGORIES.find(c => c.id === provider.category)?.label || ''}
          </Text>
        </View>
      </View>
      <Text style={styles.cardDesc} numberOfLines={2}>{provider.description || provider.skill}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.ratingRow}>
          <StarRating rating={provider.rating} />
          <Text style={styles.ratingVal}>{provider.rating > 0 ? provider.rating.toFixed(1) : 'Yangi'}</Text>
          <Text style={styles.reviewsCount}>({provider.reviewCount} sharh)</Text>
        </View>
        <View style={styles.callBtn}>
          <Ionicons name="call" size={14} color={COLORS.primary} />
          <Text style={styles.callText}>Qo'ng'iroq</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen({ navigation }) {
  const { searchProviders } = useData();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedMahalla, setSelectedMahalla] = useState('Barchasi');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  const results = searchProviders(
    query,
    selectedCat === 'all' ? '' : selectedCat,
    selectedMahalla === 'Barchasi' ? '' : selectedMahalla,
  );

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={COLORS.gradient.hero} style={styles.header}>
        <Text style={styles.headerTitle}>Qidiruv</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Mutaxassis, kasb, xizmat..."
              placeholderTextColor={COLORS.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterBtn, showFilters && styles.filterBtnActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <Ionicons name="options" size={22} color={showFilters ? COLORS.textInverse : COLORS.textInverse} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <Text style={styles.filterLabel}>Kategoriya:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.filterChip, selectedCat === cat.id && styles.filterChipActive]}
                onPress={() => setSelectedCat(cat.id)}
              >
                <Text style={[styles.filterChipText, selectedCat === cat.id && styles.filterChipTextActive]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Mahalla:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            {MAHALLAHS.map(m => (
              <TouchableOpacity
                key={m}
                style={[styles.filterChip, selectedMahalla === m && styles.filterChipActive]}
                onPress={() => setSelectedMahalla(m)}
              >
                <Text style={[styles.filterChipText, selectedMahalla === m && styles.filterChipTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.filterLabel}>Saralash:</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {SORT_OPTIONS.map(s => (
              <TouchableOpacity
                key={s.id}
                style={[styles.filterChip, sortBy === s.id && styles.filterChipActive]}
                onPress={() => setSortBy(s.id)}
              >
                <Text style={[styles.filterChipText, sortBy === s.id && styles.filterChipTextActive]}>{s.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Results count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>{sorted.length} mutaxassis topildi</Text>
      </View>

      {/* Results */}
      <FlatList
        data={sorted}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <ProviderCard provider={item} onPress={() => navigation.navigate('ProviderDetail', { provider: item })} />
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>Natija topilmadi</Text>
            <Text style={styles.emptySubtitle}>Boshqa so'z bilan qidiring</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse, marginBottom: 12 },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.surface, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.text },
  filterBtn: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  filterBtnActive: { backgroundColor: COLORS.secondary },
  filtersPanel: { backgroundColor: COLORS.surface, paddingHorizontal: 20, paddingVertical: 16, ...SHADOWS.small },
  filterLabel: { fontSize: 12, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterChipText: { fontSize: 13, color: COLORS.textSecondary },
  filterChipTextActive: { color: COLORS.textInverse, fontWeight: '600' },
  resultsHeader: { paddingHorizontal: 20, paddingVertical: 12 },
  resultsCount: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  card: { backgroundColor: COLORS.surface, borderRadius: 20, padding: 16, marginBottom: 12, ...SHADOWS.small },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatarWrap: { position: 'relative', marginRight: 12 },
  avatar: { width: 52, height: 52, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 20, fontWeight: '700', color: COLORS.textInverse },
  availableDot: { position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface },
  cardMeta: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardProfession: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  catBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  catBadgeText: { fontSize: 11, fontWeight: '600' },
  cardDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 10 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingVal: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  reviewsCount: { fontSize: 11, color: COLORS.textMuted },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primaryLight, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12 },
  callText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 8 },
});

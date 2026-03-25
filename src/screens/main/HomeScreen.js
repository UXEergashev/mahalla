import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, FlatList, RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const CATEGORIES = [
  { id: 'all', label: 'Barchasi', icon: 'apps', color: '#2563EB' },
  { id: 'repair', label: 'Ta\'mirlash', icon: 'construct', color: '#EF4444' },
  { id: 'education', label: 'Ta\'lim', icon: 'school', color: '#3B82F6' },
  { id: 'it', label: 'IT', icon: 'laptop', color: '#8B5CF6' },
  { id: 'beauty', label: 'Go\'zallik', icon: 'cut', color: '#EC4899' },
  { id: 'home', label: 'Uy', icon: 'home', color: '#10B981' },
  { id: 'transport', label: 'Transport', icon: 'car', color: '#F59E0B' },
  { id: 'food', label: 'Ovqat', icon: 'restaurant', color: '#F97316' },
  { id: 'health', label: 'Sog\'liq', icon: 'medical', color: '#06B6D4' },
];

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Xayrli tong';
  if (h < 17) return 'Xayrli kun';
  return 'Xayrli kech';
};

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
    <TouchableOpacity style={styles.providerCard} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardAvatarWrap}>
        {provider.avatar ? (
          <Image source={{ uri: provider.avatar }} style={styles.cardAvatar} />
        ) : (
          <LinearGradient colors={[categoryColor + 'CC', categoryColor]} style={styles.cardAvatar}>
            <Text style={styles.avatarInitial}>{provider.name.charAt(0)}</Text>
          </LinearGradient>
        )}
        {provider.available && <View style={styles.availableDot} />}
      </View>
      <View style={styles.cardInfo}>
        <View style={styles.cardNameRow}>
          <Text style={styles.cardName} numberOfLines={1}>{provider.name}</Text>
          {provider.verified && <Ionicons name="checkmark-circle" size={16} color={COLORS.primary} />}
        </View>
        <Text style={styles.cardProfession} numberOfLines={1}>{provider.profession}</Text>
        <View style={styles.cardMeta}>
          <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.cardMetaText}>{provider.mahalla}</Text>
        </View>
        <View style={styles.cardRating}>
          <StarRating rating={provider.rating} />
          <Text style={styles.ratingText}>{provider.rating > 0 ? provider.rating.toFixed(1) : 'Yangi'}</Text>
          <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
        </View>
      </View>
      <View style={[styles.categoryTag, { backgroundColor: categoryColor + '20' }]}>
        <Ionicons name={CATEGORIES.find(c => c.id === provider.category)?.icon || 'briefcase'} size={16} color={categoryColor} />
      </View>
    </TouchableOpacity>
  );
}

function RequestCard({ request }) {
  const cat = CATEGORIES.find(c => c.id === request.category);
  const catColor = COLORS.categories[request.category] || COLORS.primary;
  return (
    <View style={styles.requestCard}>
      <View style={[styles.reqCatIcon, { backgroundColor: catColor + '20' }]}>
        <Ionicons name={cat?.icon || 'help'} size={20} color={catColor} />
      </View>
      <View style={styles.reqInfo}>
        <Text style={styles.reqTitle} numberOfLines={1}>{request.title}</Text>
        <Text style={styles.reqDesc} numberOfLines={2}>{request.description}</Text>
        <View style={styles.reqMeta}>
          <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.reqMetaText}>{request.mahalla}</Text>
          <Text style={styles.reqMetaDot}>•</Text>
          <Text style={styles.reqMetaText}>{request.userName}</Text>
        </View>
      </View>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { userProfile } = useAuth();
  const { providers, requests, searchProviders, loading } = useData();
  const [selectedCat, setSelectedCat] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const filtered = searchProviders('', selectedCat === 'all' ? '' : selectedCat, '');
  const topProviders = [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 6);
  const recentRequests = requests.slice(0, 3);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Hero Header */}
        <LinearGradient colors={COLORS.gradient.hero} style={styles.hero}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.userName}>{userProfile?.name?.split(' ')[0] || 'Foydalanuvchi'} 👋</Text>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.textInverse} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>

          <Text style={styles.heroSubtitle}>Mahallangizda mutaxassislar toping</Text>

          <TouchableOpacity
            style={styles.searchBarFake}
            onPress={() => navigation.navigate('Search')}
            activeOpacity={0.9}
          >
            <Ionicons name="search" size={20} color={COLORS.textMuted} />
            <Text style={styles.searchFakePlaceholder}>Mutaxassis yoki xizmat qidiring...</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {[
            { label: 'Mutaxassislar', value: providers.length, icon: 'people', color: COLORS.primary },
            { label: 'E\'lonlar', value: requests.length, icon: 'document-text', color: COLORS.secondary },
            { label: 'Mahallalar', value: '9+', icon: 'location', color: COLORS.accent },
          ].map((s, i) => (
            <View key={i} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: s.color + '15' }]}>
                <Ionicons name={s.icon} size={20} color={s.color} />
              </View>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kategoriyalar</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catItem, selectedCat === cat.id && styles.catItemSelected]}
                onPress={() => setSelectedCat(cat.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.catIconBg, { backgroundColor: selectedCat === cat.id ? cat.color : cat.color + '15' }]}>
                  <Ionicons name={cat.icon} size={22} color={selectedCat === cat.id ? COLORS.textInverse : cat.color} />
                </View>
                <Text style={[styles.catLabel, selectedCat === cat.id && { color: cat.color, fontWeight: '700' }]}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Top Providers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Mutaxassislar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAll}>Hammasini ko'rish</Text>
            </TouchableOpacity>
          </View>
          {topProviders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>Bu kategoriyada mutaxassis yo'q</Text>
            </View>
          ) : (
            topProviders.map(p => (
              <ProviderCard key={p.id} provider={p} onPress={() => navigation.navigate('ProviderDetail', { provider: p })} />
            ))
          )}
        </View>

        {/* Recent Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>So'nggi e'lonlar</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AllRequests')}>
              <Text style={styles.seeAll}>Hammasini ko'rish</Text>
            </TouchableOpacity>
          </View>
          {recentRequests.map(r => (
            <RequestCard key={r.id} request={r} />
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 32 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  userName: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  notifBadge: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent, borderWidth: 1.5, borderColor: COLORS.primaryDark },
  heroSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginBottom: 16 },
  searchBarFake: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.surface, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, ...SHADOWS.medium },
  searchFakePlaceholder: { flex: 1, fontSize: 14, color: COLORS.textMuted },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: -16, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, alignItems: 'center', ...SHADOWS.small },
  statIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  seeAll: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  catScroll: { marginHorizontal: -4 },
  catItem: { alignItems: 'center', marginHorizontal: 6, paddingBottom: 4 },
  catItemSelected: {},
  catIconBg: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  catLabel: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500', textAlign: 'center' },
  providerCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 18, padding: 14, marginBottom: 12, ...SHADOWS.small, alignItems: 'center' },
  cardAvatarWrap: { position: 'relative', marginRight: 14 },
  cardAvatar: { width: 58, height: 58, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: 24, fontWeight: '700', color: COLORS.textInverse },
  availableDot: { position: 'absolute', bottom: 2, right: 2, width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.success, borderWidth: 2, borderColor: COLORS.surface },
  cardInfo: { flex: 1 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  cardName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardProfession: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 4 },
  cardMetaText: { fontSize: 11, color: COLORS.textMuted },
  cardRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 13, fontWeight: '600', color: COLORS.text },
  reviewCount: { fontSize: 11, color: COLORS.textMuted },
  categoryTag: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  requestCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 16, padding: 14, marginBottom: 10, ...SHADOWS.small, alignItems: 'flex-start' },
  reqCatIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  reqInfo: { flex: 1 },
  reqTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  reqDesc: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 6, lineHeight: 18 },
  reqMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  reqMetaText: { fontSize: 11, color: COLORS.textMuted },
  reqMetaDot: { color: COLORS.textMuted, fontSize: 10 },
  emptyState: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 14, color: COLORS.textMuted, marginTop: 12 },
});

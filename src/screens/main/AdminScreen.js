import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Alert, TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useData } from '../../context/DataContext';
import { BULUNG_UR_MAHALLAHS } from '../../constants/mahallahs';

// ─── Oddiy rang bo'yicha belgili avatar ──────────────────────────────────────
function Avatar({ name, size = 42, color = COLORS.primary }) {
  return (
    <View style={[avStyles.wrap, { width: size, height: size, borderRadius: size / 2, backgroundColor: color + '25' }]}>
      <Text style={[avStyles.letter, { fontSize: size * 0.4, color }]}>
        {name?.charAt(0)?.toUpperCase() || '?'}
      </Text>
    </View>
  );
}
const avStyles = StyleSheet.create({
  wrap: { justifyContent: 'center', alignItems: 'center' },
  letter: { fontWeight: '800' },
});

// ─── Statistika kartasi ───────────────────────────────────────────────────────
function StatCard({ icon, label, value, color, bg }) {
  return (
    <View style={[s.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={[s.statIcon, { backgroundColor: bg }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <View>
        <Text style={s.statValue}>{value}</Text>
        <Text style={s.statLabel}>{label}</Text>
      </View>
    </View>
  );
}

// ─── Tab menyusi ──────────────────────────────────────────────────────────────
const TABS = [
  { key: 'stats',     label: 'Statistika', icon: 'stats-chart' },
  { key: 'users',     label: 'Foydalanuvchilar', icon: 'people' },
  { key: 'providers', label: 'Mutaxassislar', icon: 'briefcase' },
  { key: 'requests',  label: 'E\'lonlar', icon: 'document-text' },
];

const ROLE_COLORS = { admin: '#7C3AED', provider: '#2563EB', user: '#10B981' };
const ROLE_LABELS = { admin: 'Admin', provider: 'Mutaxassis', user: 'Foydalanuvchi' };

// ─── Asosiy komponent ─────────────────────────────────────────────────────────
export default function AdminScreen({ navigation }) {
  const {
    users, providers, requests,
    getAdminStats, deleteUser, blockUser, unblockUser,
    deleteProvider, updateProvider, deleteRequest,
  } = useData();

  const [activeTab, setActiveTab] = useState('stats');
  const [searchQ, setSearchQ]     = useState('');
  const [modalData, setModalData] = useState(null); // { type, item }

  const stats = getAdminStats();

  // ── Filterlash ───────────────────────────────────────────────────────────
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    u.phone.includes(searchQ) ||
    u.mahalla.toLowerCase().includes(searchQ.toLowerCase())
  );
  const filteredProviders = providers.filter(p =>
    p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.profession.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.mahalla.toLowerCase().includes(searchQ.toLowerCase())
  );
  const filteredRequests = requests.filter(r =>
    r.title.toLowerCase().includes(searchQ.toLowerCase()) ||
    r.userName.toLowerCase().includes(searchQ.toLowerCase()) ||
    r.mahalla.toLowerCase().includes(searchQ.toLowerCase())
  );

  // ── Amallar ───────────────────────────────────────────────────────────────
  const confirmDelete = (label, onConfirm) => {
    Alert.alert(
      "O'chirish",
      `${label} ni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.`,
      [
        { text: 'Bekor qilish', style: 'cancel' },
        { text: "O'chirish", style: 'destructive', onPress: onConfirm },
      ]
    );
  };

  const handleBlockToggle = (user) => {
    const action = user.active ? blockUser : unblockUser;
    const label  = user.active ? 'bloklanadi' : 'blokdan chiqariladi';
    Alert.alert(
      user.active ? 'Bloklash' : 'Blokdan chiqarish',
      `${user.name} ${label}. Davom etasizmi?`,
      [
        { text: 'Yo\'q', style: 'cancel' },
        { text: 'Ha', onPress: () => action(user.id) },
      ]
    );
  };

  const handleVerifyToggle = (provider) => {
    updateProvider(provider.id, { verified: !provider.verified });
    Alert.alert(
      'Bajarildi',
      provider.verified
        ? `${provider.name} tasdig'i olib tashlandi`
        : `${provider.name} tasdiqlandi ✓`
    );
  };

  // ─────────────────────────────── RENDER ──────────────────────────────────
  return (
    <View style={s.container}>
      {/* ── Header ── */}
      <LinearGradient colors={['#1E1B4B', '#2563EB']} style={s.header}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Ionicons name="shield-checkmark" size={20} color="#A5B4FC" />
            <Text style={s.headerTitle}>Admin Panel</Text>
          </View>
          <View style={s.adminBadge}>
            <Text style={s.adminBadgeText}>ADMIN</Text>
          </View>
        </View>

        {/* Qidiruv */}
        {activeTab !== 'stats' && (
          <View style={s.searchBar}>
            <Ionicons name="search" size={16} color={COLORS.textMuted} />
            <TextInput
              style={s.searchInput}
              placeholder="Qidirish..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQ}
              onChangeText={setSearchQ}
            />
            {searchQ.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQ('')}>
                <Ionicons name="close-circle" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Tab bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsScroll}>
          <View style={s.tabs}>
            {TABS.map(t => (
              <TouchableOpacity
                key={t.key}
                style={[s.tab, activeTab === t.key && s.tabActive]}
                onPress={() => { setActiveTab(t.key); setSearchQ(''); }}
              >
                <Ionicons
                  name={t.icon}
                  size={14}
                  color={activeTab === t.key ? COLORS.primary : 'rgba(255,255,255,0.7)'}
                />
                <Text style={[s.tabText, activeTab === t.key && s.tabTextActive]}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* ═══════════════ STATISTIKA ═══════════════ */}
      {activeTab === 'stats' && (
        <ScrollView style={s.body} showsVerticalScrollIndicator={false}>
          <Text style={s.sectionTitle}>📊 Umumiy statistika</Text>
          <View style={s.statsGrid}>
            <StatCard icon="people" label="Foydalanuvchilar"
              value={stats.totalUsers} color="#2563EB" bg="#DBEAFE" />
            <StatCard icon="briefcase" label="Mutaxassislar"
              value={stats.totalProviders} color="#10B981" bg="#D1FAE5" />
            <StatCard icon="document-text" label="E'lonlar"
              value={stats.totalRequests} color="#F59E0B" bg="#FEF3C7" />
            <StatCard icon="checkmark-circle" label="Faol foydalanuvchilar"
              value={stats.activeUsers} color="#059669" bg="#ECFDF5" />
            <StatCard icon="ribbon" label="Tasdiqlangan"
              value={stats.verifiedProviders} color="#7C3AED" bg="#EDE9FE" />
            <StatCard icon="location" label="Mahalla qamrovi"
              value={`${stats.mahallaCoverage}/${BULUNG_UR_MAHALLAHS.length}`}
              color="#EC4899" bg="#FCE7F3" />
          </View>

          {/* Mahallalar bo'yicha taqsimot */}
          <Text style={[s.sectionTitle, { marginTop: 24 }]}>📍 Mahallalar bo'yicha</Text>
          <View style={s.mahallaList}>
            {BULUNG_UR_MAHALLAHS.map(m => {
              const cnt = providers.filter(p => p.mahalla === m).length;
              return (
                <View key={m} style={s.mahallaRow}>
                  <View style={s.mahallaDot} />
                  <Text style={s.mahallaName} numberOfLines={1}>{m}</Text>
                  <View style={[s.mahallaBar, { flex: Math.max(cnt, 0.05) }]}>
                    <View style={[s.mahallaBarFill, { width: cnt > 0 ? `${Math.min(cnt * 30, 100)}%` : '5%' }]} />
                  </View>
                  <Text style={s.mahallaCnt}>{cnt}</Text>
                </View>
              );
            })}
          </View>

          {/* Oxirgi ro'yxatdan o'tganlar */}
          <Text style={[s.sectionTitle, { marginTop: 24 }]}>🆕 Oxirgi 5 ta ro'yxatdan o'tgan</Text>
          <View style={s.recentList}>
            {[...users]
              .sort((a, b) => new Date(b.registeredAt) - new Date(a.registeredAt))
              .slice(0, 5)
              .map(u => (
                <View key={u.id} style={s.recentRow}>
                  <Avatar name={u.name} size={38} color={ROLE_COLORS[u.role] || COLORS.primary} />
                  <View style={s.recentInfo}>
                    <Text style={s.recentName}>{u.name}</Text>
                    <Text style={s.recentSub}>{u.mahalla} • {new Date(u.registeredAt).toLocaleDateString('uz')}</Text>
                  </View>
                  <View style={[s.rolePill, { backgroundColor: (ROLE_COLORS[u.role] || COLORS.primary) + '20' }]}>
                    <Text style={[s.roleText, { color: ROLE_COLORS[u.role] || COLORS.primary }]}>
                      {ROLE_LABELS[u.role] || u.role}
                    </Text>
                  </View>
                </View>
              ))}
          </View>
          <View style={{ height: 32 }} />
        </ScrollView>
      )}

      {/* ═══════════════ FOYDALANUVCHILAR ═══════════════ */}
      {activeTab === 'users' && (
        <FlatList
          data={filteredUsers}
          keyExtractor={i => i.id}
          contentContainerStyle={s.listContent}
          ListHeaderComponent={
            <View style={s.listHeader}>
              <Text style={s.listCount}>{filteredUsers.length} ta foydalanuvchi</Text>
            </View>
          }
          renderItem={({ item: u }) => (
            <View style={[s.card, !u.active && s.cardBlocked]}>
              <View style={s.cardTop}>
                <Avatar name={u.name} size={46} color={ROLE_COLORS[u.role] || COLORS.primary} />
                <View style={s.cardInfo}>
                  <View style={s.nameRow}>
                    <Text style={s.cardName}>{u.name}</Text>
                    {!u.active && (
                      <View style={s.blockedBadge}>
                        <Text style={s.blockedText}>Bloklangan</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.cardSub}>{u.phone}</Text>
                  <View style={s.metaRow}>
                    <Ionicons name="location-outline" size={11} color={COLORS.textMuted} />
                    <Text style={s.metaText}>{u.mahalla}</Text>
                    <Text style={s.dot}>•</Text>
                    <Text style={s.metaText}>{u.profession}</Text>
                  </View>
                </View>
                <View style={[s.rolePill, { backgroundColor: (ROLE_COLORS[u.role] || COLORS.primary) + '18' }]}>
                  <Text style={[s.roleText, { color: ROLE_COLORS[u.role] || COLORS.primary }]}>
                    {ROLE_LABELS[u.role] || u.role}
                  </Text>
                </View>
              </View>
              <Text style={s.regDate}>
                Ro'yxatdan o'tgan: {new Date(u.registeredAt).toLocaleDateString('uz-UZ', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </Text>
              <View style={s.cardActions}>
                <TouchableOpacity
                  style={[s.actionBtn, u.active ? s.actionBlock : s.actionUnblock]}
                  onPress={() => handleBlockToggle(u)}
                >
                  <Ionicons name={u.active ? 'ban' : 'checkmark-circle'} size={14}
                    color={u.active ? '#EF4444' : '#10B981'} />
                  <Text style={[s.actionText, { color: u.active ? '#EF4444' : '#10B981' }]}>
                    {u.active ? 'Bloklash' : 'Blokdan chiqarish'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.actionBtn, s.actionDelete]}
                  onPress={() => confirmDelete(u.name, () => deleteUser(u.id))}
                >
                  <Ionicons name="trash" size={14} color="#EF4444" />
                  <Text style={[s.actionText, { color: '#EF4444' }]}>O'chirish</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<EmptyState icon="people-outline" text="Foydalanuvchi topilmadi" />}
        />
      )}

      {/* ═══════════════ MUTAXASSISLAR ═══════════════ */}
      {activeTab === 'providers' && (
        <FlatList
          data={filteredProviders}
          keyExtractor={i => i.id}
          contentContainerStyle={s.listContent}
          ListHeaderComponent={
            <View style={s.listHeader}>
              <Text style={s.listCount}>{filteredProviders.length} ta mutaxassis</Text>
            </View>
          }
          renderItem={({ item: p }) => (
            <View style={s.card}>
              <View style={s.cardTop}>
                <Avatar name={p.name} size={46} color={COLORS.secondary} />
                <View style={s.cardInfo}>
                  <View style={s.nameRow}>
                    <Text style={s.cardName}>{p.name}</Text>
                    {p.verified && (
                      <Ionicons name="checkmark-circle" size={15} color={COLORS.primary} />
                    )}
                  </View>
                  <Text style={s.cardSub}>{p.profession}</Text>
                  <View style={s.metaRow}>
                    <Ionicons name="location-outline" size={11} color={COLORS.textMuted} />
                    <Text style={s.metaText}>{p.mahalla}</Text>
                    <Text style={s.dot}>•</Text>
                    <Ionicons name="star" size={11} color={COLORS.star} />
                    <Text style={s.metaText}>{p.rating > 0 ? p.rating.toFixed(1) : 'Yangi'}</Text>
                  </View>
                </View>
                <View style={[s.availPill, { backgroundColor: p.available ? '#D1FAE5' : '#F1F5F9' }]}>
                  <View style={[s.availDot, { backgroundColor: p.available ? '#10B981' : '#94A3B8' }]} />
                  <Text style={[s.availText, { color: p.available ? '#059669' : '#64748B' }]}>
                    {p.available ? 'Faol' : 'Band'}
                  </Text>
                </View>
              </View>
              <View style={s.cardActions}>
                <TouchableOpacity
                  style={[s.actionBtn, p.verified ? s.actionBlock : s.actionUnblock]}
                  onPress={() => handleVerifyToggle(p)}
                >
                  <Ionicons name={p.verified ? 'close-circle' : 'checkmark-circle'} size={14}
                    color={p.verified ? '#F59E0B' : '#10B981'} />
                  <Text style={[s.actionText, { color: p.verified ? '#F59E0B' : '#10B981' }]}>
                    {p.verified ? 'Tasdig\'ni olish' : 'Tasdiqlash'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.actionBtn, s.actionToggle]}
                  onPress={() => updateProvider(p.id, { available: !p.available })}
                >
                  <Ionicons name="swap-horizontal" size={14} color={COLORS.primary} />
                  <Text style={[s.actionText, { color: COLORS.primary }]}>
                    {p.available ? 'Band qilish' : 'Bandlikni ochish'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.actionBtn, s.actionDelete]}
                  onPress={() => confirmDelete(p.name, () => deleteProvider(p.id))}
                >
                  <Ionicons name="trash" size={14} color="#EF4444" />
                  <Text style={[s.actionText, { color: '#EF4444' }]}>O'chirish</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<EmptyState icon="briefcase-outline" text="Mutaxassis topilmadi" />}
        />
      )}

      {/* ═══════════════ E'LONLAR ═══════════════ */}
      {activeTab === 'requests' && (
        <FlatList
          data={filteredRequests}
          keyExtractor={i => i.id}
          contentContainerStyle={s.listContent}
          ListHeaderComponent={
            <View style={s.listHeader}>
              <Text style={s.listCount}>{filteredRequests.length} ta e'lon</Text>
            </View>
          }
          renderItem={({ item: r }) => (
            <View style={s.card}>
              <View style={s.reqTop}>
                <View style={s.reqIcon}>
                  <Ionicons name="document-text" size={20} color={COLORS.primary} />
                </View>
                <View style={s.cardInfo}>
                  <Text style={s.cardName}>{r.title}</Text>
                  <Text style={s.reqUser}>{r.userName}</Text>
                  <View style={s.metaRow}>
                    <Ionicons name="location-outline" size={11} color={COLORS.textMuted} />
                    <Text style={s.metaText}>{r.mahalla}</Text>
                    <Text style={s.dot}>•</Text>
                    <Text style={s.metaText}>{r.category}</Text>
                  </View>
                </View>
                <View style={[s.activePill, { backgroundColor: r.active ? '#D1FAE5' : '#FEE2E2' }]}>
                  <Text style={[s.activeText, { color: r.active ? '#059669' : '#EF4444' }]}>
                    {r.active ? 'Faol' : 'Yopiq'}
                  </Text>
                </View>
              </View>
              {r.description ? (
                <Text style={s.reqDesc} numberOfLines={2}>{r.description}</Text>
              ) : null}
              <Text style={s.regDate}>
                {new Date(r.createdAt).toLocaleDateString('uz-UZ', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}
              </Text>
              <View style={s.cardActions}>
                <TouchableOpacity
                  style={[s.actionBtn, s.actionDelete]}
                  onPress={() => confirmDelete(`"${r.title}"`, () => deleteRequest(r.id))}
                >
                  <Ionicons name="trash" size={14} color="#EF4444" />
                  <Text style={[s.actionText, { color: '#EF4444' }]}>O'chirish</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<EmptyState icon="document-outline" text="E'lon topilmadi" />}
        />
      )}
    </View>
  );
}

function EmptyState({ icon, text }) {
  return (
    <View style={s.emptyState}>
      <Ionicons name={icon} size={60} color={COLORS.textMuted} />
      <Text style={s.emptyText}>{text}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { paddingTop: 52, paddingBottom: 0, paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center' },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  adminBadge: { backgroundColor: '#7C3AED', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  adminBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 1 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 9, marginBottom: 12,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },

  tabsScroll: { flexGrow: 0, marginBottom: 0 },
  tabs: { flexDirection: 'row', gap: 4, paddingBottom: 12 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)' },
  tabActive: { backgroundColor: '#fff' },
  tabText: { fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },

  // Body
  body: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 12 },

  // Stats
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: '47%', flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.surface, borderRadius: 14, padding: 14,
    ...SHADOWS.small,
  },
  statIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 1 },

  // Mahalla bars
  mahallaList: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 14, ...SHADOWS.small },
  mahallaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  mahallaDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary },
  mahallaName: { fontSize: 12, color: COLORS.textSecondary, width: 100 },
  mahallaBar: { height: 8, backgroundColor: COLORS.surfaceElevated, borderRadius: 4, overflow: 'hidden' },
  mahallaBarFill: { height: '100%', backgroundColor: COLORS.primary + 'AA', borderRadius: 4 },
  mahallaCnt: { fontSize: 12, fontWeight: '700', color: COLORS.text, width: 16, textAlign: 'right' },

  // Recent
  recentList: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 14, ...SHADOWS.small },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  recentInfo: { flex: 1 },
  recentName: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  recentSub: { fontSize: 12, color: COLORS.textMuted },

  // List
  listContent: { padding: 16, paddingBottom: 32 },
  listHeader: { marginBottom: 8 },
  listCount: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '600' },

  // Card
  card: { backgroundColor: COLORS.surface, borderRadius: 18, padding: 16, marginBottom: 12, ...SHADOWS.small },
  cardBlocked: { opacity: 0.65, borderWidth: 1, borderColor: '#FCA5A5' },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  cardInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  cardName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  cardSub: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 3 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  dot: { color: COLORS.textMuted, fontSize: 10 },
  regDate: { fontSize: 11, color: COLORS.textMuted, marginBottom: 10 },

  blockedBadge: { backgroundColor: '#FEE2E2', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  blockedText: { fontSize: 10, color: '#EF4444', fontWeight: '700' },

  rolePill: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10 },
  roleText: { fontSize: 11, fontWeight: '700' },

  availPill: { flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  availDot: { width: 6, height: 6, borderRadius: 3 },
  availText: { fontSize: 11, fontWeight: '600' },

  activePill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  activeText: { fontSize: 11, fontWeight: '700' },

  // Actions
  cardActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  actionBlock:   { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
  actionUnblock: { borderColor: '#6EE7B7', backgroundColor: '#ECFDF5' },
  actionDelete:  { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
  actionToggle:  { borderColor: '#BFDBFE', backgroundColor: '#EFF6FF' },
  actionText: { fontSize: 12, fontWeight: '600' },

  // Request specific
  reqTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  reqIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#EFF6FF',
    justifyContent: 'center', alignItems: 'center' },
  reqUser: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 3 },
  reqDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18, marginBottom: 8 },

  // Empty
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: COLORS.textMuted, marginTop: 12, fontWeight: '500' },
});

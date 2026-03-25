import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator, Image, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
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

const MAHALLAHS = [
  'Yunusobod', 'Chilonzor', 'Mirzo Ulug\'bek', 'Yakkasaroy',
  'Shayxontohur', 'Olmazor', 'Sirg\'ali', 'Uchtepa', 'Bektemir',
];

export default function PostScreen({ navigation }) {
  const { userProfile } = useAuth();
  const { addRequest, requests, addPortfolioItem, getUserPortfolio, removePortfolioItem } = useData();

  const [tab, setTab] = useState('new');

  // E'lon form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMahalla, setSelectedMahalla] = useState(userProfile?.mahalla || '');
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Portfolio state
  const [portfolioCaption, setPortfolioCaption] = useState('');
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  const userRequests = requests.filter(r => r.userId === userProfile?.id);
  const myPortfolio = getUserPortfolio(userProfile?.id || '');

  // Ruxsat so'rash
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ruxsat kerak', 'Galereya uchun ruxsat bering');
      return false;
    }
    return true;
  };

  // Cover rasm yuklash
  const pickCoverImage = async () => {
    const ok = await requestPermission();
    if (!ok) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.75,
    });
    if (!result.canceled) {
      setCoverImage(result.assets[0].uri);
    }
  };

  // Portfolio rasm yoki video yuklash
  const pickPortfolioMedia = async () => {
    const ok = await requestPermission();
    if (!ok) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const isVideo = asset.type === 'video' || asset.uri.endsWith('.mp4') || asset.uri.endsWith('.mov');
      setUploadingPortfolio(true);
      try {
        await addPortfolioItem(userProfile?.id, {
          uri: asset.uri,
          type: isVideo ? 'video' : 'image',
          caption: portfolioCaption.trim(),
          duration: asset.duration || null,
          width: asset.width,
          height: asset.height,
        });
        setPortfolioCaption('');
        Alert.alert('✅ Qo\'shildi', 'Portfolio ga muvaffaqiyatli qo\'shildi!');
      } catch (e) {
        Alert.alert('Xato', 'Qo\'shishda xato yuz berdi');
      } finally {
        setUploadingPortfolio(false);
      }
    }
  };

  // Kamera bilan olish
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Ruxsat kerak', 'Kamera uchun ruxsat bering');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setUploadingPortfolio(true);
      try {
        await addPortfolioItem(userProfile?.id, {
          uri: asset.uri,
          type: 'image',
          caption: portfolioCaption.trim(),
          width: asset.width,
          height: asset.height,
        });
        setPortfolioCaption('');
        Alert.alert('✅ Qo\'shildi', 'Portfolio ga muvaffaqiyatli qo\'shildi!');
      } catch (e) {
        Alert.alert('Xato', 'Qo\'shishda xato yuz berdi');
      } finally {
        setUploadingPortfolio(false);
      }
    }
  };

  // Media olish usulini tanlash
  const showMediaPicker = () => {
    Alert.alert(
      'Media qo\'shish',
      'Qanday qo\'shasiz?',
      [
        { text: 'Galereya (Rasm/Video)', onPress: pickPortfolioMedia },
        { text: 'Kamera bilan olish', onPress: takePhoto },
        { text: 'Bekor qilish', style: 'cancel' },
      ]
    );
  };

  // Portfolio elementni o'chirish
  const deletePortfolioItem = (itemId) => {
    Alert.alert('O\'chirish', 'Bu media ni o\'chirmoqchimisiz?', [
      { text: 'Yo\'q', style: 'cancel' },
      {
        text: 'Ha, o\'chirish', style: 'destructive',
        onPress: () => removePortfolioItem(userProfile?.id, itemId),
      },
    ]);
  };

  // E'lon joylash
  const handlePost = async () => {
    if (!title.trim()) { Alert.alert('Xato', 'Sarlavha kiriting'); return; }
    if (!selectedCategory) { Alert.alert('Xato', 'Kategoriya tanlang'); return; }
    if (!selectedMahalla) { Alert.alert('Xato', 'Mahalla tanlang'); return; }

    setLoading(true);
    try {
      await addRequest({
        userId: userProfile?.id,
        userName: userProfile?.name,
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        mahalla: selectedMahalla,
        coverImage: coverImage,
      });
      Alert.alert('Muvaffaqiyat!', 'E\'loningiz joylashtirildi', [
        {
          text: 'OK', onPress: () => {
            setTitle(''); setDescription(''); setSelectedCategory('');
            setCoverImage(null); setTab('mine');
          }
        }
      ]);
    } catch (e) {
      Alert.alert('Xato', 'E\'lon joylashtirishda xato yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={COLORS.gradient.hero} style={styles.header}>
        <Text style={styles.headerTitle}>E'lonlar</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
          <View style={styles.tabs}>
            {[
              { key: 'new', label: 'Yangi e\'lon', icon: 'add-circle-outline' },
              { key: 'portfolio', label: 'Portfolio', icon: 'images-outline' },
              { key: 'mine', label: 'E\'lonlarim', icon: 'person-outline' },
              { key: 'all', label: 'Barchasi', icon: 'list-outline' },
            ].map(t => (
              <TouchableOpacity
                key={t.key}
                style={[styles.tab, tab === t.key && styles.tabActive]}
                onPress={() => setTab(t.key)}
              >
                <Ionicons name={t.icon} size={14} color={tab === t.key ? COLORS.primary : 'rgba(255,255,255,0.75)'} />
                <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* ===== YANGI E'LON TAB ===== */}
      {tab === 'new' && (
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="megaphone-outline" size={24} color={COLORS.primary} />
              <Text style={styles.cardTitle}>Yangi e'lon yarating</Text>
            </View>
            <Text style={styles.cardSubtitle}>
              Mahallangizda kerakli mutaxassisni topishda e'lon qiling
            </Text>

            {/* COVER RASM */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>🖼️ Asosiy rasm (ixtiyoriy)</Text>
              <TouchableOpacity style={styles.coverPickerBtn} onPress={pickCoverImage} activeOpacity={0.8}>
                {coverImage ? (
                  <View style={styles.coverPreviewWrap}>
                    <Image source={{ uri: coverImage }} style={styles.coverPreview} />
                    <TouchableOpacity style={styles.coverRemoveBtn} onPress={() => setCoverImage(null)}>
                      <Ionicons name="close-circle" size={26} color={COLORS.error} />
                    </TouchableOpacity>
                    <View style={styles.coverEditBadge}>
                      <Ionicons name="camera" size={14} color={COLORS.textInverse} />
                      <Text style={styles.coverEditText}>O'zgartirish</Text>
                    </View>
                  </View>
                ) : (
                  <LinearGradient
                    colors={['#EFF6FF', '#DBEAFE']}
                    style={styles.coverPlaceholder}
                  >
                    <View style={styles.coverPlaceholderIcon}>
                      <Ionicons name="image-outline" size={32} color={COLORS.primary} />
                    </View>
                    <Text style={styles.coverPlaceholderTitle}>Rasm qo'shish</Text>
                    <Text style={styles.coverPlaceholderSub}>E'loningizga asosiy rasm tanlang</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>

            {/* SARLAVHA */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E'lon sarlavhasi *</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="Masalan: Elektrik kerak, Matematika o'qituvchisi..."
                  placeholderTextColor={COLORS.textMuted}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={80}
                />
              </View>
              <Text style={styles.charCount}>{title.length}/80</Text>
            </View>

            {/* TAVSIF */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tavsif</Text>
              <View style={[styles.inputWrap, { minHeight: 100 }]}>
                <TextInput
                  style={[styles.input, { minHeight: 80 }]}
                  placeholder="Qo'shimcha ma'lumot kiriting..."
                  placeholderTextColor={COLORS.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                  maxLength={500}
                />
              </View>
            </View>

            {/* KATEGORIYA */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kategoriya *</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catChip, selectedCategory === cat.id && { backgroundColor: cat.color, borderColor: cat.color }]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Ionicons name={cat.icon} size={14} color={selectedCategory === cat.id ? COLORS.textInverse : cat.color} />
                    <Text style={[styles.catText, selectedCategory === cat.id && { color: COLORS.textInverse }]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* MAHALLA */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mahalla *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {MAHALLAHS.map(m => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.mahallaChip, selectedMahalla === m && styles.mahallaChipActive]}
                    onPress={() => setSelectedMahalla(m)}
                  >
                    <Text style={[styles.mahallaText, selectedMahalla === m && styles.mahallaTextActive]}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TouchableOpacity style={styles.postBtn} onPress={handlePost} disabled={loading}>
              <LinearGradient colors={COLORS.gradient.primary} style={styles.postBtnGrad}>
                {loading ? (
                  <ActivityIndicator color={COLORS.textInverse} />
                ) : (
                  <>
                    <Ionicons name="megaphone" size={20} color={COLORS.textInverse} />
                    <Text style={styles.postBtnText}>E'lonlash</Text>
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {/* ===== PORTFOLIO TAB ===== */}
      {tab === 'portfolio' && (
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="images-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.cardTitle}>Portfolio — Ish namunalari</Text>
            </View>
            <Text style={styles.cardSubtitle}>
              Bajargan ishlaringizdan rasm yoki video roliklar qo'shing. Ular profilingizda saqlanadi.
            </Text>

            {/* Izoh maydoni */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>📝 Izoh (ixtiyoriy)</Text>
              <View style={styles.inputWrap}>
                <TextInput
                  style={styles.input}
                  placeholder="Bu ish haqida qisqacha yozing..."
                  placeholderTextColor={COLORS.textMuted}
                  value={portfolioCaption}
                  onChangeText={setPortfolioCaption}
                  maxLength={150}
                />
              </View>
            </View>

            {/* Media yuklash tugmalari */}
            <View style={styles.mediaBtnsRow}>
              <TouchableOpacity
                style={[styles.mediaBtn, { backgroundColor: '#EFF6FF', borderColor: COLORS.primary }]}
                onPress={pickPortfolioMedia}
                disabled={uploadingPortfolio}
              >
                <Ionicons name="image-outline" size={24} color={COLORS.primary} />
                <Text style={[styles.mediaBtnText, { color: COLORS.primary }]}>Galereya</Text>
                <Text style={styles.mediaBtnSub}>Rasm/Video</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mediaBtn, { backgroundColor: '#F0FDF4', borderColor: COLORS.secondary }]}
                onPress={takePhoto}
                disabled={uploadingPortfolio}
              >
                <Ionicons name="camera-outline" size={24} color={COLORS.secondary} />
                <Text style={[styles.mediaBtnText, { color: COLORS.secondary }]}>Kamera</Text>
                <Text style={styles.mediaBtnSub}>Hozir olish</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.mediaBtn, { backgroundColor: '#FFF7ED', borderColor: '#F97316' }]}
                onPress={showMediaPicker}
                disabled={uploadingPortfolio}
              >
                <Ionicons name="add-circle-outline" size={24} color="#F97316" />
                <Text style={[styles.mediaBtnText, { color: '#F97316' }]}>Tanlash</Text>
                <Text style={styles.mediaBtnSub}>Tur tanlash</Text>
              </TouchableOpacity>
            </View>

            {uploadingPortfolio && (
              <View style={styles.uploadingBanner}>
                <ActivityIndicator color={COLORS.primary} size="small" />
                <Text style={styles.uploadingText}>Yuklanmoqda...</Text>
              </View>
            )}
          </View>

          {/* Portfolio Grid */}
          {myPortfolio.length > 0 ? (
            <View style={styles.portfolioSection}>
              <View style={styles.portfolioHeader}>
                <Ionicons name="albums-outline" size={20} color={COLORS.text} />
                <Text style={styles.portfolioHeaderTitle}>Saqlangan medialar ({myPortfolio.length})</Text>
              </View>
              <View style={styles.portfolioGrid}>
                {myPortfolio.map((item) => (
                  <View key={item.id} style={styles.portfolioItem}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.portfolioThumb}
                      resizeMode="cover"
                    />
                    {item.type === 'video' && (
                      <View style={styles.videoOverlay}>
                        <Ionicons name="play-circle" size={32} color="rgba(255,255,255,0.9)" />
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.portfolioDeleteBtn}
                      onPress={() => deletePortfolioItem(item.id)}
                    >
                      <Ionicons name="trash" size={14} color={COLORS.textInverse} />
                    </TouchableOpacity>
                    {item.caption ? (
                      <View style={styles.portfolioCaptionBar}>
                        <Text style={styles.portfolioCaptionText} numberOfLines={1}>{item.caption}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyPortfolio}>
              <LinearGradient colors={['#EFF6FF', '#DBEAFE']} style={styles.emptyPortfolioIcon}>
                <Ionicons name="images-outline" size={44} color={COLORS.primary} />
              </LinearGradient>
              <Text style={styles.emptyPortfolioTitle}>Portfolio bo'sh</Text>
              <Text style={styles.emptyPortfolioSub}>
                Bajargan ishlaringizdan rasm yoki video qo'shing.{'\n'}Ular profilingizda ko'rinadi.
              </Text>
            </View>
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {/* ===== MENING / BARCHA E'LONLAR ===== */}
      {(tab === 'mine' || tab === 'all') && (
        <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
          {(tab === 'mine' ? userRequests : requests).length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={60} color={COLORS.textMuted} />
              <Text style={styles.emptyTitle}>
                {tab === 'mine' ? 'Hali e\'lon yo\'q' : 'E\'lonlar topilmadi'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {tab === 'mine' ? 'Yangi e\'lon qo\'shing' : ''}
              </Text>
              {tab === 'mine' && (
                <TouchableOpacity style={styles.addFirstBtn} onPress={() => setTab('new')}>
                  <Text style={styles.addFirstText}>E'lon qo'shish</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            (tab === 'mine' ? userRequests : requests).map(req => {
              const cat = CATEGORIES.find(c => c.id === req.category);
              return (
                <View key={req.id} style={styles.reqCard}>
                  {req.coverImage && (
                    <Image source={{ uri: req.coverImage }} style={styles.reqCoverImage} />
                  )}
                  <View style={styles.reqBody}>
                    <View style={styles.reqCatIcon2} backgroundColor={(cat?.color || COLORS.primary) + '20'}>
                      <View style={[styles.reqCatIcon, { backgroundColor: (cat?.color || COLORS.primary) + '20' }]}>
                        <Ionicons name={cat?.icon || 'help'} size={22} color={cat?.color || COLORS.primary} />
                      </View>
                    </View>
                    <View style={styles.reqContent}>
                      <Text style={styles.reqTitle}>{req.title}</Text>
                      {req.description ? <Text style={styles.reqDesc} numberOfLines={2}>{req.description}</Text> : null}
                      <View style={styles.reqMeta}>
                        <Ionicons name="location-outline" size={12} color={COLORS.textMuted} />
                        <Text style={styles.reqMetaText}>{req.mahalla}</Text>
                        <Text style={styles.dot}>•</Text>
                        <Text style={styles.reqMetaText}>{req.userName}</Text>
                      </View>
                      <View style={[styles.catBadge, { backgroundColor: (cat?.color || COLORS.primary) + '15' }]}>
                        <Text style={[styles.catBadgeText, { color: cat?.color || COLORS.primary }]}>{cat?.label}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse, marginBottom: 14 },
  tabsScroll: { flexGrow: 0 },
  tabs: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 14, padding: 3, gap: 2 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 11 },
  tabActive: { backgroundColor: COLORS.surface },
  tabText: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: '500' },
  tabTextActive: { color: COLORS.primary, fontWeight: '700' },

  form: { flex: 1 },
  card: { backgroundColor: COLORS.surface, borderRadius: 20, margin: 16, padding: 20, ...SHADOWS.medium },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  cardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20, lineHeight: 20 },

  // Cover image
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  coverPickerBtn: { borderRadius: 16, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.border, borderStyle: 'dashed' },
  coverPreviewWrap: { position: 'relative' },
  coverPreview: { width: '100%', height: 180, borderRadius: 14 },
  coverRemoveBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 13 },
  coverEditBadge: {
    position: 'absolute', bottom: 10, left: 10,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  coverEditText: { fontSize: 12, color: COLORS.textInverse, fontWeight: '600' },
  coverPlaceholder: { height: 140, borderRadius: 14, justifyContent: 'center', alignItems: 'center', gap: 6 },
  coverPlaceholderIcon: { width: 60, height: 60, borderRadius: 18, backgroundColor: 'rgba(37,99,235,0.12)', justifyContent: 'center', alignItems: 'center' },
  coverPlaceholderTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  coverPlaceholderSub: { fontSize: 12, color: COLORS.textMuted },

  inputWrap: { backgroundColor: COLORS.surfaceElevated, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border },
  input: { fontSize: 14, color: COLORS.text },
  charCount: { fontSize: 11, color: COLORS.textMuted, textAlign: 'right', marginTop: 4 },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border },
  catText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  mahallaChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  mahallaChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  mahallaText: { fontSize: 13, color: COLORS.textSecondary },
  mahallaTextActive: { color: COLORS.textInverse, fontWeight: '600' },

  postBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8, ...SHADOWS.colored },
  postBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  postBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.textInverse },

  // Portfolio tab
  mediaBtnsRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  mediaBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16,
    borderWidth: 1.5, gap: 4,
  },
  mediaBtnText: { fontSize: 13, fontWeight: '700' },
  mediaBtnSub: { fontSize: 10, color: COLORS.textMuted },

  uploadingBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#EFF6FF', borderRadius: 12, padding: 12, marginTop: 4,
  },
  uploadingText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },

  portfolioSection: { marginHorizontal: 16, marginTop: 4 },
  portfolioHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  portfolioHeaderTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  portfolioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  portfolioItem: {
    width: '48%', aspectRatio: 1, borderRadius: 14, overflow: 'hidden',
    ...SHADOWS.small, position: 'relative',
  },
  portfolioThumb: { width: '100%', height: '100%' },
  videoOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center',
  },
  portfolioDeleteBtn: {
    position: 'absolute', top: 6, right: 6,
    backgroundColor: 'rgba(239,68,68,0.85)', borderRadius: 10,
    width: 24, height: 24, justifyContent: 'center', alignItems: 'center',
  },
  portfolioCaptionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 5,
  },
  portfolioCaptionText: { fontSize: 11, color: COLORS.textInverse },

  emptyPortfolio: { alignItems: 'center', paddingTop: 30, paddingBottom: 20, marginHorizontal: 16 },
  emptyPortfolioIcon: { width: 90, height: 90, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  emptyPortfolioTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  emptyPortfolioSub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 21 },

  // Requests list
  listContainer: { flex: 1, padding: 16 },
  emptyState: { alignItems: 'center', paddingTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },
  addFirstBtn: { marginTop: 20, backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 14 },
  addFirstText: { color: COLORS.textInverse, fontWeight: '700' },

  reqCard: { backgroundColor: COLORS.surface, borderRadius: 18, marginBottom: 12, ...SHADOWS.small, overflow: 'hidden' },
  reqCoverImage: { width: '100%', height: 140 },
  reqBody: { flexDirection: 'row', padding: 14 },
  reqCatIcon2: {},
  reqCatIcon: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  reqContent: { flex: 1 },
  reqTitle: { fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  reqDesc: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 6, lineHeight: 18 },
  reqMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  reqMetaText: { fontSize: 11, color: COLORS.textMuted },
  dot: { color: COLORS.textMuted },
  catBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  catBadgeText: { fontSize: 11, fontWeight: '600' },
});

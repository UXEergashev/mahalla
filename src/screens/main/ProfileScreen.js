import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, Image, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';


const CATEGORIES = [
  { id: 'repair', label: 'Ta\'mirlash', icon: 'construct' },
  { id: 'education', label: 'Ta\'lim', icon: 'school' },
  { id: 'it', label: 'IT', icon: 'laptop' },
  { id: 'beauty', label: 'Go\'zallik', icon: 'cut' },
  { id: 'home', label: 'Uy', icon: 'home' },
  { id: 'transport', label: 'Transport', icon: 'car' },
  { id: 'food', label: 'Ovqat', icon: 'restaurant' },
  { id: 'health', label: 'Sog\'liq', icon: 'medical' },
];

const MAHALLAHS = [
  'Yunusobod', 'Chilonzor', 'Mirzo Ulug\'bek', 'Yakkasaroy',
  'Shayxontohur', 'Olmazor', 'Sirg\'ali', 'Uchtepa', 'Bektemir',
];

function StatCard({ icon, value, label, color }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color }]}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen({ navigation }) {
  const { userProfile, updateProfile, logout } = useAuth();
  const { providers, requests, getProviderReviews, getUserPortfolio, removePortfolioItem } = useData();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [profession, setProfession] = useState(userProfile?.profession || '');
  const [description, setDescription] = useState(userProfile?.description || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [age, setAge] = useState(userProfile?.age || '');
  const [selectedCategory, setSelectedCategory] = useState(userProfile?.category || '');
  const [selectedMahalla, setSelectedMahalla] = useState(userProfile?.mahalla || '');
  const [avatar, setAvatar] = useState(userProfile?.avatar || null);
  const [saving, setSaving] = useState(false);

  const myProvider = providers.find(p => p.id === userProfile?.id);
  const myReviews = myProvider ? getProviderReviews(myProvider.id) : [];
  const myRequests = requests.filter(r => r.userId === userProfile?.id);
  const myPortfolio = getUserPortfolio(userProfile?.id || '');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Ruxsat kerak', 'Rasm tanlash uchun ruxsat bering'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, profession, description, phone, age, category: selectedCategory, mahalla: selectedMahalla, avatar });
      setEditing(false);
      Alert.alert('Muvaffaqiyat', 'Profil yangilandi');
    } catch (e) {
      Alert.alert('Xato', 'Profilni yangilashda xato');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Chiqish', 'Tizimdan chiqmoqchimisiz?', [
      { text: 'Bekor qilish', style: 'cancel' },
      { text: 'Ha, chiqish', style: 'destructive', onPress: logout },
    ]);
  };

  const categoryColor = COLORS.categories[userProfile?.category] || COLORS.primary;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[categoryColor + 'CC', categoryColor, COLORS.primaryDark]} style={styles.header}>
          <View style={styles.headerActions}>
            <Text style={styles.headerTitle}>Profil</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {editing ? (
                <>
                  <TouchableOpacity style={styles.iconBtn} onPress={() => setEditing(false)}>
                    <Ionicons name="close" size={22} color={COLORS.textInverse} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.iconBtn, { backgroundColor: COLORS.secondary }]} onPress={handleSave} disabled={saving}>
                    {saving ? <ActivityIndicator size="small" color={COLORS.textInverse} /> : <Ionicons name="checkmark" size={22} color={COLORS.textInverse} />}
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.iconBtn} onPress={() => setEditing(true)}>
                  <Ionicons name="create-outline" size={22} color={COLORS.textInverse} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <TouchableOpacity onPress={editing ? pickImage : null} style={styles.avatarWrap}>
              {(avatar || userProfile?.avatar) ? (
                <Image source={{ uri: avatar || userProfile.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarInitial}>{userProfile?.name?.charAt(0) || 'U'}</Text>
                </View>
              )}
              {editing && (
                <View style={styles.avatarEdit}>
                  <Ionicons name="camera" size={16} color={COLORS.textInverse} />
                </View>
              )}
            </TouchableOpacity>
            {!editing ? (
              <>
                <Text style={styles.profileName}>{userProfile?.name}</Text>
                <Text style={styles.profileProfession}>{userProfile?.profession || 'Kasb ko\'rsatilmagan'}</Text>
                <View style={styles.profileMeta}>
                  {userProfile?.verified && (
                    <View style={styles.verifiedBadge}>
                      <Ionicons name="checkmark-circle" size={14} color={COLORS.textInverse} />
                      <Text style={styles.verifiedText}>Tasdiqlangan</Text>
                    </View>
                  )}
                  <View style={styles.locationBadge}>
                    <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.locationText}>{userProfile?.mahalla || 'Mahalla ko\'rsatilmagan'}</Text>
                  </View>
                </View>
              </>
            ) : null}
          </View>
        </LinearGradient>

        {/* Stats */}
        {!editing && (
          <View style={styles.statsRow}>
            <StatCard icon="star" value={myProvider?.rating > 0 ? myProvider.rating.toFixed(1) : '0'} label="Reyting" color={COLORS.star} />
            <StatCard icon="chatbubbles" value={myReviews.length} label="Sharhlar" color={COLORS.primary} />
            <StatCard icon="document-text" value={myRequests.length} label="E'lonlar" color={COLORS.secondary} />
          </View>
        )}

        {editing ? (
          /* Edit Form */
          <View style={styles.editForm}>
            {[
              { label: 'Ism Familiya', icon: 'person-outline', value: name, setter: setName, placeholder: 'Ismingiz' },
              { label: 'Yosh', icon: 'calendar-outline', value: age, setter: setAge, placeholder: '25', keyboardType: 'numeric' },
              { label: 'Telefon', icon: 'call-outline', value: phone, setter: setPhone, placeholder: '+998 90 000 00 00', keyboardType: 'phone-pad' },
              { label: 'Kasb', icon: 'briefcase-outline', value: profession, setter: setProfession, placeholder: 'Elektrik, Dasturchi...' },
            ].map((field, i) => (
              <View key={i} style={styles.inputGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name={field.icon} size={18} color={COLORS.textMuted} style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor={COLORS.textMuted}
                    value={field.value}
                    onChangeText={field.setter}
                    keyboardType={field.keyboardType}
                  />
                </View>
              </View>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tavsif</Text>
              <View style={[styles.inputWrap, { minHeight: 90, alignItems: 'flex-start' }]}>
                <TextInput
                  style={[styles.input, { minHeight: 70 }]}
                  placeholder="Xizmatlaringiz haqida yozing..."
                  placeholderTextColor={COLORS.textMuted}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Kategoriya</Text>
              <View style={styles.catGrid}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catChip, selectedCategory === cat.id && styles.catChipActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Ionicons name={cat.icon} size={14} color={selectedCategory === cat.id ? COLORS.textInverse : COLORS.textSecondary} />
                    <Text style={[styles.catText, selectedCategory === cat.id && { color: COLORS.textInverse }]}>{cat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mahalla</Text>
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
          </View>
        ) : (
          /* Profile Info */
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Shaxsiy ma'lumotlar</Text>
              {[
                { icon: 'mail-outline', label: 'Email', value: userProfile?.email },
                { icon: 'call-outline', label: 'Telefon', value: userProfile?.phone || 'Ko\'rsatilmagan' },
                { icon: 'calendar-outline', label: 'Yosh', value: userProfile?.age ? `${userProfile.age} yosh` : 'Ko\'rsatilmagan' },
                { icon: 'location-outline', label: 'Mahalla', value: userProfile?.mahalla || 'Ko\'rsatilmagan' },
              ].map((item, i) => (
                <View key={i} style={styles.infoRow}>
                  <Ionicons name={item.icon} size={16} color={COLORS.textSecondary} />
                  <Text style={styles.infoLabel}>{item.label}:</Text>
                  <Text style={styles.infoValue} numberOfLines={1}>{item.value}</Text>
                </View>
              ))}
            </View>

            {userProfile?.description && (
              <View style={styles.infoCard}>
                <Text style={styles.infoCardTitle}>Xizmat tavsifi</Text>
                <Text style={styles.descText}>{userProfile.description}</Text>
              </View>
            )}

            {/* ===== PORTFOLIO BO'LIMI ===== */}
            <View style={styles.infoCard}>
              <View style={styles.portfolioTitleRow}>
                <View style={styles.portfolioTitleLeft}>
                  <Ionicons name="images-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.infoCardTitle}>Portfolio</Text>
                  {myPortfolio.length > 0 && (
                    <View style={styles.portfolioCountBadge}>
                      <Text style={styles.portfolioCountText}>{myPortfolio.length}</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.addPortfolioBtn}
                  onPress={() => navigation.navigate('Post', { screen: 'portfolio' })}
                >
                  <Ionicons name="add" size={16} color={COLORS.primary} />
                  <Text style={styles.addPortfolioBtnText}>Qo'shish</Text>
                </TouchableOpacity>
              </View>

              {myPortfolio.length === 0 ? (
                <TouchableOpacity
                  style={styles.emptyPortfolioCard}
                  onPress={() => navigation.navigate('Post')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="cloud-upload-outline" size={36} color={COLORS.textMuted} />
                  <Text style={styles.emptyPortfolioText}>Hali ish namunasi yo'q</Text>
                  <Text style={styles.emptyPortfolioSub}>"Portfolio" bo'limidan rasm/video qo'shing</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.portfolioGrid}>
                  {myPortfolio.slice(0, 6).map((item) => (
                    <View key={item.id} style={styles.portfolioGridItem}>
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.portfolioThumb}
                        resizeMode="cover"
                      />
                      {item.type === 'video' && (
                        <View style={styles.videoOverlay}>
                          <Ionicons name="play-circle" size={28} color="rgba(255,255,255,0.9)" />
                        </View>
                      )}
                      <TouchableOpacity
                        style={styles.portfolioDeleteBtn}
                        onPress={() => {
                          Alert.alert('O\'chirish', 'Bu media ni o\'chirmoqchimisiz?', [
                            { text: 'Yo\'q', style: 'cancel' },
                            { text: 'Ha', style: 'destructive', onPress: () => removePortfolioItem(userProfile?.id, item.id) },
                          ]);
                        }}
                      >
                        <Ionicons name="trash" size={11} color={COLORS.textInverse} />
                      </TouchableOpacity>
                      {item.caption ? (
                        <View style={styles.portfolioCaptionBar}>
                          <Text style={styles.portfolioCaptionText} numberOfLines={1}>{item.caption}</Text>
                        </View>
                      ) : null}
                    </View>
                  ))}
                  {myPortfolio.length > 6 && (
                    <TouchableOpacity
                      style={styles.portfolioMoreBtn}
                      onPress={() => navigation.navigate('Post')}
                    >
                      <Text style={styles.portfolioMoreText}>+{myPortfolio.length - 6} ko'proq</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
              <Text style={styles.logoutText}>Chiqish</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 32 },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarSection: { alignItems: 'center' },
  avatarWrap: { position: 'relative', marginBottom: 12 },
  avatar: { width: 92, height: 92, borderRadius: 28, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  avatarFallback: { width: 92, height: 92, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  avatarInitial: { fontSize: 36, fontWeight: '800', color: COLORS.textInverse },
  avatarEdit: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.surface },
  profileName: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse, marginBottom: 4 },
  profileProfession: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 10 },
  profileMeta: { flexDirection: 'row', gap: 10 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  verifiedText: { fontSize: 12, color: COLORS.textInverse, fontWeight: '600' },
  locationBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  locationText: { fontSize: 12, color: 'rgba(255,255,255,0.9)' },
  statsRow: { flexDirection: 'row', gap: 12, marginHorizontal: 20, marginTop: -16, marginBottom: 8 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: 16, padding: 14, alignItems: 'center', ...SHADOWS.small, borderTopWidth: 3 },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginTop: 8 },
  statLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  infoSection: { paddingHorizontal: 20, marginTop: 8 },
  infoCard: { backgroundColor: COLORS.surface, borderRadius: 18, padding: 18, marginBottom: 12, ...SHADOWS.small },
  infoCardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  infoLabel: { fontSize: 13, color: COLORS.textMuted, width: 70 },
  infoValue: { flex: 1, fontSize: 13, color: COLORS.text, fontWeight: '500' },
  descText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.errorLight, paddingVertical: 14, borderRadius: 16, marginTop: 8 },
  logoutText: { fontSize: 15, color: COLORS.error, fontWeight: '700' },
  editForm: { paddingHorizontal: 20, marginTop: 16 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, fontSize: 14, color: COLORS.text },
  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border },
  catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
  mahallaChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  mahallaChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  mahallaText: { fontSize: 13, color: COLORS.textSecondary },
  mahallaTextActive: { color: COLORS.textInverse, fontWeight: '600' },

  // Portfolio in profile
  portfolioTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  portfolioTitleLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  portfolioCountBadge: { backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  portfolioCountText: { fontSize: 11, color: COLORS.textInverse, fontWeight: '700' },
  addPortfolioBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  addPortfolioBtnText: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },
  emptyPortfolioCard: { alignItems: 'center', paddingVertical: 24, backgroundColor: COLORS.surfaceElevated, borderRadius: 14, gap: 6 },
  emptyPortfolioText: { fontSize: 14, fontWeight: '600', color: COLORS.textSecondary },
  emptyPortfolioSub: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },
  portfolioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  portfolioGridItem: { width: '31.5%', aspectRatio: 1, borderRadius: 10, overflow: 'hidden', position: 'relative' },
  portfolioThumb: { width: '100%', height: '100%' },
  videoOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' },
  portfolioDeleteBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(239,68,68,0.85)', borderRadius: 8, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  portfolioCaptionBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 4, paddingVertical: 3 },
  portfolioCaptionText: { fontSize: 9, color: COLORS.textInverse },
  portfolioMoreBtn: { width: '31.5%', aspectRatio: 1, borderRadius: 10, backgroundColor: COLORS.surfaceElevated, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  portfolioMoreText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },
});

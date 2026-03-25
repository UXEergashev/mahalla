import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Linking, Alert, Modal, TextInput, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

function StarRating({ rating, size = 14, onRate }) {
  return (
    <View style={{ flexDirection: 'row', gap: 4 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <TouchableOpacity key={i} onPress={() => onRate && onRate(i)} disabled={!onRate}>
          <Ionicons name={i <= Math.round(rating) ? "star" : "star-outline"} size={size} color={COLORS.star} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function ReviewCard({ review }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarText}>{review.userName?.charAt(0) || 'A'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewerName}>{review.userName || 'Anonim'}</Text>
          <Text style={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString('uz-UZ')}</Text>
        </View>
        <StarRating rating={review.rating} size={12} />
      </View>
      {review.comment ? <Text style={styles.reviewComment}>{review.comment}</Text> : null}
    </View>
  );
}

export default function ProviderDetailScreen({ route, navigation }) {
  const { provider } = route.params;
  const { userProfile } = useAuth();
  const { addReview, getProviderReviews, updateProvider, providers } = useData();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Get latest provider data
  const currentProvider = providers.find(p => p.id === provider.id) || provider;
  const reviews = getProviderReviews(provider.id);
  const categoryColor = COLORS.categories[currentProvider.category] || COLORS.primary;

  const handleCall = () => {
    const phone = currentProvider.phone?.replace(/\s/g, '');
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    } else {
      Alert.alert('Xato', 'Telefon raqami mavjud emas');
    }
  };

  const handleSubmitReview = async () => {
    if (myRating === 0) { Alert.alert('Xato', 'Reyting qo\'ying'); return; }
    setSubmitting(true);
    try {
      await addReview(provider.id, {
        rating: myRating,
        comment: myComment.trim(),
        userId: userProfile?.id,
        userName: userProfile?.name,
      });
      setShowReviewModal(false);
      setMyRating(0);
      setMyComment('');
      Alert.alert('Rahmat!', 'Sharhingiz qo\'shildi');
    } catch (e) {
      Alert.alert('Xato', 'Sharh qo\'shishda xato');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={[categoryColor + 'CC', categoryColor]} style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={COLORS.textInverse} />
          </TouchableOpacity>

          <View style={styles.heroContent}>
            <View style={styles.avatarWrapper}>
              {currentProvider.avatar ? (
                <Image source={{ uri: currentProvider.avatar }} style={styles.heroAvatar} />
              ) : (
                <View style={styles.heroAvatarFallback}>
                  <Text style={styles.heroAvatarText}>{currentProvider.name.charAt(0)}</Text>
                </View>
              )}
              {currentProvider.available && (
                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>Bo'sh</Text>
                </View>
              )}
            </View>
            <Text style={styles.heroName}>{currentProvider.name}</Text>
            <Text style={styles.heroProfession}>{currentProvider.profession}</Text>
            <View style={styles.heroMeta}>
              {currentProvider.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={COLORS.textInverse} />
                  <Text style={styles.verifiedText}>Tasdiqlangan</Text>
                </View>
              )}
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={14} color={COLORS.star} />
                <Text style={styles.ratingVal}>{currentProvider.rating > 0 ? currentProvider.rating.toFixed(1) : 'Yangi'}</Text>
                <Text style={styles.ratingCount}>({currentProvider.reviewCount})</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.callButton} onPress={handleCall} activeOpacity={0.85}>
            <LinearGradient colors={COLORS.gradient.primary} style={styles.actionBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Ionicons name="call" size={20} color={COLORS.textInverse} />
              <Text style={styles.actionBtnText}>Qo'ng'iroq</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatButton} onPress={() => Alert.alert('Tez kunda', 'Chat funksiyasi qo\'shilmoqda')}>
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
            <Text style={styles.chatBtnText}>Xabar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookButton} onPress={() => Alert.alert('Tez kunda', 'Bron qilish qo\'shilmoqda')}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.secondary} />
            <Text style={styles.bookBtnText}>Bron</Text>
          </TouchableOpacity>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          {/* About */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoCardTitle}>Haqida</Text>
            </View>
            <Text style={styles.infoText}>{currentProvider.description || currentProvider.skill || 'Tavsif mavjud emas'}</Text>
          </View>

          {/* Details */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="person-outline" size={20} color={COLORS.primary} />
              <Text style={styles.infoCardTitle}>Ma'lumotlar</Text>
            </View>
            {[
              { icon: 'location-outline', label: 'Mahalla', value: currentProvider.mahalla },
              { icon: 'call-outline', label: 'Telefon', value: currentProvider.phone },
              { icon: 'briefcase-outline', label: 'Kategoriya', value: currentProvider.category },
              currentProvider.age && { icon: 'calendar-outline', label: 'Yosh', value: `${currentProvider.age} yosh` },
            ].filter(Boolean).map((item, i) => (
              <View key={i} style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name={item.icon} size={16} color={COLORS.textSecondary} />
                </View>
                <Text style={styles.detailLabel}>{item.label}:</Text>
                <Text style={styles.detailValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <View>
              <Text style={styles.reviewsTitle}>Sharhlar</Text>
              <Text style={styles.reviewsSub}>{reviews.length} ta sharh</Text>
            </View>
            <TouchableOpacity style={styles.addReviewBtn} onPress={() => setShowReviewModal(true)}>
              <Ionicons name="add-circle" size={18} color={COLORS.primary} />
              <Text style={styles.addReviewText}>Sharh yozing</Text>
            </TouchableOpacity>
          </View>

          {reviews.length === 0 ? (
            <View style={styles.emptyReviews}>
              <Ionicons name="chatbubbles-outline" size={40} color={COLORS.textMuted} />
              <Text style={styles.emptyReviewText}>Hali sharh yozilmagan. Birinchi bo'ling!</Text>
            </View>
          ) : (
            reviews.map(r => <ReviewCard key={r.id} review={r} />)
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Review Modal */}
      <Modal visible={showReviewModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Sharh yozing</Text>
            <Text style={styles.modalSubtitle}>{currentProvider.name} uchun</Text>

            <Text style={styles.rateLabel}>Reytingiz:</Text>
            <StarRating rating={myRating} size={32} onRate={setMyRating} />

            <View style={styles.commentInput}>
              <TextInput
                style={styles.commentText}
                placeholder="Izoh (ixtiyoriy)..."
                placeholderTextColor={COLORS.textMuted}
                value={myComment}
                onChangeText={setMyComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowReviewModal(false)}>
                <Text style={styles.cancelBtnText}>Bekor qilish</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReview} disabled={submitting}>
                <LinearGradient colors={COLORS.gradient.primary} style={styles.submitGrad}>
                  <Text style={styles.submitBtnText}>{submitting ? 'Yuborilmoqda...' : 'Yuborish'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  hero: { paddingTop: 52, paddingBottom: 32, alignItems: 'center' },
  backBtn: { position: 'absolute', top: 52, left: 20, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  heroContent: { alignItems: 'center', paddingTop: 8 },
  avatarWrapper: { position: 'relative', marginBottom: 12 },
  heroAvatar: { width: 96, height: 96, borderRadius: 28, borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)' },
  heroAvatarFallback: { width: 96, height: 96, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  heroAvatarText: { fontSize: 36, fontWeight: '800', color: COLORS.textInverse },
  availableBadge: { position: 'absolute', bottom: -4, right: -4, backgroundColor: COLORS.success, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, borderWidth: 2, borderColor: COLORS.surface },
  availableText: { fontSize: 10, color: COLORS.textInverse, fontWeight: '700' },
  heroName: { fontSize: 24, fontWeight: '800', color: COLORS.textInverse, marginBottom: 4 },
  heroProfession: { fontSize: 15, color: 'rgba(255,255,255,0.85)', marginBottom: 12 },
  heroMeta: { flexDirection: 'row', gap: 10 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  verifiedText: { fontSize: 12, color: COLORS.textInverse, fontWeight: '600' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  ratingVal: { fontSize: 13, color: COLORS.textInverse, fontWeight: '700' },
  ratingCount: { fontSize: 11, color: 'rgba(255,255,255,0.8)' },
  actionRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: -24, marginBottom: 8 },
  callButton: { flex: 2, borderRadius: 14, overflow: 'hidden', ...SHADOWS.colored },
  actionBtnGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, gap: 8 },
  actionBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.textInverse },
  chatButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.surface, borderRadius: 14, paddingVertical: 14, ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.primaryLight },
  chatBtnText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  bookButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.surface, borderRadius: 14, paddingVertical: 14, ...SHADOWS.small, borderWidth: 1, borderColor: COLORS.secondaryLight },
  bookBtnText: { fontSize: 13, color: COLORS.secondary, fontWeight: '600' },
  infoSection: { paddingHorizontal: 20, marginTop: 16 },
  infoCard: { backgroundColor: COLORS.surface, borderRadius: 18, padding: 18, marginBottom: 12, ...SHADOWS.small },
  infoCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  infoCardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  infoText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  detailIcon: { width: 24 },
  detailLabel: { fontSize: 13, color: COLORS.textMuted, width: 80 },
  detailValue: { flex: 1, fontSize: 13, color: COLORS.text, fontWeight: '500' },
  reviewsSection: { paddingHorizontal: 20, marginTop: 8 },
  reviewsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  reviewsTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  reviewsSub: { fontSize: 13, color: COLORS.textMuted },
  addReviewBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primaryLight, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  addReviewText: { fontSize: 13, color: COLORS.primary, fontWeight: '600' },
  reviewCard: { backgroundColor: COLORS.surface, borderRadius: 16, padding: 16, marginBottom: 10, ...SHADOWS.small },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 12, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  reviewAvatarText: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  reviewerName: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  reviewDate: { fontSize: 12, color: COLORS.textMuted },
  reviewComment: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 20 },
  emptyReviews: { alignItems: 'center', paddingVertical: 32 },
  emptyReviewText: { fontSize: 14, color: COLORS.textMuted, marginTop: 12, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'flex-end' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28 },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.border, alignSelf: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  modalSubtitle: { fontSize: 14, color: COLORS.textMuted, marginBottom: 20 },
  rateLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
  commentInput: { backgroundColor: COLORS.surfaceElevated, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: COLORS.border, marginTop: 16, marginBottom: 20 },
  commentText: { fontSize: 14, color: COLORS.text, minHeight: 80 },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, backgroundColor: COLORS.surfaceElevated, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, color: COLORS.textSecondary, fontWeight: '600' },
  submitBtn: { flex: 2, borderRadius: 14, overflow: 'hidden' },
  submitGrad: { paddingVertical: 14, alignItems: 'center' },
  submitBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.textInverse },
});

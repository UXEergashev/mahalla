import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/colors';

const DEMO_NOTIFS = [
  { id: '1', type: 'review', title: 'Yangi sharh', message: 'Jasur Toshmatov sizga 5 yulduz berdi', time: '2 soat oldin', icon: 'star', color: '#FBBF24' },
  { id: '2', type: 'message', title: 'Yangi xabar', message: 'Nilufar Karimova: Dars vaqtini kelishtiramizmi?', time: '5 soat oldin', icon: 'chatbubble', color: COLORS.primary },
  { id: '3', type: 'request', title: 'Yangi so\'rov', message: 'Yunusobodda elektrik kerak', time: 'Kecha', icon: 'megaphone', color: COLORS.secondary },
  { id: '4', type: 'system', title: 'Xush kelibsiz!', message: 'Mahalla Connect ilovasiga xush kelibsiz!', time: '2 kun oldin', icon: 'home', color: '#8B5CF6' },
];

export default function NotificationsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <LinearGradient colors={COLORS.gradient.hero} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textInverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bildirishnomalar</Text>
      </LinearGradient>

      <FlatList
        data={DEMO_NOTIFS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={[styles.iconWrap, { backgroundColor: item.color + '20' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={styles.content}>
              <View style={styles.row}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
            </View>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 52, paddingHorizontal: 20, paddingBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 16, padding: 14, marginBottom: 10, ...SHADOWS.small, alignItems: 'flex-start' },
  iconWrap: { width: 46, height: 46, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  content: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  time: { fontSize: 11, color: COLORS.textMuted },
  message: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
});

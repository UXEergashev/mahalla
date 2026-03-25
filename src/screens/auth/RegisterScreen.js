import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = [
  { id: 'repair', label: 'Ta\'mirlash', icon: 'construct' },
  { id: 'education', label: 'Ta\'lim', icon: 'school' },
  { id: 'it', label: 'IT xizmat', icon: 'laptop' },
  { id: 'beauty', label: 'Go\'zallik', icon: 'cut' },
  { id: 'home', label: 'Uy xizmati', icon: 'home' },
  { id: 'transport', label: 'Transport', icon: 'car' },
  { id: 'food', label: 'Ovqat', icon: 'restaurant' },
  { id: 'health', label: 'Sog\'liq', icon: 'medical' },
];

const MAHALLAHS = [
  'Yunusobod', 'Chilonzor', 'Mirzo Ulug\'bek', 'Yakkasaroy',
  'Shayxontohur', 'Olmazor', 'Sirg\'ali', 'Uchtepa', 'Bektemir',
];

export default function RegisterScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [profession, setProfession] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMahalla, setSelectedMahalla] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const validateStep1 = () => {
    if (!name.trim()) { Alert.alert('Xato', 'Ismingizni kiriting'); return false; }
    if (!email.trim()) { Alert.alert('Xato', 'Emailingizni kiriting'); return false; }
    if (!password.trim() || password.length < 6) { Alert.alert('Xato', 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak'); return false; }
    if (!phone.trim()) { Alert.alert('Xato', 'Telefon raqamingizni kiriting'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!profession.trim()) { Alert.alert('Xato', 'Kasbingizni kiriting'); return false; }
    if (!selectedCategory) { Alert.alert('Xato', 'Kategoriya tanlang'); return false; }
    if (!selectedMahalla) { Alert.alert('Xato', 'Mahallangizni tanlang'); return false; }
    return true;
  };

  const handleRegister = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        phone: phone.trim(),
        age: age.trim(),
        profession: profession.trim(),
        description: description.trim(),
        category: selectedCategory,
        mahalla: selectedMahalla,
      });
    } catch (error) {
      Alert.alert('Xato', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={COLORS.gradient.hero} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => step === 1 ? navigation.goBack() : setStep(1)}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textInverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ro'yxatdan o'tish</Text>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
        </View>
        <Text style={styles.stepText}>Qadam {step}/2</Text>
      </LinearGradient>

      <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {step === 1 ? (
            <>
              <Text style={styles.sectionTitle}>Shaxsiy ma'lumotlar</Text>

              {[
                { label: 'Ism Familiya', icon: 'person-outline', value: name, setter: setName, placeholder: 'Jasur Toshmatov' },
                { label: 'Yosh', icon: 'calendar-outline', value: age, setter: setAge, placeholder: '25', keyboardType: 'numeric' },
                { label: 'Elektron pochta', icon: 'mail-outline', value: email, setter: setEmail, placeholder: 'email@mail.com', keyboardType: 'email-address' },
                { label: 'Telefon raqam', icon: 'call-outline', value: phone, setter: setPhone, placeholder: '+998 90 123 45 67', keyboardType: 'phone-pad' },
              ].map((field, i) => (
                <View key={i} style={styles.inputGroup}>
                  <Text style={styles.label}>{field.label}</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name={field.icon} size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={field.placeholder}
                      placeholderTextColor={COLORS.textMuted}
                      value={field.value}
                      onChangeText={field.setter}
                      keyboardType={field.keyboardType}
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              ))}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Parol</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Kamida 6 ta belgi"
                    placeholderTextColor={COLORS.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                  />
                  <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.nextBtn} onPress={() => { if (validateStep1()) setStep(2); }}>
                <LinearGradient colors={COLORS.gradient.primary} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.nextBtnText}>Keyingi</Text>
                  <Ionicons name="arrow-forward" size={20} color={COLORS.textInverse} />
                </LinearGradient>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.sectionTitle}>Kasb ma'lumotlari</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Kasbingiz / Ko'nikmangiz</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="briefcase-outline" size={20} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Elektrik, Dasturchi, O'qituvchi..."
                    placeholderTextColor={COLORS.textMuted}
                    value={profession}
                    onChangeText={setProfession}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Xizmat tavsifi</Text>
                <View style={[styles.inputWrapper, { height: 100, alignItems: 'flex-start' }]}>
                  <TextInput
                    style={[styles.input, { height: 80 }]}
                    placeholder="Siz taklif qiladigan xizmatlar haqida yozing..."
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
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map(cat => (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.catChip, selectedCategory === cat.id && styles.catChipSelected]}
                      onPress={() => setSelectedCategory(cat.id)}
                    >
                      <Ionicons name={cat.icon} size={16} color={selectedCategory === cat.id ? COLORS.textInverse : COLORS.textSecondary} />
                      <Text style={[styles.catChipText, selectedCategory === cat.id && styles.catChipTextSelected]}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mahalla</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mahallasScroll}>
                  {MAHALLAHS.map(m => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.mahallaChip, selectedMahalla === m && styles.mahallaChipSelected]}
                      onPress={() => setSelectedMahalla(m)}
                    >
                      <Text style={[styles.mahallaText, selectedMahalla === m && styles.mahallaTextSelected]}>{m}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <TouchableOpacity style={styles.nextBtn} onPress={handleRegister} disabled={loading}>
                <LinearGradient colors={COLORS.gradient.secondary} style={styles.btnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  {loading ? (
                    <ActivityIndicator color={COLORS.textInverse} />
                  ) : (
                    <>
                      <Text style={styles.nextBtnText}>Ro'yxatdan o'tish</Text>
                      <Ionicons name="checkmark-circle" size={20} color={COLORS.textInverse} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>
              Hisobingiz bormi? <Text style={styles.loginLinkHighlight}>Kiring</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textInverse, marginBottom: 16 },
  stepIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  stepDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.3)' },
  stepDotActive: { backgroundColor: COLORS.textInverse },
  stepLine: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 8 },
  stepText: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  formContainer: { flex: 1, marginTop: -16 },
  card: { backgroundColor: COLORS.surface, borderRadius: 24, marginHorizontal: 16, padding: 24, ...SHADOWS.large, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 20 },
  inputGroup: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surfaceElevated, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, borderWidth: 1, borderColor: COLORS.border },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: COLORS.text },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border },
  catChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catChipText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  catChipTextSelected: { color: COLORS.textInverse },
  mahallasScroll: { marginTop: 4 },
  mahallaChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surfaceElevated, borderWidth: 1, borderColor: COLORS.border, marginRight: 8 },
  mahallaChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  mahallaText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  mahallaTextSelected: { color: COLORS.textInverse },
  nextBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8, ...SHADOWS.colored },
  btnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.textInverse },
  loginLink: { alignItems: 'center', marginTop: 16 },
  loginLinkText: { fontSize: 14, color: COLORS.textSecondary },
  loginLinkHighlight: { color: COLORS.primary, fontWeight: '700' },
});

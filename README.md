# Mahalla Connect — README

## 🏘️ Loyiha haqida
**Mahalla Connect** — mahallangizda iqtidorli odamlarni va xizmatlarni topish uchun mo'ljallangan mobil ilova.

---

## 🚀 Ishga tushirish

### 1. Metro serverni ishga tushirish
```bash
cd "MahallaConnect"
npx expo start
```

### 2. Telefoningizda ochish
- **Expo Go** ilovasini Play Store / App Store dan yuklab oling
- Terminal da ko'rsatilgan **QR kodni** skanerlang
- **Yoki:** `exp://YOUR_IP:8082` manziliga boring

---

## 📱 Ilova tuzilishi

```
MahallaConnect/
├── App.js                          # Asosiy kirish nuqtasi
├── src/
│   ├── config/
│   │   └── firebase.js             # Firebase konfiguratsiya
│   ├── constants/
│   │   ├── colors.js               # Rang paletti
│   │   └── translations.js         # O'zbek tilidagi tarjimalar
│   ├── context/
│   │   ├── AuthContext.js          # Autentifikatsiya holati
│   │   └── DataContext.js          # Ma'lumotlar holati
│   ├── navigation/
│   │   └── AppNavigator.js         # Navigatsiya sozlamalari
│   └── screens/
│       ├── auth/
│       │   ├── LoginScreen.js      # Kirish ekrani
│       │   └── RegisterScreen.js   # Ro'yxatdan o'tish (2 qadam)
│       └── main/
│           ├── HomeScreen.js           # Asosiy ekran
│           ├── SearchScreen.js         # Qidiruv & filtr
│           ├── PostScreen.js           # E'lon qo'shish
│           ├── ProfileScreen.js        # Profil & tahrirlash
│           ├── ProviderDetailScreen.js # Mutaxassis sahifasi
│           ├── AllRequestsScreen.js    # Barcha e'lonlar
│           └── NotificationsScreen.js  # Bildirishnomalar
```

---

## ✅ Amalga oshirilgan funksiyalar

| # | Funksiya | Holat |
|---|----------|-------|
| 1 | Foydalanuvchi ro'yxatdan o'tish (2 qadam) | ✅ |
| 2 | Tizimga kirish (email + parol) | ✅ |
| 3 | Foydalanuvchi profili (tahrirlash, rasm) | ✅ |
| 4 | Kategoriyalar (8 ta) | ✅ |
| 5 | Qidiruv & filtr (kategoriya, mahalla) | ✅ |
| 6 | Mutaxassislar lenti | ✅ |
| 7 | Reyting & sharhlar (1-5 yulduz) | ✅ |
| 8 | E'lon qo'shish ("Elektrik kerak") | ✅ |
| 9 | Qo'ng'iroq qilish tugmasi | ✅ |
| 10 | Pastki navigatsiya menyu | ✅ |
| 11 | Offline ma'lumotlar (AsyncStorage) | ✅ |
| 12 | Demo ma'lumotlar (6 mutaxassis) | ✅ |
| 13 | Bildirishnomalar ekrani | ✅ |
| 14 | O'zbek tili interfeysi | ✅ |

---

## 🔥 Firebase ulash (ixtiyoriy)

1. [Firebase Console](https://console.firebase.google.com/) ga kiring
2. Yangi loyiha yarating
3. `src/config/firebase.js` faylini oching
4. Konfiguratsiyangizni qo'ying:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

## 🎨 Dizayn tizimi

| Token | Qiymat |
|-------|--------|
| **Asosiy rang** | `#2563EB` (Ko'k) |
| **Ikkilamchi rang** | `#10B981` (Yashil) |
| **Aksent** | `#F59E0B` (Sariq) |
| **Font** | System Default |
| **Border radius** | 14–24px |

---

## 📦 Texnologiyalar

- **Expo SDK 51** — React Native framework
- **React Navigation v6** — Navigatsiya
- **AsyncStorage** — Lokal ma'lumotlar saqlash
- **expo-linear-gradient** — Gradient UI
- **@expo/vector-icons** — Ionicons ikonkalar
- **expo-image-picker** — Rasm tanlash

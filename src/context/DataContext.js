import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BULUNG_UR_MAHALLAHS } from '../constants/mahallahs';

const DataContext = createContext({});

// ─────────────────────────────────────────────────────────────────────────────
// 20 ta ro'yxatdan o'tgan foydalanuvchilar
// ─────────────────────────────────────────────────────────────────────────────
export const SEED_USERS = [
  {
    id: 'u1', name: 'Ahmadjon Raximov', phone: '+998901111001',
    mahalla: "Yangi hayot", role: 'user', avatar: null,
    profession: 'Elektrik', category: 'repair',
    registeredAt: '2025-11-10T08:00:00Z', active: true,
  },
  {
    id: 'u2', name: 'Mohira Yusupova', phone: '+998901111002',
    mahalla: "Navbahor", role: 'user', avatar: null,
    profession: 'O\'qituvchi', category: 'education',
    registeredAt: '2025-11-15T09:00:00Z', active: true,
  },
  {
    id: 'u3', name: 'Sardor Mirzayev', phone: '+998901111003',
    mahalla: "Mustaqillik", role: 'provider', avatar: null,
    profession: 'Dasturchi', category: 'it',
    registeredAt: '2025-11-20T10:00:00Z', active: true,
  },
  {
    id: 'u4', name: 'Dilnoza Karimova', phone: '+998901111004',
    mahalla: "Bog'ishamol", role: 'user', avatar: null,
    profession: 'Sartarosh', category: 'beauty',
    registeredAt: '2025-12-01T08:30:00Z', active: true,
  },
  {
    id: 'u5', name: 'Jasur Toshmatov', phone: '+998901111005',
    mahalla: "Zafar", role: 'provider', avatar: null,
    profession: 'Santexnik', category: 'repair',
    registeredAt: '2025-12-05T11:00:00Z', active: true,
  },
  {
    id: 'u6', name: 'Nilufar Hasanova', phone: '+998901111006',
    mahalla: "Hamkor", role: 'user', avatar: null,
    profession: 'Shifokor', category: 'health',
    registeredAt: '2025-12-10T07:00:00Z', active: true,
  },
  {
    id: 'u7', name: 'Bobur Qodirov', phone: '+998901111007',
    mahalla: "Do'stlik", role: 'provider', avatar: null,
    profession: 'Haydovchi', category: 'transport',
    registeredAt: '2025-12-15T12:00:00Z', active: true,
  },
  {
    id: 'u8', name: 'Kamola Nazarova', phone: '+998901111008',
    mahalla: "Tinchlik", role: 'user', avatar: null,
    profession: 'Oshpaz', category: 'food',
    registeredAt: '2025-12-20T09:00:00Z', active: true,
  },
  {
    id: 'u9', name: 'Ulugbek Rahimov', phone: '+998901111009',
    mahalla: "Baxt", role: 'provider', avatar: null,
    profession: 'Mebel ustasi', category: 'home',
    registeredAt: '2026-01-03T08:00:00Z', active: true,
  },
  {
    id: 'u10', name: 'Zulfiya Ergasheva', phone: '+998901111010',
    mahalla: "Guliston", role: 'user', avatar: null,
    profession: 'Tikuvchi', category: 'beauty',
    registeredAt: '2026-01-08T10:00:00Z', active: true,
  },
  {
    id: 'u11', name: 'Sherzod Abdullayev', phone: '+998901111011',
    mahalla: "Mehr", role: 'provider', avatar: null,
    profession: 'Qurilishchi', category: 'repair',
    registeredAt: '2026-01-12T11:00:00Z', active: true,
  },
  {
    id: 'u12', name: 'Feruza Tursunova', phone: '+998901111012',
    mahalla: "Sarvar", role: 'user', avatar: null,
    profession: 'Ingliz tili o\'qituvchisi', category: 'education',
    registeredAt: '2026-01-18T09:30:00Z', active: true,
  },
  {
    id: 'u13', name: 'Otabek Xolmatov', phone: '+998901111013',
    mahalla: "Paxtakor", role: 'provider', avatar: null,
    profession: 'Elektr ustalari', category: 'repair',
    registeredAt: '2026-01-22T14:00:00Z', active: true,
  },
  {
    id: 'u14', name: 'Malika Yodgorova', phone: '+998901111014',
    mahalla: "Birlashgan", role: 'user', avatar: null,
    profession: 'Fotoograf', category: 'beauty',
    registeredAt: '2026-01-28T08:00:00Z', active: true,
  },
  {
    id: 'u15', name: 'Nodir Sobirov', phone: '+998901111015',
    mahalla: "Fayz", role: 'provider', avatar: null,
    profession: 'IT mutaxassis', category: 'it',
    registeredAt: '2026-02-03T10:00:00Z', active: true,
  },
  {
    id: 'u16', name: 'Sabohat Alimova', phone: '+998901111016',
    mahalla: "Istiqbol", role: 'user', avatar: null,
    profession: 'Manikur ustasi', category: 'beauty',
    registeredAt: '2026-02-10T09:00:00Z', active: true,
  },
  {
    id: 'u17', name: 'Husan Mamatov', phone: '+998901111017',
    mahalla: "Yangi tong", role: 'provider', avatar: null,
    profession: 'Avtoservis', category: 'transport',
    registeredAt: '2026-02-15T11:00:00Z', active: true,
  },
  {
    id: 'u18', name: 'Barno Razzaqova', phone: '+998901111018',
    mahalla: "Omad", role: 'user', avatar: null,
    profession: 'Logoped', category: 'health',
    registeredAt: '2026-02-22T08:30:00Z', active: true,
  },
  {
    id: 'u19', name: 'Mansur Ismoilov', phone: '+998901111019',
    mahalla: "Baraka", role: 'provider', avatar: null,
    profession: 'Bog\'bon', category: 'home',
    registeredAt: '2026-03-01T10:00:00Z', active: true,
  },
  {
    id: 'u20', name: 'Xurmo Holiqova', phone: '+998901111020',
    mahalla: "Shifo", role: 'user', avatar: null,
    profession: 'Psixolog', category: 'health',
    registeredAt: '2026-03-10T09:00:00Z', active: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Bulung'ur tumani xizmat ko'rsatuvchilar (seed)
// ─────────────────────────────────────────────────────────────────────────────
const SEED_PROVIDERS = [
  {
    id: '1', name: 'Ahmadjon Raximov', age: 30, profession: 'Elektrik',
    category: 'repair', skill: 'Elektr montaj, rozet, konditsioner o\'rnatish',
    description: 'Bulung\'ur tumanida 8 yillik tajribaga ega elektrik usta.',
    mahalla: "Yangi hayot", phone: '+998901111001', rating: 4.8, reviewCount: 24,
    verified: true, available: true, avatar: null, portfolio: [],
    createdAt: '2025-11-10T08:00:00Z',
  },
  {
    id: '2', name: 'Mohira Yusupova', age: 29, profession: 'Matematika o\'qituvchisi',
    category: 'education', skill: 'Matematika, fizika, kimyo darslari',
    description: '5-11-sinf o\'quvchilariga matematika va fizikadan dars beraman.',
    mahalla: "Navbahor", phone: '+998901111002', rating: 4.9, reviewCount: 41,
    verified: true, available: true, avatar: null, portfolio: [],
    createdAt: '2025-11-15T09:00:00Z',
  },
  {
    id: '3', name: 'Sardor Mirzayev', age: 26, profession: 'Dasturchi',
    category: 'it', skill: 'React Native, Flutter, web saytlar',
    description: 'Mobil ilovalar va veb saytlar yaratish bo\'yicha mutaxassis.',
    mahalla: "Mustaqillik", phone: '+998901111003', rating: 4.7, reviewCount: 18,
    verified: true, available: true, avatar: null, portfolio: [],
    createdAt: '2025-11-20T10:00:00Z',
  },
  {
    id: '4', name: 'Dilnoza Karimova', age: 32, profession: 'Sartarosh',
    category: 'beauty', skill: 'Soch kesish, bo\'yash, soqlash',
    description: 'Professional sartaroshlik xizmatlari. Sochingizni chiroyli qilaman.',
    mahalla: "Bog'ishamol", phone: '+998901111004', rating: 4.6, reviewCount: 55,
    verified: false, available: true, avatar: null, portfolio: [],
    createdAt: '2025-12-01T08:30:00Z',
  },
  {
    id: '5', name: 'Jasur Toshmatov', age: 38, profession: 'Santexnik',
    category: 'repair', skill: 'Quvur ta\'mirlash, vannaxona montaj',
    description: 'Suv quvurlari, kranlar va vannaxona jihozlarini o\'rnatish.',
    mahalla: "Zafar", phone: '+998901111005', rating: 4.5, reviewCount: 32,
    verified: true, available: false, avatar: null, portfolio: [],
    createdAt: '2025-12-05T11:00:00Z',
  },
  {
    id: '6', name: 'Zulfiya Ergasheva', age: 40, profession: 'Tikuvchi',
    category: 'beauty', skill: 'Ko\'ylak, shimlar, kiyim tikish va ta\'mirlash',
    description: 'Har xil kiyimlarni tikish va ta\'mirlash. 15 yillik tajriba.',
    mahalla: "Guliston", phone: '+998901111010', rating: 4.9, reviewCount: 87,
    verified: true, available: true, avatar: null, portfolio: [],
    createdAt: '2026-01-08T10:00:00Z',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// E'lonlar (seed)
// ─────────────────────────────────────────────────────────────────────────────
const SEED_REQUESTS = [
  {
    id: 'r1', userId: '0', userName: 'Kamola Nazarova',
    title: 'Elektrik kerak', description: 'Uyimda elektr toki tushib qoldi, tezda yordam kerak.',
    category: 'repair', mahalla: "Yangi hayot", createdAt: '2026-03-20T08:00:00Z', active: true,
  },
  {
    id: 'r2', userId: '0', userName: 'Feruza Tursunova',
    title: 'Matematika o\'qituvchisi izlayapman', description: '8-sinf o\'quvchisi uchun haftalik 2 marta dars kerak.',
    category: 'education', mahalla: "Navbahor", createdAt: '2026-03-21T10:00:00Z', active: true,
  },
  {
    id: 'r3', userId: '0', userName: 'Nodir Sobirov',
    title: 'Veb-sayt yaratish', description: 'Kichik do\'konim uchun oddiy veb-sayt kerak.',
    category: 'it', mahalla: "Mustaqillik", createdAt: '2026-03-22T14:00:00Z', active: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
export const DataProvider = ({ children }) => {
  const [providers, setProviders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState({});
  const [portfolios, setPortfolios] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedProviders  = await AsyncStorage.getItem('mahalla_providers');
      const storedRequests   = await AsyncStorage.getItem('mahalla_requests');
      const storedReviews    = await AsyncStorage.getItem('mahalla_reviews');
      const storedPortfolios = await AsyncStorage.getItem('mahalla_portfolios');
      const storedUsers      = await AsyncStorage.getItem('mahalla_users');

      // Eski Toshkent ma'lumotlari bo'lsa, Bulung'ur bilan almashtiramiz
      const needsReset = storedProviders &&
        JSON.parse(storedProviders).some(p =>
          ['Yunusobod','Chilonzor','Mirzo Ulug\'bek','Yakkasaroy',
           'Shayxontohur','Olmazor','Sirg\'ali','Uchtepa','Bektemir'].includes(p.mahalla)
        );

      if (needsReset) {
        await AsyncStorage.multiRemove([
          'mahalla_providers', 'mahalla_requests', 'mahalla_users'
        ]);
        setProviders(SEED_PROVIDERS);
        setRequests(SEED_REQUESTS);
        setUsers(SEED_USERS);
        await AsyncStorage.setItem('mahalla_providers', JSON.stringify(SEED_PROVIDERS));
        await AsyncStorage.setItem('mahalla_requests',  JSON.stringify(SEED_REQUESTS));
        await AsyncStorage.setItem('mahalla_users',     JSON.stringify(SEED_USERS));
      } else {
        setProviders(storedProviders   ? JSON.parse(storedProviders)   : SEED_PROVIDERS);
        if (!storedProviders) await AsyncStorage.setItem('mahalla_providers', JSON.stringify(SEED_PROVIDERS));

        setRequests(storedRequests     ? JSON.parse(storedRequests)    : SEED_REQUESTS);
        if (!storedRequests) await AsyncStorage.setItem('mahalla_requests', JSON.stringify(SEED_REQUESTS));

        setUsers(storedUsers           ? JSON.parse(storedUsers)       : SEED_USERS);
        if (!storedUsers) await AsyncStorage.setItem('mahalla_users', JSON.stringify(SEED_USERS));
      }

      if (storedReviews && !needsReset)    setReviews(JSON.parse(storedReviews));
      if (storedPortfolios && !needsReset) setPortfolios(JSON.parse(storedPortfolios));

    } catch (e) {
      setProviders(SEED_PROVIDERS);
      setRequests(SEED_REQUESTS);
      setUsers(SEED_USERS);
    } finally {
      setLoading(false);
    }
  };

  // ── Provider CRUD ──────────────────────────────────────────────────────────
  const addProvider = async (providerData) => {
    const newProvider = {
      id: Date.now().toString(),
      ...providerData,
      rating: 0, reviewCount: 0, verified: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newProvider, ...providers];
    setProviders(updated);
    await AsyncStorage.setItem('mahalla_providers', JSON.stringify(updated));
    return newProvider;
  };

  const updateProvider = async (id, updates) => {
    const updated = providers.map(p => p.id === id ? { ...p, ...updates } : p);
    setProviders(updated);
    await AsyncStorage.setItem('mahalla_providers', JSON.stringify(updated));
  };

  const deleteProvider = async (id) => {
    const updated = providers.filter(p => p.id !== id);
    setProviders(updated);
    await AsyncStorage.setItem('mahalla_providers', JSON.stringify(updated));
  };

  // ── Request CRUD ───────────────────────────────────────────────────────────
  const addRequest = async (requestData) => {
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      active: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [newRequest, ...requests];
    setRequests(updated);
    await AsyncStorage.setItem('mahalla_requests', JSON.stringify(updated));
    return newRequest;
  };

  const deleteRequest = async (id) => {
    const updated = requests.filter(r => r.id !== id);
    setRequests(updated);
    await AsyncStorage.setItem('mahalla_requests', JSON.stringify(updated));
  };

  // ── Review ─────────────────────────────────────────────────────────────────
  const addReview = async (providerId, reviewData) => {
    const providerReviews = reviews[providerId] || [];
    const newReview = { id: Date.now().toString(), ...reviewData, createdAt: new Date().toISOString() };
    const updatedReviews = { ...reviews, [providerId]: [newReview, ...providerReviews] };
    setReviews(updatedReviews);
    await AsyncStorage.setItem('mahalla_reviews', JSON.stringify(updatedReviews));
    const allReviews = [newReview, ...providerReviews];
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await updateProvider(providerId, { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length });
  };

  const getProviderReviews = (providerId) => reviews[providerId] || [];

  // ── Portfolio ──────────────────────────────────────────────────────────────
  const addPortfolioItem = async (userId, item) => {
    const userPortfolio = portfolios[userId] || [];
    const newItem = { id: Date.now().toString(), ...item, createdAt: new Date().toISOString() };
    const updatedPortfolios = { ...portfolios, [userId]: [newItem, ...userPortfolio] };
    setPortfolios(updatedPortfolios);
    await AsyncStorage.setItem('mahalla_portfolios', JSON.stringify(updatedPortfolios));
    return newItem;
  };

  const removePortfolioItem = async (userId, itemId) => {
    const updated = (portfolios[userId] || []).filter(i => i.id !== itemId);
    const updatedPortfolios = { ...portfolios, [userId]: updated };
    setPortfolios(updatedPortfolios);
    await AsyncStorage.setItem('mahalla_portfolios', JSON.stringify(updatedPortfolios));
  };

  const getUserPortfolio = (userId) => portfolios[userId] || [];

  // ── User (admin) CRUD ──────────────────────────────────────────────────────
  const updateUser = async (id, updates) => {
    const updated = users.map(u => u.id === id ? { ...u, ...updates } : u);
    setUsers(updated);
    await AsyncStorage.setItem('mahalla_users', JSON.stringify(updated));
  };

  const deleteUser = async (id) => {
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    await AsyncStorage.setItem('mahalla_users', JSON.stringify(updated));
  };

  const blockUser = async (id) => {
    await updateUser(id, { active: false });
  };

  const unblockUser = async (id) => {
    await updateUser(id, { active: true });
  };

  // ── Search ─────────────────────────────────────────────────────────────────
  const searchProviders = (query, category, mahalla) => {
    return providers.filter(p => {
      const matchQuery = !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.profession.toLowerCase().includes(query.toLowerCase()) ||
        p.skill.toLowerCase().includes(query.toLowerCase());
      const matchCategory = !category || category === 'all' || p.category === category;
      const matchMahalla  = !mahalla  || mahalla  === 'all' || p.mahalla === mahalla;
      return matchQuery && matchCategory && matchMahalla;
    });
  };

  // ── Stats for admin ────────────────────────────────────────────────────────
  const getAdminStats = () => ({
    totalUsers: users.length,
    totalProviders: providers.length,
    totalRequests: requests.length,
    activeUsers: users.filter(u => u.active).length,
    verifiedProviders: providers.filter(p => p.verified).length,
    mahallaCoverage: BULUNG_UR_MAHALLAHS.filter(m =>
      providers.some(p => p.mahalla === m)
    ).length,
  });

  return (
    <DataContext.Provider value={{
      providers, requests, reviews, portfolios, users, loading,
      addProvider, updateProvider, deleteProvider,
      addRequest, deleteRequest,
      addReview, getProviderReviews,
      searchProviders,
      addPortfolioItem, removePortfolioItem, getUserPortfolio,
      updateUser, deleteUser, blockUser, unblockUser,
      getAdminStats,
      refreshData: loadData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

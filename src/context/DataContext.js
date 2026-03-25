import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataContext = createContext({});

// Seed data for demo
const SEED_PROVIDERS = [
  {
    id: '1', name: 'Jasur Toshmatov', age: 35, profession: 'Elektrik',
    category: 'repair', skill: 'Elektr montaj ishlari, konditsioner o\'rnatish',
    description: 'Uyingizda elektr ta\'mirlash ishlari, yangi rozet va almashtirishlar.',
    mahalla: 'Yunusobod', phone: '+998901234567', rating: 4.8, reviewCount: 24,
    verified: true, available: true, avatar: null, portfolio: [],
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2', name: 'Nilufar Karimova', age: 28, profession: 'Matematika o\'qituvchisi',
    category: 'education', skill: 'Matematika, fizika darslari, abituriyentlarga yordam',
    description: '5-11 sinf o\'quvchilariga matematika va fizikadan dars beraman.',
    mahalla: 'Chilonzor', phone: '+998901234568', rating: 4.9, reviewCount: 41,
    verified: true, available: true, avatar: null, portfolio: [],
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '3', name: 'Bobur Rahimov', age: 24, profession: 'Dasturchi',
    category: 'it', skill: 'React Native, Flutter, web saytlar',
    description: 'Mobil ilovalar va web saytlar yaratish. Loyihangizni hayotga tatbiq etaman.',
    mahalla: 'Mirzo Ulug\'bek', phone: '+998901234569', rating: 4.7, reviewCount: 18,
    verified: true, available: true, avatar: null, portfolio: [],
    createdAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '4', name: 'Malika Yusupova', age: 30, profession: 'Sartarosh',
    category: 'beauty', skill: 'Soch kesish, bo\'yash, soqlash',
    description: 'Professional sartaroshlik xizmatlari. Sochingizni chiroyli qilaman.',
    mahalla: 'Yakkasaroy', phone: '+998901234570', rating: 4.6, reviewCount: 55,
    verified: false, available: true, avatar: null, portfolio: [],
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '5', name: 'Sherzod Nazarov', age: 42, profession: 'Santexnik',
    category: 'repair', skill: 'Quvur ta\'mirlash, vannaxona montaj',
    description: 'Suv quvurlari, kranlar, dush va vannaxona jihozlarini o\'rnatish va ta\'mirlash.',
    mahalla: 'Shayxontohur', phone: '+998901234571', rating: 4.5, reviewCount: 32,
    verified: true, available: false, avatar: null, portfolio: [],
    createdAt: '2024-03-05T10:00:00Z',
  },
  {
    id: '6', name: 'Dilorom Hasanova', age: 45, profession: 'Tikuvchi',
    category: 'beauty', skill: 'Ko\'ylak, shimlar, kiyim tikish va ta\'mirlash',
    description: 'Har xil kiyimlarni tikish va ta\'mirlash. 20 yillik tajriba.',
    mahalla: 'Olmazor', phone: '+998901234572', rating: 4.9, reviewCount: 87,
    verified: true, available: true, avatar: null, portfolio: [],
    createdAt: '2024-03-10T10:00:00Z',
  },
];

const SEED_REQUESTS = [
  {
    id: 'r1', userId: '0', userName: 'Anvar Usmonov',
    title: 'Elektrik kerak', description: 'Uyimda elektr toki tushib qoldi, tezda yordam kerak.',
    category: 'repair', mahalla: 'Yunusobod', createdAt: '2024-03-20T08:00:00Z', active: true,
  },
  {
    id: 'r2', userId: '0', userName: 'Gulnora Mirzayeva',
    title: 'Matematika o\'qituvchisi izlayapman', description: '8-sinf o\'quvchisi uchun haftalik 2 marta dars kerak.',
    category: 'education', mahalla: 'Chilonzor', createdAt: '2024-03-21T10:00:00Z', active: true,
  },
  {
    id: 'r3', userId: '0', userName: 'Hamid Qodirov',
    title: 'Veb-sayt yaratish', description: 'Kichik do\'konim uchun oddiy veb-sayt kerak.',
    category: 'it', mahalla: 'Mirzo Ulug\'bek', createdAt: '2024-03-22T14:00:00Z', active: true,
  },
];

export const DataProvider = ({ children }) => {
  const [providers, setProviders] = useState([]);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState({});
  const [portfolios, setPortfolios] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedProviders = await AsyncStorage.getItem('mahalla_providers');
      const storedRequests = await AsyncStorage.getItem('mahalla_requests');
      const storedReviews = await AsyncStorage.getItem('mahalla_reviews');
      const storedPortfolios = await AsyncStorage.getItem('mahalla_portfolios');

      if (storedProviders) {
        setProviders(JSON.parse(storedProviders));
      } else {
        setProviders(SEED_PROVIDERS);
        await AsyncStorage.setItem('mahalla_providers', JSON.stringify(SEED_PROVIDERS));
      }

      if (storedRequests) {
        setRequests(JSON.parse(storedRequests));
      } else {
        setRequests(SEED_REQUESTS);
        await AsyncStorage.setItem('mahalla_requests', JSON.stringify(SEED_REQUESTS));
      }

      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }

      if (storedPortfolios) {
        setPortfolios(JSON.parse(storedPortfolios));
      }
    } catch (e) {
      setProviders(SEED_PROVIDERS);
      setRequests(SEED_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  const addProvider = async (providerData) => {
    const newProvider = {
      id: Date.now().toString(),
      ...providerData,
      rating: 0,
      reviewCount: 0,
      verified: false,
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

  const addReview = async (providerId, reviewData) => {
    const providerReviews = reviews[providerId] || [];
    const newReview = {
      id: Date.now().toString(),
      ...reviewData,
      createdAt: new Date().toISOString(),
    };
    const updatedReviews = { ...reviews, [providerId]: [newReview, ...providerReviews] };
    setReviews(updatedReviews);
    await AsyncStorage.setItem('mahalla_reviews', JSON.stringify(updatedReviews));

    // Update provider rating
    const allReviews = [newReview, ...providerReviews];
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await updateProvider(providerId, { rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length });
  };

  const getProviderReviews = (providerId) => reviews[providerId] || [];

  // Portfolio management
  const addPortfolioItem = async (userId, item) => {
    const userPortfolio = portfolios[userId] || [];
    const newItem = {
      id: Date.now().toString(),
      ...item,
      createdAt: new Date().toISOString(),
    };
    const updatedPortfolio = [newItem, ...userPortfolio];
    const updatedPortfolios = { ...portfolios, [userId]: updatedPortfolio };
    setPortfolios(updatedPortfolios);
    await AsyncStorage.setItem('mahalla_portfolios', JSON.stringify(updatedPortfolios));
    return newItem;
  };

  const removePortfolioItem = async (userId, itemId) => {
    const userPortfolio = portfolios[userId] || [];
    const updated = userPortfolio.filter(i => i.id !== itemId);
    const updatedPortfolios = { ...portfolios, [userId]: updated };
    setPortfolios(updatedPortfolios);
    await AsyncStorage.setItem('mahalla_portfolios', JSON.stringify(updatedPortfolios));
  };

  const getUserPortfolio = (userId) => portfolios[userId] || [];

  const searchProviders = (query, category, mahalla) => {
    return providers.filter(p => {
      const matchQuery = !query || 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.profession.toLowerCase().includes(query.toLowerCase()) ||
        p.skill.toLowerCase().includes(query.toLowerCase());
      const matchCategory = !category || category === 'all' || p.category === category;
      const matchMahalla = !mahalla || mahalla === 'all' || p.mahalla === mahalla;
      return matchQuery && matchCategory && matchMahalla;
    });
  };

  return (
    <DataContext.Provider value={{
      providers,
      requests,
      reviews,
      portfolios,
      loading,
      addProvider,
      updateProvider,
      addRequest,
      deleteRequest,
      addReview,
      getProviderReviews,
      searchProviders,
      addPortfolioItem,
      removePortfolioItem,
      getUserPortfolio,
      refreshData: loadData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

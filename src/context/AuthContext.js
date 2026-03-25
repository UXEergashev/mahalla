import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

// Mock users for demo (without Firebase)
const DEMO_USERS = [];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('mahalla_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserProfile(parsedUser);
      }
    } catch (e) {
      console.log('Error loading user:', e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const stored = await AsyncStorage.getItem('mahalla_users');
    const users = stored ? JSON.parse(stored) : [];
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Email yoki parol noto\'g\'ri');
    const { password: _, ...safeUser } = found;
    setUser(safeUser);
    setUserProfile(safeUser);
    await AsyncStorage.setItem('mahalla_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const register = async (userData) => {
    const stored = await AsyncStorage.getItem('mahalla_users');
    const users = stored ? JSON.parse(stored) : [];
    if (users.find(u => u.email === userData.email)) {
      throw new Error('Bu email allaqachon ro\'yxatdan o\'tgan');
    }
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      rating: 0,
      reviewCount: 0,
      verified: false,
      createdAt: new Date().toISOString(),
      avatar: null,
    };
    users.push(newUser);
    await AsyncStorage.setItem('mahalla_users', JSON.stringify(users));
    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    setUserProfile(safeUser);
    await AsyncStorage.setItem('mahalla_user', JSON.stringify(safeUser));
    return safeUser;
  };

  const updateProfile = async (updates) => {
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    setUser(updated);
    await AsyncStorage.setItem('mahalla_user', JSON.stringify(updated));
    // Also update in users list
    const stored = await AsyncStorage.getItem('mahalla_users');
    const users = stored ? JSON.parse(stored) : [];
    const idx = users.findIndex(u => u.id === updated.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      await AsyncStorage.setItem('mahalla_users', JSON.stringify(users));
    }
    return updated;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('mahalla_user');
    setUser(null);
    setUserProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

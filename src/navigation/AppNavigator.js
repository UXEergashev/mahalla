import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import SearchScreen from '../screens/main/SearchScreen';
import PostScreen from '../screens/main/PostScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ProviderDetailScreen from '../screens/main/ProviderDetailScreen';
import AllRequestsScreen from '../screens/main/AllRequestsScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import AdminScreen from '../screens/main/AdminScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TABS = [
  { name: 'Home', label: 'Asosiy', icon: 'home', iconOutline: 'home-outline' },
  { name: 'Search', label: 'Qidiruv', icon: 'search', iconOutline: 'search-outline' },
  { name: 'Post', label: 'E\'lon', icon: 'add-circle', iconOutline: 'add-circle-outline' },
  { name: 'Profile', label: 'Profil', icon: 'person', iconOutline: 'person-outline' },
];

function CustomTabBar({ state, navigation }) {
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS.find(t => t.name === route.name) || TABS[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (route.name === 'Post') {
            return (
              <TouchableOpacity
                key={route.key}
                style={tabStyles.postBtn}
                onPress={onPress}
                activeOpacity={0.9}
              >
                <LinearGradient colors={COLORS.gradient.primary} style={tabStyles.postBtnGrad}>
                  <Ionicons name="add" size={28} color={COLORS.textInverse} />
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={route.key}
              style={tabStyles.tabItem}
              onPress={onPress}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isFocused ? tab.icon : tab.iconOutline}
                size={24}
                color={isFocused ? COLORS.primary : COLORS.textMuted}
              />
              <Text style={[tabStyles.tabLabel, isFocused && tabStyles.tabLabelActive]}>
                {tab.label}
              </Text>
              {isFocused && <View style={tabStyles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Post" component={PostScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="ProviderDetail"
        component={ProviderDetailScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="AllRequests"
        component={AllRequestsScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ presentation: 'card' }}
      />
      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ presentation: 'card' }}
      />
    </Stack.Navigator>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
    position: 'relative',
  },
  tabLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    top: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  postBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  postBtnGrad: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -16,
  },
});

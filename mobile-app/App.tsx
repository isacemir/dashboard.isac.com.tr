import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CRMScreen } from './src/screens/CRMScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { PurchasingScreen } from './src/screens/PurchasingScreen';
import { SalesScreen } from './src/screens/SalesScreen';
import { StockScreen } from './src/screens/StockScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof MaterialIcons.glyphMap;

              if (route.name === 'Dashboard') {
                iconName = 'dashboard';
              } else if (route.name === 'Sales') {
                iconName = 'payments';
              } else if (route.name === 'Purchasing') {
                iconName = 'shopping-cart';
              } else if (route.name === 'Stock') {
                iconName = 'inventory-2';
              } else if (route.name === 'CRM') {
                iconName = 'groups';
              } else {
                iconName = 'dashboard';
              }

              return <MaterialIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#006290',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: {
              backgroundColor: 'transparent',
              borderTopColor: 'transparent',
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
              height: 80,
              borderRadius: 24,
              marginHorizontal: 16,
              marginBottom: 16,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -10,
              },
              shadowOpacity: 0.1,
              shadowRadius: 40,
              elevation: 10,
            },
            tabBarLabelStyle: {
              fontFamily: 'Inter',
              fontSize: 10,
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: 0.5,
            },
            tabBarItemStyle: {
              paddingVertical: 4,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ tabBarLabel: 'Genel Bakış' }}
          />
          <Tab.Screen 
            name="Sales" 
            component={SalesScreen}
            options={{ tabBarLabel: 'Satış' }}
          />
          <Tab.Screen 
            name="Purchasing" 
            component={PurchasingScreen}
            options={{ tabBarLabel: 'Satınalma' }}
          />
          <Tab.Screen 
            name="Stock" 
            component={StockScreen}
            options={{ tabBarLabel: 'Stok' }}
          />
          <Tab.Screen 
            name="CRM" 
            component={CRMScreen}
            options={{ tabBarLabel: 'CRM' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

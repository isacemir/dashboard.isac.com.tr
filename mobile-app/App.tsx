import { MaterialIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CRMScreen } from './src/screens/CRMScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ExcelFilesScreen } from './src/screens/ExcelFilesScreen';
import { NotificationsScreen } from './src/screens/NotificationsScreen';
import { OfferReportScreen } from './src/screens/OfferReportScreen';
import { OrderReportScreen } from './src/screens/OrderReportScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { PurchasingInvoiceScreen } from './src/screens/PurchasingInvoiceScreen';
import { PurchasingOfferScreen } from './src/screens/PurchasingOfferScreen';
import { PurchasingScreen } from './src/screens/PurchasingScreen';
import { SalesScreen } from './src/screens/SalesScreen';
import { StockOrderScreen } from './src/screens/StockOrderScreen';
import { StockScreen } from './src/screens/StockScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color }) => {
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

              return (
                <MaterialIcons 
                  name={iconName} 
                  size={26} 
                  color={color} 
                />
              );
            },
            tabBarActiveTintColor: '#006290',
            tabBarInactiveTintColor: '#94A3B8',
            tabBarStyle: {
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              elevation: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              height: 75,
              paddingBottom: 10,
              paddingTop: 10,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              marginHorizontal: 0,
              marginBottom: 10,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '700',
              marginTop: 4,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen 
            name="Dashboard" 
            component={DashboardScreen}
            options={{ 
              tabBarLabel: 'Genel Bakış',
              tabBarItemStyle: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
              }
            }}
          />
          <Tab.Screen 
            name="Sales" 
            component={SalesScreen}
            options={{ 
              tabBarLabel: 'Satış',
              tabBarItemStyle: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
              }
            }}
          />
          <Tab.Screen 
            name="Purchasing" 
            component={PurchasingScreen}
            options={{ 
              tabBarLabel: 'Satınalma',
              tabBarItemStyle: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
              }
            }}
          />
          <Tab.Screen 
            name="Stock" 
            component={StockScreen}
            options={{ 
              tabBarLabel: 'Stok',
              tabBarItemStyle: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
              }
            }}
          />
          <Tab.Screen 
            name="CRM" 
            component={CRMScreen}
            options={{ 
              tabBarLabel: 'CRM',
              tabBarItemStyle: {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 4,
              }
            }}
          />
        </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="OrderReport" component={OrderReportScreen} />
          <Stack.Screen name="OfferReport" component={OfferReportScreen} />
          <Stack.Screen name="PurchasingOffer" component={PurchasingOfferScreen} />
          <Stack.Screen name="PurchasingInvoice" component={PurchasingInvoiceScreen} />
          <Stack.Screen name="StockOrder" component={StockOrderScreen} />
          <Stack.Screen name="ExcelFiles" component={ExcelFilesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

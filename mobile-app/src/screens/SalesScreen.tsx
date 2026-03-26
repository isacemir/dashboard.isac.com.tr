import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../components/Header';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 380;
const isTablet = width > 768;

const ordersData = [
  {
    id: 'ORD-2024-08912',
    customer: 'Global Lojistik A.Ş.',
    date: '12 Mart 2024',
    amount: '₺42,250.00',
    products: 12,
    status: 'Açık',
    statusColor: '#006290',
    icon: 'shopping-bag',
    iconBg: '#00629020',
  },
  {
    id: 'ORD-2024-08910',
    customer: 'Tekno Market Zinciri',
    date: '11 Mart 2024',
    amount: '₺128,400.00',
    products: 45,
    status: 'Kapalı',
    statusColor: '#64748B',
    icon: 'check-circle',
    iconBg: '#f1f4f9',
  },
  {
    id: 'ORD-2024-08908',
    customer: 'Hızmar Endüstriyel',
    date: '10 Mart 2024',
    amount: '₺15,750.00',
    products: 8,
    status: 'İptal',
    statusColor: '#dc2626',
    icon: 'cancel',
    iconBg: '#dc262620',
  },
];

export const SalesScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="ISAC Sense Digital"
        subtitle="Satış Siparişleri"
        showNotification={true}
        showProfile={true}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Editorial Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <Text style={styles.sectionTitle}>Satış Siparişleri</Text>
            <Text style={styles.sectionLabel}>Operasyonel Takip</Text>
          </View>
          
          {/* Mini Trend Graphic */}
          <View style={[styles.trendCard, isSmallScreen && styles.trendCardSmall]}>
            <View>
              <Text style={styles.trendLabel}>Aylık Trend</Text>
              <Text style={styles.trendValue}>+14.2%</Text>
            </View>
            <View style={styles.trendBars}>
              <View style={[styles.trendBar, { height: '25%', backgroundColor: '#00629020' }]} />
              <View style={[styles.trendBar, { height: '40%', backgroundColor: '#00629020' }]} />
              <View style={[styles.trendBar, { height: '15%', backgroundColor: '#00629040' }]} />
              <View style={[styles.trendBar, { height: '60%', backgroundColor: '#00629060' }]} />
              <View style={[styles.trendBar, { height: '75%', backgroundColor: '#006290' }]} />
              <View style={[styles.trendBar, { height: '70%', backgroundColor: '#00629080' }]} />
            </View>
          </View>
        </View>

        {/* Search & Filter Panel */}
        <View style={styles.searchPanel}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Müşteri veya sipariş no ara..."
              placeholderTextColor="#64748B"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <MaterialIcons name="tune" size={20} color="#181c20" />
            <Text style={styles.filterText}>Filtrele</Text>
          </TouchableOpacity>
        </View>

        {/* Order List */}
        <View style={styles.ordersList}>
          {ordersData.map((order, index) => (
            <TouchableOpacity key={index} style={styles.orderCard}>
              <View style={styles.orderLeft}>
                <View style={[styles.orderIcon, isSmallScreen && styles.orderIconSmall, { backgroundColor: order.iconBg }]}>
                  <MaterialIcons name={order.icon as any} size={isSmallScreen ? 20 : 24} color={order.statusColor} />
                </View>
                <View style={styles.orderInfo}>
                  <Text style={[styles.customerName, isSmallScreen && styles.customerNameSmall]}>{order.customer}</Text>
                  <View style={styles.orderMeta}>
                    <Text style={[styles.orderId, isSmallScreen && styles.orderIdSmall]}>{order.id}</Text>
                    <View style={styles.separator} />
                    <Text style={[styles.orderDate, isSmallScreen && styles.orderDateSmall]}>{order.date}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.orderRight}>
                <View style={styles.orderAmount}>
                  <Text style={[styles.amount, isSmallScreen && styles.amountSmall]}>{order.amount}</Text>
                  <Text style={[styles.productCount, isSmallScreen && styles.productCountSmall]}>{order.products} Ürün</Text>
                </View>
                <View style={[styles.statusBadge, isSmallScreen && styles.statusBadgeSmall, { backgroundColor: `${order.statusColor}10` }]}>
                  <Text style={[styles.statusText, isSmallScreen && styles.statusTextSmall, { color: order.statusColor }]}>{order.status}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header Section
  headerSection: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isSmallScreen ? 'flex-start' : 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 16,
  },
  headerLeft: {
    flex: 2,
    flexDirection: 'column',
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#006290',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Inter',
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 26 : 20       ,
    fontWeight: '800',
    color: '#181c20',
    fontFamily: 'Manrope',
    flexShrink: 0,
    marginBottom: 4,
    letterSpacing: 4,
    flexWrap: 'nowrap',
  },
  
  // Trend Card
  trendCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: isSmallScreen ? 160 : 200,
  },
  trendCardSmall: {
    minWidth: 200,
    padding: 12,
    gap: 12,
  },
  trendLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#64748B',
    marginBottom: 2,
    fontFamily: 'Inter',
  },
  trendValue: {
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '700',
    color: '#006290',
    fontFamily: 'Manrope',
  },
  trendBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: isSmallScreen ? 36 : 48,
    flex: 1,
  },
  trendBar: {
    width: 8,
    borderRadius: 4,
  },
  
  // Search Panel
  searchPanel: {
    flexDirection: isSmallScreen ? 'column' : 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: isSmallScreen ? 12 : 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: isSmallScreen ? 14 : 16,
    color: '#181c20',
    fontFamily: 'Inter',
  },
  filterButton: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingVertical: isSmallScreen ? 12 : 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterText: {
    marginLeft: 8,
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '500',
    color: '#181c20',
    fontFamily: 'Inter',
  },
  
  // Orders List
  ordersList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: isSmallScreen ? 12 : 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 5,
  },
  orderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: isSmallScreen ? 12 : 16,
    flex: 1,
  },
  orderIcon: {
    width: isSmallScreen ? 44 : 56,
    height: isSmallScreen ? 44 : 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderIconSmall: {
    width: 44,
    height: 44,
  },
  orderInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  customerNameSmall: {
    fontSize: 16,
  },
  orderMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  orderId: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '400',
    color: '#64748B',
    fontFamily: 'Inter',
  },
  orderIdSmall: {
    fontSize: 12,
  },
  separator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
  },
  orderDate: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: '400',
    color: '#64748B',
    fontFamily: 'Inter',
  },
  orderDateSmall: {
    fontSize: 12,
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: isSmallScreen ? 16 : 24,
  },
  orderAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: isSmallScreen ? 16 : 20,
    fontWeight: '800',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  amountSmall: {
    fontSize: 16,
  },
  productCount: {
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: '400',
    color: '#64748B',
    fontFamily: 'Inter',
  },
  productCountSmall: {
    fontSize: 10,
  },
  statusBadge: {
    paddingHorizontal: isSmallScreen ? 12 : 16,
    paddingVertical: isSmallScreen ? 4 : 6,
    borderRadius: 20,
  },
  statusBadgeSmall: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Inter',
  },
  statusTextSmall: {
    fontSize: 10,
  },
});

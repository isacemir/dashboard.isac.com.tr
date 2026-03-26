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

const purchasingData = [
  {
    id: '#TR-1142',
    supplier: 'Endüstriyel Çözümler',
    lastDate: '12 May 2024',
    pendingApprovals: 1,
    pendingText: '1 İşlem',
    status: 'İnceleniyor',
    statusColor: '#64748b',
    statusBg: '#f1f4f9',
    icon: 'settings',
    iconBg: '#ffdeac30',
    iconColor: '#ffba38',
  },
  {
    id: '#TR-4402',
    supplier: 'Özdemir Paketleme',
    lastDate: '10 May 2024',
    pendingApprovals: 0,
    pendingText: 'Yok',
    status: 'Onaylandı',
    statusColor: '#15803d',
    statusBg: '#dcfce7',
    icon: 'inventory',
    iconBg: '#8ecdff30',
    iconColor: '#006290',
  },
];

export const PurchasingScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="ISAC Sense Digital"
        subtitle="Satınalma"
        showNotification={true}
        showProfile={true}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Editorial Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.headerLeft}>
            <Text style={styles.sectionTitle}>Satınalma</Text>
            <Text style={styles.sectionLabel}>Tedarik Yönetimi</Text>
          </View>
          
          {/* Mini Trend Graphic */}
          <View style={[styles.trendCard, isSmallScreen && styles.trendCardSmall]}>
            <View>
              <Text style={styles.trendLabel}>Aylık Trend</Text>
              <Text style={styles.trendValue}>+8.7%</Text>
            </View>
            <View style={styles.trendBars}>
              <View style={[styles.trendBar, { height: '30%', backgroundColor: '#f59e0b20' }]} />
              <View style={[styles.trendBar, { height: '45%', backgroundColor: '#f59e0b20' }]} />
              <View style={[styles.trendBar, { height: '20%', backgroundColor: '#f59e0b40' }]} />
              <View style={[styles.trendBar, { height: '65%', backgroundColor: '#f59e0b60' }]} />
              <View style={[styles.trendBar, { height: '80%', backgroundColor: '#f59e0b' }]} />
              <View style={[styles.trendBar, { height: '55%', backgroundColor: '#f59e0b80' }]} />
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Toplam Onay Bekleyen</Text>
            <Text style={styles.statValue}>24</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Aylık Hacim</Text>
            <Text style={styles.statValue}>₺1.2M</Text>
          </View>
        </View>

        {/* Search & Filter Panel */}
        <View style={styles.searchPanel}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#64748B" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tedarikçi veya sipariş no ara..."
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

        {/* Purchasing List */}
        <View style={styles.purchasingList}>
          {purchasingData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.supplierCard}>
              <View style={styles.cardContent}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.supplierInfo}>
                    <View style={[styles.supplierIcon, { backgroundColor: item.iconBg }]}>
                      <MaterialIcons name={item.icon as any} size={24} color={item.iconColor} />
                    </View>
                    <View>
                      <Text style={styles.supplierName}>{item.supplier}</Text>
                      <Text style={styles.supplierId}>ID: {item.id}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: item.statusBg }]}>
                    <Text style={[styles.statusText, { color: item.statusColor }]}>{item.status}</Text>
                  </View>
                </View>

                {/* Details */}
                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Bekleyen Onaylar</Text>
                    <Text style={styles.detailValue}>{item.pendingText}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Son İşlem Tarihi</Text>
                    <Text style={styles.detailDate}>{item.lastDate}</Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.detailButton}>
                    <Text style={styles.detailButtonText}>Detayları Gör</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.moreButton}>
                    <MaterialIcons name="more-horiz" size={16} color="#64748B" />
                  </TouchableOpacity>
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
    flex: 4,
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
    fontSize: isSmallScreen ? 22 : 30,
    fontWeight: '800',
    color: '#181c20',
    fontFamily: 'Manrope',
    flexShrink: 0,
    marginBottom: 4,
    letterSpacing: 2,
    flexWrap: 'nowrap',
  },
  
  // Trend Card
  trendCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: isSmallScreen ? 140 : 180,
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
    fontSize: isSmallScreen ? 12 : 12,
    fontWeight: '700',
    color: '#f59e0b',
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
  
  // Stats Card
  statsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
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
  
  // Purchasing List
  purchasingList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  supplierCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardContent: {
    padding: 24,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  supplierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  supplierIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supplierName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  supplierId: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'Inter',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Inter',
  },
  cardDetails: {
    marginBottom: 24,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  detailDate: {
    fontSize: 12,
    fontWeight: '500',
    color: '#181c20',
    fontFamily: 'Inter',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#006290',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'Inter',
  },
  moreButton: {
    width: 48,
    height: 48,
    backgroundColor: '#f1f4f9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

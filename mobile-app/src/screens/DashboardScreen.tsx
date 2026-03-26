import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Dimensions,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../components/Header';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fe',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f7f9fe',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 80,
  },
  pageTitle: {
    marginTop: 8,
    marginBottom: 16,
  },
  pageSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#006290',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Inter',
  },
  pageTitleText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#181c20',
    fontFamily: 'Manrope',
    marginTop: 4,
  },
  kpiGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  kpiCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 5,
    flex: 1,
    justifyContent: 'space-between',
  },
  kpiLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  kpiTrend: {
    backgroundColor: '#ffb4ac',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  kpiTrendText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#b7131a',
  },
  kpiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  kpiIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kpiIconContainerPrimary: {
    backgroundColor: 'rgba(0, 98, 144, 0.1)',
  },
  kpiIconContainerTertiary: {
    backgroundColor: 'rgba(123, 85, 0, 0.1)',
  },
  horizontalKPIContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
    paddingLeft: 0,
  },
  kpiCardSmall: {
    backgroundColor: '#e5e8ed',
    padding: 20,
    borderRadius: 12,
    width: 160,
    borderWidth: 1,
    borderColor: '#dfe3e815',
    flex: 1,
  },
  kpiSubtitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  kpiSubtitleText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#006290',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 5,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  chartBadge: {
    backgroundColor: '#e5e8ed',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chartBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chart: {
    height: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 4,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  bar: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: '100%',
  },
  valueLabel: {
    position: 'absolute',
    top: -32,
    left: '50%',
    marginLeft: -20,
    backgroundColor: '#181c20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  valueText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  chartLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    fontFamily: 'Inter',
  },
  chartLabelActive: {
    color: '#006290',
  },
  regionalContainer: {
    backgroundColor: '#e5e8ed',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  regionalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  regionalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
  },
  regionalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter',
    marginTop: 4,
  },
  regionsContainer: {
    gap: 20,
  },
  regionItem: {
    gap: 8,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  regionName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Inter',
    flex: 1,
  },
  regionValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#006290',
    fontFamily: 'Inter',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#006290',
    borderRadius: 3,
  },
  actionButtonContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 32,
  },
  actionButton: {
    backgroundColor: '#006290',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    fontFamily: 'Manrope',
  },
});

export const DashboardScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalSales: '€1.725.811',
    salesTrend: '+12.4%',
    pendingOrders: '€6.847.459',
    openOffers: '€6.435.028',
    criticalStock: 105,
    crmActivities: 21028,
  });

  const salesTrendData = [
    { month: 'OCAK', value: 1200000 },
    { month: 'ŞUBAT', value: 1450000 },
    { month: 'MART', value: 1350000 },
    { month: 'NİSAN', value: 1680000 },
    { month: 'MAYIS', value: 1520000 },
    { month: 'HAZİRAN', value: 1725811 },
  ];

  const regionalData = [
    { region: 'Bursa Bölge', value: '€500.5K', percentage: 85 },
    { region: 'Avrupa Bölge', value: '€403.9K', percentage: 65 },
    { region: 'Anadolu Bölge', value: '€298.6K', percentage: 45 },
    { region: 'Ege Bölge', value: '€204.4K', percentage: 30 },
    { region: 'Diğer Bölge', value: '€167.3K', percentage: 20 },
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleDownloadReport = () => {
    console.log('Rapor indiriliyor...');
  };

  const handleMenuPress = () => {
    console.log('Menu açılıyor...');
  };

  const handleNotificationPress = () => {
    console.log('Bildirimler açılıyor...');
  };

  const handleProfilePress = () => {
    console.log('Profil açılıyor...');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="ISAC Sense Digital"
        subtitle="Yönetim Özeti"
        showNotification={true}
        showProfile={true}
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
        onProfilePress={handleProfilePress}
      />
      
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Page Title */}
        <View style={styles.pageTitle}>
          <Text style={styles.pageSubtitle}>Genel Bakış</Text>
          <Text style={styles.pageTitleText}>Yönetim Özeti</Text>
        </View>

        {/* Summary Metrics Grid */}
        <View style={styles.kpiGrid}>
          {/* Metric 1: Main Highlight */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiCardHeader}>
              <View style={[styles.kpiIconContainer, styles.kpiIconContainerPrimary]}>
                <MaterialIcons name="payments" size={24} color="#006290" />
              </View>
              <View style={styles.kpiTrend}>
                <Text style={styles.kpiTrendText}>+12.4%</Text>
              </View>
            </View>
            <View>
              <Text style={styles.kpiLabel}>Toplam Satış (Ciro)</Text>
              <Text style={styles.kpiValue}>€1.725.811</Text>
            </View>
          </View>

          {/* Metric 2 */}
          <View style={styles.kpiCard}>
            <View style={styles.kpiCardHeader}>
              <View style={[styles.kpiIconContainer, styles.kpiIconContainerTertiary]}>
                <MaterialIcons name="shopping-cart" size={24} color="#7b5500" />
              </View>
            </View>
            <View>
              <Text style={styles.kpiLabel}>Bekleyen Siparişler</Text>
              <Text style={styles.kpiValue}>€6.847.459</Text>
            </View>
          </View>
        </View>

        {/* Horizontal Scroll for Secondary Metrics */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalKPIContainer}
        >
          <View style={styles.kpiCardSmall}>
            <Text style={styles.kpiLabel}>Açık Teklifler</Text>
            <Text style={styles.kpiValue}>€6.435.028</Text>
            <View style={styles.kpiSubtitle}>
              <MaterialIcons name="description" size={16} color="#006290" />
              <Text style={styles.kpiSubtitleText}>Aktif Süreçler</Text>
            </View>
          </View>
          <View style={styles.kpiCardSmall}>
            <Text style={styles.kpiLabel}>Kritik Stok</Text>
            <Text style={styles.kpiValue}>105</Text>
            <View style={styles.kpiSubtitle}>
              <MaterialIcons name="inventory-2" size={16} color="#b7131a" />
              <Text style={styles.kpiSubtitleText}>Acil İkmal</Text>
            </View>
          </View>
          <View style={styles.kpiCardSmall}>
            <Text style={styles.kpiLabel}>CRM Aktivite</Text>
            <Text style={styles.kpiValue}>21.028</Text>
            <View style={styles.kpiSubtitle}>
              <MaterialIcons name="groups" size={16} color="#7b5500" />
              <Text style={styles.kpiSubtitleText}>Kayıtlı Etkileşim</Text>
            </View>
          </View>
        </ScrollView>

        {/* Sales Trend Section */}
        <View style={styles.chartContainer}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>SATIŞ TRENDİ</Text>
            <View style={styles.chartBadge}>
              <Text style={styles.chartBadgeText}>AYLIK CİRO</Text>
            </View>
          </View>
          
          <View style={styles.chart}>
            {salesTrendData.map((item, index) => {
              const height = (item.value / Math.max(...salesTrendData.map(d => d.value))) * 100;
              const isHighest = item.value === Math.max(...salesTrendData.map(d => d.value));
              const opacity = 0.1 + (index * 0.1);
              
              return (
                <View key={index} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${height}%`,
                        width: 30,
                        backgroundColor: `rgba(0, 98, 144, ${Math.min(opacity + 0.2, 1)})`,
                      },
                    ]}
                  />
                  {isHighest && (
                    <View style={styles.valueLabel}>
                      <Text style={styles.valueText}>
                        €{(item.value / 1000000).toFixed(1)}M
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          
          <View style={styles.chartLabels}>
            <Text style={styles.chartLabel}>OCAK</Text>
            <Text style={styles.chartLabel}>MART</Text>
            <Text style={[styles.chartLabel, styles.chartLabelActive]}>HAZİRAN</Text>
            <Text style={styles.chartLabel}>EYLÜL</Text>
          </View>
        </View>

        {/* Regional Distribution Section */}
        <View style={styles.regionalContainer}>
          <View style={styles.regionalHeader}>
            <View>
              <Text style={styles.regionalTitle}>BRÜT DAĞILIM</Text>
              <Text style={styles.regionalSubtitle}>Bölgesel Satış Performansı</Text>
            </View>
            <MaterialIcons name="map" size={24} color="#006290" />
          </View>
          
          <View style={styles.regionsContainer}>
            {regionalData.map((item, index) => (
              <View key={index} style={styles.regionItem}>
                <View style={styles.regionHeader}>
                  <Text style={styles.regionName}>{item.region}</Text>
                  <Text style={styles.regionValue}>{item.value}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${item.percentage}%`,
                        backgroundColor: `rgba(0, 98, 144, ${1 - (index * 0.2)})`
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDownloadReport}
          >
            <MaterialIcons name="file-download" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Raporu İndir</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

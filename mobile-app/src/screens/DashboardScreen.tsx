import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Alert, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DataService from '../services/DataService';

import { Header } from '../components/Header';
import { NavigationDrawer } from '../components/NavigationDrawer';

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
  regionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
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
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const kpis = useMemo(() => DataService.getDashboardKPIs(), []);
  const salesTrendData = useMemo(() => DataService.getMonthlySalesTrend(), []);
  const regionalData = useMemo(() => DataService.getRegionalSales(), []);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleDownloadReport = () => {
    Alert.alert(
      'Raporu İndir',
      'Hangi formatta indirmek istersiniz?',
      [
        {
          text: 'Excel (.xlsx)',
          onPress: async () => {
            try {
              // Mevcut satis-raporu.xlsx dosyasını asset'ten kopyala ve paylaş
              const sourceUri = FileSystem.documentDirectory + 'satis-raporu.xlsx';
              // Asset'ten kopyala
              await FileSystem.downloadAsync(
                'https://dashboard.isac.com.tr/api/satis-raporu.xlsx',
                sourceUri
              ).catch(async () => {
                // API yoksa local JSON'dan CSV oluştur
                const data = DataService.getSalesReports().slice(0, 100);
                const headers = Object.keys(data[0] || {}).join(',');
                const rows = data.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
                const csv = [headers, ...rows].join('\n');
                const csvUri = FileSystem.documentDirectory + 'satis-raporu.csv';
                await FileSystem.writeAsStringAsync(csvUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
                const canShare = await Sharing.isAvailableAsync();
                if (canShare) {
                  await Sharing.shareAsync(csvUri, { mimeType: 'text/csv', dialogTitle: 'Satış Raporu', UTI: 'public.comma-separated-values-text' });
                } else {
                  Alert.alert('Başarılı', 'Rapor kaydedildi: ' + csvUri);
                }
              });
              const canShare = await Sharing.isAvailableAsync();
              if (canShare) {
                await Sharing.shareAsync(sourceUri, { mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', dialogTitle: 'Satış Raporu' });
              }
            } catch (e) {
              Alert.alert('Hata', 'Dosya oluşturulurken bir hata oluştu.');
            }
          },
        },
        {
          text: 'PDF (CSV)',
          onPress: async () => {
            try {
              const data = DataService.getSalesReports();
              const kpis = DataService.getDashboardKPIs();
              const regional = DataService.getRegionalSales();

              const lines = [
                'ISAC SENSE DIGITAL - DASHBOARD RAPORU',
                '======================================',
                `Tarih: ${new Date().toLocaleDateString('tr-TR')}`,
                '',
                'KPI ÖZET',
                `Toplam Satış: ${kpis.totalSales}`,
                `Bekleyen Siparişler: ${kpis.pendingOrders}`,
                `Açık Teklifler: ${kpis.openOffers}`,
                `Kritik Stok: ${kpis.criticalStock}`,
                `CRM Aktivite: ${kpis.crmActivities}`,
                '',
                'BÖLGESEL DAĞILIM',
                ...regional.map(r => `${r.region}: ${r.value} (%${r.percentage})`),
                '',
                `Toplam ${data.length} satış kaydı bulunmaktadır.`,
              ];

              const content = lines.join('\n');
              const fileUri = FileSystem.documentDirectory + 'dashboard-raporu.txt';
              await FileSystem.writeAsStringAsync(fileUri, content, { encoding: FileSystem.EncodingType.UTF8 });

              const canShare = await Sharing.isAvailableAsync();
              if (canShare) {
                await Sharing.shareAsync(fileUri, { mimeType: 'text/plain', dialogTitle: 'Dashboard Raporu' });
              } else {
                Alert.alert('Başarılı', 'Rapor kaydedildi.');
              }
            } catch (e) {
              Alert.alert('Hata', 'Rapor oluşturulurken bir hata oluştu.');
            }
          },
        },
        { text: 'İptal', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleMenuPress = () => {
    setIsDrawerVisible(true);
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications' as never);
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile' as never);
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
              <Text style={styles.kpiValue}>{kpis.totalSales}</Text>
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
              <Text style={styles.kpiValue}>{kpis.pendingOrders}</Text>
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
            <Text style={styles.kpiValue}>{kpis.openOffers}</Text>
            <View style={styles.kpiSubtitle}>
              <MaterialIcons name="description" size={16} color="#006290" />
              <Text style={styles.kpiSubtitleText}>Aktif Süreçler</Text>
            </View>
          </View>
          <View style={styles.kpiCardSmall}>
            <Text style={styles.kpiLabel}>Kritik Stok</Text>
            <Text style={styles.kpiValue}>{kpis.criticalStock}</Text>
            <View style={styles.kpiSubtitle}>
              <MaterialIcons name="inventory-2" size={16} color="#b7131a" />
              <Text style={styles.kpiSubtitleText}>Acil İkmal</Text>
            </View>
          </View>
          <View style={styles.kpiCardSmall}>
            <Text style={styles.kpiLabel}>CRM Aktivite</Text>
            <Text style={styles.kpiValue}>{kpis.crmActivities.toLocaleString('tr-TR')}</Text>
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
              const maxVal = Math.max(...salesTrendData.map(d => d.value));
              const height = (item.value / maxVal) * 100;
              const isHighest = item.value === maxVal;
              const opacity = 0.3 + (index / salesTrendData.length) * 0.7;

              return (
                <View key={index} style={styles.barContainer}>
                  <View style={styles.valueLabel}>
                    <Text style={[styles.valueText, isHighest && { color: '#006290', fontWeight: '800' }]}>
                      €{item.value.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${height}%`,
                        width: 30,
                        backgroundColor: isHighest ? '#006290' : `rgba(0, 98, 144, ${opacity})`,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
          
          <View style={styles.chartLabels}>
            {salesTrendData.map((item, index) => (
              <Text key={index} style={index === salesTrendData.length - 1 ? [styles.chartLabel, styles.chartLabelActive] : styles.chartLabel}>
                {item.month}
              </Text>
            ))}
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
              <TouchableOpacity key={index} style={styles.regionItem} onPress={() => (navigation as any).navigate('Tabs', { screen: 'Sales', params: { region: item.region } })} activeOpacity={0.7}>
                <View style={styles.regionHeader}>
                  <Text style={styles.regionName}>{item.region}</Text>
                  <View style={styles.regionRight}>
                    <Text style={styles.regionValue}>{item.value}</Text>
                    <MaterialIcons name="chevron-right" size={16} color="#006290" />
                  </View>
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
              </TouchableOpacity>
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
      <NavigationDrawer 
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        onNavigate={(screen) => {
          setIsDrawerVisible(false);
          const TAB = ['Dashboard','Sales','Purchasing','Stock','CRM'];
          if (TAB.includes(screen)) { (navigation as any).navigate('Tabs', { screen }); }
          else { (navigation as any).navigate(screen); }
        }}
      />
    </SafeAreaView>
  );
};

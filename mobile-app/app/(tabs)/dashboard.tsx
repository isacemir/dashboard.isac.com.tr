import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

interface KPIData {
  satis: { kpi: any; charts: any };
  siparis: { kpi: any; charts: any };
  stok: { kpi: any; charts: any };
  crm: { kpi: any; charts: any };
  teklif: { kpi: any; charts: any };
  purchase: { kpi: any; charts: any };
}

export default function DashboardScreen() {
  const [data, setData] = useState<KPIData>({
    satis: { kpi: {}, charts: {} },
    siparis: { kpi: {}, charts: {} },
    stok: { kpi: {}, charts: {} },
    crm: { kpi: {}, charts: {} },
    teklif: { kpi: {}, charts: {} },
    purchase: { kpi: {}, charts: {} },
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadDashboardData() {
    try {
      const baseUrl = 'http://192.168.1.100:5173'; // Local IP adresinizi girin
      const results = await Promise.all([
        fetch(`${baseUrl}/api/fatura.php?summary=1`).then(r => r.json()).catch(() => ({ kpi: { toplam: 1725811, sayi: 5583 }, charts: {} })),
        fetch(`${baseUrl}/api/satis_siparis.php?summary=1`).then(r => r.json()).catch(() => ({ kpi: { toplam: 2500000, sayi: 1200 }, charts: {} })),
        fetch(`${baseUrl}/api/stok.php?summary=1`).then(r => r.json()).catch(() => ({ kpi: { kritik: 15, stokta: 850 }, charts: {} })),
        fetch(`${baseUrl}/api/crm.php?summary=1`).then(r => r.json()).catch(() => ({ kpi: { sayi: 245 }, charts: {} })),
        fetch(`${baseUrl}/api/teklif.php?summary=1`).then(r => r.json()).catch(() => ({ kpi: { toplam: 450000 }, charts: {} })),
        fetch(`${baseUrl}/api/satinalma_fatura.php?summary=1`).then(r => r.json()).catch(() => ({ kpi: { toplam: 890000 }, charts: {} })),
      ]);

      setData({
        satis: results[0] || { kpi: {}, charts: {} },
        siparis: results[1] || { kpi: {}, charts: {} },
        stok: results[2] || { kpi: {}, charts: {} },
        crm: results[3] || { kpi: {}, charts: {} },
        teklif: results[4] || { kpi: {}, charts: {} },
        purchase: results[5] || { kpi: {}, charts: {} },
      });
    } catch (error) {
      console.error('Dashboard verisi yüklenemedi:', error);
      // Demo veriler
      setData({
        satis: { kpi: { toplam: 1725811, sayi: 5583 }, charts: {} },
        siparis: { kpi: { toplam: 2500000, sayi: 1200 }, charts: {} },
        stok: { kpi: { kritik: 15, stokta: 850 }, charts: {} },
        crm: { kpi: { sayi: 245 }, charts: {} },
        teklif: { kpi: { toplam: 450000 }, charts: {} },
        purchase: { kpi: { toplam: 890000 }, charts: {} },
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const totalCiro = data.satis.kpi?.toplam || 0;
  const totalOrders = data.siparis.kpi?.toplam || 0;
  const criticalStok = data.stok.kpi?.kritik || 0;
  const crmToday = data.crm.kpi?.sayi || 0;

  const KPICard = ({ title, value, icon, color, bgColor, prefix = '' }: any) => (
    <View style={[styles.kpiCard, { backgroundColor: bgColor }]}>
      <View style={styles.kpiHeader}>
        <Text style={styles.kpiIcon}>{icon}</Text>
        <Text style={styles.kpiTitle}>{title}</Text>
      </View>
      <Text style={[styles.kpiValue, { color }]}>
        {prefix}{Math.round(value).toLocaleString('tr-TR')}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ISAC Dashboard</Text>
          <Text style={styles.headerSubtitle}>Yönetim Özeti</Text>
        </View>

        <View style={styles.kpiContainer}>
          <KPICard
            title="Toplam Satış"
            value={totalCiro}
            icon="🧾"
            color="#ef4444"
            bgColor="#fee2e2"
            prefix="€"
          />
          <KPICard
            title="Bekleyen Siparişler"
            value={totalOrders}
            icon="⏳"
            color="#0ea5e9"
            bgColor="#e0f2fe"
            prefix="€"
          />
          <KPICard
            title="Açık Teklifler"
            value={data.teklif.kpi?.toplam || 0}
            icon="📋"
            color="#f59e0b"
            bgColor="#fef3c7"
            prefix="€"
          />
          <KPICard
            title="Kritik Stok"
            value={criticalStok}
            icon="⚠️"
            color="#10b981"
            bgColor="#d1fae5"
          />
          <KPICard
            title="CRM Aktivite"
            value={crmToday}
            icon="👥"
            color="#ec4899"
            bgColor="#fce7f3"
          />
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sistem Durumu</Text>
          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Satınalma</Text>
              <Text style={styles.statusValue}>
                €{Math.round(data.purchase.kpi?.toplam || 0).toLocaleString('tr-TR')}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Stok Değeri</Text>
              <Text style={styles.statusValue}>
                {data.stok.kpi?.stokta || 0} Çeşit
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Veri Kaynağı</Text>
              <Text style={styles.statusValue}>Wolvox ERP</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusLabel}>Son Güncelleme</Text>
              <Text style={styles.statusValue}>
                {new Date().toLocaleTimeString('tr-TR')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
    justifyContent: 'space-between',
  },
  kpiCard: {
    width: (width - 48) / 2 - 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  kpiIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  kpiTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    flex: 1,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statusItem: {
    width: (width - 64) / 2,
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 11,
    color: '#94a3b8',
    textTransform: 'uppercase' as const,
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
});

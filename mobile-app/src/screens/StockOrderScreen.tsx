import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { NavigationDrawer } from '../components/NavigationDrawer';
import DataService from '../services/DataService';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;
const TAB = ['Dashboard', 'Sales', 'Purchasing', 'Stock', 'CRM'];

const DURUM_STYLE: Record<string, { bg: string; text: string; icon: string }> = {
  'SIFIR BAKİYE - SATIN ALMA YOK': { bg: '#fee2e2', text: '#dc2626', icon: 'warning' },
  'SIFIR BAKİYE - SATIN ALMA VAR': { bg: '#fef9c3', text: '#a16207', icon: 'pending' },
  'POZİTİF BAKİYE':                { bg: '#dcfce7', text: '#15803d', icon: 'check-circle' },
  'NEGATİF BAKİYE':                { bg: '#fee2e2', text: '#dc2626', icon: 'error' },
};

export const StockOrderScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigation = useNavigation<any>();

  const handleNavigate = (screen: string) => {
    if (TAB.includes(screen)) navigation.navigate('Tabs' as never, { screen } as never);
    else navigation.navigate(screen as never);
  };

  const rawData = useMemo(() => DataService.getStockOrders(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return rawData;
    const q = search.toLowerCase();
    return rawData.filter(item =>
      String(item.STOK_ADI || '').toLowerCase().includes(q) ||
      String(item.STOKKODU || '').toLowerCase().includes(q) ||
      String(item.MARKASI || '').toLowerCase().includes(q) ||
      String(item.MODELI || '').toLowerCase().includes(q)
    );
  }, [rawData, search]);

  const kritik = useMemo(() => rawData.filter(d => String(d.DURUM || '').includes('SIFIR BAKİYE')).length, [rawData]);
  const pozitif = useMemo(() => rawData.filter(d => String(d.DURUM || '').includes('POZİTİF')).length, [rawData]);
  const siparisVar = useMemo(() => rawData.filter(d => String(d.DURUM || '').includes('SATIN ALMA VAR')).length, [rawData]);

  const getDurum = (d: string) => DURUM_STYLE[d] || { bg: '#f1f5f9', text: '#64748b', icon: 'help' };

  const renderItem = ({ item }: { item: any }) => {
    const durum = getDurum(item.DURUM);
    const stok = Number(item.STOK_MIKTARI || 0);
    const kalan = Number(item.SIPARIS_KALAN_MIKTARI || 0);
    const termin = Number(item.TERMINLI_STOK || 0);
    const terminMiktar = Number(item.TERMIN_MIKTAR || 0);
    const customers = [item.CARI_1, item.CARI_2, item.CARI_3, item.CARI_4, item.CARI_5,
      item.CARI_6, item.CARI_7, item.CARI_8, item.CARI_9, item.CARI_10].filter(Boolean);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIconWrap, { backgroundColor: durum.bg }]}>
            <MaterialIcons name={durum.icon as any} size={20} color={durum.text} />
          </View>
          <View style={styles.cardMeta}>
            <Text style={styles.cardTitle} numberOfLines={2}>{item.STOK_ADI || '—'}</Text>
            <Text style={styles.cardSub}>{item.STOKKODU || '—'}</Text>
          </View>
        </View>

        <View style={[styles.durumBadge, { backgroundColor: durum.bg }]}>
          <Text style={[styles.durumText, { color: durum.text }]}>{item.DURUM || '—'}</Text>
        </View>

        {(item.MARKASI || item.MODELI) ? (
          <View style={styles.infoRow}>
            <MaterialIcons name="business" size={13} color="#94a3b8" />
            <Text style={styles.infoText}>{[item.MARKASI, item.MODELI].filter(Boolean).join(' · ')}</Text>
          </View>
        ) : null}

        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Stok</Text>
            <Text style={[styles.metricValue, { color: stok > 0 ? '#15803d' : '#dc2626' }]}>{stok || '0'}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Sipariş Kalan</Text>
            <Text style={[styles.metricValue, { color: '#a16207' }]}>{kalan}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Termin Miktar</Text>
            <Text style={[styles.metricValue, { color: '#006290' }]}>{terminMiktar || '0'}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Terminli Stok</Text>
            <Text style={[styles.metricValue, { color: termin < 0 ? '#dc2626' : '#15803d' }]}>{termin}</Text>
          </View>
        </View>

        {customers.length > 0 && (
          <View style={styles.customersWrap}>
            <MaterialIcons name="people" size={13} color="#94a3b8" />
            <Text style={styles.customersText} numberOfLines={2}>{customers.join(' · ')}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <NavigationDrawer isVisible={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={handleNavigate} />
      <Header title="ISAC Sense Digital" subtitle="Stok Siparişleri" onMenuPress={() => setDrawerOpen(true)} onNotificationPress={() => (navigation as any).navigate("Notifications")} onProfilePress={() => (navigation as any).navigate("Profile")} />
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#e0f2fe' }]}>
          <MaterialIcons name="inventory" size={16} color="#006290" />
          <Text style={[styles.summaryNum, { color: '#006290' }]}>{rawData.length}</Text>
          <Text style={styles.summaryLabel}>Toplam</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#dcfce7' }]}>
          <MaterialIcons name="check-circle" size={16} color="#15803d" />
          <Text style={[styles.summaryNum, { color: '#15803d' }]}>{pozitif}</Text>
          <Text style={styles.summaryLabel}>Stokta</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#fee2e2' }]}>
          <MaterialIcons name="warning" size={16} color="#dc2626" />
          <Text style={[styles.summaryNum, { color: '#dc2626' }]}>{kritik}</Text>
          <Text style={styles.summaryLabel}>Kritik</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#fef9c3' }]}>
          <MaterialIcons name="pending" size={16} color="#a16207" />
          <Text style={[styles.summaryNum, { color: '#a16207' }]}>{siparisVar}</Text>
          <Text style={styles.summaryLabel}>Sipariş Var</Text>
        </View>
      </View>
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={20} color="#94a3b8" />
        <TextInput style={styles.searchInput} placeholder="Stok kodu, ürün adı, marka veya model ara..." placeholderTextColor="#94a3b8" value={search} onChangeText={setSearch} />
        {search.length > 0 && <TouchableOpacity onPress={() => setSearch('')}><MaterialIcons name="close" size={18} color="#94a3b8" /></TouchableOpacity>}
      </View>
      <FlatList data={filtered} renderItem={renderItem} keyExtractor={(_, i) => String(i)}
        contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}
        ListEmptyComponent={<View style={styles.empty}><MaterialIcons name="inbox" size={48} color="#cbd5e1" /><Text style={styles.emptyText}>Sonuç bulunamadı</Text></View>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fe' },
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 8, alignItems: 'center', gap: 3 },
  summaryNum: { fontSize: isSmallScreen ? 14 : 16, fontWeight: '800' },
  summaryLabel: { fontSize: 9, color: '#64748b', fontWeight: '600', textAlign: 'center' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14, color: '#1e293b' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: '#94a3b8', fontSize: 14 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3, gap: 7 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  cardIconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#1e293b', lineHeight: 18 },
  cardSub: { fontSize: 11, color: '#64748b', marginTop: 1 },
  durumBadge: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  durumText: { fontSize: 10, fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  infoText: { fontSize: 12, color: '#64748b', flex: 1 },
  metricsRow: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, alignItems: 'center', marginTop: 4 },
  metric: { flex: 1, alignItems: 'center', gap: 2 },
  metricLabel: { fontSize: 9, color: '#94a3b8', fontWeight: '600', textAlign: 'center' },
  metricValue: { fontSize: 13, fontWeight: '800', color: '#1e293b' },
  metricDivider: { width: 1, height: 28, backgroundColor: '#e2e8f0' },
  customersWrap: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  customersText: { fontSize: 11, color: '#64748b', flex: 1 },
});

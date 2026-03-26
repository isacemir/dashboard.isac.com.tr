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

const excelDate = (val: any): string => {
  if (!val) return '—';
  const num = Number(val);
  if (isNaN(num) || num === 0) return String(val);
  return new Date(Math.round((num - 25569) * 86400 * 1000))
    .toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'Siparişe Aktarıldı': { bg: '#dcfce7', text: '#15803d' },
  'Onaylandı':          { bg: '#dcfce7', text: '#15803d' },
  'Bekliyor':           { bg: '#fef9c3', text: '#a16207' },
  'Reddedildi':         { bg: '#fee2e2', text: '#dc2626' },
  'İptal':              { bg: '#fee2e2', text: '#dc2626' },
};

export const PurchasingOfferScreen: React.FC = () => {
  const [search, setSearch] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigation = useNavigation<any>();

  const handleNavigate = (screen: string) => {
    if (TAB.includes(screen)) navigation.navigate('Tabs' as never, { screen } as never);
    else navigation.navigate(screen as never);
  };

  const rawData = useMemo(() => DataService.getPurchasingOffers(), []);

  const filtered = useMemo(() => {
    if (!search.trim()) return rawData;
    const q = search.toLowerCase();
    return rawData.filter(item =>
      String(item.TICARI_UNVANI || '').toLowerCase().includes(q) ||
      String(item.TEKLIF_NO || '').toLowerCase().includes(q) ||
      String(item.STOK_ADI || '').toLowerCase().includes(q) ||
      String(item.MARKASI || '').toLowerCase().includes(q)
    );
  }, [rawData, search]);

  const counts = useMemo(() => rawData.reduce((acc: Record<string, number>, d) => {
    const k = String(d.TEKLIF_DURUMU || 'Belirsiz');
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {}), [rawData]);

  const totalEur = useMemo(() => rawData.reduce((s, d) => s + Number(d.DVZ_IND_TUTAR || 0), 0), [rawData]);
  const statusStyle = (s: string) => STATUS_STYLE[s] || { bg: '#f1f5f9', text: '#64748b' };

  const renderItem = ({ item }: { item: any }) => {
    const s = statusStyle(item.TEKLIF_DURUMU);
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrap}>
            <MaterialIcons name="shopping-cart" size={20} color="#006290" />
          </View>
          <View style={styles.cardMeta}>
            <Text style={styles.cardTitle} numberOfLines={1}>{item.TICARI_UNVANI || '—'}</Text>
            <Text style={styles.cardSub}>{item.TEKLIF_NO || '—'} · {item.TEKLIF_TURU || ''}</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: s.bg }]}>
            <Text style={[styles.badgeText, { color: s.text }]}>{item.TEKLIF_DURUMU || '—'}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <MaterialIcons name="inventory-2" size={13} color="#94a3b8" />
          <Text style={styles.infoText} numberOfLines={2}>{item.STOK_ADI || '—'}</Text>
        </View>
        {(item.MARKASI || item.MODELI) ? (
          <View style={styles.infoRow}>
            <MaterialIcons name="business" size={13} color="#94a3b8" />
            <Text style={styles.infoText}>{[item.MARKASI, item.MODELI].filter(Boolean).join(' · ')}</Text>
          </View>
        ) : null}
        <View style={styles.infoRow}>
          <MaterialIcons name="location-on" size={13} color="#94a3b8" />
          <Text style={styles.infoText}>{item.ILI || '—'}{item.ILCESI ? ` / ${item.ILCESI}` : ''} · {item.GRUBU || ''}</Text>
          <Text style={styles.sep}>·</Text>
          <MaterialIcons name="calendar-today" size={13} color="#94a3b8" />
          <Text style={styles.infoText}>{excelDate(item.TARIHI)}</Text>
        </View>
        <View style={styles.metricsRow}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Miktar</Text>
            <Text style={styles.metricValue}>{item.MIKTARI || '—'} {item.BIRIMI || ''}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Birim €</Text>
            <Text style={styles.metricValue}>€{Number(item.DVZ_IND_FIYAT || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Toplam €</Text>
            <Text style={[styles.metricValue, { color: '#006290' }]}>€{Number(item.DVZ_IND_TUTAR || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>Toplam ₺</Text>
            <Text style={[styles.metricValue, { fontSize: 10 }]}>₺{Number(item.KPB_IND_TUTAR || 0).toLocaleString('tr-TR', { minimumFractionDigits: 0 })}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <NavigationDrawer isVisible={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={handleNavigate} />
      <Header title="ISAC Sense Digital" subtitle="Satınalma Teklifleri" onMenuPress={() => setDrawerOpen(true)} onNotificationPress={() => (navigation as any).navigate("Notifications")} onProfilePress={() => (navigation as any).navigate("Profile")} />
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#e0f2fe' }]}>
          <MaterialIcons name="shopping-cart" size={16} color="#006290" />
          <Text style={[styles.summaryNum, { color: '#006290' }]}>{rawData.length}</Text>
          <Text style={styles.summaryLabel}>Toplam</Text>
        </View>
        {Object.entries(counts).slice(0, 2).map(([durum, sayi]) => {
          const s = statusStyle(durum);
          return (
            <View key={durum} style={[styles.summaryCard, { backgroundColor: s.bg }]}>
              <Text style={[styles.summaryNum, { color: s.text }]}>{sayi}</Text>
              <Text style={[styles.summaryLabel, { color: s.text }]} numberOfLines={1}>{durum}</Text>
            </View>
          );
        })}
        <View style={[styles.summaryCard, { backgroundColor: '#f3e8ff' }]}>
          <MaterialIcons name="euro" size={16} color="#7c3aed" />
          <Text style={[styles.summaryNum, { color: '#7c3aed', fontSize: 12 }]}>€{(totalEur / 1000).toFixed(0)}K</Text>
          <Text style={styles.summaryLabel}>Tutar</Text>
        </View>
      </View>
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={20} color="#94a3b8" />
        <TextInput style={styles.searchInput} placeholder="Tedarikçi, teklif no, ürün veya marka ara..." placeholderTextColor="#94a3b8" value={search} onChangeText={setSearch} />
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardIconWrap: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
  cardMeta: { flex: 1 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  cardSub: { fontSize: 11, color: '#64748b', marginTop: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  infoText: { fontSize: 12, color: '#64748b', flex: 1 },
  sep: { color: '#cbd5e1', fontSize: 12 },
  metricsRow: { flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, alignItems: 'center', marginTop: 4 },
  metric: { flex: 1, alignItems: 'center', gap: 2 },
  metricLabel: { fontSize: 9, color: '#94a3b8', fontWeight: '600' },
  metricValue: { fontSize: 12, fontWeight: '800', color: '#1e293b' },
  metricDivider: { width: 1, height: 28, backgroundColor: '#e2e8f0' },
});

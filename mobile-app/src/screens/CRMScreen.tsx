import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Dimensions, FlatList, Linking, Modal, ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { NavigationDrawer } from '../components/NavigationDrawer';
import DataService, { CRMActivity } from '../services/DataService';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 380;

// Excel serial date → okunabilir tarih
const excelDateToStr = (val: any): string => {
  if (!val) return '—';
  const num = Number(val);
  if (isNaN(num) || num === 0) return String(val);
  const date = new Date(Math.round((num - 25569) * 86400 * 1000));
  return date.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const excelDateTimeToStr = (val: any): string => {
  if (!val) return '—';
  const num = Number(val);
  if (isNaN(num) || num === 0) return String(val);
  const date = new Date(Math.round((num - 25569) * 86400 * 1000));
  return date.toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const DURUM_STYLE: Record<string, { bg: string; text: string }> = {
  'Yapılacak':  { bg: '#fef9c3', text: '#a16207' },
  'Yapıldı':    { bg: '#dcfce7', text: '#15803d' },
  'AÇIK':       { bg: '#e0f2fe', text: '#006290' },
  'KAPALI':     { bg: '#dcfce7', text: '#15803d' },
  'İptal':      { bg: '#fee2e2', text: '#dc2626' },
};

const TIP_ICON: Record<string, string> = {
  'Randevu':   'event',
  'Telefon':   'phone',
  'E-Posta':   'email',
  'Ziyaret':   'directions-walk',
  'Toplantı':  'groups',
};

const FILTER_TABS = ['Tümü', 'Yapılacak', 'Yapıldı', 'AÇIK', 'KAPALI'];

export const CRMScreen: React.FC = () => {
  const [allData, setAllData] = useState<CRMActivity[]>([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tümü');
  const [selected, setSelected] = useState<CRMActivity | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigation = useNavigation<any>();
  const TAB = ['Dashboard','Sales','Purchasing','Stock','CRM'];
  const handleNavigate = (screen: string) => {
    if (TAB.includes(screen)) { navigation.navigate('Tabs' as never, { screen } as never); }
    else { navigation.navigate(screen as never); }
  };

  useEffect(() => {
    setAllData(DataService.getCRMActivities());
  }, []);

  const filtered = useMemo(() => {
    let data = allData;
    if (activeFilter !== 'Tümü') {
      data = data.filter(d => d.DURUMU === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(d =>
        String(d.TICARI_UNVANI || '').toLowerCase().includes(q) ||
        String(d.KONU || '').toLowerCase().includes(q) ||
        String(d.AKTIVITE_SAHIBI || '').toLowerCase().includes(q) ||
        String(d.CARI_YETKILI || '').toLowerCase().includes(q) ||
        String(d.ADI_SOYADI || '').toLowerCase().includes(q)
      );
    }
    return data;
  }, [allData, search, activeFilter]);

  const counts = useMemo(() => ({
    toplam: allData.length,
    yapilacak: allData.filter(d => d.DURUMU === 'Yapılacak').length,
    yapildi: allData.filter(d => d.DURUMU === 'Yapıldı').length,
    acik: allData.filter(d => d.DURUMU === 'AÇIK').length,
  }), [allData]);

  const durumStyle = (d: string) => DURUM_STYLE[d] || { bg: '#f1f5f9', text: '#64748b' };
  const tipIcon = (t: string) => (TIP_ICON[t] || 'task') as any;

  const renderCard = ({ item }: { item: CRMActivity }) => {
    const ds = durumStyle(item.DURUMU);
    return (
      <TouchableOpacity style={styles.card} onPress={() => setSelected(item)} activeOpacity={0.75}>
        {/* Üst satır */}
        <View style={styles.cardTop}>
          <View style={[styles.tipIcon, { backgroundColor: ds.bg }]}>
            <MaterialIcons name={tipIcon(item.TIPI)} size={18} color={ds.text} />
          </View>
          <View style={styles.cardTopMid}>
            <Text style={styles.cardCompany} numberOfLines={1}>
              {item.TICARI_UNVANI || item.ADI_SOYADI || '—'}
            </Text>
            <Text style={styles.cardKonu} numberOfLines={1}>{item.KONU || '—'}</Text>
          </View>
          <View style={[styles.durumBadge, { backgroundColor: ds.bg }]}>
            <Text style={[styles.durumText, { color: ds.text }]}>{item.DURUMU || '—'}</Text>
          </View>
        </View>

        {/* Orta bilgiler */}
        <View style={styles.cardMid}>
          {item.TIPI ? (
            <View style={styles.infoChip}>
              <MaterialIcons name="label" size={12} color="#94a3b8" />
              <Text style={styles.infoChipText}>{item.TIPI}</Text>
            </View>
          ) : null}
          {item.AKTIVITE_SAHIBI ? (
            <View style={styles.infoChip}>
              <MaterialIcons name="person" size={12} color="#94a3b8" />
              <Text style={styles.infoChipText}>{item.AKTIVITE_SAHIBI}</Text>
            </View>
          ) : null}
          {item.GORUSME_SURESI ? (
            <View style={styles.infoChip}>
              <MaterialIcons name="timer" size={12} color="#94a3b8" />
              <Text style={styles.infoChipText}>{item.GORUSME_SURESI}</Text>
            </View>
          ) : null}
          {item.ILI_1 ? (
            <View style={styles.infoChip}>
              <MaterialIcons name="location-on" size={12} color="#94a3b8" />
              <Text style={styles.infoChipText}>{item.ILI_1}</Text>
            </View>
          ) : null}
        </View>

        {/* Tarih satırı */}
        <View style={styles.cardBottom}>
          <MaterialIcons name="calendar-today" size={12} color="#94a3b8" />
          <Text style={styles.dateText}>{excelDateTimeToStr(item.BASLAMA)}</Text>
          {item.BITIS ? (
            <>
              <Text style={styles.dateSep}>→</Text>
              <Text style={styles.dateText}>{excelDateTimeToStr(item.BITIS)}</Text>
            </>
          ) : null}
          {item.FIRSATADI ? (
            <View style={styles.firsatChip}>
              <MaterialIcons name="star" size={11} color="#a16207" />
              <Text style={styles.firsatText} numberOfLines={1}>{item.FIRSATADI}</Text>
            </View>
          ) : null}
        </View>

        {item.ACIKLAMA_NOTLAR ? (
          <Text style={styles.notlar} numberOfLines={2}>{item.ACIKLAMA_NOTLAR}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <NavigationDrawer isVisible={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={handleNavigate} />
      <Header
        title="ISAC Sense Digital"
        subtitle="CRM Aktiviteleri"
        onMenuPress={() => setDrawerOpen(true)} onNotificationPress={() => (navigation as any).navigate("Notifications")} onProfilePress={() => (navigation as any).navigate("Profile")}
      />

      {/* Özet Kartlar */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: '#e0f2fe' }]}>
          <Text style={[styles.summaryNum, { color: '#006290' }]}>{counts.toplam}</Text>
          <Text style={styles.summaryLabel}>Toplam</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#fef9c3' }]}>
          <Text style={[styles.summaryNum, { color: '#a16207' }]}>{counts.yapilacak}</Text>
          <Text style={styles.summaryLabel}>Yapılacak</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#dcfce7' }]}>
          <Text style={[styles.summaryNum, { color: '#15803d' }]}>{counts.yapildi}</Text>
          <Text style={styles.summaryLabel}>Yapıldı</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#e0f2fe' }]}>
          <Text style={[styles.summaryNum, { color: '#006290' }]}>{counts.acik}</Text>
          <Text style={styles.summaryLabel}>Açık</Text>
        </View>
      </View>

      {/* Arama */}
      <View style={styles.searchWrap}>
        <MaterialIcons name="search" size={20} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Müşteri, konu, yetkili ara..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <MaterialIcons name="close" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filtre Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterTab, activeFilter === tab && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[styles.filterTabText, activeFilter === tab && styles.filterTabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Liste */}
      <FlatList
        data={filtered}
        renderItem={renderCard}
        keyExtractor={(item, idx) => `${item.AKTIVITE_KODU || idx}`}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialIcons name="inbox" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>Aktivite bulunamadı</Text>
          </View>
        }
      />

      {/* Detay Modal */}
      {selected && (
        <Modal visible animationType="slide" transparent onRequestClose={() => setSelected(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHandle} />

              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <Text style={styles.modalCompany} numberOfLines={2}>
                    {selected.TICARI_UNVANI || selected.ADI_SOYADI || '—'}
                  </Text>
                  <Text style={styles.modalKonu}>{selected.KONU || '—'}</Text>
                </View>
                <TouchableOpacity onPress={() => setSelected(null)} style={styles.closeBtn}>
                  <MaterialIcons name="close" size={22} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Durum & Tip */}
                <View style={styles.modalBadgeRow}>
                  <View style={[styles.durumBadge, { backgroundColor: durumStyle(selected.DURUMU).bg }]}>
                    <Text style={[styles.durumText, { color: durumStyle(selected.DURUMU).text }]}>{selected.DURUMU || '—'}</Text>
                  </View>
                  {selected.TIPI ? (
                    <View style={styles.tipBadge}>
                      <MaterialIcons name={tipIcon(selected.TIPI)} size={13} color="#006290" />
                      <Text style={styles.tipBadgeText}>{selected.TIPI}</Text>
                    </View>
                  ) : null}
                  {selected.GORUSME_SURESI ? (
                    <View style={styles.tipBadge}>
                      <MaterialIcons name="timer" size={13} color="#006290" />
                      <Text style={styles.tipBadgeText}>{selected.GORUSME_SURESI}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Aktivite Bilgileri */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Aktivite Bilgileri</Text>
                  <DetailRow icon="tag" label="Aktivite Kodu" value={selected.AKTIVITE_KODU} />
                  <DetailRow icon="person" label="Aktivite Sahibi" value={selected.AKTIVITE_SAHIBI} />
                  <DetailRow icon="event" label="Başlama" value={excelDateTimeToStr(selected.BASLAMA)} />
                  <DetailRow icon="event-available" label="Bitiş" value={excelDateTimeToStr(selected.BITIS)} />
                  <DetailRow icon="timer" label="Görüşme Süresi" value={selected.GORUSME_SURESI} />
                  <DetailRow icon="update" label="Kayıt Tarihi" value={excelDateToStr(selected.EV_KAYIT_TARIHI)} />
                  <DetailRow icon="edit" label="Değiştiren" value={selected.EV_DEGISTIREN} />
                  <DetailRow icon="history" label="Değiştirme Tarihi" value={excelDateTimeToStr(selected.EV_DEGISTIRME_TARIHI)} />
                </View>

                {/* Müşteri Bilgileri */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Müşteri Bilgileri</Text>
                  <DetailRow icon="business" label="Cari Kodu" value={selected.CARIKODU} />
                  <DetailRow icon="person-outline" label="Ad Soyad" value={selected.ADI_SOYADI} />
                  <DetailRow icon="supervisor-account" label="Yetkili" value={selected.CARI_YETKILI} />
                  <DetailRow icon="work" label="Yetkili Görevi" value={selected.CARI_YETKILI_GOREVI} />
                  <DetailRow icon="group" label="Grup" value={selected.GRUBU} />
                  <DetailRow icon="toggle-on" label="Cari Aktif" value={selected.CARI_AKTIF} />
                </View>

                {/* İletişim */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>İletişim</Text>
                  {selected.TEL1 ? (
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${selected.TEL1}`)}>
                      <DetailRow icon="phone" label="Tel 1" value={selected.TEL1} highlight />
                    </TouchableOpacity>
                  ) : <DetailRow icon="phone" label="Tel 1" value={selected.TEL1} />}
                  {selected.TEL2 ? (
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${selected.TEL2}`)}>
                      <DetailRow icon="phone" label="Tel 2" value={selected.TEL2} highlight />
                    </TouchableOpacity>
                  ) : <DetailRow icon="phone" label="Tel 2" value={selected.TEL2} />}
                  {selected.CEP_TEL ? (
                    <TouchableOpacity onPress={() => Linking.openURL(`tel:${selected.CEP_TEL}`)}>
                      <DetailRow icon="smartphone" label="Cep Tel" value={selected.CEP_TEL} highlight />
                    </TouchableOpacity>
                  ) : <DetailRow icon="smartphone" label="Cep Tel" value={selected.CEP_TEL} />}
                  {selected.E_MAIL ? (
                    <TouchableOpacity onPress={() => Linking.openURL(`mailto:${selected.E_MAIL}`)}>
                      <DetailRow icon="email" label="E-Posta" value={selected.E_MAIL} highlight />
                    </TouchableOpacity>
                  ) : <DetailRow icon="email" label="E-Posta" value={selected.E_MAIL} />}
                  <DetailRow icon="location-on" label="Adres" value={selected.ADRESI_1} />
                  <DetailRow icon="map" label="İl / İlçe" value={[selected.ILI_1, selected.ILCESI_1].filter(Boolean).join(' / ')} />
                </View>

                {/* Fırsat */}
                {(selected.FIRSATKODU || selected.FIRSATADI) && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Fırsat</Text>
                    <DetailRow icon="star" label="Fırsat Kodu" value={selected.FIRSATKODU} />
                    <DetailRow icon="star-border" label="Fırsat Adı" value={selected.FIRSATADI} />
                  </View>
                )}

                {/* Notlar */}
                {selected.ACIKLAMA_NOTLAR ? (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Açıklama / Notlar</Text>
                    <View style={styles.notlarBox}>
                      <Text style={styles.notlarFullText}>{selected.ACIKLAMA_NOTLAR}</Text>
                    </View>
                  </View>
                ) : null}

                <View style={{ height: 40 }} />
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fe' },

  // Özet
  summaryRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 10 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 10, alignItems: 'center', gap: 3 },
  summaryNum: { fontSize: isSmallScreen ? 18 : 22, fontWeight: '800' },
  summaryLabel: { fontSize: 10, color: '#64748b', fontWeight: '600' },

  // Arama
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    marginHorizontal: 16, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    gap: 8, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#1e293b' },

  // Filtre
  filterScroll: { maxHeight: 44, marginBottom: 10 },
  filterContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0',
  },
  filterTabActive: { backgroundColor: '#006290', borderColor: '#006290' },
  filterTabText: { fontSize: 12, fontWeight: '600', color: '#64748b' },
  filterTabTextActive: { color: '#fff' },

  // Liste
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: '#94a3b8', fontSize: 14 },

  // Kart
  card: {
    backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  tipIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTopMid: { flex: 1 },
  cardCompany: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
  cardKonu: { fontSize: 12, color: '#64748b', marginTop: 2 },
  durumBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  durumText: { fontSize: 11, fontWeight: '700' },
  cardMid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  infoChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#f8fafc', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  infoChipText: { fontSize: 11, color: '#64748b' },
  cardBottom: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  dateText: { fontSize: 11, color: '#94a3b8' },
  dateSep: { fontSize: 11, color: '#cbd5e1' },
  firsatChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#fef9c3', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 4,
  },
  firsatText: { fontSize: 10, color: '#a16207', fontWeight: '600', maxWidth: 120 },
  notlar: { fontSize: 12, color: '#94a3b8', marginTop: 8, lineHeight: 16 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '92%', paddingHorizontal: 20, paddingBottom: 20,
  },
  modalHandle: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 16 },
  modalHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  modalHeaderLeft: { flex: 1 },
  modalCompany: { fontSize: 16, fontWeight: '800', color: '#1e293b', lineHeight: 22 },
  modalKonu: { fontSize: 13, color: '#64748b', marginTop: 4 },
  closeBtn: { padding: 4 },
  modalBadgeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  tipBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#e0f2fe', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
  },
  tipBadgeText: { fontSize: 12, color: '#006290', fontWeight: '600' },

  // Detay Section
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '800', color: '#006290', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  detailIcon: { marginRight: 10, marginTop: 1 },
  detailLabel: { width: 110, fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  detailValue: { flex: 1, fontSize: 13, color: '#1e293b', fontWeight: '500' },
  detailValueHighlight: { color: '#006290', textDecorationLine: 'underline' },

  // Notlar
  notlarBox: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 14 },
  notlarFullText: { fontSize: 13, color: '#475569', lineHeight: 20 },
});

const DetailRow = ({ icon, label, value, highlight }: { icon: string; label: string; value?: any; highlight?: boolean }) => (
  <View style={styles.detailRow}>
    <MaterialIcons name={icon as any} size={15} color="#94a3b8" style={styles.detailIcon} />
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, highlight && styles.detailValueHighlight]} numberOfLines={2}>
      {value || '—'}
    </Text>
  </View>
);

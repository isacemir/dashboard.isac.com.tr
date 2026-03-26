import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { NavigationDrawer } from '../components/NavigationDrawer';

const { width } = Dimensions.get('window');
const TAB = ['Dashboard', 'Sales', 'Purchasing', 'Stock', 'CRM'];

const NOTIFICATIONS = [
  {
    id: 1,
    type: 'critical',
    icon: 'error',
    iconColor: '#b7131a',
    iconBg: 'rgba(183,19,26,0.1)',
    title: 'Kritik Stok Uyarısı',
    time: 'Az önce',
    text: 'Depo A-12 biriminde hammadde seviyeleri kritik eşiğin altına düştü. Üretim bandı durma riskiyle karşı karşıya.',
    borderColor: '#b7131a',
    actions: ['Envantere Git', 'Kapat'],
  },
  {
    id: 2,
    type: 'warning',
    icon: 'pending-actions',
    iconColor: '#7b5500',
    iconBg: 'rgba(123,85,0,0.1)',
    title: 'Teklif Onayı Bekleniyor',
    time: '14 dakika önce',
    text: 'PRJ-402 kodlu proje için hazırlanan maliyet analizi ve teklif formu yönetici onayına sunuldu.',
    borderColor: '#f59e0b',
    actions: [],
  },
  {
    id: 3,
    type: 'info',
    icon: 'assignment-turned-in',
    iconColor: '#006290',
    iconBg: 'rgba(0,98,144,0.1)',
    title: 'Yeni Aktivite Atandı',
    time: '1 saat önce',
    text: 'Haftalık sistem güvenliği denetimi aktivitesi iş listenize eklendi. Bitiş tarihi: Cuma 17:00.',
    borderColor: '#006290',
    actions: [],
  },
  {
    id: 4,
    type: 'regular',
    icon: 'update',
    iconColor: '#94a3b8',
    iconBg: '#f1f5f9',
    title: 'Sistem Güncellemesi Tamamlandı',
    time: 'Dün',
    text: 'v2.4.0 güvenlik yaması başarıyla uygulandı. Tüm sensörler optimize edildi.',
    borderColor: 'transparent',
    actions: [],
  },
];

export const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleNavigate = (screen: string) => {
    if (TAB.includes(screen)) navigation.navigate('Tabs' as never, { screen } as never);
    else navigation.navigate(screen as never);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <NavigationDrawer isVisible={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={handleNavigate} />
      <Header
        title="ISAC Sense Digital"
        subtitle="Bildirimler"
        onMenuPress={() => setDrawerOpen(true)}
        onNotificationPress={() => {}}
        onProfilePress={() => navigation.navigate('Profile' as never)}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Başlık + Butonlar */}
        <View style={styles.topRow}>
          <View>
            <Text style={styles.liveLabel}>Canlı Akış</Text>
            <Text style={styles.pageTitle}>Bildirimler</Text>
          </View>
          <View style={styles.topButtons}>
            <TouchableOpacity style={styles.btnPrimary}>
              <MaterialIcons name="done-all" size={14} color="#006290" />
              <Text style={styles.btnPrimaryText}>Tümünü Okundu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnDanger}>
              <MaterialIcons name="delete-sweep" size={14} color="#b7131a" />
              <Text style={styles.btnDangerText}>Temizle</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bildirim Kartları */}
        {NOTIFICATIONS.map(n => (
          <View key={n.id} style={[styles.card, n.borderColor !== 'transparent' && { borderLeftWidth: 4, borderLeftColor: n.borderColor }, n.type === 'regular' && { opacity: 0.75 }]}>
            <View style={styles.cardTop}>
              <View style={[styles.iconWrap, { backgroundColor: n.iconBg }]}>
                <MaterialIcons name={n.icon as any} size={24} color={n.iconColor} />
              </View>
              <View style={styles.cardTopText}>
                <Text style={styles.cardTitle} numberOfLines={2}>{n.title}</Text>
                <Text style={styles.cardTime}>{n.time}</Text>
              </View>
            </View>
            <Text style={styles.cardText}>{n.text}</Text>
            {n.actions.length > 0 && (
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Text style={styles.actionBtnText}>{n.actions[0]}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.actionBtnSecondary}>{n.actions[1]}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {/* Alt Bilgi */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>4 / 24 bildirim gösteriliyor. Geçmiş veriler 30 günde bir arşivlenir.</Text>
          <TouchableOpacity style={styles.loadMoreBtn}>
            <Text style={styles.loadMoreText}>Daha Fazla Yükle</Text>
          </TouchableOpacity>
        </View>

        {/* Insight Kartı */}
        <View style={styles.insightCard}>
          <View style={styles.insightLeft}>
            <View style={styles.insightIconWrap}>
              <MaterialIcons name="analytics" size={28} color="white" />
            </View>
            <View style={styles.insightText}>
              <Text style={styles.insightTitle}>Haftalık Rapor</Text>
              <Text style={styles.insightDesc}>Uyarı sıklığı geçen haftaya göre %14 azaldı.</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.insightBtn}>
            <Text style={styles.insightBtnText}>Görüntüle</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fe' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 },

  topRow: { marginBottom: 20 },
  liveLabel: { fontSize: 11, fontWeight: '700', color: '#006290', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 },
  pageTitle: { fontSize: 26, fontWeight: '800', color: '#181c20' },
  topButtons: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,98,144,0.1)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnPrimaryText: { fontSize: 12, fontWeight: '600', color: '#006290' },
  btnDanger: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  btnDangerText: { fontSize: 12, fontWeight: '600', color: '#b7131a' },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTopText: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#181c20', lineHeight: 20 },
  cardTime: { fontSize: 11, color: '#94a3b8', marginTop: 3, fontWeight: '500' },
  cardText: { fontSize: 13, color: '#64748b', lineHeight: 20 },
  cardActions: { flexDirection: 'row', gap: 20, marginTop: 12 },
  actionBtn: { backgroundColor: 'rgba(183,19,26,0.08)', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8 },
  actionBtnText: { fontSize: 12, fontWeight: '700', color: '#b7131a' },
  actionBtnSecondary: { fontSize: 12, fontWeight: '600', color: '#94a3b8', paddingVertical: 7 },

  footer: { marginTop: 8, marginBottom: 16, gap: 12 },
  footerText: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic' },
  loadMoreBtn: { backgroundColor: '#006290', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  loadMoreText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  insightCard: {
    backgroundColor: '#006290', borderRadius: 20, padding: 16,
    flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  insightLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  insightIconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  insightText: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: '700', color: '#fff' },
  insightDesc: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  insightBtn: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  insightBtnText: { fontSize: 12, fontWeight: '700', color: '#006290' },
});

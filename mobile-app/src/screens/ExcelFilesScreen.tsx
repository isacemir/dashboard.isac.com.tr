import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { NavigationDrawer } from '../components/NavigationDrawer';

const FILES = [
  { name: 'CRM Aktivite Raporu',       file: 'crm.xlsx',                      icon: 'people',         color: '#006290', bg: '#e0f2fe', desc: 'Müşteri aktiviteleri ve iletişim geçmişi',    size: '245 KB', updated: '26 Mar 2026' },
  { name: 'Satış Raporu',              file: 'satis-raporu.xlsx',              icon: 'trending-up',    color: '#15803d', bg: '#dcfce7', desc: 'Aylık ve yıllık satış performans verileri',   size: '512 KB', updated: '26 Mar 2026' },
  { name: 'Sipariş Raporu',            file: 'siparis-raporu.xlsx',            icon: 'receipt-long',   color: '#a16207', bg: '#fef9c3', desc: 'Açık, kapalı ve iptal sipariş listesi',       size: '388 KB', updated: '26 Mar 2026' },
  { name: 'Teklif Raporu',             file: 'teklif-raporu.xlsx',             icon: 'description',    color: '#7c3aed', bg: '#f3e8ff', desc: 'Müşteri teklifleri ve onay durumları',         size: '290 KB', updated: '26 Mar 2026' },
  { name: 'Satınalma Teklif Raporu',   file: 'SATINALMA-TEKLIF.xlsx',          icon: 'shopping-cart',  color: '#0369a1', bg: '#e0f2fe', desc: 'Tedarikçi teklifleri ve karşılaştırma',       size: '178 KB', updated: '26 Mar 2026' },
  { name: 'Satınalma Fatura Raporu',   file: 'satınalma-fatura-raporu.xlsx',   icon: 'request-quote',  color: '#b7131a', bg: '#fee2e2', desc: 'Tedarikçi faturaları ve ödeme durumları',     size: '421 KB', updated: '26 Mar 2026' },
  { name: 'Stok Sipariş Raporu',       file: 'stok-sipariş-raporu.xlsx',       icon: 'inventory',      color: '#7b5500', bg: '#fef3c7', desc: 'Stok durumu ve bekleyen siparişler',           size: '334 KB', updated: '26 Mar 2026' },
];

export const ExcelFilesScreen: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigation = useNavigation<any>();
  const TAB = ['Dashboard','Sales','Purchasing','Stock','CRM'];
  const handleNavigate = (screen: string) => {
    if (TAB.includes(screen)) { navigation.navigate('Tabs' as never, { screen } as never); }
    else { navigation.navigate(screen as never); }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <NavigationDrawer isVisible={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={handleNavigate} />
      <Header title="ISAC Sense Digital" subtitle="Excel Dosyaları" onMenuPress={() => setDrawerOpen(true)} onNotificationPress={() => (navigation as any).navigate("Notifications")} onProfilePress={() => (navigation as any).navigate("Profile")} />

      <View style={styles.infoCard}>
        <MaterialIcons name="info-outline" size={18} color="#006290" />
        <Text style={styles.infoText}>Tüm raporlar güncel verilerle senkronize edilmiştir.</Text>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {FILES.map((file, idx) => (
          <TouchableOpacity key={idx} style={styles.card} activeOpacity={0.7}>
            <View style={[styles.iconWrap, { backgroundColor: file.bg }]}>
              <MaterialIcons name={file.icon as any} size={26} color={file.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{file.name}</Text>
              <Text style={styles.cardDesc}>{file.desc}</Text>
              <View style={styles.cardMeta}>
                <View style={styles.metaItem}><MaterialIcons name="folder" size={12} color="#94a3b8" /><Text style={styles.metaText}>{file.file}</Text></View>
                <View style={styles.metaItem}><MaterialIcons name="storage" size={12} color="#94a3b8" /><Text style={styles.metaText}>{file.size}</Text></View>
                <View style={styles.metaItem}><MaterialIcons name="update" size={12} color="#94a3b8" /><Text style={styles.metaText}>{file.updated}</Text></View>
              </View>
            </View>
            <View style={styles.downloadBtn}>
              <MaterialIcons name="download" size={20} color="#006290" />
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fe' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: '#e0f2fe', marginHorizontal: 16, borderRadius: 12, padding: 12, marginBottom: 16 },
  infoText: { flex: 1, fontSize: 12, color: '#006290', lineHeight: 18 },
  list: { flex: 1, paddingHorizontal: 16 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, marginBottom: 12, padding: 16, gap: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  iconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardContent: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  cardDesc: { fontSize: 12, color: '#64748b', lineHeight: 16 },
  cardMeta: { flexDirection: 'row', gap: 10, flexWrap: 'wrap', marginTop: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: 10, color: '#94a3b8' },
  downloadBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center' },
});

import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationDrawer } from '../components/NavigationDrawer';

const { width } = Dimensions.get('window');
const TAB = ['Dashboard', 'Sales', 'Purchasing', 'Stock', 'CRM'];

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNavigate = (screen: string) => {
    if (TAB.includes(screen)) navigation.navigate('Tabs' as never, { screen } as never);
    else navigation.navigate(screen as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationDrawer isVisible={drawerOpen} onClose={() => setDrawerOpen(false)} onNavigate={handleNavigate} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => setDrawerOpen(true)}>
            <MaterialIcons name="menu" size={24} color="#006290" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ISAC Sense</Text>
          <View style={styles.headerProfile}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQIcimlWxMZ00mcn4wEhuMMFTlmTr0hCgC4rQx-LIv29JrpV-Mdzd9ks6oVyZBFfSY7vWlb8iVbx9ir_Icg875ks4Kev4Nume72yGyiBHb5c23du_wp39NklWtcPpTKOVjN86FzG8ptwOIcXd74NudmFYUEBQsdu2QBF3Bfnw250bS35H0VTnfDXpL8pVDHJk6bLgQgbP-knCJRA82AxE1BxACWg-zqyLJXOuItbxWDHos992Ra81IJklQbtppRReecHkVUId1xQ' }}
              style={styles.headerProfileImage}
            />
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCq_tLGUckSRyHO-4XHNjxR7iQPuB9WWM1XOwlPI4bQONOHp1BXH25RSh0ioTRbyfN6POSPuBwfMvzzxqMab8v1yhGVL5wzLqF-KsqDqcnuyWVz6Lbxbhv0MXejc6m0aTqEdmRMyhWlcLaeUosW5SV1qcBNkK_GBs5YbfgjOL76I4iLIsolWeuVF8ydwBYKDBkfJ1vrT_ZPrLFET4QWpkkty567yQu4E0ezLQ9sLIXLYu_Coa5B0qG50lCxih7MeNIB-BZrLeXfA' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Selim Ak</Text>
            <Text style={styles.profileTitle}>Satış Temsilcisi</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Bölge</Text>
                <Text style={styles.infoValue}>Marmara</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>ID</Text>
                <Text style={styles.infoValue}>#2904-S</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Section */}
        <View style={styles.performanceSection}>
          <View style={styles.performanceCard}>
            <View style={styles.performanceHeader}>
              <View>
                <Text style={styles.performanceTitle}>Satış Performansı</Text>
                <Text style={styles.performanceSubtitle}>Bu Ayki Hedef Gerçekleşme Oranı</Text>
              </View>
              <Text style={styles.performancePercentage}>%85</Text>
            </View>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Mevcut: 425.000 ₺</Text>
                <Text style={styles.progressLabel}>Hedef: 500.000 ₺</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '85%' }]} />
              </View>
            </View>
            
            <View style={styles.trendContainer}>
              <MaterialIcons name="trending-up" size={16} color="#b7131a" />
              <Text style={styles.trendText}>Geçen aya göre %12 artış</Text>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsSection}>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <MaterialIcons name="payments" size={24} color="#006290" />
              </View>
              <Text style={styles.statLabel}>Aylık Ciro</Text>
              <Text style={styles.statValue}>₺425.0K</Text>
            </View>
            
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <MaterialIcons name="calendar-today" size={24} color="#7b5500" />
              </View>
              <Text style={styles.statLabel}>Aktiviteler</Text>
              <Text style={styles.statValue}>124 Görüşme</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.settingsTitle}>Profil Ayarları</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <MaterialIcons name="person-outline" size={24} color="#3f4850" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Hesap Bilgileri</Text>
                <Text style={styles.settingSubtitle}>Kişisel detaylar ve bölge ayarları</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6f7881" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <MaterialIcons name="lock-open" size={24} color="#3f4850" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Güvenlik</Text>
                <Text style={styles.settingSubtitle}>Şifre ve iki faktörlü doğrulama</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6f7881" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
              <View style={styles.settingIcon}>
                <MaterialIcons name="notifications-active" size={24} color="#3f4850" />
              </View>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Bildirimler</Text>
                <Text style={styles.settingSubtitle}>Anlık uyarılar ve e-posta tercihleri</Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#6f7881" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton}>
            <MaterialIcons name="logout" size={24} color="white" />
            <Text style={styles.logoutText}>Oturumu Kapat</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>isac_sense_admin v2.4.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fe',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f7f9fe',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#006290',
    fontStyle: 'italic',
  },
  headerProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0, 98, 144, 0.2)',
  },
  headerProfileImage: {
    width: '100%',
    height: '100%',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  editButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#006290',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#181c20',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 14,
    color: '#006290',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  infoBox: {
    backgroundColor: '#f1f4f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 10,
    color: '#6f7881',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#181c20',
    marginTop: 2,
  },
  performanceSection: {
    marginVertical: 20,
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 10,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  performanceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c20',
  },
  performanceSubtitle: {
    fontSize: 12,
    color: '#6f7881',
    marginTop: 4,
  },
  performancePercentage: {
    fontSize: 32,
    fontWeight: '900',
    color: '#006290',
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 10,
    color: '#6f7881',
  },
  progressBar: {
    height: 16,
    backgroundColor: '#dfe3e8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#006290',
    borderRadius: 8,
    shadowColor: 'rgba(0, 98, 144, 0.3)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 5,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  trendText: {
    fontSize: 12,
    color: '#b7131a',
    fontWeight: '600',
  },
  statsSection: {
    marginVertical: 20,
  },
  statsRow: {
    gap: 16,
  },
  statCard: {
    backgroundColor: '#e5e8ed',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 98, 144, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#6f7881',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#181c20',
    marginTop: 4,
  },
  settingsSection: {
    marginVertical: 20,
  },
  settingsTitle: {
    fontSize: 10,
    color: '#6f7881',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f4f9',
  },
  settingItemLast: {
    borderBottomWidth: 0,
  },
  settingIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#dfe3e8',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181c20',
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#6f7881',
    marginTop: 2,
  },
  logoutSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 40,
  },
  logoutButton: {
    backgroundColor: '#b7131a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    shadowColor: '#b7131a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 16,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  versionText: {
    fontSize: 10,
    color: '#6f7881',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

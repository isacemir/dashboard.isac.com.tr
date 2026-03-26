import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(width * 0.85, 320);

interface NavigationDrawerProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({ isVisible, onClose, onNavigate }) => {
  if (!isVisible) return null;

  const navigate = (screen: string) => {
    onClose();
    onNavigate(screen);
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.drawer}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxhFa8Sv7nUP29pQO93es341wy-zbe7l7GCgSzdrWDzM7xC6UqrjI0PJUePCDiPJjUVdbeTus-dUkuu5LpxohTF7TGZtuDG2tvq0JAyJptb4pBjbvxCAtvWd01dEbrAeQtYnpeyr6_4RV6JU-OPBaztodb--ympZTYkZy4iUdpbM70TpAl5Tx-PPc7YVu-4jMtaSmYFYCng03XBNzQdPAPXbpPkPydS00cLTmF-s7VRgaahLj1oCEUUTKC-Nw-bJDHc2RSCCj5_Q' }}
                style={styles.avatar}
              />
            </View>
            <View>
              <Text style={styles.profileName}>Analyst Pro</Text>
              <Text style={styles.profileEmail}>isac_sense_admin</Text>
            </View>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>System Status</Text>
            <Text style={styles.versionText}>v2.4.0</Text>
          </View>
        </View>

        {/* Navigation Items */}
        <ScrollView style={styles.navigationItems} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.navItem} onPress={() => navigate('Dashboard')}>
            <MaterialIcons name="dashboard" size={24} color="#006290" />
            <Text style={styles.navItemText}>Genel Bakış</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigate('CRM')}>
            <MaterialIcons name="people" size={24} color="#006290" />
            <Text style={styles.navItemText}>CRM Aktiviteleri</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigate('Sales')}>
            <MaterialIcons name="trending-up" size={24} color="#006290" />
            <Text style={styles.navItemText}>Satış Raporları</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigate('OrderReport')}>
            <MaterialIcons name="receipt" size={24} color="#006290" />
            <Text style={styles.navItemText}>Sipariş Raporları</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigate('OfferReport')}>
            <MaterialIcons name="description" size={24} color="#006290" />
            <Text style={styles.navItemText}>Teklif Raporları</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigate('PurchasingOffer')}>
            <MaterialIcons name="shopping-cart" size={24} color="#006290" />
            <Text style={styles.navItemText}>Satınalma Teklifleri</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigate('PurchasingInvoice')}>
            <MaterialIcons name="request-quote" size={24} color="#006290" />
            <Text style={styles.navItemText}>Satınalma Faturaları</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigate('StockOrder')}>
            <MaterialIcons name="inventory" size={24} color="#006290" />
            <Text style={styles.navItemText}>Stok Siparişleri</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => navigate('ExcelFiles')}>
            <MaterialIcons name="folder" size={24} color="#006290" />
            <Text style={styles.navItemText}>Excel Dosyaları</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.navItem} onPress={onClose}>
            <MaterialIcons name="settings" size={24} color="#64748B" />
            <Text style={styles.navItemText}>Ayarlar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={onClose}>
            <MaterialIcons name="logout" size={24} color="#64748B" />
            <Text style={styles.navItemText}>Çıkış</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
    paddingTop: 50,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    backgroundColor: '#f7f9fe',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 40,
    elevation: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    flex: 1,
  },
  profileHeader: {
    padding: width < 380 ? 16 : 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    width: width < 380 ? 40 : 48,
    height: width < 380 ? 40 : 48,
    borderRadius: width < 380 ? 10 : 12,
    backgroundColor: '#e3f2fd',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: width < 380 ? 14 : 16,
    fontWeight: '900',
    color: '#006290',
    fontFamily: 'Manrope',
  },
  profileEmail: {
    fontSize: width < 380 ? 10 : 12,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'Manrope',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(0, 98, 144, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  versionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  navigation: {
    flex: 1,
    paddingVertical: 16,
  },
  navItemActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    backgroundColor: '#006290',
    borderRadius: 8,
  },
  navigationItems: {
    flex: 1,
    paddingVertical: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  navItemText: {
    fontSize: width < 380 ? 12 : 14,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'Manrope',
  },
  navTextActive: {
    fontSize: width < 380 ? 12 : 14,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'Manrope',
  },
  navText: {
    fontSize: width < 380 ? 12 : 14,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: 'Manrope',
  },
  footer: {
    margin: width < 380 ? 12 : 16,
    marginBottom: width < 380 ? 16 : 24,
    padding: width < 380 ? 12 : 16,
    backgroundColor: 'rgba(0, 98, 144, 0.1)',
    borderRadius: width < 380 ? 12 : 16,
  },
  footerTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#006290',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e3f2fd',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#006290',
    borderRadius: 3,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(0, 98, 144, 0.7)',
  },
});

import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Header } from '../components/Header';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < 380;
const isTablet = width > 768;

const stockAlerts = [
  {
    id: 1,
    product: 'Organik Zeytinyağı 5L',
    currentStock: 2,
    criticalLevel: 10,
    description: 'Kritik seviye: 10 Adet. Hemen sipariş oluşturulmalı.',
    percentage: 20,
  },
  {
    id: 2,
    product: 'MacBook Pro M3',
    currentStock: 1,
    criticalLevel: 3,
    description: 'Kritik seviye: 3 Adet. Bekleyen 4 sipariş var.',
    percentage: 33,
  },
];

const categories = [
  'Tümü',
  'Gıda & İçecek',
  'Teknoloji',
  'Ev Tekstili',
  'Kozmetik',
  'Ofis Malzemeleri',
];

const products = [
  {
    id: 1,
    name: 'Red Velocity Runner',
    category: 'Teknoloji / Giyim',
    stock: 124,
    critical: 15,
    status: 'In Stock',
    statusColor: '#006290',
    statusBg: '#00629090',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkMmKBfZtAMzAJK6apMB1CqYp8mvnRLVCYDiUIVfhgsI3PgOtF57nmw1Sc5j5qLhUSTFU7CjJA0ikXCZfVrrp_9YygHPPbqGe698v7kETH-7BwhZDR8x_RSau1NCH45yYppC5nCgXSsuKg51iRfvfWd81Z2Ke7rihVy9vD56NXV6z-X5fYhXXYthdEamN_WxiFUAqbLvXg5TX2VIRFkPSz8Rj_CkQPngxmxTrTlHYGc-XU4K7pTie5qMEZS07I6NkQwhD5eiJTkw',
  },
  {
    id: 2,
    name: 'Arctic Smart Watch V2',
    category: 'Teknoloji / Aksesuar',
    stock: 18,
    critical: 20,
    status: 'Limited',
    statusColor: '#7b5500',
    statusBg: '#ffba3890',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeE2H2ebjOKHoCzAL_rKdtYrlV4ulyh60olL_pMSUaRwcSBh62rFahNSFUUqUXMfqsoqn7PokVjdY-bEehEfGKdJlauZQX5mShud3GvEF3Wf6Db060zC7y4nqanb3GYvZ5Ji6RiEFdL5BVGkdjCiDa7XoOPlPVlugwn5HTlDzhFM2t_UtmD2MSZWzbzsB8jV9_2jEdDQF-BqLobel6gGt5ERZZbdC_Iyy-KdVkiqOJm0F8fPN-kGyzh4cODTb7d6KtVb1ZIVf5jw',
  },
  {
    id: 3,
    name: 'Obsidian Audio Pods',
    category: 'Teknoloji / Ses',
    stock: 56,
    critical: 10,
    status: 'In Stock',
    statusColor: '#006290',
    statusBg: '#00629090',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNqBDyjK9I9Wm5Z6Ojyf7G_MNyq-__hPC3_gcAVfk97T5XX9vpWZt5sg7vIVksxP_G1qKtrN_R_poB1ZIiQc0XnqhbFsfaxRFmpeoBi8Gq-3D_34sei5cSbuWiN1x92bEQ_ydc29AjX7uHauAKMjclj-gqxSbOb-7jYufPQp6rg15e3C_pCqPtGVeLRfk9noQ3M_a0K8uvXnhGTHKKqPCPUfutgDZlqI4wNim1GzG2DuSxRBfhSlU24CREtcgTbhOFppKjdRK9hA',
  },
];

export const StockScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="ISAC Sense Digital"
        subtitle="Stok & Sipariş"
        showNotification={true}
        showProfile={true}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Stok & Sipariş</Text>
          <Text style={styles.headerSubtitle}>Envanterinizi editorial hassasiyetle yönetin.</Text>
        </View>

        {/* Critical Stock Alerts */}
        <View style={styles.alertsSection}>
          <View style={styles.alertsHeader}>
            <Text style={styles.alertsTitle}>Kritik Stok Uyarıları</Text>
            <View style={styles.alertBadge}>
              <Text style={styles.alertBadgeText}>3 Acil Durum</Text>
            </View>
          </View>
          
          {stockAlerts.map((alert) => (
            <View key={alert.id} style={styles.alertCard}>
              <View style={styles.alertIcon}>
                <MaterialIcons name="warning" size={24} color="#db322f" />
              </View>
              <View style={styles.alertContent}>
                <View style={styles.alertHeader}>
                  <Text style={styles.alertProduct}>{alert.product}</Text>
                  <Text style={styles.alertStock}>{alert.currentStock} Adet</Text>
                </View>
                <Text style={styles.alertDescription}>{alert.description}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${alert.percentage}%` }]} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Category Filters */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selectedCategory === category && styles.categoryButtonActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Grid */}
        <View style={styles.productsSection}>
          {products.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <View style={styles.productImageContainer}>
                <Image source={{ uri: product.image }} style={styles.productImage} />
                <View style={[styles.statusBadge, { backgroundColor: product.statusBg }]}>
                  <Text style={[styles.statusText, { color: product.statusColor }]}>
                    {product.status}
                  </Text>
                </View>
              </View>
              
              <View style={styles.productContent}>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productName}>{product.name}</Text>
                
                <View style={styles.productStats}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Stok</Text>
                    <Text style={[styles.statValue, { color: '#006290' }]}>
                      {product.stock}
                    </Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Kritik</Text>
                    <Text style={[styles.statValue, { color: '#181c20' }]}>
                      {product.critical}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="qr-code-scanner" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  
  // Header
  header: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Inter',
  },
  
  // Alerts Section
  alertsSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  alertsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#db322f',
    fontFamily: 'Manrope',
  },
  alertBadge: {
    backgroundColor: '#ffdad6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  alertBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#db322f',
    fontFamily: 'Inter',
  },
  alertCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    borderLeftWidth: 4,
    borderLeftColor: '#db322f',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 40,
    elevation: 5,
  },
  alertIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#db322f10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  alertProduct: {
    fontSize: 16,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
    flex: 1,
  },
  alertStock: {
    fontSize: 14,
    fontWeight: '700',
    color: '#db322f',
    fontFamily: 'Inter',
  },
  alertDescription: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Inter',
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f1f4f9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#db322f',
    borderRadius: 3,
  },
  
  // Categories Section
  categoriesSection: {
    marginBottom: 32,
  },
  categoryButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f4f9',
    marginLeft: 24,
  },
  categoryButtonActive: {
    backgroundColor: '#006290',
    shadowColor: '#006290',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3f4850',
    fontFamily: 'Inter',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  
  // Products Section
  productsSection: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: isSmallScreen ? '100%' : '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
    elevation: 5,
  },
  productImageContainer: {
    position: 'relative',
    height: 192,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Inter',
  },
  productContent: {
    padding: 24,
  },
  productCategory: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#64748B',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#181c20',
    fontFamily: 'Manrope',
    marginBottom: 16,
  },
  productStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f1f4f9',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#64748B',
    fontFamily: 'Inter',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Manrope',
  },
  
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 112,
    right: 24,
    width: 64,
    height: 64,
    backgroundColor: '#006290',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#006290',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
});

# 📱 Mobil Ana Sayfa Analizi ve React Native Dönüşümü

## 🎯 **HTML Tasarım Analizi**

### **Mevcut HTML Yapısı**
- **Framework**: Tailwind CSS + Material Design 3.0
- **Layout**: Responsive grid system
- **Components**: KPI cards, charts, navigation
- **Color Scheme**: Material Design 3.0 color palette
- **Typography**: Manrope (headline) + Inter (label)

---

## 🏗️ **React Native Component Yapısı**

### **1. Ana Sayfa Component'leri**

#### **DashboardScreen.tsx**
```typescript
import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { KPICard } from '../components/KPICard';
import { SalesTrendChart } from '../components/SalesTrendChart';
import { RegionalDistribution } from '../components/RegionalDistribution';
import { BottomNavigation } from '../components/BottomNavigation';

export const DashboardScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header 
        title="ISAC Sense Digital"
        subtitle="Yönetim Özeti"
        showNotification={true}
        showProfile={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.pageTitle}>
          <Text style={styles.pageSubtitle}>Genel Bakış</Text>
          <Text style={styles.pageTitle}>Yönetim Özeti</Text>
        </View>

        {/* Ana KPI Kartları */}
        <View style={styles.kpiGrid}>
          <KPICard
            title="Toplam Satış (Ciro)"
            value="€1.725.811"
            trend="+12.4%"
            icon="payments"
            color="primary"
            size="large"
          />
          <KPICard
            title="Bekleyen Siparişler"
            value="€6.847.459"
            icon="shopping_cart"
            color="tertiary"
            size="large"
          />
        </View>

        {/* Horizontal Scroll KPI'lar */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalKPIContainer}
        >
          <KPICard
            title="Açık Teklifler"
            value="€6.435.028"
            subtitle="Aktif Süreçler"
            icon="description"
            color="primary"
            size="small"
          />
          <KPICard
            title="Kritik Stok"
            value="105"
            subtitle="Acil İkmal"
            icon="inventory_2"
            color="secondary"
            size="small"
          />
          <KPICard
            title="CRM Aktivite"
            value="21.028"
            subtitle="Kayıtlı Etkileşim"
            icon="groups"
            color="tertiary"
            size="small"
          />
        </ScrollView>

        {/* Satış Trendi */}
        <SalesTrendChart
          title="SATIŞ TRENDİ"
          subtitle="AYLIK CİRO"
          data={salesTrendData}
        />

        {/* Bölgesel Dağılım */}
        <RegionalDistribution
          title="BRÜT DAĞILIM"
          subtitle="Bölgesel Satış Performansı"
          data={regionalData}
        />

        {/* Rapor İndir Butonu */}
        <View style={styles.actionButtonContainer}>
          <ActionButton
            title="Raporu İndir"
            icon="file_download"
            onPress={() => handleDownloadReport()}
          />
        </View>
      </ScrollView>

      <BottomNavigation activeTab="dashboard" />
    </SafeAreaView>
  );
};
```

---

## 🎨 **Component Detayları**

### **1. Header Component**

#### **Header.tsx**
```typescript
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showNotification?: boolean;
  showProfile?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showNotification = true,
  showProfile = true,
  onMenuPress,
  onNotificationPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
          <MaterialIcons name="menu" size={24} color="#006290" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>{title}</Text>
          {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      
      <View style={styles.headerRight}>
        {showNotification && (
          <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
            <MaterialIcons name="notifications" size={24} color="#64748B" />
          </TouchableOpacity>
        )}
        {showProfile && (
          <TouchableOpacity onPress={onProfilePress} style={styles.profileButton}>
            <Image 
              source={{ uri: 'https://lh3.googleusercontent.com/...' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
```

### **2. KPI Card Component**

#### **KPICard.tsx**
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  color: 'primary' | 'secondary' | 'tertiary';
  trend?: string;
  size: 'large' | 'small';
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  trend,
  size,
}) => {
  const cardStyles = [
    styles.card,
    size === 'large' ? styles.cardLarge : styles.cardSmall,
    color === 'primary' && styles.cardPrimary,
    color === 'secondary' && styles.cardSecondary,
    color === 'tertiary' && styles.cardTertiary,
  ];

  const iconColor = {
    primary: '#006290',
    secondary: '#b7131a',
    tertiary: '#7b5500',
  }[color];

  return (
    <View style={cardStyles}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <MaterialIcons name={icon} size={24} color={iconColor} />
        </View>
        {trend && (
          <View style={styles.trendBadge}>
            <Text style={styles.trendText}>{trend}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardLabel}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        {subtitle && (
          <View style={styles.subtitleContainer}>
            <MaterialIcons name="description" size={14} color={iconColor} />
            <Text style={[styles.cardSubtitle, { color: iconColor }]}>
              {subtitle}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
```

### **3. Sales Trend Chart Component**

#### **SalesTrendChart.tsx**
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

interface SalesTrendChartProps {
  title: string;
  subtitle: string;
  data: Array<{ month: string; value: number }>;
}

export const SalesTrendChart: React.FC<SalesTrendChartProps> = ({
  title,
  subtitle,
  data,
}) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [{
      data: data.map(item => item.value),
    }],
  };

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>{title}</Text>
        <View style={styles.chartBadge}>
          <Text style={styles.chartBadgeText}>{subtitle}</Text>
        </View>
      </View>
      
      <View style={styles.chartContent}>
        <BarChart
          data={chartData}
          width={320}
          height={160}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 98, 144, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={styles.chart}
          withInnerLines={false}
          withHorizontalLines={false}
          showBarTops={false}
        />
      </View>
      
      <View style={styles.chartLabels}>
        <Text style={styles.chartLabel}>OCAK</Text>
        <Text style={styles.chartLabel}>MART</Text>
        <Text style={[styles.chartLabel, styles.chartLabelActive]}>HAZİRAN</Text>
        <Text style={styles.chartLabel}>EYLÜL</Text>
      </View>
    </View>
  );
};
```

### **4. Regional Distribution Component**

#### **RegionalDistribution.tsx**
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface RegionalData {
  region: string;
  value: string;
  percentage: number;
}

interface RegionalDistributionProps {
  title: string;
  subtitle: string;
  data: RegionalData[];
}

export const RegionalDistribution: React.FC<RegionalDistributionProps> = ({
  title,
  subtitle,
  data,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <MaterialIcons name="map" size={24} color="#006290" />
      </View>
      
      <View style={styles.regionsContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.regionItem}>
            <View style={styles.regionHeader}>
              <Text style={styles.regionName}>{item.region}</Text>
              <Text style={styles.regionValue}>{item.value}</Text>
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
          </View>
        ))}
      </View>
    </View>
  );
};
```

### **5. Bottom Navigation Component**

#### **BottomNavigation.tsx**
```typescript
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Genel Bakış', icon: 'dashboard' },
    { id: 'sales', label: 'Satış', icon: 'payments' },
    { id: 'purchasing', label: 'Satınalma', icon: 'shopping_cart' },
    { id: 'stock', label: 'Stok', icon: 'inventory_2' },
    { id: 'crm', label: 'CRM', icon: 'groups' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tabItem,
            activeTab === tab.id && styles.tabItemActive,
          ]}
          onPress={() => onTabChange?.(tab.id)}
        >
          <MaterialIcons
            name={tab.icon}
            size={24}
            color={activeTab === tab.id ? '#006290' : '#94A3B8'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.id && styles.tabLabelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
```

---

## 🎨 **Styling (StyleSheet)**

### **Colors.ts**
```typescript
export const Colors = {
  // Primary
  primary: '#006290',
  primaryContainer: '#007bb5',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#fcfcff',
  
  // Secondary
  secondary: '#b7131a',
  secondaryContainer: '#db322f',
  onSecondary: '#ffffff',
  onSecondaryContainer: '#fffbff',
  
  // Tertiary
  tertiary: '#7b5500',
  tertiaryContainer: '#9b6b00',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#fffbff',
  
  // Surface
  surface: '#f7f9fe',
  surfaceContainer: '#ebeef3',
  surfaceContainerLow: '#f1f4f9',
  surfaceContainerHigh: '#e5e8ed',
  onSurface: '#181c20',
  onSurfaceVariant: '#3f4850',
  
  // Outline
  outline: '#6f7881',
  outlineVariant: '#bfc7d1',
  
  // Background
  background: '#f7f9fe',
  onBackground: '#181c20',
  
  // Error
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',
};
```

### **Typography.ts**
```typescript
export const Typography = {
  // Headlines
  headlineLarge: {
    fontSize: 32,
    fontWeight: '800' as const,
    fontFamily: 'Manrope',
  },
  headlineMedium: {
    fontSize: 24,
    fontWeight: '700' as const,
    fontFamily: 'Manrope',
  },
  headlineSmall: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: 'Manrope',
  },
  
  // Labels
  labelLarge: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: 'Inter',
    textTransform: 'uppercase' as const,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500' as const,
    fontFamily: 'Inter',
    textTransform: 'uppercase' as const,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '600' as const,
    fontFamily: 'Inter',
    textTransform: 'uppercase' as const,
  },
  
  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: 'Manrope',
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    fontFamily: 'Manrope',
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'Manrope',
  },
};
```

---

## 📱 **Responsive Tasarım**

### **Breakpoints**
```typescript
export const Breakpoints = {
  mobile: {
    small: 320,  // iPhone SE
    medium: 375, // iPhone 12
    large: 414,  // iPhone Plus
  },
  tablet: {
    small: 768,  // iPad Mini
    medium: 1024, // iPad Pro
  },
};
```

### **Responsive Styles**
```typescript
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const isTablet = width >= 768;
export const isLargePhone = width >= 414;
export const isSmallPhone = width <= 375;

export const Responsive = {
  container: {
    paddingHorizontal: isTablet ? 32 : 16,
  },
  kpiGrid: {
    flexDirection: isTablet ? 'row' : 'column',
    gap: isTablet ? 16 : 12,
  },
  cardWidth: isTablet ? width / 2 - 24 : width - 32,
};
```

---

## 🔄 **Data Management**

### **Mock Data**
```typescript
export const mockData = {
  salesTrend: [
    { month: 'OCAK', value: 1200000 },
    { month: 'ŞUBAT', value: 1450000 },
    { month: 'MART', value: 1350000 },
    { month: 'NİSAN', value: 1680000 },
    { month: 'MAYIS', value: 1520000 },
    { month: 'HAZİRAN', value: 1725811 },
  ],
  regionalDistribution: [
    { region: 'Bursa Bölge', value: '€500.5K', percentage: 85 },
    { region: 'Avrupa Bölge', value: '€403.9K', percentage: 65 },
    { region: 'Anadolu Bölge', value: '€298.6K', percentage: 45 },
    { region: 'Ege Bölge', value: '€204.4K', percentage: 30 },
    { region: 'Diğer Bölge', value: '€167.3K', percentage: 20 },
  ],
};
```

### **API Integration**
```typescript
import axios from 'axios';

const API_BASE_URL = 'https://dashboard.isac.com.tr/api/';

export const DashboardAPI = {
  async getDashboardData() {
    try {
      const response = await axios.get(`${API_BASE_URL}genel_bakis.php`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Dashboard API Error:', error);
      throw error;
    }
  },
  
  async getSalesTrend() {
    try {
      const response = await axios.get(`${API_BASE_URL}satis_trend.php`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error('Sales Trend API Error:', error);
      throw error;
    }
  },
};
```

---

## 🚀 **Performance Optimizasyonu**

### **Lazy Loading**
```typescript
import React, { lazy, Suspense } from 'react';

const SalesTrendChart = lazy(() => import('../components/SalesTrendChart'));
const RegionalDistribution = lazy(() => import('../components/RegionalDistribution'));

// Usage
<Suspense fallback={<LoadingSpinner />}>
  <SalesTrendChart data={salesData} />
</Suspense>
```

### **Memoization**
```typescript
import React, { memo, useMemo } from 'react';

export const KPICard = memo<KPICardProps>(({ title, value, ...props }) => {
  const formattedValue = useMemo(() => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }, [value]);
  
  return (
    // Component JSX
  );
});
```

---

Bu analiz, HTML tasarımın React Native'e nasıl dönüştürüleceğini göstermektedir. Component'ler, styling ve data management için detaylı örnekler içerir.

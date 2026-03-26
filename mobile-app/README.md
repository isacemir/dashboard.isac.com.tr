# 📱 ISAC Dashboard - Mobil Uygulama

## 🎯 **Proje Hakkında**

ISAC Dashboard mobil uygulaması, web dashboard'unun tüm özelliklerini mobil cihazlarda sunmak için geliştirilmiştir. React Native + Expo ile cross-platform (iOS/Android) geliştirilmiştir.

---

## 🚀 **Quick Start**

### **Geliştirme Ortamı**
```bash
# Gerekli dependency'leri yükle
npm install

# Expo development server'ı başlat
npm start

# iOS simulator'da çalıştır
npm run ios

# Android emulator'da çalıştır
npm run android

# Web'de çalıştır
npm run web
```

### **Proje Yapısı**
```
src/
├── App.tsx                    # Ana uygulama ve navigation
├── screens/                   # Sayfa component'leri
│   ├── DashboardScreen.tsx    # Ana dashboard
│   ├── SalesScreen.tsx        # Satış siparişleri
│   ├── PurchasingScreen.tsx   # Satınalma
│   ├── StockScreen.tsx        # Stok & Sipariş
│   └── CRMScreen.tsx          # CRM aktiviteleri
├── components/                # Ortak component'ler
│   ├── Header.tsx            # Üst bar
│   ├── KPICard.tsx           # KPI kartları
│   ├── SalesTrendChart.tsx   # Satış trend grafiği
│   ├── RegionalDistribution.tsx # Bölgesel dağılım
│   └── ActionButton.tsx      # Eylem butonları
└── types/                     # TypeScript type'ları
```

---

## 📱 **Özellikler**

### **✅ Tamamlanan Özellikler**
- 🏠 **Dashboard Ana Sayfa** - KPI kartları ve grafikler
- 📊 **KPI Kartları** - Large ve small boyutlarda
- 📈 **Satış Trend Grafiği** - Aylık ciro analizi
- 🗺️ **Bölgesel Dağılım** - Progress bar ile bölge performansı
- 🎨 **Material Design 3.0** - Modern tasarım sistemi
- 📱 **Bottom Navigation** - iOS style tab bar
- 🔄 **Pull-to-refresh** - Veri yenileme
- 📱 **Responsive Design** - Tüm ekran boyutları

### **🚧 Geliştirilecek Özellikler**
- 📦 **Satış Siparişleri** - Detaylı liste ve filtreleme
- 🛒 **Satınalma** - Tedarikçi yönetimi
- 📋 **Teklifler** - Teklif takibi
- 📊 **Stok** - Stok yönetimi
- 👥 **CRM** - Aktivite yönetimi
- 📄 **Export** - Excel/PDF raporlama
- 🔔 **Push Notifications** - Bildirimler
- 📱 **Offline Support** - Çevrimdışı mod

---

## 🎨 **Component'ler**

### **Header Component**
- Logo ve başlık
- Bildirim butonu
- Profil avatar'ı
- Menu butonu

### **KPICard Component**
- Large ve small boyutlar
- Trend göstergeleri
- Icon ve renk temaları
- Shadow ve animasyon

### **SalesTrendChart Component**
- Bar chart görselleştirme
- Aylık veri gösterimi
- Responsive tasarım
- Value labels

### **RegionalDistribution Component**
- Progress bar görselleştirme
- Bölgesel performans
- Renk gradyanları
- Interactive hover states

---

## 🔧 **Teknoloji Stack**

### **Frontend**
- **Framework**: React Native 0.81.5
- **Platform**: Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **Icons**: Expo Vector Icons
- **Gestures**: React Native Gesture Handler
- **Animations**: React Native Reanimated

### **UI/UX**
- **Design System**: Material Design 3.0
- **Color Palette**: #006290 (primary), #b7131a (secondary), #7b5500 (tertiary)
- **Typography**: Manrope (headline), Inter (label)
- **Spacing**: 8-point grid system
- **Components**: Custom component library

---

## 📊 **Veri Yönetimi**

### **API Entegrasyonu**
```typescript
// Base URL
const API_BASE_URL = 'https://dashboard.isac.com.tr/api/';

// Authentication (cookie-based)
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Örnek API çağrısı
const getDashboardData = async () => {
  const response = await api.get('/genel_bakis.php');
  return response.data;
};
```

### **Mock Data**
```typescript
// Dashboard verileri
const dashboardData = {
  totalSales: '€1.725.811',
  salesTrend: '+12.4%',
  pendingOrders: '€6.847.459',
  // ... diğer veriler
};
```

---

## 🎯 **Kullanım**

### **Navigation**
- **Bottom Tab Bar**: 5 ana sekme
- **Swipe Gestures**: Sayfa geçişleri
- **Pull-to-refresh**: Veri yenileme
- **Back Navigation**: Otomatik geri butonu

### **Interactions**
- **Tap**: Card ve button'lar
- **Long Press**: Detay modal'ları
- **Swipe**: Listelerde eylemler
- **Pinch**: Grafik zoom

---

## 📱 **Platform Özellikleri**

### **iOS**
- **Safe Area**: iPhone X+ uyumlu
- **Bottom Tab Bar**: iOS style
- **Status Bar**: Otomatik renk uyumu
- **Gestures**: iOS native gestures

### **Android**
- **Material Design**: MD3 uyumlu
- **Navigation Bar**: Renk uyumu
- **Back Button**: Android back handler
- **Permissions**: Android permission system

---

## 🔒 **Security**

### **Authentication**
- **Cookie-based**: Web ile aynı session
- **HTTPS**: Tüm API çağrıları SSL üzerinden
- **Session Management**: Otomatik token yenileme
- **Logout**: Session temizleme

### **Data Protection**
- **Local Storage**: Sensitive veriler şifreli
- **API Validation**: Input doğrulama
- **Error Handling**: Güvenli hata yönetimi
- **Network Security**: SSL pinning

---

## 📈 **Performance**

### **Optimizasyonlar**
- **Lazy Loading**: Component'ler için
- **Memoization**: Re-render optimizasyonu
- **Image Caching**: Profil resimleri
- **Bundle Size**: Code splitting
- **Memory Management**: Component cleanup

### **Metrics**
- **App Launch**: < 3 saniye
- **API Response**: < 500ms
- **Scroll Performance**: 60fps
- **Memory Usage**: < 150MB
- **Bundle Size**: < 50MB

---

## 🧪 **Testing**

### **Unit Tests**
```bash
# Component testleri
npm test

# Coverage raporu
npm run test:coverage
```

### **E2E Tests**
```bash
# Detox ile E2E testleri
npm run test:e2e
```

---

## 📦 **Build ve Deployment**

### **Development**
```bash
# Development build
expo start --dev-client

# Preview build
expo start --preview
```

### **Production**
```bash
# iOS build
expo build:ios --release-channel production

# Android build
expo build:android --release-channel production

# Web build
expo build:web
```

### **App Store**
- **iOS**: App Store Connect
- **Android**: Google Play Console
- **OTA**: Expo Updates Service

---

## 🐛 **Debugging**

### **Tools**
- **Flipper**: React Native debugging
- **Expo Dev Tools**: Hot reload ve debugging
- **React Inspector**: Component inspection
- **Network Inspector**: API debugging

### **Common Issues**
- **Metro bundler**: Cache temizleme
- **Font loading**: Custom font'lar
- **Safe Area**: iPhone X+ uyum
- **Navigation**: Stack overflow

---

## 📞 **Destek**

### **Documentation**
- 📖 **API Dokümantasyonu**: `API_DOKUMASYONU.md`
- 📱 **Sayfa Yapıları**: `SAYFA_YAPILARI.md`
- 🎨 **Figma Kılavuzu**: `FIGMA_TASARIM_KILAVUZU.md`

### **İletişim**
- **Issues**: GitHub repository
- **Email**: development@isac.com.tr
- **Slack**: #mobile-development kanalı

---

## 🚀 **Roadmap**

### **Phase 1** (Mevcut)
- ✅ Dashboard ana sayfa
- ✅ Component library
- ✅ Navigation system
- ✅ Responsive design

### **Phase 2** (1 ay)
- 📦 Satış siparişleri detayı
- 🛒 Satınalma modülü
- 📋 Teklif yönetimi
- 📊 Stok takibi

### **Phase 3** (2 ay)
- 👥 CRM aktiviteleri
- 📄 Export özellikleri
- 🔔 Push notifications
- 📱 Offline support

### **Phase 4** (3 ay)
- 🤖 AI destekli öneriler
- 🎯 Kişiselleştirme
- 📈 Gelişmiş raporlama
- 🔄 Real-time updates

---

Bu mobil uygulama, web dashboard'un tüm özelliklerini mobil cihazlarda sunmak için kapsamlı bir çözüm sunar. Modern React Native practices ve Material Design 3.0 ile geliştirilmiştir.
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

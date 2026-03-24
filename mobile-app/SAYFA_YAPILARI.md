# ISAC Dashboard - Sayfa ve Component Yapıları

## 📱 **Mobil Uygulama İçin Sayfa Planları**

---

## 🏠 **1. Genel Bakış Sayfası**

### **Web Karşılığı**: `OverviewTab.jsx`
### **Mobil Component'ler**:
- `GenelBakisScreen` - Ana dashboard
- `KPICard` - KPI kartları (ciro, sipariş, fatura, aktivite)
- `AylikCiroChart` - Aylık ciro grafiği
- `SatisPerformansList` - Satış performansı listesi
- `HaberlerCard` - Haberler ve duyurular

### **Önemli Özellikler**:
- 🔄 **Pull-to-refresh** - Verileri yenileme
- 📊 **Interactive charts** - Zoom ve pan
- 🎯 **Quick actions** - Hızlı eylem butonları
- 📱 **Bottom navigation** - iOS style tab bar

---

## 📦 **2. Satış Siparişleri Sayfası**

### **Web Karşılığı**: `SatisTab.jsx` + `BaseTab.jsx`
### **Mobil Component'ler**:
- `SiparislerScreen` - Ana siparişler listesi
- `SiparisCard` - Sipariş kartı
- `FilterPanel` - Filtre paneli (collapsible)
- `SiparisDetayModal` - Sipariş detay modal'ı
- `DurumBadge` - Durum badge'i

### **Filtreler**:
- 🔍 **Arama** - Müşteri/ürün arama
- 📅 **Tarih aralığı** - Başlangıç/bitış tarihi
- 🏷️ **Durum** - Açık/Kapalı/İptal
- 🌍 **Bölge** - Coğrafi filtre
- 👤 **Personel** - Satış personeli
- 📦 **Kategori/Marka** - Ürün filtreleri

### **Önemli Özellikler**:
- 📄 **Excel export** - Sipariş listesi
- 📊 **Aylık tutar grafiği** - Trend analizi
- 🔄 **Infinite scroll** - Sayfalama yerine
- 🎯 **Hızlı filtre** - Önceden tanımlı filtreler

---

## 🛒 **3. Satınalma Sayfası**

### **Web Karşılığı**: `SatinAlmaTab.jsx`
### **Mobil Component'ler**:
- `SatinAlmaScreen` - Ana satınalma listesi
- `TedarikciCard` - Tedarikçi bilgisi
- `SatinAlmaDetayModal` - Detay modal'ı
- `OnayBadge` - Onay durumu

### **Filtreler**:
- 🏭 **Tedarikçi** - Tedarikçi adı
- 📦 **Ürün** - Stok kodu/ada göre
- 📅 **Tarih** - Tarihe göre filtre
- ✅ **Durum** - Onay beklemede/teslim edildi

---

## 📋 **4. Teklifler Sayfası**

### **Web Karşılığı**: `TeklifTab.jsx`
### **Mobil Component'ler**:
- `TekliflerScreen` - Teklif listesi
- `TeklifCard` - Teklif kartı
- `TeklifDetayModal` - Detay modal'ı
- `DurumSelector` - Durum seçici

### **Özellikler**:
- 📊 **Durum dağılımı** - Teklif durumu grafiği
- 💰 **Değer analizi** - Teklif değerleri
- 🔄 **Swipe actions** - Kaydırarak onay/red

---

## 📊 **5. Stok & Sipariş Sayfası**

### **Web Karşılığı**: `StokTab.jsx`
### **Mobil Component'ler**:
- `StokScreen` - Stok listesi
- `StokCard` - Stok kartı (stok durumu, kritik seviye)
- `StokDetayModal` - Ürün detayları
- `StokAlert` - Kritik stok uyarısı

### **Özellikler**:
- 🔴 **Kritik stok** - Düşük stok uyarıları
- 📈 **Stok grafiği** - Stok hareketleri
- 🏷️ **Kategori filtreleri** - Ürün gruplandırma
- 📸 **Barkod okuyucu** - Stok girişi

---

## 🧾 **6. Satış Raporu (Faturalar) Sayfası**

### **Web Karşılığı**: `FaturaTab.jsx`
### **Mobil Component'ler**:
- `FaturalarScreen` - Fatura listesi
- `FaturaCard` - Fatura kartı
- `FaturaDetayModal` - Fatura detayları
- `IrsaliyeModal` - İrsaliye bilgileri

### **Özellikler**:
- 💰 **Ciro hesaplama** - Toplam ve vergi dağılımı
- 📊 **Aylık karşılaştırma** - Önceki aylar
- 📄 **PDF export** - Fatura PDF'i
- 🔍 **Gelişmiş arama** - Fatura no/müşteri/ürün

---

## 📈 **7. Sipariş Raporu Sayfası**

### **Web Karşılığı**: `SiparisTab.jsx` (rapor modu)
### **Mobil Component'ler**:
- `SiparisRaporuScreen` - Rapor listesi
- `RaporCard` - Rapor kartı
- `RaporFiltreleri` - Detaylı filtreler
- `RaporChart` - Rapor görselleştirmesi

### **Özellikler**:
- 📊 **Performans grafiği** - Personel bazında
- 🏆 **En çok satan** - Ürün/personel sıralaması
- 📅 **Trend analizi** - Zaman içindeki değişim
- 📄 **Detaylı rapor** - Excel/PDF export

---

## 👥 **8. CRM Sayfası**

### **Web Karşılığı**: `CrmTab.jsx`
### **Mobil Component'ler**:
- `CRMScreen` - Ana CRM ekranı
- `AktiviteCard` - Aktivite kartı
- `PersonelKarti` - Personel performans kartı
- `AktiviteDetayModal` - Aktivite detayları
- `MusteriProfiliModal` - Müşteri profili

### **Özellikler**:
- 📅 **Takvim görünümü** - Aktivite takvimi
- 👥 **Personel performansı** - Kişiye özel istatistikler
- 🎯 **Fırsat yönetimi** - Fırsat takibi
- 📞 **Hızlı eylemler** - Ara/mail/aktivite ekle

---

## 🏢 **9. Kullanıcı Detay Sayfası**

### **Web Karşılığı**: `KullaniciDetayTab.jsx`
### **Mobil Component'ler**:
- `KullaniciProfiliScreen` - Kullanıcı profili
- `PerformansChart` - Performans grafikleri
- `AktivitelerListesi` - Kullanıcının aktiviteleri
- `SiparislerListesi` - Kullanıcının siparişleri
- `FaturalarListesi` - Kullanıcının faturaları

### **Özellikler**:
- 📊 **Kişisel performans** - Aylık karşılaştırma
- 🎯 **Hedef takibi** - KPI karşılaştırma
- 📈 **Trend analizi** - Performans trendi
- 📋 **Detaylı raporlama** - Excel export

---

## 📄 **10. Cari Detay Sayfası**

### **Web Karşılığı**: `CariDetayTab.jsx`
### **Mobil Component'ler**:
- `CariProfiliScreen` - Cari profili
- `CariPerformansChart` - Cari performansı
- `CariAktiviteleri` - Cari aktiviteleri
- `CariSiparisleri` - Cari siparişleri
- `CariFaturalari` - Cari faturaları

### **Özellikler**:
- 💰 **Ciro analizi** - Müşteri cirosu
- 📊 **Sipariş geçmişi** - Tüm siparişler
- 📞 **İletişim bilgileri** - Telefon/adres/mail
- 📈 **Trend grafiği** - Aylık alışveriş

---

## 🎨 **Ortak Component'ler**

### **Core Components**:
- `Layout` - Ana layout (header, content, navigation)
- `Header` - Üst bar (logo, kullanıcı, menü)
- `BottomNav` - Alt navigasyon (iOS style)
- `TabBar` - Sekme navigasyonu
- `Card` - Genel kart component'i
- `Modal` - Modal pencere
- `FilterButton` - Filtre butonu
- `SearchBar` - Arama çubuğu
- `LoadingSpinner` - Yükleme animasyonu
- `EmptyState` - Boş durum gösterimi
- `ErrorBoundary` - Hata yakalama

### **Chart Components**:
- `LineChart` - Çizgi grafiği
- `BarChart` - Sütun grafiği
- `PieChart` - Pasta grafiği
- `AreaChart` - Alan grafiği
- `MiniChart` - Mini grafikler

### **Form Components**:
- `DatePicker` - Tarih seçici
- `Select` - Dropdown seçici
- `MultiSelect` - Çoklu seçici
- `TextInput` - Metin girişi
- `RangeSlider` - Aralık seçici
- `Switch` - Aç/kapa butonu

---

## 📱 **Mobil Uyumluluk Stratejisi**

### **Navigation Pattern**:
- **iOS**: Bottom tab bar + swipe gestures
- **Android**: Bottom navigation + material design
- **Cross**: React Navigation v6

### **Data Management**:
- **Offline storage** - AsyncStorage/SQLite
- **Sync mechanism** - Background sync
- **Cache strategy** - Redux Persist
- **Real-time updates** - WebSocket/SSE

### **Performance**:
- **Lazy loading** - Route ve component lazy loading
- **Virtual lists** - Büyük listeler için
- **Image optimization** - Lazy load + cache
- **Bundle optimization** - Code splitting

---

## 🔧 **Teknoloji Önerileri**

### **Frontend**:
- **React Native** - Cross-platform mobil
- **Expo** - Geliştirme ortamı
- **React Navigation** - Navigasyon
- **Recharts** - Grafikler (mobil uyumlu)
- **React Query** - API yönetimi
- **Zustand** - State management

### **Backend Integration**:
- **Axios** - HTTP client
- **Cookie handling** - Session management
- **Error handling** - Global error boundary
- **Retry mechanism** - Başarısız istekler

### **Development Tools**:
- **Flipper** - Debug tool
- **Reactotron** - State debugging
- **CodePush** - OTA updates
- **Sentry** - Error tracking

---

## 🚀 **MVP (Minimum Viable Product) Özellikleri**

### **Phase 1 - Core Features**:
1. ✅ **Authentication** - Login/logout
2. ✅ **Genel bakış** - KPI'lar ve grafikler
3. ✅ **Satış siparişleri** - Listeleme ve filtreleme
4. ✅ **CRM aktiviteleri** - Temel CRM fonksiyonları
5. ✅ **Arama ve filtreleme** - Temel arama

### **Phase 2 - Enhanced Features**:
1. 📊 **Detaylı grafikler** - Interactive charts
2. 📄 **Export özellikleri** - Excel/PDF export
3. 🔄 **Real-time updates** - WebSocket entegrasyonu
4. 📱 **Offline support** - Temel offline mod
5. 🔔 **Push notifications** - Önemli bildirimler

### **Phase 3 - Advanced Features**:
1. 🎯 **Kişiselleştirme** - Kullanıcı tercihleri
2. 📊 **Gelişmiş raporlama** - Custom raporlar
3. 🤖 **AI destek** - Tahminleme ve öneriler
4. 📈 **Predictive analytics** - Satış tahminleri
5. 🔄 **Otomatik sync** - Background senkronizasyon

---

Bu doküman mobil uygulamanızın geliştirilmesi için tam sayfa planını ve component yapısını içerir. Her sayfanın web karşılığı, mobil component'leri ve özellikleri detaylı olarak açıklanmıştır.

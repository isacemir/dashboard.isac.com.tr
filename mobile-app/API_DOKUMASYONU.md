# ISAC Dashboard - Mobil Uygulama API Dokümantasyonu

## 📱 Mobil Uygulama İçin Gerekli Bilgiler

### 🔗 **Base URL**
```
https://dashboard.isac.com.tr/api/
```

### 🛡️ **Authentication**
Tüm API çağrıları için authentication gerekli:
- **Cookie-based authentication** (web'de login olduktan sonra)
- **Credentials**: `include` (cookies gönder)

---

## 📋 **Sayfa ve Endpoint Yapıları**

### 1. 🏠 **Genel Bakış (Overview)**
```
GET /api/genel_bakis.php
```
**Dönen Veri:**
```json
{
  "kpi": {
    "toplam_ciro": 1234567.89,
    "aylik_ciro_artis": 12.5,
    "toplam_siparis": 1234,
    "toplam_fatura": 567,
    "toplam_aktivite": 890
  },
  "charts": {
    "aylik_ciro": [
      {"ay": "2024-01", "ciro": 123456.78},
      {"ay": "2024-02", "ciro": 134567.89}
    ],
    "satis_performans": [
      {"personel": "Ahmet Yılmaz", "siparis": 45, "tutar": 12345.67},
      {"personel": "Melek Demir", "siparis": 38, "tutar": 9876.54}
    ]
  }
}
```

### 2. 📦 **Satış Siparişleri**
```
GET /api/satis_siparis.php
```
**Filtreleme Parametreleri:**
- `musteri` (string) - Müşteri adı
- `stok_search` (string) - Stok kodu/ada göre arama
- `siparis_durumu` (string) - "acik", "kapali", "iptal"
- `siparis_turu` (string) - Sipariş türü
- `bolge` (string) - Bölge filtresi
- `personel` (string) - Personel filtresi
- `kategori` (string) - Kategori filtresi
- `marka` (string) - Marka filtresi
- `model` (string) - Model filtresi
- `il` (string) - İl filtresi
- `tarih_bas` (date) - Başlangıç tarihi
- `tarih_bit` (date) - Bitiş tarihi

**Response:**
```json
{
  "kpi": {
    "sayi": 1234,
    "teslim": 987654.32,
    "kalan": 123456.78,
    "iptal": 45678.90,
    "toplam": 1156889.00
  },
  "charts": {
    "trend": [
      {"ay": "2024-01", "tutar": 123456.78},
      {"ay": "2024-02", "tutar": 134567.89}
    ],
    "bolge": [
      {"name": "Marmara", "val": 456789.12},
      {"name": "Ege", "val": 234567.89}
    ]
  },
  "rows": [
    {
      "SIPARIS_NO": "S2024-001",
      "TARIHI": "2024-01-15",
      "TICARI_UNVANI": "ABC Ltd. Şti.",
      "STOK_ADI": "Ürün Adı",
      "MIKTARI": 100,
      "DVZ_IND_TUTAR": 1234.56,
      "SIPARIS_DURUMU": "Açık"
    }
  ]
}
```

### 3. 🛒 **Satınalma Siparişleri**
```
GET /api/satin_alma_siparis.php
```
**Filtreleme Parametreleri:**
- `tedarikci` (string) - Tedarikçi adı
- `stok_search` (string) - Stok kodu/ada göre arama
- `durum` (string) - Durum filtresi
- `tarih_bas` (date) - Başlangıç tarihi
- `tarih_bit` (date) - Bitiş tarihi

### 4. 📋 **Teklifler**
```
GET /api/teklifler.php
```
**Filtreleme Parametreleri:**
- `musteri` (string) - Müşteri adı
- `stok_search` (string) - Stok kodu/ada göre arama
- `durum` (string) - Durum filtresi
- `teklif_turu` (string) - Teklif türü

### 5. 📊 **Stok & Sipariş**
```
GET /api/stok_siparis.php
```
**Filtreleme Parametreleri:**
- `stok_kodu` (string) - Stok kodu
- `stok_adi` (string) - Stok adı
- `kategori` (string) - Kategori
- `marka` (string) - Marka
- `model` (string) - Model
- `min_stok` (number) - Minimum stok

### 6. 🧾 **Satış Raporu (Faturalar)**
```
GET /api/fatura.php
```
**Filtreleme Parametreleri:**
- `musteri` (string) - Müşteri adı
- `stok_search` (string) - Stok kodu/ada göre arama
- `fatura_durumu` (string) - Fatura durumu
- `tarih_bas` (date) - Başlangıç tarihi
- `tarih_bit` (date) - Bitiş tarihi
- `personel` (string) - Personel filtresi

### 7. 📈 **Sipariş Raporu**
```
GET /api/siparis_raporu.php
```
**Filtreleme Parametreleri:**
- `musteri` (string) - Müşteri adı
- `stok_search` (string) - Stok kodu/ada göre arama
- `siparis_durumu` (string) - Sipariş durumu
- `tarih_bas` (date) - Başlangıç tarihi
- `tarih_bit` (date) - Bitiş tarihi

### 8. 👥 **CRM (Customer Relationship Management)**
```
GET /api/crm.php
```
**Filtreleme Parametreleri:**
- `musteri` (string) - Müşteri (cari ünvanı)
- `sahip` (string) - Aktivite sahibi (personel)
- `tipi` (string) - Aktivite tipi
- `durum` (string) - Durum ("Tamamlandı", "Yapılacak", "İptal")
- `tarih_bas` (date) - Başlangıç tarihi
- `tarih_bit` (date) - Bitiş tarihi

**Response:**
```json
{
  "kpi": {
    "sayi": 890,
    "yapildi": 567,
    "yapilacak": 123,
    "firsat": 45
  },
  "charts": {
    "aktivite": [
      {"name": "Telefon", "val": 234},
      {"name": "E-posta", "val": 123}
    ],
    "personel_performans": [
      {"name": "Ahmet Yılmaz", "val": 45},
      {"name": "Melek Demir", "val": 38}
    ]
  },
  "rows": [
    {
      "AKTIVITE_KODU": "AKT2024001",
      "BASLAMA": "2024-01-15 10:30:00",
      "AKTIVITE_SAHIBI": "Ahmet Yılmaz",
      "TICARI_UNVANI": "ABC Ltd. Şti.",
      "TIPI": "Telefon",
      "DURUMU": "Tamamlandı",
      "KONU": "Ürün tanıtımı",
      "FIRSATADI": "FRS2024001"
    }
  ]
}
```

---

## 🎯 **Özel Detay Sayfaları**

### 📄 **Cari Detay Sayfası**
```
/kullanici-detay?adi={PERSONEL_ADI}
```
**Kullanılacak Endpoint'ler:**
- CRM aktiviteleri: `/api/crm.php?sahip={PERSONEL_ADI}`
- Satış siparişleri: `/api/satis_siparis.php?personel={PERSONEL_ADI}`
- Satış faturaları: `/api/fatura.php?personel={PERSONEL_ADI}`

### 🏢 **Kullanıcı Detay Sayfası**
```
/kullanici-detay?adi={PERSONEL_ADI}
```
**Kullanılacak Endpoint'ler:**
- CRM aktiviteleri: `/api/crm.php?sahip={PERSONEL_ADI}`
- Satış siparişleri: `/api/satis_siparis.php?personel={PERSONEL_ADI}`
- Satış faturaları: `/api/fatura.php?personel={PERSONEL_ADI}`

---

## 🎨 **UI/UX Tasarım İpuçları**

### **Renk Paleti**
```css
--primary: #0ea5e9;     /* Ana renk - Mavi */
--secondary: #8b5cf6;   /* İkincil renk - Mor */
--success: #10b981;     /* Başarı - Yeşil */
--warning: #f59e0b;     /* Uyarı - Sarı */
--error: #ef4444;       /* Hata - Kırmızı */
--info: #64748b;        /* Bilgi - Gri */
--background: #f1f5f9;  /* Arka plan */
--surface: #ffffff;      /* Kart arka planı */
```

### **Component Yapıları**
- **Header**: Logo + kullanıcı bilgisi + çıkış
- **Navigation**: Bottom tabs (iOS style) veya drawer
- **Cards**: Rounded corners, shadow, elevation
- **Charts**: Recharts veya benzeri
- **Tables**: Horizontal scroll, sticky headers
- **Filters**: Collapsible filter panel
- **Loading**: Skeleton loaders veya spinners

### **Responsive Breakpoints**
```css
--mobile: 320px - 768px
--tablet: 768px - 1024px
--desktop: 1024px+
```

---

## 📱 **Mobil Uyumluluk İpuçları**

### **Performance Optimizasyonu**
- ✅ **Lazy loading** - Sayfa ve component'ler
- ✅ **Virtual scrolling** - Büyük tablolar
- ✅ **Image optimization** - Lazy load, WebP format
- ✅ **API caching** - Önbellekleme
- ✅ **Bundle splitting** - Code splitting

### **User Experience**
- ✅ **Pull-to-refresh** - Veri yenileme
- ✅ **Infinite scroll** - Sayfalama yerine
- ✅ **Offline support** - Service worker
- ✅ **Push notifications** - Önemli bildirimler
- ✅ **Biometric auth** - Parmak izi/Yüz tanıma

### **Platform Integration**
- ✅ **iOS** - Native iOS app
- ✅ **Android** - Native Android app
- ✅ **PWA** - Progressive Web App
- ✅ **React Native** - Cross-platform

---

## 🔧 **Geliştirme Ortamı**

### **Local Development**
```bash
# Web dashboard'u çalıştır
npm run dev

# Mobil uygulama için proxy
# Mobil app'den API çağrıları web'e yönlendir
```

### **Testing**
```bash
# API testleri
curl -X GET "https://dashboard.isac.com.tr/api/crm.php" \
  -H "Cookie: session_id=your_session_id" \
  -H "Content-Type: application/json"
```

---

## 📞 **İletişim ve Destek**

### **API Sorunları**
- **Web Dashboard**: https://dashboard.isac.com.tr
- **API Base URL**: https://dashboard.isac.com.tr/api/
- **Authentication**: Cookie-based session

### **Öneriler**
1. **Rate Limiting** - 100 istek/dakika
2. **Response Caching** - 5 dakika önbellek
3. **Error Handling** - Standart error format
4. **Pagination** - Büyük veri setleri için
5. **Versioning** - API versiyonlama

---

## 🚀 **Quick Start**

### 1. **Authentication**
```javascript
// Login için (web'de session oluştur)
POST /api/login.php
{
  "username": "kullanici_adi",
  "password": "sifre"
}

// Session cookie otomatik gönderilir
```

### 2. **Veri Çekme**
```javascript
// CRM verileri
GET /api/crm.php?sahip=Ahmet%20Yılmaz

// Satış siparişleri
GET /api/satis_siparis.php?bolge=Marmara

// Genel bakış
GET /api/genel_bakis.php
```

### 3. **Filtreleme**
```javascript
// Tarih aralığı
GET /api/satis_siparis.php?tarih_bas=2024-01-01&tarih_bit=2024-01-31

// Çoklu filtre
GET /api/crm.php?sahip=Ahmet&durum=Tamamlandı&musteri=ABC%20Ltd
```

---

Bu dokümantasyon mobil uygulamanızın web dashboard ile entegre olması için tüm gerekli bilgileri içerir. Herhangi bir sorunda veya detaylı bilgi için iletişime geçebilirsiniz.

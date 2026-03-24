# ISAC Dashboard - Figma Tasarım Kılavuzu

## 🎨 **Design System for Mobile App**

---

## 🎯 **Design Principles**

### **Core Values**
- **Clarity** - Net ve anlaşılır arayüz
- **Efficiency** - Hızlı ve etkili kullanım
- **Consistency** - Tutarlı tasarım dili
- **Accessibility** - Herkes için erişilebilir

### **Mobile First**
- 👆 **Thumb-friendly** - 44px minimum touch target
- 📱 **Portrait first** - Dikey odaklı tasarım
- 🔄 **Gesture support** - Kaydırma ve swipe
- 📊 **Data density** - Optimum bilgi yoğunluğu

---

## 🎨 **Color Palette**

### **Primary Colors**
```css
/* Ana Renkler */
--primary-blue: #0EA5E9;      /* Ana mavi */
--primary-purple: #8B5CF6;    /* Ana mor */
--success-green: #10B981;     /* Başarı yeşili */
--warning-amber: #F59E0B;     /* Uyarı sarısı */
--error-red: #EF4444;         /* Hata kırmızısı */

/* Nötr Renkler */
--gray-50: #F8FAFC;
--gray-100: #F1F5F9;
--gray-200: #E2E8F0;
--gray-300: #CBD5E1;
--gray-400: #94A3B8;
--gray-500: #64748B;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1E293B;
--gray-900: #0F172A;

/* Arka Planlar */
--background: #F8FAFC;        /* Ana arka plan */
--surface: #FFFFFF;            /* Kart arka planı */
--overlay: rgba(15, 23, 42, 0.5); /* Modal overlay */
```

### **Semantic Colors**
```css
--text-primary: #0F172A;       /* Ana metin */
--text-secondary: #64748B;     /* İkincil metin */
--text-muted: #94A3B8;         /* Soluk metin */
--border-light: #E2E8F0;       /* Hafif kenarlık */
--border-medium: #CBD5E1;      /* Orta kenarlık */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
```

---

## 📝 **Typography**

### **Font Hiyerarşisi**
```css
/* Font Ailesi */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'SF Mono', monospace;

/* Font Boyutları */
--text-xs: 12px;     /* Küçük metin, etiketler */
--text-sm: 14px;     /* İkincil metin */
--text-base: 16px;   /* Ana metin */
--text-lg: 18px;     /* Başlıklar */
--text-xl: 24px;     /* Büyük başlıklar */
--text-2xl: 32px;    /* Hero başlıklar */

/* Font Ağırlıkları */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### **Text Styles**
```css
/* Başlıklar */
.heading-1: font-size: var(--text-2xl); font-weight: 700; line-height: 1.2;
.heading-2: font-size: var(--text-xl); font-weight: 700; line-height: 1.3;
.heading-3: font-size: var(--text-lg); font-weight: 600; line-height: 1.4;

/* Metin */
.body-large: font-size: var(--text-base); font-weight: 400; line-height: 1.5;
.body-medium: font-size: var(--text-sm); font-weight: 500; line-height: 1.5;
.body-small: font-size: var(--text-xs); font-weight: 400; line-height: 1.4;

/* Etiketler */
.label-default: font-size: var(--text-xs); font-weight: 500; text-transform: uppercase;
```

---

## 🎯 **Spacing System**

### **8-Point Grid System**
```css
/* Spacing Scale */
--space-1: 4px;    /* 0.25rem */
--space-2: 8px;    /* 0.5rem */
--space-3: 12px;   /* 0.75rem */
--space-4: 16px;   /* 1rem */
--space-5: 20px;   /* 1.25rem */
--space-6: 24px;   /* 1.5rem */
--space-8: 32px;   /* 2rem */
--space-10: 40px;  /* 2.5rem */
--space-12: 48px;  /* 3rem */
--space-16: 64px;  /* 4rem */
--space-20: 80px;  /* 5rem */
```

### **Component Spacing**
```css
/* Kart iç boşlukları */
--card-padding: var(--space-4);
--card-gap: var(--space-3);
--card-radius: 12px;

/* Listeler */
--list-item-padding: var(--space-4);
--list-item-gap: var(--space-2);

/* Form elemanları */
--form-field-gap: var(--space-3);
--form-padding: var(--space-4);
--button-height: 44px; /* Minimum touch target */
```

---

## 🎨 **Component Library**

### **1. Navigation Components**

#### **Bottom Navigation Bar**
```
┌─────────────────────────────────────────────┐
│  🏠   📦   👥   📊   👤  ⚙️  │
│ Gen. Satış  CRM  Stok  Profil Ayar │
└─────────────────────────────────────────────┘
```
**Özellikler:**
- Height: 64px
- Active state: Ana renk + ikon vurgusu
- Badge: Bildirim sayısı
- Safe area: iOS bottom notch uyumu

#### **Header**
```
┌─────────────────────────────────────────────┐
│ ISAC Sense Digital        👤 Ahmet Y. │
│ YÖNETİM PANELİ         Çıkış     │
└─────────────────────────────────────────────┘
```
**Özellikler:**
- Height: 56px
- Logo: 32x32px
- User info: İsim + avatar
- Actions: Çıkış butonu

### **2. Card Components**

#### **KPI Card**
```
┌─────────────────────────────────┐
│  📦 Toplam Sipariş      │
│        1,234              │
│     %12.5 ▲ önceki ay    │
└─────────────────────────────────┘
```
**Özellikler:**
- Background: White surface
- Padding: 16px
- Border radius: 12px
- Shadow: Medium
- Icon: 24px
- Value: 24px bold
- Trend: Mini chart veya yüzde

#### **Data Card**
```
┌─────────────────────────────────┐
│ 🏢 ABC Ltd. Şti.        │
│ 0555 123 45 67          │
│ Marmara • İstanbul         │
│─────────────────────────────────│
│ 📋 45 sipariş           │
│ ✅ 38 tamamlandı          │
│ ⏳ 7 açık                │
└─────────────────────────────────┘
```

### **3. List Components**

#### **List Item**
```
┌─────────────────────────────────┐
│ [İkon] [Başlık] [Tarih]    │
│        [Açıklama]           │
│ [Durum] [Tutar] [> ]      │
└─────────────────────────────────┘
```
**Özellikler:**
- Height: 72px minimum
- Padding: 16px
- Divider: Hafif çizgi
- Swipe actions: Sağdan kaydırma
- Press state: Hafif arka plan değişimi

#### **Section Header**
```
┌─────────────────────────────────┐
│  Satış Siparişleri         │
│  (1,234 kayıt)            │
└─────────────────────────────────┘
```

### **4. Form Components**

#### **Search Bar**
```
┌─────────────────────────────────┐
│ 🔍 Müşteri veya ürün ara... │
└─────────────────────────────────┘
```
**Özellikler:**
- Height: 44px
- Border radius: 8px
- Icon: 16px sol tarafta
- Clear button: Sağ tarafta
- Focus state: Ana renk kenarlık

#### **Filter Chip**
```
┌───────────┐ ┌───────┐ ┌─────────┐
│  Marmara │ │  Açık  │ │  2024   │
└───────────┘ └───────┘ └─────────┘
```
**Özellikler:**
- Height: 32px
- Border radius: 16px
- Active: Ana renk arka plan
- Close icon: X ile kaldırma

### **5. Chart Components**

#### **Mini Chart**
```
┌─────────────────────────────────┐
│    📈                    │
│    ╭─╮                   │
│   ╱   ╲                  │
│  ╱     ╲                 │
│ ╭─╯     ╰─╮               │
└─────────────────────────────────┘
```
**Özellikler:**
- Size: 60x60px
- Line color: Ana renk
- Grid: Hafif grid çizgileri
- Interactive: Tap ile detay

#### **Full Width Chart**
```
┌─────────────────────────────────┐
│      Ocak Şubat Mart        │
│    ╭─╮ ╭─╮ ╭─╮           │
│   ╱   ╲╱   ╲╱   ╲          │
│  ╱     ╲╱     ╲╱     ╲         │
│ ╭─╯     ╰─╮   ╰─╮   ╰─╮        │
└─────────────────────────────────┘
```

### **6. Modal Components**

#### **Bottom Sheet (iOS Style)**
```
┌─────────────────────────────────┐
│  Sipariş Detayı           │
│  ───────────────────────    │
│  Müşteri: ABC Ltd.        │
│  Ürün: XYZ Model         │
│  Tutar: €1,234.56       │
│                          │
│  [Kapat] [İptal Et]     │
└─────────────────────────────────┘
```
**Özellikler:**
- Handle: 40px height
- Backdrop: Semi-transparent overlay
- Swipe to dismiss: Aşağı kaydırma
- Safe area: Alt çent uyumu

#### **Full Screen Modal**
```
┌─────────────────────────────────┐
│  < Geri     Kullanıcı Detayı │
│  ───────────────────────    │
│                          │
│  [Tüm içeriği burada]     │
└─────────────────────────────────┘
```

### **7. Status Components**

#### **Badge**
```
┌─────┐ ┌─────┐ ┌───────┐
│  Yeni│ │Aktif │ │Tamamlandı│
└─────┘ └─────┘ └───────┘
```
**Renkler:**
- New: Warning amber
- Active: Primary blue
- Completed: Success green
- Cancelled: Error red

#### **Progress Indicator**
```
┌─────────────────────────────────┐
│ ████████░░░ 75%           │
│ Yükleniyor...               │
└─────────────────────────────────┘
```

---

## 📱 **Screen Layouts**

### **1. Dashboard Layout**
```
┌─────────────────────────────────┐
│ Header (56px)                │
├─────────────────────────────────┤
│                              │
│  ┌─────┐ ┌─────┐ ┌─────┐ │
│  │KPI-1│ │KPI-2│ │KPI-3│ │
│  └─────┘ └─────┘ └─────┘ │
│                              │
│  ┌─────────────────────────┐   │
│  │     Grafik Alanı      │   │
│  └─────────────────────────┘   │
│                              │
│  ┌─────────────────────────┐   │
│  │     Liste Alanı       │   │
│  └─────────────────────────┘   │
│                              │
├─────────────────────────────────┤
│ Bottom Nav (64px)            │
└─────────────────────────────────┘
```

### **2. List Layout**
```
┌─────────────────────────────────┐
│ Header (56px)                │
├─────────────────────────────────┤
│ ┌─────────────────────────┐   │
│ │ 🔍 Arama Çubuğu     │   │
│ └─────────────────────────┘   │
│                              │
│ ┌─────────────────────────┐   │
│ │ 📋 Filtreler        │   │
│ │ [Chip] [Chip] [Chip] │   │
│ └─────────────────────────┘   │
│                              │
│ ┌─────────────────────────┐   │
│ │     Liste Elemanları   │   │
│ ├─────────────────────────┤   │
│ │ [Item] [Item] [Item] │   │
│ ├─────────────────────────┤   │
│ │ [Item] [Item] [Item] │   │
│ └─────────────────────────┘   │
├─────────────────────────────────┤
│ Bottom Nav (64px)            │
└─────────────────────────────────┘
```

### **3. Detail Layout**
```
┌─────────────────────────────────┐
│ Header (56px)                │
├─────────────────────────────────┤
│                              │
│ ┌─────────────────────────┐   │
│ │     Detay İçeriği    │   │
│ │ ┌─────┐ ┌─────┐      │
│ │ │Bilgi│ │İşlem│      │
│ │ └─────┘ └─────┘      │
│ │                          │
│ │ [Tab] [Tab] [Tab]     │
│ └─────────────────────────┘   │
│                              │
│ ┌─────────────────────────┐   │
│ │   İlişkili Kayıtlar  │   │
│ └─────────────────────────┘   │
├─────────────────────────────────┤
│ Bottom Nav (64px)            │
└─────────────────────────────────┘
```

---

## 🎯 **Interaction Patterns**

### **1. Navigation**
- **Tab switching** - Horizontal swipe
- **Pull to refresh** - Vertical pull
- **Infinite scroll** - Bottom reach
- **Back navigation** - Swipe edge or button

### **2. Data Entry**
- **Quick filters** - Pre-defined chips
- **Date range picker** - Calendar modal
- **Multi-select** - Checkbox list
- **Search suggestions** - Auto-complete

### **3. Feedback**
- **Loading states** - Skeletons ve spinners
- **Empty states** - İllustrasyon + action
- **Error states** - Clear message + retry
- **Success states** - Confirmation toast

---

## 📐 **Breakpoints and Responsive**

### **Device Sizes**
```css
/* Mobile */
--mobile-sm: 320px-375px;   /* iPhone SE */
--mobile-md: 376px-414px;   /* iPhone 12 */
--mobile-lg: 415px-480px;   /* iPhone Plus */

/* Tablet */
--tablet-sm: 481px-768px;   /* Small tablets */
--tablet-md: 769px-1024px;  /* Standard tablets */

/* Desktop */
--desktop: 1025px+;         /* Desktop */
```

### **Adaptive Layouts**
- **Mobile**: Single column, stacked cards
- **Tablet**: Two columns, larger cards
- **Desktop**: Multi-column dashboard

---

## 🔧 **Figma Organization**

### **File Structure**
```
ISAC-Mobile-App/
├── 📁 Design System/
│   ├── Colors.figma
│   ├── Typography.figma
│   ├── Components.figma
│   └── Icons.figma
├── 📁 Screens/
│   ├── 01-Authentication/
│   ├── 02-Dashboard/
│   ├── 03-Sales/
│   ├── 04-CRM/
│   ├── 05-Reports/
│   └── 06-Profile/
├── 📁 Prototypes/
│   ├── User-Flows.fig
│   └── Interactive.fig
└── 📁 Assets/
    ├── Icons/
    ├── Images/
    └── Illustrations/
```

### **Component Naming**
- **Prefix**: Kategori (Button, Card, Input)
- **Modifier**: State/Variant (Primary, Secondary, Disabled)
- **Size**: Small, Medium, Large
- **Example**: Button-Primary-Medium, Card-Data

---

## 🚀 **Implementation Notes**

### **Development Handoff**
- **Export**: React Native compatible format
- **Assets**: SVG icons, optimized images
- **Tokens**: CSS variables export
- **Specs**: Component documentation

### **Animation Guidelines**
- **Duration**: 200-300ms for micro-interactions
- **Easing**: Ease-out for entrance, ease-in for exit
- **Springs**: Physical-feeling gestures
- **Loading**: Subtle animations only

---

Bu kılavuz Figma'da mobil uygulamanızın tasarlanması için tüm gerekli bilgileri içerir. Tutarlı bir design system ve component library oluşturmak için bu referans kullanılabilir.

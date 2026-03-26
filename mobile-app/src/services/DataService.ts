import crmData from '../data/crmData.json';
import offerReportData from '../data/offerReportData.json';
import orderReportData from '../data/orderReportData.json';
import purchasingInvoiceData from '../data/purchasingInvoiceData.json';
import purchasingOfferData from '../data/purchasingOfferData.json';
import salesReportData from '../data/salesReportData.json';
import stockOrderData from '../data/stockOrderData.json';

export interface CRMActivity {
  CARIKODU: string;
  TICARI_UNVANI: string;
  KONU: string;
  AKTIVITE_KODU: string;
  TIPI: string;
  DURUMU: string;
  AKTIVITE_SAHIBI: string;
  BASLAMA: string;
  BITIS: string;
  GORUSME_SURESI: string;
  ACIKLAMA_NOTLAR: string;
  CARI_YETKILI: string;
  CARI_YETKILI_GOREVI: string;
  ADI_SOYADI: string;
  [key: string]: any;
}

export interface SalesReport {
  [key: string]: any;
}

export interface OrderReport {
  [key: string]: any;
}

export interface OfferReport {
  [key: string]: any;
}

export interface PurchasingOffer {
  [key: string]: any;
}

export interface PurchasingInvoice {
  [key: string]: any;
}

export interface StockOrder {
  [key: string]: any;
}

interface DataStructure {
  [sheetName: string]: {
    headers: string[];
    data: any[];
    totalRows: number;
  };
}

class DataService {
  // CRM Verileri
  static getCRMActivities(): CRMActivity[] {
    return crmData.VW_CRM_AKTIVITE?.data || [];
  }

  static getCRMHeaders(): string[] {
    return crmData.VW_CRM_AKTIVITE?.headers || [];
  }

  static getCRMActivityById(cariKodu: string): CRMActivity | undefined {
    return this.getCRMActivities().find(activity => activity.CARIKODU === cariKodu);
  }

  static searchCRMActivities(query: string): CRMActivity[] {
    const activities = this.getCRMActivities();
    return activities.filter(activity => 
      activity.TICARI_UNVANI.toLowerCase().includes(query.toLowerCase()) ||
      activity.KONU.toLowerCase().includes(query.toLowerCase()) ||
      activity.CARI_YETKILI.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Satış Raporları
  static getSalesReports(): SalesReport[] {
    const firstSheet = Object.keys(salesReportData)[0];
    return (salesReportData as any)[firstSheet]?.data || [];
  }

  static getSalesReportHeaders(): string[] {
    const firstSheet = Object.keys(salesReportData)[0];
    return (salesReportData as any)[firstSheet]?.headers || [];
  }

  // Sipariş Raporları
  static getOrderReports(): OrderReport[] {
    const firstSheet = Object.keys(orderReportData)[0];
    return orderReportData[firstSheet]?.data || [];
  }

  static getOrderReportHeaders(): string[] {
    const firstSheet = Object.keys(orderReportData)[0];
    return orderReportData[firstSheet]?.headers || [];
  }

  // Teklif Raporları
  static getOfferReports(): OfferReport[] {
    const firstSheet = Object.keys(offerReportData)[0];
    return offerReportData[firstSheet]?.data || [];
  }

  static getOfferReportHeaders(): string[] {
    const firstSheet = Object.keys(offerReportData)[0];
    return offerReportData[firstSheet]?.headers || [];
  }

  // Satınalma Teklifleri
  static getPurchasingOffers(): PurchasingOffer[] {
    const firstSheet = Object.keys(purchasingOfferData)[0];
    return purchasingOfferData[firstSheet]?.data || [];
  }

  static getPurchasingOfferHeaders(): string[] {
    const firstSheet = Object.keys(purchasingOfferData)[0];
    return purchasingOfferData[firstSheet]?.headers || [];
  }

  // Satınalma Faturaları
  static getPurchasingInvoices(): PurchasingInvoice[] {
    const firstSheet = Object.keys(purchasingInvoiceData)[0];
    return purchasingInvoiceData[firstSheet]?.data || [];
  }

  static getPurchasingInvoiceHeaders(): string[] {
    const firstSheet = Object.keys(purchasingInvoiceData)[0];
    return purchasingInvoiceData[firstSheet]?.headers || [];
  }

  // Stok Siparişleri
  static getStockOrders(): StockOrder[] {
    const firstSheet = Object.keys(stockOrderData)[0];
    return stockOrderData[firstSheet]?.data || [];
  }

  static getStockOrderHeaders(): string[] {
    const firstSheet = Object.keys(stockOrderData)[0];
    return stockOrderData[firstSheet]?.headers || [];
  }

  // Genel arama fonksiyonu
  static searchAllData(query: string): {
    crm: CRMActivity[];
    sales: SalesReport[];
    orders: OrderReport[];
    offers: OfferReport[];
  } {
    return {
      crm: this.searchCRMActivities(query),
      sales: this.getSalesReports().filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      ),
      orders: this.getOrderReports().filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      ),
      offers: this.getOfferReports().filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      )
    };
  }
  // Dashboard KPI ve Trend Hesaplamaları
  static getDashboardKPIs() {
    const sales = this.getSalesReports();
    const orders = this.getOrderReports();
    const offers = this.getOfferReports();
    const stock = this.getStockOrders();
    const crm = this.getCRMActivities();

    const totalSalesEur = sales.reduce((s, d) => s + Number(d.DVZ_IND_TUTAR || 0), 0);
    const pendingOrdersEur = orders.reduce((s, d) => s + Number(d.DVZ_IND_TUTAR || 0), 0);
    const openOffersEur = offers.reduce((s, d) => s + Number(d.DVZ_IND_TUTAR || 0), 0);
    const criticalStock = stock.filter(d => String(d.DURUM || '').includes('SIFIR BAKİYE')).length;

    const fmt = (n: number) => '€' + n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return {
      totalSales: fmt(totalSalesEur),
      pendingOrders: fmt(pendingOrdersEur),
      openOffers: fmt(openOffersEur),
      criticalStock,
      crmActivities: crm.length,
    };
  }

  static getMonthlySalesTrend(): { month: string; value: number; label: string }[] {
    const TR_MONTHS = ['', 'OCA', 'ŞUB', 'MAR', 'NİS', 'MAY', 'HAZ', 'TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'];
    const monthly: Record<string, number> = {};

    // Satış fatura verisi (YIL/AY alanları)
    this.getSalesReports().forEach(r => {
      if (!r.YIL || !r.AY) return;
      const key = `${r.YIL}-${String(r.AY).padStart(2, '0')}`;
      monthly[key] = (monthly[key] || 0) + Number(r.DVZ_IND_TUTAR || 0);
    });

    // Sipariş verisi (TARIHI Excel serial) — satış faturasında olmayan ayları tamamlar
    this.getOrderReports().forEach(r => {
      if (!r.TARIHI) return;
      const num = Number(r.TARIHI);
      if (isNaN(num) || num === 0) return;
      const d = new Date(Math.round((num - 25569) * 86400 * 1000));
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!monthly[key]) monthly[key] = Number(r.DVZ_IND_TUTAR || 0);
    });

    const sorted = Object.entries(monthly)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-5); // Son 5 ay

    return sorted.map(([key, value]) => {
      const [, month] = key.split('-');
      return { month: TR_MONTHS[parseInt(month)] || month, value, label: key };
    });
  }

  static getRegionalSales(): { region: string; value: string; percentage: number }[] {
    const sales = this.getSalesReports();
    const regional: Record<string, number> = {};

    sales.forEach(r => {
      const g = String(r.GRUBU || 'Diğer');
      regional[g] = (regional[g] || 0) + Number(r.DVZ_IND_TUTAR || 0);
    });

    const sorted = Object.entries(regional).sort((a, b) => b[1] - a[1]);
    const max = sorted[0]?.[1] || 1;

    return sorted.slice(0, 5).map(([region, val]) => ({
      region,
      value: `€${val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      percentage: Math.round((val / max) * 100),
    }));
  }
}

export default DataService;

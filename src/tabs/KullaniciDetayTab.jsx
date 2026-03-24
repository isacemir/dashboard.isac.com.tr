import { useState, useEffect, useMemo } from "react";
import { KPICard, DataTable, ChartCard, TTip, Badge,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
  groupSum, topN, fmtDate, apiFetch } from "../components.jsx";

const COLOR = "#f59e0b";
const DURUM_MAP = {
  "Yapıldı":   {bg:"#d1fae5",color:"#065f46"},
  "Tamamlandı": {bg:"#d1fae5",color:"#065f46"},
  "Yapılacak": {bg:"#dbeafe",color:"#1e40af"},
  "İptal":     {bg:"#fee2e2",color:"#991b1b"},
};
const TIP_COLORS = ["#f59e0b","#ec4899","#0ea5e9","#10b981","#8b5cf6","#ef4444","#6366f1"];

export default function KullaniciDetayTab({ kullaniciAdi }) {
  const [crmRows, setCrmRows] = useState([]);
  const [siparisRows, setSiparisRows] = useState([]);
  const [faturaRows, setFaturaRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      // CRM aktiviteleri
      const crmResponse = await apiFetch("/api/crm.php", { sahip: kullaniciAdi });
      if (crmResponse) {
        setCrmRows(crmResponse.rows || []);
      }

      // Satış siparişleri
      const siparisResponse = await apiFetch("/api/satis_siparis.php", { personel: kullaniciAdi });
      if (siparisResponse) {
        setSiparisRows(siparisResponse.rows || []);
      }

      // Satış faturaları
      const faturaResponse = await apiFetch("/api/fatura.php", { personel: kullaniciAdi });
      if (faturaResponse) {
        setFaturaRows(faturaResponse.rows || []);
      }

    } catch (error) {
      console.error('Kullanıcı detay yükleme hatası:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (kullaniciAdi) {
      loadData();
    }
  }, [kullaniciAdi]);

  // KPI hesaplamaları
  const kpiData = useMemo(() => {
    return {
      crm: {
        toplam: crmRows.length,
        tamamlandi: crmRows.filter(r => r.DURUMU === 'Tamamlandı').length,
        yapilacak: crmRows.filter(r => r.DURUMU === 'Yapılacak').length,
        firsat: crmRows.filter(r => r.FIRSATADI).length,
        ortalamaSure: crmRows.reduce((sum, r) => sum + (parseFloat(r.GORUSME_SURESI) || 0), 0) / crmRows.length || 0,
      },
      siparis: {
        toplam: siparisRows.length,
        acik: siparisRows.filter(r => r.SIPARIS_DURUMU === 'Açık').length,
        kapali: siparisRows.filter(r => r.SIPARIS_DURUMU === 'Kapalı').length,
        iptal: siparisRows.filter(r => r.SIPARIS_DURUMU === 'İptal').length,
        toplamTutar: siparisRows.reduce((sum, r) => sum + (parseFloat(r.DVZ_IND_TUTAR) || 0), 0),
      },
      fatura: {
        toplam: faturaRows.length,
        toplamTutar: faturaRows.reduce((sum, r) => sum + (parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0), 0),
        iptal: faturaRows.filter(r => r.IPTAL == 1 || r.IPTAL === "1").length,
      }
    };
  }, [crmRows, siparisRows, faturaRows]);

  // Grafik verileri
  const aktiviteTipleri = useMemo(() => {
    const tipler = {};
    crmRows.forEach(r => {
      const tip = r.TIPI || 'Bilinmeyen';
      tipler[tip] = (tipler[tip] || 0) + 1;
    });
    return Object.entries(tipler).map(([name, val]) => ({ name, val }));
  }, [crmRows]);

  const aylikPerformans = useMemo(() => {
    const aylik = {};
    const ayNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    
    crmRows.forEach(r => {
      if (r.BASLAMA) {
        const tarih = new Date(r.BASLAMA);
        const ay = tarih.getMonth();
        const yil = tarih.getFullYear();
        const key = `${yil}-${ay}`;
        
        if (!aylik[key]) {
          aylik[key] = { ay: `${ayNames[ay]} ${yil}`, crm: 0, siparis: 0, fatura: 0 };
        }
        aylik[key].crm++;
      }
    });
    
    siparisRows.forEach(r => {
      if (r.TARIHI) {
        const tarih = new Date(r.TARIHI);
        const ay = tarih.getMonth();
        const yil = tarih.getFullYear();
        const key = `${yil}-${ay}`;
        
        if (!aylik[key]) {
          aylik[key] = { ay: `${ayNames[ay]} ${yil}`, crm: 0, siparis: 0, fatura: 0 };
        }
        aylik[key].siparis++;
      }
    });
    
    faturaRows.forEach(r => {
      if (r.FATURA_TARIHI) {
        const tarih = new Date(r.FATURA_TARIHI);
        const ay = tarih.getMonth();
        const yil = tarih.getFullYear();
        const key = `${yil}-${ay}`;
        
        if (!aylik[key]) {
          aylik[key] = { ay: `${ayNames[ay]} ${yil}`, crm: 0, siparis: 0, fatura: 0 };
        }
        aylik[key].fatura++;
      }
    });
    
    return Object.values(aylik).sort((a, b) => a.ay.localeCompare(b.ay)).slice(-6);
  }, [crmRows, siparisRows, faturaRows]);

  const musterilereGore = useMemo(() => {
    const musteriler = {};
    crmRows.forEach(r => {
      const musteri = r.TICARI_UNVANI || 'Bilinmeyen';
      musteriler[musteri] = (musteriler[musteri] || 0) + 1;
    });
    return Object.entries(musteriler)
      .map(([name, val]) => ({ name, val }))
      .sort((a, b) => b.val - a.val)
      .slice(0, 8);
  }, [crmRows]);

  if (error) {
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"200px",flexDirection:"column",gap:10}}>
        <div style={{fontSize:16,color:"#ef4444",fontWeight:600}}>Kullanıcı Detay Hatası</div>
        <div style={{fontSize:14,color:"#64748b"}}>{error}</div>
        <button 
          onClick={() => loadData()} 
          style={{padding:"8px 16px",backgroundColor:COLOR,color:"#fff",border:"none",borderRadius:6,cursor:"pointer"}}
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"200px"}}>
        <div style={{fontSize:16,color:"#64748b"}}>Kullanıcı detayları yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1.5rem",padding:"1rem",background:"#fff",borderRadius:12,border:"1px solid #e2e8f0"}}>
        <div>
          <h1 style={{margin:0,color:"#0f172a",fontSize:28,fontWeight:700}}>{kullaniciAdi}</h1>
          <p style={{margin:0,color:"#64748b",fontSize:14}}>Personel Performans Analizi</p>
        </div>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding:"8px 16px",
            backgroundColor:"#f1f5f9",
            color:"#64748b",
            border:"none",
            borderRadius:6,
            cursor:"pointer",
            fontSize:14,
            fontWeight:500
          }}
        >
          ← Geri
        </button>
      </div>

      {/* KPI Kartları */}
      <div style={{marginBottom:"1.5rem"}}>
        <h2 style={{margin:"0 0 1rem 0",color:"#0f172a",fontSize:18,fontWeight:600}}>Genel Bakış</h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>
          <KPICard label="CRM Aktivite" value={kpiData.crm.toplam} icon="📅" color="#ec4899" bg="#fce7f3"/>
          <KPICard label="Satış Sipariş" value={kpiData.siparis.toplam} icon="📋" color="#3b82f6" bg="#dbeafe"/>
          <KPICard label="Satış Fatura" value={kpiData.fatura.toplam} icon="📄" color="#10b981" bg="#d1fae5"/>
          <KPICard label="Toplam Ciro" value={Math.round(kpiData.siparis.toplamTutar + kpiData.fatura.toplamTutar)} prefix="€" icon="💰" color="#8b5cf6" bg="#ede9fe"/>
        </div>
      </div>

      {/* Detaylı KPI'lar */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.5rem"}}>
        {/* CRM KPI'ları */}
        <div style={{background:"#fff",borderRadius:12,padding:"1rem",border:"1px solid #e2e8f0"}}>
          <h3 style={{margin:"0 0 1rem 0",color:"#0f172a",fontSize:16,fontWeight:600}}>CRM Performansı</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <KPICard label="Tamamlandı" value={kpiData.crm.tamamlandi} icon="✅" color="#10b981" bg="#d1fae5"/>
            <KPICard label="Yapılacak" value={kpiData.crm.yapilacak} icon="⏳" color="#f59e0b" bg="#fef3c7"/>
            <KPICard label="Fırsat Bağlı" value={kpiData.crm.firsat} icon="🎯" color="#ec4899" bg="#fce7f3"/>
            <KPICard label="Ort. Süre" value={Math.round(kpiData.crm.ortalamaSure)} suffix="dk" icon="⏱️" color="#f59e0b" bg="#fef3c7"/>
          </div>
        </div>

        {/* Satış KPI'ları */}
        <div style={{background:"#fff",borderRadius:12,padding:"1rem",border:"1px solid #e2e8f0"}}>
          <h3 style={{margin:"0 0 1rem 0",color:"#0f172a",fontSize:16,fontWeight:600}}>Satış Performansı</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <KPICard label="Açık" value={kpiData.siparis.acik} icon="⏳" color="#f59e0b" bg="#fef3c7"/>
            <KPICard label="Kapalı" value={kpiData.siparis.kapali} icon="✅" color="#10b981" bg="#d1fae5"/>
            <KPICard label="İptal" value={kpiData.siparis.iptal} icon="🚫" color="#ef4444" bg="#fee2e2"/>
            <KPICard label="Toplam Tutar" value={Math.round(kpiData.siparis.toplamTutar)} prefix="€" icon="💰" color="#3b82f6" bg="#dbeafe"/>
          </div>
        </div>
      </div>

      {/* Grafikler */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.5rem"}}>
        <div style={{background:"#fff",borderRadius:12,padding:"1rem",border:"1px solid #e2e8f0"}}>
          <h3 style={{margin:"0 0 1rem 0",color:"#0f172a",fontSize:16,fontWeight:600}}>Aktivite Tipleri</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={aktiviteTipleri} cx="50%" cy="50%" outerRadius={70} dataKey="val" startAngle={90} endAngle={-270}>
                {aktiviteTipleri.map((_,i)=><Cell key={i} fill={TIP_COLORS[i%TIP_COLORS.length]}/> )}
              </Pie>
              <Tooltip formatter={v=>[`${v} adet`]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{background:"#fff",borderRadius:12,padding:"1rem",border:"1px solid #e2e8f0"}}>
          <h3 style={{margin:"0 0 1rem 0",color:"#0f172a",fontSize:16,fontWeight:600}}>Aylık Performans</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={aylikPerformans} margin={{left:10,right:16}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
              <XAxis dataKey="ay" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} angle={-45} textAnchor="end" height={60}/>
              <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <Tooltip/>
              <Bar dataKey="crm" name="CRM" fill="#ec4899" maxBarSize={12} />
              <Bar dataKey="siparis" name="Sipariş" fill="#3b82f6" maxBarSize={12} />
              <Bar dataKey="fatura" name="Fatura" fill="#10b981" maxBarSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Müşteri Dağılımı */}
      <div style={{marginBottom:"1.5rem"}}>
        <div style={{background:"#fff",borderRadius:12,padding:"1rem",border:"1px solid #e2e8f0"}}>
          <h3 style={{margin:"0 0 1rem 0",color:"#0f172a",fontSize:16,fontWeight:600}}>En Çok Çalışılan Müşteriler</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={musterilereGore} layout="horizontal" margin={{left:10,right:16}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:"#334155"}} axisLine={false} tickLine={false} width={120}/>
              <Tooltip/>
              <Bar dataKey="val" name="Aktivite" fill={COLOR} radius={[0,5,5,0]} maxBarSize={16}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detay Tabloları */}
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12}}>
        <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{padding:"1rem",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"}}>
            <h3 style={{margin:0,color:"#0f172a",fontSize:16,fontWeight:600}}>CRM Aktiviteleri</h3>
          </div>
          <DataTable 
            color="#ec4899" 
            filename={`crm_aktiviteler_${kullaniciAdi}`}
            data={crmRows} 
            columns={[
              {key:"AKTIVITE_KODU", label:"Aktivite No", render:v=><span style={{color:"#ec4899",fontFamily:"monospace",fontWeight:600,fontSize:11}}>{v}</span>},
              {key:"BASLAMA", label:"Tarih", render:v=>v ? new Date(v).toLocaleDateString('tr-TR') : "-"},
              {key:"TICARI_UNVANI", label:"Müşteri", render:v=><span style={{color:"#8b5cf6",fontWeight:500}}>{v}</span>},
              {key:"TIPI", label:"Tip"},
              {key:"DURUMU", label:"Durum", render:v=><Badge value={v} map={DURUM_MAP}/>},
              {key:"KONU", label:"Konu"},
              {key:"GORUSME_SURESI", label:"Süre", render:v=>v ? `${v} dk` : "-"},
              {key:"FIRSATADI", label:"Fırsat", render:v=>v?<span style={{color:"#8b5cf6",fontSize:11,fontWeight:600}}>🎯{v}</span>:"-"},
            ]}
          />
        </div>

        <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{padding:"1rem",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"}}>
            <h3 style={{margin:0,color:"#0f172a",fontSize:16,fontWeight:600}}>Satış Siparişleri</h3>
          </div>
          <DataTable 
            color="#3b82f6" 
            filename={`satis_siparis_${kullaniciAdi}`}
            data={siparisRows} 
            columns={[
              {key:"SIPARIS_NO", label:"Sipariş No", render:v=><span style={{color:"#3b82f6",fontFamily:"monospace",fontWeight:600,fontSize:11}}>{v}</span>},
              {key:"TARIHI", label:"Tarih", render:v=>v ? new Date(v).toLocaleDateString('tr-TR') : "-"},
              {key:"TICARI_UNVANI", label:"Müşteri", render:v=><span style={{color:"#8b5cf6",fontWeight:500}}>{v}</span>},
              {key:"STOK_ADI", label:"Ürün"},
              {key:"MIKTARI", label:"Miktar", render:v=>v ? parseFloat(v).toLocaleString('tr-TR') : "-"},
              {key:"DVZ_IND_TUTAR", label:"Tutar", render:v=>v ? `€${parseFloat(v).toLocaleString('tr-TR', {minimumFractionDigits: 2})}` : "-"},
              {key:"SIPARIS_DURUMU", label:"Durum"},
            ]}
          />
        </div>

        <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{padding:"1rem",borderBottom:"1px solid #e2e8f0",background:"#f8fafc"}}>
            <h3 style={{margin:0,color:"#0f172a",fontSize:16,fontWeight:600}}>Satış Faturaları</h3>
          </div>
          <DataTable 
            color="#10b981" 
            filename={`satis_faturalar_${kullaniciAdi}`}
            data={faturaRows} 
            columns={[
              {key:"FATURA_NO", label:"Fatura No", render:v=><span style={{color:"#10b981",fontFamily:"monospace",fontWeight:600,fontSize:11}}>{v}</span>},
              {key:"FATURA_TARIHI", label:"Tarih", render:v=>v ? new Date(v).toLocaleDateString('tr-TR') : "-"},
              {key:"TICARI_UNVANI", label:"Müşteri", render:v=><span style={{color:"#8b5cf6",fontWeight:500}}>{v}</span>},
              {key:"STOK_ADI", label:"Ürün"},
              {key:"MIKTARI", label:"Miktar", render:v=>v ? parseFloat(v).toLocaleString('tr-TR') : "-"},
              {key:"IKINCI_DVZ_IND_TUTAR", label:"Tutar", render:v=>v ? `€${parseFloat(v).toLocaleString('tr-TR', {minimumFractionDigits: 2})}` : "-"},
              {key:"IPTAL", label:"İptal", render:v=>v ? "Evet" : "Hayır"},
            ]}
          />
        </div>
      </div>
    </div>
  );
}

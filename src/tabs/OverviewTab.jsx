import { useState, useEffect } from "react";
import { KPICard, ChartCard, TTip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, apiFetch } from "../components.jsx";

export default function OverviewTab() {
  const [data,setData] = useState({
    satis:   { kpi: {}, charts: {} },
    siparis: { kpi: {}, charts: {} },
    stok:    { kpi: {}, charts: {} },
    crm:     { kpi: {}, charts: {} },
    teklif:  { kpi: {}, charts: {} },
    purchase:{ kpi: {}, charts: {} },
  });
  const [loading,setLoading] = useState(true);

  async function loadAll() {
    setLoading(true);
    const results = await Promise.all([
      apiFetch("/api/fatura.php", {}, "summary"),
      apiFetch("/api/satis_siparis.php", {}, "summary"),
      apiFetch("/api/stok.php", {}, "summary"),
      apiFetch("/api/crm.php", {}, "summary"),
      apiFetch("/api/teklif.php", {}, "summary"),
      apiFetch("/api/satinalma_fatura.php", {}, "summary"),
    ]);

    setData({
      satis:    results[0] || { kpi:{} },
      siparis:  results[1] || { kpi:{} },
      stok:     results[2] || { kpi:{} },
      crm:      results[3] || { kpi:{} },
      teklif:   results[4] || { kpi:{} },
      purchase: results[5] || { kpi:{} },
    });
    setLoading(false);
  }

  useEffect(() => { loadAll(); }, []);

  const totalCiro    = data.satis.kpi?.toplam || 0;
  const totalOrders  = data.siparis.kpi?.toplam || 0;
  const criticalStok = data.stok.kpi?.kritik || 0;
  const crmToday     = data.crm.kpi?.sayi || 0;
  
  // Combine charts for a trend
  const trend = data.satis.charts?.trend || [];

  return (
    <div style={{animation: "fadeIn 0.5s"}}>
      <h2 style={{fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: "1.5rem"}}>Yönetim Özeti</h2>
      
      <div style={{display:"flex", gap:16, marginBottom: "2rem", flexWrap: "wrap"}}>
        <KPICard label="Toplam Satış (Ciro)" value={Math.round(totalCiro)} prefix="€" icon="🧾" color="#ef4444" bg="#fee2e2" sub="Faturalanan"/>
        <KPICard label="Bekleyen Siparişler" value={Math.round(totalOrders)} prefix="€" icon="⏳" color="#0ea5e9" bg="#e0f2fe" sub="Sevk Bekleyen"/>
        <KPICard label="Açık Teklifler"     value={Math.round(data.teklif.kpi?.toplam || 0)} prefix="€" icon="📋" color="#f59e0b" bg="#fef3c7"/>
        <KPICard label="Kritik Stok"        value={criticalStok} icon="⚠️" color="#10b981" bg="#d1fae5" sub="Acil Tedarik"/>
        <KPICard label="CRM Aktivite"       value={crmToday} icon="👥" color="#ec4899" bg="#fce7f3" sub="Toplam Kayıt"/>
      </div>

      <div style={{display:"grid", gridTemplateColumns: "2fr 1fr", gap: 16}}>
        <ChartCard title="Satış Trendi (Aylık Ciro)">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`€${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<TTip/>}/>
              <Area type="monotone" dataKey="val" name="Ciro" stroke="#ef4444" fill="#fee2e2" strokeWidth={3} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        
        <ChartCard title="Brüt Dağılım">
           <div style={{padding: "1rem"}}>
              <div style={{fontSize: 12, color: "#64748b", marginBottom: 15}}>Bölgesel Satış Dağılımı</div>
              {(data.satis.charts?.bolge || []).slice(0, 5).map((b,i) => (
                <div key={i} style={{marginBottom: 12}}>
                  <div style={{display:"flex", justifyContent:"space-between", fontSize: 11, marginBottom: 4}}>
                    <span style={{fontWeight: 600}}>{b.name}</span>
                    <span>€{(b.val/1000).toFixed(1)}K</span>
                  </div>
                  <div style={{height:6, background: "#f1f5f9", borderRadius: 3, overflow:"hidden"}}>
                    <div style={{height:"100%", width: `${Math.min(100, (b.val/totalCiro)*100)}%`, background: "#ef4444"}}/>
                  </div>
                </div>
              ))}
           </div>
        </ChartCard>
      </div>

      <div style={{marginTop: "2rem", padding: "1.5rem", background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0"}}>
        <h3 style={{fontSize: 14, fontWeight: 700, color: "#1e293b", marginBottom: "1rem"}}>Sistem Durumu</h3>
        <div style={{display:"grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20}}>
           <div>
              <div style={{fontSize: 11, color: "#94a3b8", textTransform: "uppercase"}}>Satınalma</div>
              <div style={{fontSize: 13, fontWeight: 600, marginTop: 4}}>€{Math.round(data.purchase.kpi?.toplam || 0).toLocaleString()} <span style={{fontSize: 10, color: "#10b981"}}>Aktif</span></div>
           </div>
           <div>
              <div style={{fontSize: 11, color: "#94a3b8", textTransform: "uppercase"}}>Stok Değeri</div>
              <div style={{fontSize: 13, fontWeight: 600, marginTop: 4}}>{data.stok.kpi?.stokta || 0} Çeşit Ürün</div>
           </div>
           <div>
              <div style={{fontSize: 11, color: "#94a3b8", textTransform: "uppercase"}}>Veri Kaynağı</div>
              <div style={{fontSize: 13, fontWeight: 600, marginTop: 4}}>Wolvox ERP (Excel)</div>
           </div>
           <div>
              <div style={{fontSize: 11, color: "#94a3b8", textTransform: "uppercase"}}>Son Güncelleme</div>
              <div style={{fontSize: 13, fontWeight: 600, marginTop: 4}}>{new Date().toLocaleTimeString()}</div>
           </div>
        </div>
      </div>
    </div>
  );
}

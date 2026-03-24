// Sipariş tipi sekmeler için ortak baz
// Kullanım: SatisTab, SiparisTab, SatinAlma/Sipariş, SatinAlma/Teklif
import { useState, useEffect } from "react";
import {
  KPICard, FilterBar, DataTable, ChartCard, TTip, Badge,
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  groupSum, topN, fmtDate, fmtEur, apiFetch,
} from "../components.jsx";

const SIP_DURUM = {
  "Muhasebelendi":{bg:"#d1fae5",color:"#065f46"},
  "Açık":         {bg:"#dbeafe",color:"#1e40af"},
  "İptal":        {bg:"#fee2e2",color:"#991b1b"},
  "Beklemede":    {bg:"#fef3c7",color:"#92400e"},
  "Kısmi Teslim": {bg:"#e0e7ff",color:"#3730a3"},
};

const TEK_DURUM = {
  "Onaylandı":                  {bg:"#d1fae5",color:"#065f46"},
  "Teklifte":                   {bg:"#dbeafe",color:"#1e40af"},
  "Siparişe Aktarıldı":         {bg:"#d1fae5",color:"#065f46"},
  "Sipariş Aktarıldı":          {bg:"#d1fae5",color:"#065f46"},
  "Muhasebelendi":              {bg:"#e0e7ff",color:"#3730a3"},
  "Arşiv":                      {bg:"#f1f5f9",color:"#475569"},
  "Fiyattan Dolayı Kaybedildi": {bg:"#fef3c7",color:"#92400e"},
  "Kaybedildi":                 {bg:"#fef3c7",color:"#92400e"},
  "Mükerrer":                   {bg:"#fef3c7",color:"#92400e"},
  "Revize edildi":              {bg:"#fef3c7",color:"#92400e"},
  "İptal":                      {bg:"#fee2e2",color:"#991b1b"},
};

// ── SİPARİŞ BAZLI SEKME (Satış Siparişleri, Sipariş Raporu, Satınalma Sipariş) ──
export function SiparisTab({ apiUrl, color, filename, title }) {
  const [rows,setRows]=useState([]);
  const [kpi,setKpi]=useState({});
  const [charts,setCharts]=useState({});
  const [loading,setLoading]=useState(false);
  const [filters,setFilters]=useState({});

  const uniq=(key)=>[...new Set(rows.map(r=>r[key]).filter(Boolean))].sort();

  async function load(f=filters){
    setLoading(true);
    // 1. Summary fetch
    const s = await apiFetch(apiUrl, f, "summary");
    if (s) { setKpi(s.kpi || {}); setCharts(s.charts || {}); }

    // 2. Full fetch
    const d = await apiFetch(apiUrl, f);
    if(d){ 
      setRows(d.rows||[]); 
      setKpi(d.kpi||{});
      if (d.rows?.length > 0) setCharts({});
    }
    setLoading(false);
  }

  useEffect(()=>{load();},[]);

  function tutar(r){
    const sd=filters.siparis_durumu||"";
    if(sd==="kapali") return +(r.TESLIM_EUR_TUTAR||0);
    if(sd==="iptal")  return +(r.IPTAL_EUR_TUTAR||0);
    if(sd==="acik")   return +(r.KALAN_EUR_TUTAR||0);
    return +(r.TESLIM_EUR_TUTAR||0) + +(r.KALAN_EUR_TUTAR||0) - +(r.IPTAL_EUR_TUTAR||0);
  }

  // Use pre-calculated charts if rows are not loaded yet
  let trendData = charts.trend || [];
  let bolgeChart = charts.bolge || [];

  if (rows.length > 0) {
    const trendMap={};
    rows.forEach(r=>{const k=(r.TARIHI||"").slice(0,7);if(k)trendMap[k]=(trendMap[k]||0)+tutar(r);});
    trendData=Object.entries(trendMap).sort().map(([k,v])=>({ay:k,tutar:Math.round(v)}));
    bolgeChart=topN(groupSum(rows,r=>r.GRUBU,tutar));
  }

  return (
    <div>
      <div style={{display:"flex",gap:12,marginBottom:"1.25rem",flexWrap:"wrap"}}>
        <KPICard label="Teslim (EUR)"    value={Math.round(kpi.teslim||0)} prefix="€" icon="✅" color={color} bg={color+"18"}/>
        <KPICard label="Kalan / Açık"    value={Math.round(kpi.kalan||0)}  prefix="€" icon="⏳" color="#f59e0b" bg="#fef3c7"/>
        <KPICard label="İptal (EUR)"     value={Math.round(kpi.iptal||0)}  prefix="€" icon="🚫" color="#ef4444" bg="#fee2e2"/>
        <KPICard label="Net Toplam"      value={Math.round(kpi.toplam||0)} prefix="€" icon="💰" color={color} bg={color+"18"}/>
        <KPICard label="Kayıt"           value={kpi.sayi||0}                           icon="🔢" color={color} bg={color+"18"}/>
      </div>

      <FilterBar color={color} values={filters} loading={loading}
        onChange={(k,v)=>setFilters(f=>({...f,[k]:v}))}
        onReset={()=>{setFilters({});load({});}}
        onApply={()=>load(filters)}
        filters={[
          {key:"musteri",        label:"Müşteri",          type:"text", placeholder:"Ünvan ara..."},
          {key:"stok_search",    label:"Stok Kodu",         type:"text", placeholder:"Stok ara..."},
          {key:"siparis_durumu", label:"Sipariş Durumu",    type:"select", options:["kapali","acik","iptal"]},
          {key:"siparis_turu",   label:"Sipariş Türü",      type:"select", options:uniq("SIPARIS_TURU")},
          {key:"bolge",          label:"Bölge",             type:"select", options:uniq("GRUBU")},
          {key:"personel",       label:"Personel",          type:"select", options:uniq("ARA_GRUBU")},
          {key:"kategori",       label:"Kategori",          type:"select", options:uniq("ALT_GRUBU")},
          {key:"marka",          label:"Marka",             type:"select", options:uniq("MARKASI")},
          {key:"model",          label:"Model",             type:"select", options:uniq("MODELI")},
          {key:"il",             label:"İl",                type:"select", options:uniq("ILI")},
        ]}
      />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.25rem"}}>
        <ChartCard title="Aylık Tutar (EUR)">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData}>
              <defs><linearGradient id={`g${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.18}/><stop offset="100%" stopColor={color} stopOpacity={0}/>
              </linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="ay" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`€${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<TTip/>}/>
              <Area type="monotone" dataKey="tutar" name="Tutar" stroke={color} strokeWidth={2} fill={`url(#g${color.replace("#","")})`} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Bölge Bazlı (EUR)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bolgeChart} layout="vertical" margin={{left:10,right:16}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`€${(v/1000).toFixed(0)}K`}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:"#334155"}} axisLine={false} tickLine={false} width={115}/>
              <Tooltip content={<TTip/>}/>
              <Bar dataKey="val" name="Tutar" fill={color} radius={[0,5,5,0]} maxBarSize={14}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <DataTable color={color} filename={filename} data={rows} columns={[
        {key:"SIPARIS_NO",      label:"Sipariş No",    render:v=><span style={{color,fontFamily:"monospace",fontWeight:600,fontSize:11}}>{v}</span>},
        {key:"TARIHI",          label:"Tarih",          render:v=>fmtDate(v)},
        {key:"TICARI_UNVANI",   label:"Müşteri"},
        {key:"ILI",             label:"İl"},
        {key:"GRUBU",           label:"Bölge"},
        {key:"ARA_GRUBU",       label:"Personel"},
        {key:"ALT_GRUBU",       label:"Kategori"},
        {key:"SIPARISI_ACAN",   label:"Açan"},
        {key:"STOKKODU",        label:"Stok Kodu",     render:v=><span style={{fontFamily:"monospace",fontSize:11}}>{v}</span>},
        {key:"STOK_ADI",        label:"Ürün"},
        {key:"MARKASI",         label:"Marka"},
        {key:"MODELI",          label:"Model"},
        {key:"MIKTARI",         label:"Mik."},
        {key:"MIKTARI_TESLIM",  label:"Teslim"},
        {key:"MIKTARI_KALAN",   label:"Kalan"},
        {key:"DVZ_IND_FIYAT",   label:"Birim €",       render:v=>fmtEur(+v)},
        {key:"TESLIM_EUR_TUTAR",label:"Teslim €",      render:v=>fmtEur(+v)},
        {key:"KALAN_EUR_TUTAR", label:"Kalan €",       render:v=><b>{fmtEur(+v)}</b>},
        {key:"IPTAL_EUR_TUTAR", label:"İptal €",       render:v=>fmtEur(+v)},
        {key:"SIPARIS_DURUMU",  label:"Durum",          render:v=><Badge value={v} map={SIP_DURUM}/>},
        {key:"SIPARIS_TURU",    label:"Tür"},
        {key:"DEPO_ADI",        label:"Depo"},
      ]}/>
    </div>
  );
}

// ── TEKLİF BAZLI SEKME ────────────────────────────────────
export function TeklifBaseTab({ apiUrl, color, filename }) {
  const [rows,setRows]=useState([]);
  const [kpi,setKpi]=useState({});
  const [charts,setCharts]=useState({});
  const [loading,setLoading]=useState(false);
  const [filters,setFilters]=useState({});

  const uniq=(key)=>[...new Set(rows.map(r=>r[key]).filter(Boolean))].sort();

  async function load(f=filters){
    setLoading(true);
    // 1. Summary fetch
    const s = await apiFetch(apiUrl, f, "summary");
    if (s) { setKpi(s.kpi || {}); setCharts(s.charts || {}); }

    // 2. Full fetch
    const d=await apiFetch(apiUrl,f);
    if(d){ 
      setRows(d.rows||[]); 
      setKpi(d.kpi||{}); 
      if (d.rows?.length > 0) setCharts({});
    }
    setLoading(false);
  }

  useEffect(()=>{load();},[]);

  let markaChart = charts.marka || [];
  let statusData = charts.durum || [];

  if (rows.length > 0) {
    markaChart=topN(groupSum(rows,r=>r.MARKASI,r=>+(r.DVZ_IND_TUTAR||0)));
    statusData=[
      {name:"Açık",val:rows.filter(r=>r.TEKLIF_DURUMU==="Teklifte"||r.TEKLIF_DURUMU==="Açık").length},
      {name:"Kapalı",val:rows.filter(r=>r.TEKLIF_DURUMU==="Onaylandı"||r.TEKLIF_DURUMU.includes("Aktarıldı")).length},
      {name:"İptal",val:rows.filter(r=>r.TEKLIF_DURUMU==="İptal").length}
    ];
  }
  const donusum=kpi.sayi?Math.round((kpi.kapali||0)/kpi.sayi*100):0;

  return (
    <div>
      <div style={{display:"flex",gap:12,marginBottom:"1.25rem",flexWrap:"wrap"}}>
        <KPICard label="Toplam Teklif (EUR)" value={Math.round(kpi.toplam||0)} prefix="€" icon="📋" color={color} bg={color+"18"}/>
        <KPICard label="Teklif Adedi"        value={kpi.sayi||0}                           icon="📄" color={color} bg={color+"18"}/>
        <KPICard label="Açık Teklifler"      value={kpi.acik||0}                           icon="🔓" color={color} bg={color+"18"}/>
        <KPICard label="Kapalı Teklifler"    value={kpi.kapali||0}                         icon="✅" color={color} bg={color+"18"}/>
        <KPICard label="Dönüşüm"             value={donusum} suffix="%"                   icon="📈" color={color} bg={color+"18"} sub="kapalı/toplam"/>
      </div>

      <FilterBar color={color} values={filters} loading={loading}
        onChange={(k,v)=>setFilters(f=>({...f,[k]:v}))}
        onReset={()=>{setFilters({});load({});}}
        onApply={()=>load(filters)}
        filters={[
          {key:"musteri",       label:"Müşteri/Tedarikçi", type:"text", placeholder:"Ünvan ara..."},
          {key:"stok_search",   label:"Stok Kodu",          type:"text", placeholder:"Stok ara..."},
          {key:"teklif_durumu", label:"Teklif Durumu",      type:"select", options:["acik","kapali","iptal"]},
          {key:"teklif_turu",   label:"Teklif Türü",        type:"select", options:uniq("TEKLIF_TURU")},
          {key:"bolge",         label:"Bölge",              type:"select", options:uniq("GRUBU")},
          {key:"personel",      label:"Personel",           type:"select", options:uniq("ARA_GRUBU")},
          {key:"kategori",      label:"Kategori",           type:"select", options:uniq("ALT_GRUBU")},
          {key:"marka",         label:"Marka",              type:"select", options:uniq("MARKASI")},
          {key:"model",         label:"Model",              type:"select", options:uniq("MODELI")},
          {key:"il",            label:"İl",                 type:"select", options:uniq("ILI")},
        ]}
      />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.25rem"}}>
        <ChartCard title="Açık / Kapalı / İptal">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <Tooltip/>
              <Bar dataKey="val" name="Adet" fill={color} radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Marka Bazlı Teklif (EUR)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={markaChart} layout="vertical" margin={{left:10,right:16}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`€${(v/1000).toFixed(0)}K`}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:"#334155"}} axisLine={false} tickLine={false} width={90}/>
              <Tooltip content={<TTip/>}/>
              <Bar dataKey="val" name="Tutar" fill={color} radius={[0,5,5,0]} maxBarSize={14}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <DataTable color={color} filename={filename} data={rows} columns={[
        {key:"TEKLIF_NO",     label:"Teklif No",   render:v=><span style={{color,fontFamily:"monospace",fontWeight:600,fontSize:11}}>{v}</span>},
        {key:"TARIHI",        label:"Tarih",        render:v=>fmtDate(v)},
        {key:"TICARI_UNVANI", label:"Müşteri"},
        {key:"ILI",           label:"İl"},
        {key:"GRUBU",         label:"Bölge"},
        {key:"ARA_GRUBU",     label:"Personel"},
        {key:"ALT_GRUBU",     label:"Kategori"},
        {key:"STOKKODU",      label:"Stok Kodu",   render:v=><span style={{fontFamily:"monospace",fontSize:11}}>{v}</span>},
        {key:"STOK_ADI",      label:"Ürün"},
        {key:"MARKASI",       label:"Marka"},
        {key:"MODELI",        label:"Model"},
        {key:"MIKTARI",       label:"Miktar"},
        {key:"DVZ_IND_FIYAT", label:"Birim €",     render:v=>fmtEur(+v)},
        {key:"DVZ_IND_TUTAR", label:"Tutar €",     render:v=><b>{fmtEur(+v)}</b>},
        {key:"TEKLIF_DURUMU", label:"Durum",        render:v=><Badge value={v} map={TEK_DURUM}/>},
        {key:"TEKLIF_TURU",   label:"Tür"},
      ]}/>
    </div>
  );
}

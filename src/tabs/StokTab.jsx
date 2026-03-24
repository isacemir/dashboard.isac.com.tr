import { useState, useEffect } from "react";
import { KPICard, FilterBar, DataTable, ChartCard, TTip, Badge,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  groupSum, topN, apiFetch } from "../components.jsx";

const COLOR = "#10b981";

const DURUM_MAP = {
  "STOKTA VAR":                   {bg:"#d1fae5",color:"#065f46"},
  "KRİTİK STOK":                  {bg:"#fef3c7",color:"#92400e"},
  "SIFIR BAKİYE - SATIN ALMA YOK":{bg:"#fee2e2",color:"#991b1b"},
  "SİPARİŞTE":                    {bg:"#dbeafe",color:"#1e40af"},
  "TERMİNLİ":                     {bg:"#e0e7ff",color:"#3730a3"},
};

export default function StokTab() {
  const [rows,setRows]=useState([]);
  const [kpi,setKpi]=useState({});
  const [charts,setCharts]=useState({});
  const [loading,setLoading]=useState(false);
  const [filters,setFilters]=useState({});
  const [view,setView]=useState("tum"); // tum | siparisteStokYok | kritik | negatifTermin

  const uniq=(key)=>[...new Set(rows.map(r=>r[key]).filter(Boolean))].sort();

  async function load(f=filters){
    setLoading(true);
    // 1. Summary
    const s = await apiFetch("/api/stok.php", f, "summary");
    if (s) { setKpi(s.kpi || {}); setCharts(s.charts || {}); }

    // 2. Full
    const d = await apiFetch("/api/stok.php", f);
    if(d){ 
      setRows(d.rows||[]); 
      setKpi(d.kpi||{});
      if (d.rows?.length > 0) setCharts({});
    }
    setLoading(false);
  }

  useEffect(()=>{load();},[]);

  // Görünüm bazlı filtreli rows
  const viewRows = view==="siparisteStokYok"
    ? rows.filter(r=>(+(r.SIPARIS_KALAN_MIKTARI||0))>0 && (+(r.STOK_MIKTARI||0))<=0)
    : view==="kritik"
    ? rows.filter(r=>["KRİTİK STOK","SIFIR BAKİYE - SATIN ALMA YOK"].includes(r.DURUM||""))
    : view==="negatifTermin"
    ? rows.filter(r=>(+(r.TERMINLI_STOK||0))<0)
    : rows;

  // Use pre-calculated charts if rows are not loaded yet
  let durumChart = charts.durum || [];
  let markaChart = charts.marka || [];

  if (rows.length > 0) {
    durumChart=Object.keys(DURUM_MAP).map(d=>({name:d.length>20?d.slice(0,20)+"…":d,val:rows.filter(r=>r.DURUM===d).length}));
    markaChart=topN(groupSum(rows,r=>r.MARKASI,r=>+(r.SIPARIS_KALAN_MIKTARI||0)));
  }

  const viewBtns=[
    {k:"tum",              l:`Tümü (${rows.length})`},
    {k:"siparisteStokYok", l:`Siparişte/Stok Yok (${rows.filter(r=>(+(r.SIPARIS_KALAN_MIKTARI||0))>0&&(+(r.STOK_MIKTARI||0))<=0).length})`},
    {k:"kritik",           l:`Kritik/Sıfır (${rows.filter(r=>["KRİTİK STOK","SIFIR BAKİYE - SATIN ALMA YOK"].includes(r.DURUM||"")).length})`},
    {k:"negatifTermin",    l:`Negatif Terminli (${rows.filter(r=>(+(r.TERMINLI_STOK||0))<0).length})`},
  ];

  return (
    <div>
      <div style={{display:"flex",gap:12,marginBottom:"1.25rem",flexWrap:"wrap"}}>
        <KPICard label="Toplam Ürün"        value={kpi.sayi||0}              icon="📦" color={COLOR} bg="#d1fae5"/>
        <KPICard label="Stokta Var"         value={kpi.stokta||0}            icon="✅" color={COLOR} bg="#d1fae5"/>
        <KPICard label="Kritik / Sıfır"     value={kpi.kritik||0}            icon="⚠️" color="#f59e0b" bg="#fef3c7" sub="acil satınalma"/>
        <KPICard label="Sipariş Var Stok Yok" value={kpi.siparisteVarStokYok||0} icon="🚨" color="#ef4444" bg="#fee2e2" sub="tedarik bekliyor"/>
      </div>

      <FilterBar color={COLOR} values={filters} loading={loading}
        onChange={(k,v)=>setFilters(f=>({...f,[k]:v}))}
        onReset={()=>{setFilters({});load({});}}
        onApply={()=>load(filters)}
        filters={[
          {key:"stok",  label:"Stok Kodu / Adı", type:"text",   placeholder:"Ara..."},
          {key:"durum", label:"Durum",             type:"select", options:Object.keys(DURUM_MAP)},
          {key:"marka", label:"Marka",             type:"select", options:uniq("MARKASI")},
        ]}
      />

      {/* Hızlı görünüm butonları */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:"1.25rem"}}>
        {viewBtns.map(b=>(
          <button key={b.k} onClick={()=>setView(b.k)} style={{
            padding:"5px 13px", borderRadius:20, border:"1px solid",
            borderColor:view===b.k?COLOR:"#e2e8f0",
            background:view===b.k?COLOR:"#fff",
            color:view===b.k?"#fff":"#64748b",
            fontSize:11, fontWeight:500, cursor:"pointer", fontFamily:"inherit",
          }}>{b.l}</button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.25rem"}}>
        <ChartCard title="Durum Dağılımı">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={durumChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={{fontSize:9,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <Tooltip/>
              <Bar dataKey="val" name="Adet" fill={COLOR} radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Marka Bazlı Bekleyen Sipariş">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={markaChart} layout="vertical" margin={{left:10,right:16}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:"#334155"}} axisLine={false} tickLine={false} width={90}/>
              <Tooltip/>
              <Bar dataKey="val" name="Adet" fill={COLOR} radius={[0,5,5,0]} maxBarSize={14}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <DataTable color={COLOR} filename="stok_siparis_durum" data={viewRows} columns={[
        {key:"DURUM",                  label:"Durum",          render:v=><Badge value={v} map={DURUM_MAP}/>},
        {key:"STOKKODU",               label:"Stok Kodu",      render:v=><span style={{fontFamily:"monospace",fontSize:11,color:COLOR}}>{v}</span>},
        {key:"STOK_ADI",               label:"Ürün Adı"},
        {key:"MARKASI",                label:"Marka"},
        {key:"MODELI",                 label:"Model"},
        {key:"STOK_MIKTARI",           label:"Stok"},
        {key:"SIPARIS_KALAN_MIKTARI",  label:"Sipariş Kalan"},
        {key:"TERMIN_MIKTAR",          label:"Termin Mik."},
        {key:"TERMINLI_STOK",          label:"Terminli Stok",  render:v=><span style={{color:(+(v||0))<0?"#ef4444":"#10b981",fontWeight:600}}>{v}</span>},
        {key:"CARI_1",                 label:"Müşteri 1"},
        {key:"CARI_2",                 label:"Müşteri 2"},
        {key:"CARI_3",                 label:"Müşteri 3"},
      ]}/>
    </div>
  );
}

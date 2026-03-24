import { useState, useEffect } from "react";
import { KPICard, FilterBar, DataTable, ChartCard, TTip, Badge,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  groupSum, topN, fmtDate, fmtEur, apiFetch } from "../components.jsx";

const COLOR = "#ef4444";

export default function FaturaTab() {
  const [rows,setRows]=useState([]);
  const [kpi,setKpi]=useState({});
  const [charts,setCharts]=useState({});
  const [loading,setLoading]=useState(false);
  const [filters,setFilters]=useState({});

  const uniq=(key)=>[...new Set(rows.map(r=>r[key]).filter(Boolean))].sort();

  async function load(f=filters){
    setLoading(true);
    // 1. Summary
    const s = await apiFetch("/api/fatura.php", f, "summary");
    if (s) { setKpi(s.kpi || {}); setCharts(s.charts || {}); }

    // 2. Full
    const d = await apiFetch("/api/fatura.php", f);
    if(d){ 
      setRows(d.rows||[]); 
      setKpi(d.kpi||{});
      if (d.rows?.length > 0) setCharts({});
    }
    setLoading(false);
  }

  useEffect(()=>{load();},[]);

  // Use pre-calculated charts
  let ayData = charts.ciro || [];
  let markaChart = charts.marka || [];

  if (rows.length > 0) {
    const ayMap={};
    rows.forEach(r=>{
      const k=`${r.YIL||""}-${String(r.AY||"").padStart(2,"0")}`;
      if(k.length>3) ayMap[k]=(ayMap[k]||0)+(+(r.IKINCI_DVZ_IND_TUTAR||0));
    });
    ayData=Object.entries(ayMap).sort().map(([k,v])=>({ay:k,tutar:Math.round(v)}));
    markaChart=topN(groupSum(rows,r=>r.MARKASI,r=>+(r.IKINCI_DVZ_IND_TUTAR||0)));
  }

  return (
    <div>
      <div style={{display:"flex",gap:12,marginBottom:"1.25rem",flexWrap:"wrap"}}>
        <KPICard label="Toplam Ciro (EUR)" value={Math.round(kpi.toplam||0)} prefix="€" icon="🧾" color={COLOR} bg="#fee2e2"/>
        <KPICard label="Fatura Adedi"      value={kpi.sayi||0}                           icon="📄" color={COLOR} bg="#fee2e2"/>
        <KPICard label="Müşteri Sayısı"    value={new Set(rows.map(r=>r.CARIKODU)).size} icon="👥" color={COLOR} bg="#fee2e2"/>
        <KPICard label="İptal Fatura"      value={rows.filter(r=>r.IPTAL==1||r.IPTAL==="1").length} icon="🚫" color={COLOR} bg="#fee2e2"/>
      </div>
      <FilterBar color={COLOR} values={filters} loading={loading}
        onChange={(k,v)=>setFilters(f=>({...f,[k]:v}))}
        onReset={()=>{setFilters({});load({});}}
        onApply={()=>load(filters)}
        filters={[
          {key:"musteri",    label:"Müşteri",        type:"text",   placeholder:"Ünvan ara..."},
          {key:"stok_search",label:"Stok Kodu",       type:"text",   placeholder:"Stok ara..."},
          {key:"bolge",      label:"Bölge",            type:"select", options:uniq("GRUBU")},
          {key:"personel",   label:"Personel",         type:"select", options:uniq("ARA_GRUBU")},
          {key:"kategori",   label:"Kategori",         type:"select", options:uniq("ALT_GRUBU")},
          {key:"marka",      label:"Marka",            type:"select", options:uniq("MARKASI")},
          {key:"model",      label:"Model",            type:"select", options:uniq("MODELI")},
          {key:"il",         label:"İl",               type:"select", options:uniq("ILI_1")},
          {key:"iptal_gizle",label:"İptalleri Gizle",  type:"select", options:["1"]},
        ]}
      />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.25rem"}}>
        <ChartCard title="Aylık Ciro (EUR)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ayData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="ay" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`€${(v/1000).toFixed(0)}K`}/>
              <Tooltip content={<TTip/>}/>
              <Bar dataKey="tutar" name="Ciro" fill={COLOR} radius={[5,5,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Marka Bazlı Ciro (EUR)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={markaChart} layout="vertical" margin={{left:10,right:16}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false} tickFormatter={v=>`€${(v/1000).toFixed(0)}K`}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:"#334155"}} axisLine={false} tickLine={false} width={90}/>
              <Tooltip content={<TTip/>}/>
              <Bar dataKey="val" name="Ciro" fill={COLOR} radius={[0,5,5,0]} maxBarSize={14}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <DataTable color={COLOR} filename="satis_raporu" data={rows} columns={[
        {key:"FATURA_NO",            label:"Fatura No",    render:v=><span style={{color:COLOR,fontFamily:"monospace",fontWeight:600,fontSize:11}}>{v}</span>},
        {key:"TARIHI",               label:"Tarih",         render:v=>fmtDate(v)},
        {key:"CARIKODU",             label:"Cari Kodu",    render:v=><span style={{fontFamily:"monospace",fontSize:11}}>{v}</span>},
        {key:"TICARI_UNVANI",        label:"Müşteri"},
        {key:"ILI_1",                label:"İl"},
        {key:"ILCESI_1",             label:"İlçe"},
        {key:"GRUBU",                label:"Bölge"},
        {key:"ARA_GRUBU",            label:"Personel"},
        {key:"ALT_GRUBU",            label:"Kategori"},
        {key:"STOKKODU",             label:"Stok Kodu",    render:v=><span style={{fontFamily:"monospace",fontSize:11}}>{v}</span>},
        {key:"STOK_ADI",             label:"Ürün"},
        {key:"MARKASI",              label:"Marka"},
        {key:"MODELI",               label:"Model"},
        {key:"MIKTARI",              label:"Miktar"},
        {key:"DVZ_IND_FIYAT",        label:"Birim €",      render:v=>fmtEur(+v)},
        {key:"IKINCI_DVZ_IND_TUTAR", label:"Tutar €",      render:v=><b>{fmtEur(+v)}</b>},
        {key:"YIL",                  label:"Yıl"},
        {key:"AY",                   label:"Ay"},
        {key:"IPTAL",                label:"İptal",         render:v=>(v==1||v==="1")?<Badge value="İptal" map={{"İptal":{bg:"#fee2e2",color:"#991b1b"}}}/>:"-"},
      ]}/>
    </div>
  );
}

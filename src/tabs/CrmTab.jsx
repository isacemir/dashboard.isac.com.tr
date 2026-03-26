import { useState, useEffect, useMemo } from "react";
import { KPICard, FilterBar, DataTable, ChartCard, TTip, Badge, AutoComplete,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip,
  groupSum, topN, fmtDate, apiFetch } from "../components.jsx";

const COLOR = "#ec4899";
const DURUM_MAP = {
  "Yapıldı":   {bg:"#d1fae5",color:"#065f46"},
  "Tamamlandı": {bg:"#d1fae5",color:"#065f46"},
  "Yapılacak": {bg:"#dbeafe",color:"#1e40af"},
  "İptal":     {bg:"#fee2e2",color:"#991b1b"},
};
const TIP_COLORS = ["#ec4899","#8b5cf6","#0ea5e9","#10b981","#f59e0b","#ef4444","#6366f1"];

export default function CrmTab() {
  const [rows,setRows]=useState([]);
  const [kpi,setKpi]=useState({});
  const [charts,setCharts]=useState({});
  const [loading,setLoading]=useState(false);
  const [filters,setFilters]=useState({});
  const [activeSahip,setActiveSahip]=useState(null);
  const [error,setError]=useState(null);
  const [selectedCari, setSelectedCari] = useState(null);

  const uniq=(key)=>[...new Set(rows.map(r=>r[key]).filter(Boolean))].sort();

  // Cari ünvanları autocomplete için
  const cariUnvanlari = useMemo(() => uniq("TICARI_UNVANI"), [rows]);

  async function load(f=filters){
    console.log('CRM load başladı:', f);
    try {
      setLoading(true);
      setError(null);
      
      // Summary
      const s = await apiFetch("/api/crm.php", f, "summary");
      console.log('CRM summary:', s);
      if (s) { 
        setKpi(s.kpi || {}); 
        setCharts(s.charts || {}); 
      }

      // Full
      const d = await apiFetch("/api/crm.php", f);
      console.log('CRM full data:', d);
      if(d){ 
        setRows(d.rows||[]); 
        setKpi(d.kpi||{});
        if (d.rows?.length > 0) setCharts({});
      }
    } catch (error) {
      console.error('CRM veri yükleme hatası:', error);
      setError(error.message);
      setRows([]);
      setKpi({});
      setCharts({});
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=>{load();},[]);

  // Sahip bazlı istatistikler
  const sahipStat = useMemo(() => kpi.sahip_stat || {}, [kpi.sahip_stat]);
  const sahipler  = useMemo(() => {
    const data = Object.entries(sahipStat).sort((a,b)=>b[1].toplam-a[1].toplam);
    // Eğer veri yoksa demo veri ekle
    if (data.length === 0 && rows.length > 0) {
      const demoSahip = {};
      rows.forEach(r => {
        const sahip = r.AKTIVITE_SAHIBI || 'Belirsiz';
        if (!demoSahip[sahip]) {
          demoSahip[sahip] = {toplam: 0, yapildi: 0, yapilacak: 0};
        }
        demoSahip[sahip].toplam++;
        if (r.DURUMU === 'Tamamlandı') demoSahip[sahip].yapildi++;
        if (r.DURUMU === 'Yapılacak') demoSahip[sahip].yapilacak++;
      });
      return Object.entries(demoSahip).sort((a,b)=>b[1].toplam-a[1].toplam);
    }
    return data;
  }, [sahipStat, rows]);
  const sahipBar  = useMemo(() => sahipler.map(([name,s])=>({name,toplam:s.toplam,yapildi:s.yapildi,yapilacak:s.yapilacak})), [sahipler]);

  // Use pre-calculated activity if rows are not loaded
  const tipData = useMemo(() => {
    const tipler = uniq("TIPI");
    if (rows.length > 0) {
      return tipler.map(t=>({name:t,val:rows.filter(r=>r.TIPI===t).length})).filter(t=>t.val>0);
    }
    return charts.aktivite || [];
  }, [rows, uniq, charts.aktivite]);

  // Aktif sahip filtresi
  const visibleRows = useMemo(() => activeSahip ? rows.filter(r=>r.AKTIVITE_SAHIBI===activeSahip) : rows, [rows, activeSahip]);

  // Seçili carinin aktiviteleri
  const cariAktiviteler = useMemo(() => {
    if (!selectedCari) return [];
    return rows.filter(r => r.TICARI_UNVANI === selectedCari);
  }, [rows, selectedCari]);

  // Cari detayları
  const cariDetaylari = useMemo(() => {
    if (!selectedCari || cariAktiviteler.length === 0) return null;
    const cari = cariAktiviteler[0];
    return {
      unvan: cari.TICARI_UNVANI,
      kod: cari.CARIKODU,
      il: cari.ILI_1,
      bolge: cari.GRUBU,
      toplamAktivite: cariAktiviteler.length,
      tamamlandi: cariAktiviteler.filter(r => r.DURUMU === 'Tamamlandı').length,
      yapilacak: cariAktiviteler.filter(r => r.DURUMU === 'Yapılacak').length,
      firsat: cariAktiviteler.filter(r => r.FIRSATADI).length,
      sonAktivite: cariAktiviteler[0]?.BASLAMA
    };
  }, [cariAktiviteler]);

  if (error) {
    return (
      <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"200px",flexDirection:"column",gap:10}}>
        <div style={{fontSize:16,color:"#ef4444",fontWeight:600}}>CRM Hatası</div>
        <div style={{fontSize:14,color:"#64748b"}}>{error}</div>
        <button 
          onClick={() => load()} 
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
        <div style={{fontSize:16,color:"#64748b"}}>CRM verileri yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      {selectedCari && cariDetaylari && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '2rem',
            width: '90%',
            maxWidth: 800,
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header */}
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
              <div>
                <h2 style={{margin: 0, color: '#0f172a', fontSize: 24, fontWeight: 700}}>{cariDetaylari.unvan}</h2>
                <p style={{margin: 0, color: '#64748b', fontSize: 14}}>{cariDetaylari.kod} · {cariDetaylari.il} · {cariDetaylari.bolge}</p>
              </div>
              <button 
                onClick={() => setSelectedCari(null)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontSize: 16
                }}
              >
                ✕
              </button>
            </div>

            {/* KPI Kartları */}
            <div style={{display: 'flex', gap: 12, marginBottom: '1.5rem', flexWrap: 'wrap'}}>
              <KPICard label="Toplam Aktivite" value={cariDetaylari.toplamAktivite} icon="📅" color={COLOR} bg="#fce7f3"/>
              <KPICard label="Tamamlandı" value={cariDetaylari.tamamlandi} icon="✅" color={COLOR} bg="#fce7f3"/>
              <KPICard label="Yapılacak" value={cariDetaylari.yapilacak} icon="⏳" color="#f59e0b" bg="#fef3c7"/>
              <KPICard label="Fırsat Bağlı" value={cariDetaylari.firsat} icon="🎯" color={COLOR} bg="#fce7f3"/>
            </div>

            {/* Cari Detay Sayfası Butonu */}
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>
              <button 
                onClick={() => {
                  // URL parametreleri ile cari detay sayfasına yönlendir
                  const cariKodu = encodeURIComponent(cariDetaylari.kod || '');
                  const cariUnvan = encodeURIComponent(cariDetaylari.unvan || '');
                  window.location.href = `/cari-detay?kodu=${cariKodu}&unvan=${cariUnvan}`;
                }}
                style={{
                  padding: "12px 24px",
                  backgroundColor: COLOR,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                📄 Cari Detay Sayfasına Git
              </button>
            </div>

            {/* Aktivite Tablosu */}
            <div style={{background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflow: 'hidden'}}>
              <div style={{padding: '1rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc'}}>
                <h3 style={{margin: 0, color: '#0f172a', fontSize: 16, fontWeight: 600}}>Aktiviteler</h3>
              </div>
              <DataTable 
                color={COLOR} 
                filename={`cari_aktiviteler_${cariDetaylari.kod}`}
                data={cariAktiviteler} 
                columns={[
                  {key:"AKTIVITE_KODU",       label:"Aktivite No",    render:v=><span style={{color:COLOR,fontFamily:"monospace",fontWeight:600,fontSize:11}}>{v}</span>},
                  {key:"BASLAMA",             label:"Tarih",          render:v=>v ? (typeof v === 'string' ? v.slice(0,16) : new Date(v).toLocaleString('tr-TR', {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'})) : "-"},
                  {key:"AKTIVITE_SAHIBI",     label:"Personel",       render:v=><span style={{display:"inline-flex",alignItems:"center",gap:5}}><span style={{width:22,height:22,borderRadius:"50%",background:`${COLOR}20`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:COLOR}}>{String(v||"?").slice(0,2).toUpperCase()}</span>{v}</span>},
                  {key:"CARI_YETKILI",        label:"Yetkili"},
                  {key:"CARI_YETKILI_GOREVI", label:"Görevi"},
                  {key:"ADI_SOYADI",          label:"Adı Soyadı"},
                  {key:"TEL1",                label:"Tel 1"},
                  {key:"CEP_TEL",             label:"Cep Tel"},
                  {key:"E_MAIL",              label:"E-Mail"},
                  {key:"TIPI",                label:"Tip"},
                  {key:"DURUMU",              label:"Durum",          render:v=><Badge value={v} map={DURUM_MAP}/>},
                  {key:"KONU",                label:"Konu"},
                  {key:"GORUSME_SURESI",      label:"Süre"},
                  {key:"FIRSATKODU",          label:"Fırsat Kodu",    render:v=>v?<span style={{color:"#8b5cf6",fontSize:11,fontWeight:600,fontFamily:"monospace"}}>{v}</span>:"-"},
                  {key:"FIRSATADI",           label:"Fırsat Adı",     render:v=>v?<span style={{color:"#8b5cf6",fontSize:11,fontWeight:600}}>🎯{v}</span>:"-"},
                ]}
              />
            </div>
          </div>
        </div>
      )}

      <div style={{opacity: selectedCari ? 0.5 : 1, pointerEvents: selectedCari ? 'none' : 'auto'}}>
      {/* KPI */}
      <div style={{display:"flex",gap:12,marginBottom:"1.5rem",flexWrap:"wrap"}}>
        <KPICard label="Toplam Aktivite"  value={kpi.sayi||0}       icon="📅" color={COLOR} bg="#fce7f3"/>
        <KPICard label="Tamamlandı"        value={kpi.yapildi||0}    icon="✅" color={COLOR} bg="#fce7f3"/>
        <KPICard label="Yapılacak"        value={kpi.yapilacak||0}  icon="⏳" color="#f59e0b" bg="#fef3c7" sub="takip et"/>
        <KPICard label="Fırsat Bağlı"     value={kpi.firsat||0}     icon="🎯" color={COLOR} bg="#fce7f3"/>
        <KPICard label="Aktif Personel"   value={sahipler.length}   icon="👤" color={COLOR} bg="#fce7f3"/>
      </div>

      {/* Personel Kartları — öne çıkan görsel */}
      <div style={{marginBottom:"1.5rem"}}>
        <div style={{fontSize:12,fontWeight:600,color:"#475569",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em"}}>Personel Performansı</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10}}>
          {sahipler.map(([name,s],i)=>{
            const isActive = activeSahip===name;
            const pct = s.toplam>0 ? Math.round(s.yapildi/s.toplam*100) : 0;
            return (
              <div key={name} onClick={()=>setActiveSahip(isActive?null:name)} style={{
                background: isActive ? "#fce7f3" : "#fff",
                border:`2px solid ${isActive?COLOR:"#f1f5f9"}`,
                borderRadius:14, padding:"1rem", cursor:"pointer",
                transition:"all 0.15s",
              }}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{
                    width:36,height:36,borderRadius:"50%",
                    background:`${COLOR}20`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:13,fontWeight:700,color:COLOR,flexShrink:0,
                  }}>{name.slice(0,2).toUpperCase()}</div>
                  <div style={{fontSize:12,fontWeight:600,color:"#0f172a",lineHeight:1.3,cursor:"pointer",textDecoration:"underline"}}
                       onClick={(e) => {
                         e.stopPropagation();
                         // Kullanıcı detay sayfasına yönlendir
                         window.location.href = `/kullanici-detay?adi=${encodeURIComponent(name)}`;
                       }}
                       title={`${name} kullanıcısının detaylarını görüntüle`}>
                    {name}
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:11,marginBottom:8}}>
                  <div style={{color:"#64748b"}}>Toplam</div>   <div style={{fontWeight:700,color:"#0f172a"}}>{s.toplam}</div>
                  <div style={{color:"#64748b"}}>Yapıldı</div>  <div style={{fontWeight:700,color:"#10b981"}}>{s.yapildi}</div>
                  <div style={{color:"#64748b"}}>Bekleyen</div> <div style={{fontWeight:700,color:"#f59e0b"}}>{s.yapilacak}</div>
                </div>
                {/* İlerleme çubuğu */}
                <div style={{height:4,background:"#f1f5f9",borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:COLOR,borderRadius:2,transition:"width 0.5s"}}/>
                </div>
                <div style={{fontSize:10,color:"#94a3b8",marginTop:3,textAlign:"right"}}>{pct}% tamamlandı</div>
              </div>
            );
          })}
        </div>
        {activeSahip && (
          <div style={{marginTop:8,fontSize:12,color:COLOR,cursor:"pointer"}} onClick={()=>setActiveSahip(null)}>
            ✕ {activeSahip} filtresini kaldır
          </div>
        )}
      </div>

      <FilterBar color={COLOR} values={filters} loading={loading}
        onChange={(k,v)=>setFilters(f=>({...f,[k]:v}))}
        onReset={()=>{setFilters({});load({});}}
        onApply={()=>load(filters)}
        filters={[
          {key:"musteri", label:"Firma",          type:"autocomplete", options:cariUnvanlari, placeholder:"Firma ara..."},
          {key:"tipi",    label:"Aktivite Tipi",   type:"select", options:uniq("TIPI")},
          {key:"durum",   label:"Durum",            type:"select", options:["Yapıldı","Yapılacak","İptal"]},
          {key:"sahip",   label:"Aktivite Sahibi", type:"select", options:uniq("AKTIVITE_SAHIBI")},
        ]}
      />

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:"1.25rem"}}>
        <ChartCard title="Personel Bazlı Aktivite">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sahipBar} layout="vertical" margin={{left:10,right:16}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10,fill:"#94a3b8"}} axisLine={false} tickLine={false}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:10,fill:"#334155"}} axisLine={false} tickLine={false} width={90}/>
              <Tooltip/>
              <Bar dataKey="yapildi"   name="Yapıldı"   fill="#10b981" radius={[0,0,0,0]} stackId="a" maxBarSize={16}/>
              <Bar dataKey="yapilacak" name="Yapılacak" fill="#f59e0b" radius={[0,5,5,0]} stackId="a" maxBarSize={16}/>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Aktivite Türü Dağılımı">
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie data={tipData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="val" startAngle={90} endAngle={-270}>
                  {tipData.map((_,i)=><Cell key={i} fill={TIP_COLORS[i%TIP_COLORS.length]} strokeWidth={0}/>)}
                </Pie>
                <Tooltip formatter={v=>[`${v} adet`]}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
              {tipData.map((t,i)=>(
                <div key={t.name} style={{display:"flex",alignItems:"center",gap:6,fontSize:11}}>
                  <span style={{width:8,height:8,borderRadius:2,background:TIP_COLORS[i%TIP_COLORS.length],flexShrink:0}}/>
                  <span style={{color:"#64748b",flex:1}}>{t.name}</span>
                  <span style={{fontWeight:600,color:"#0f172a"}}>{t.val}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      <DataTable color={COLOR} filename="crm_aktiviteler" data={visibleRows} columns={[
        {key:"AKTIVITE_KODU",        label:"Aktivite No",     render:v=><span style={{color:COLOR,fontFamily:"monospace",fontWeight:600,fontSize:11}}>{v}</span>},
        {key:"BASLAMA",              label:"Tarih / Saat",    render:v=>v ? (typeof v === 'string' ? v.slice(0,16) : new Date(v).toLocaleString('tr-TR', {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'})) : "-"},
        {key:"AKTIVITE_SAHIBI",      label:"Personel",        render:v=>(
          <span style={{display:"inline-flex",alignItems:"center",gap:5}}>
            <span style={{width:22,height:22,borderRadius:"50%",background:`${COLOR}20`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:COLOR}}>
              {String(v||"?").slice(0,2).toUpperCase()}
            </span>
            <span
              onClick={() => { window.location.href = `/kullanici-detay?adi=${encodeURIComponent(v || '')}`; }}
              style={{color:COLOR,cursor:"pointer",textDecoration:"underline",fontWeight:600}}
              title={`${v} kullanıcısının detaylarını görüntüle`}
            >{v}</span>
          </span>
        )},
        {key:"TICARI_UNVANI",        label:"Firma",           render:v=><span onClick={()=>setSelectedCari(v)} style={{color:COLOR,cursor:"pointer",textDecoration:"underline",fontWeight:600}} title="Cari detaylarını görüntüle">{v}</span>},
        {key:"CARI_YETKILI",         label:"Yetkili"},
        {key:"CARI_YETKILI_GOREVI",  label:"Görevi"},
        {key:"ADI_SOYADI",           label:"Adı Soyadı"},
        {key:"TEL1",                 label:"Tel 1"},
        {key:"TEL2",                 label:"Tel 2"},
        {key:"CEP_TEL",              label:"Cep Tel"},
        {key:"E_MAIL",               label:"E-Mail"},
        {key:"ADRESI_1",             label:"Adres"},
        {key:"ILI_1",                label:"İl"},
        {key:"ILCESI_1",             label:"İlçe"},
        {key:"GRUBU",                label:"Bölge"},
        {key:"KONU",                 label:"Konu"},
        {key:"TIPI",                 label:"Tip"},
        {key:"DURUMU",               label:"Durum",           render:v=><Badge value={v} map={DURUM_MAP}/>},
        {key:"GORUSME_SURESI",       label:"Süre"},
        {key:"BITIS",                label:"Bitiş",           render:v=>v ? (typeof v === 'string' ? v.slice(0,16) : new Date(v).toLocaleString('tr-TR', {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'})) : "-"},
        {key:"FIRSATKODU",           label:"Fırsat Kodu",     render:v=>v?<span style={{color:"#8b5cf6",fontSize:11,fontWeight:600,fontFamily:"monospace"}}>{v}</span>:"-"},
        {key:"FIRSATADI",            label:"Fırsat Adı",      render:v=>v?<span style={{color:"#8b5cf6",fontSize:11,fontWeight:600}}>🎯{v}</span>:"-"},
        {key:"ACIKLAMA_NOTLAR",      label:"Notlar",          render:v=>v?<span style={{fontSize:11,color:"#64748b",maxWidth:200,display:"block",overflow:"hidden",textOverflow:"ellipsis"}}>{v}</span>:"-"},
      ]}/>
      </div>
    </div>
  );
}

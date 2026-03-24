import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import * as XLSX from "xlsx";

export { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip };

// ── Hızlı Tarih Filtresi ──────────────────────────────────
export function DateFilter({ values, onChange, color }) {
  const btns = [
    { k:"bugun",    l:"Bugün"    },
    { k:"dun",      l:"Dün"      },
    { k:"bu_hafta", l:"Bu Hafta" },
    { k:"bu_ay",    l:"Bu Ay"    },
    { k:"bu_yil",   l:"Bu Yıl"   },
    { k:"ozel",     l:"Özel"     },
  ];
  const active = values.quick_date || "";
  return (
    <div style={{ display:"flex", flexWrap:"wrap", gap:6, alignItems:"center", marginBottom:10 }}>
      {btns.map(b => (
        <button key={b.k} onClick={() => onChange("quick_date", b.k === active ? "" : b.k)} style={{
          padding:"5px 13px", borderRadius:20, border:"1px solid",
          borderColor: active===b.k ? color : "#e2e8f0",
          background: active===b.k ? color : "#fff",
          color: active===b.k ? "#fff" : "#64748b",
          fontSize:12, fontWeight:500, cursor:"pointer", fontFamily:"inherit",
          transition:"all 0.12s",
        }}>{b.l}</button>
      ))}
      {(active === "ozel" || (!active && (values.tarih_bas || values.tarih_bit))) && (
        <div style={{ display:"flex", gap:6, alignItems:"center" }}>
          <input type="date" value={values.tarih_bas||""} onChange={e=>onChange("tarih_bas",e.target.value)}
            style={{ padding:"5px 8px", borderRadius:8, border:"1px solid #e2e8f0", fontSize:12, fontFamily:"inherit", outline:"none" }}/>
          <span style={{ color:"#94a3b8", fontSize:12 }}>—</span>
          <input type="date" value={values.tarih_bit||""} onChange={e=>onChange("tarih_bit",e.target.value)}
            style={{ padding:"5px 8px", borderRadius:8, border:"1px solid #e2e8f0", fontSize:12, fontFamily:"inherit", outline:"none" }}/>
        </div>
      )}
    </div>
  );
}

// ── KPI CARD ──────────────────────────────────────────────
export function KPICard({ label, value, sub, icon, color, bg, prefix="", suffix="" }) {
  const display = typeof value==="number" ? value.toLocaleString("tr-TR") : (value??"-");
  return (
    <div style={{ background:"#fff", borderRadius:14, padding:"1rem 1.25rem", border:`1px solid ${color}22`, flex:1, minWidth:150 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div style={{ fontSize:11, color:"#64748b", fontWeight:500, marginBottom:8, lineHeight:1.3 }}>{label}</div>
        <span style={{ fontSize:17, width:34, height:34, borderRadius:9, background:bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>{icon}</span>
      </div>
      <div style={{ fontSize:22, fontWeight:700, color:"#0f172a", letterSpacing:"-0.5px" }}>{prefix}{display}{suffix}</div>
      {sub && <div style={{ fontSize:11, marginTop:4, color:sub.startsWith("+")?`#10b981`:sub.startsWith("-")?`#ef4444`:`#94a3b8` }}>{sub}</div>}
    </div>
  );
}

// ── FILTER BAR ────────────────────────────────────────────
export function FilterBar({ filters, values, onChange, onReset, color, onApply, loading }) {
  return (
    <div style={{ background:"#fff", borderRadius:12, padding:"0.9rem 1.25rem", border:"1px solid #e2e8f0", marginBottom:"1.25rem" }}>
      <DateFilter values={values} onChange={onChange} color={color}/>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, alignItems:"flex-end" }}>
        {filters.map(f => (
          <div key={f.key} style={{ display:"flex", flexDirection:"column", gap:3 }}>
            <label style={{ fontSize:10, color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em" }}>{f.label}</label>
            {f.type==="select" ? (
              <select value={values[f.key]||""} onChange={e=>onChange(f.key,e.target.value)}
                style={{ padding:"6px 10px", borderRadius:8, border:"1px solid #e2e8f0", fontSize:12, color:"#334155", background:"#f8fafc", minWidth:120, fontFamily:"inherit", outline:"none" }}>
                <option value="">Tümü</option>
                {f.options?.map(o=><option key={o} value={o}>{o}</option>)}
              </select>
            ) : (
              <input type={f.type||"text"} placeholder={f.placeholder||""} value={values[f.key]||""}
                onChange={e=>onChange(f.key,e.target.value)}
                style={{ padding:"6px 10px", borderRadius:8, border:"1px solid #e2e8f0", fontSize:12, color:"#334155", background:"#f8fafc", minWidth:140, fontFamily:"inherit", outline:"none" }}/>
            )}
          </div>
        ))}
        <div style={{ display:"flex", gap:6, alignSelf:"flex-end" }}>
          <button onClick={onApply} disabled={loading} style={{ padding:"6px 18px", borderRadius:8, border:"none", background:color, color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>
            {loading?"⏳":"🔍"} Filtrele
          </button>
          <button onClick={onReset} style={{ padding:"6px 12px", borderRadius:8, border:"1px solid #e2e8f0", background:"#f8fafc", fontSize:12, color:"#64748b", cursor:"pointer", fontFamily:"inherit" }}>↺</button>
        </div>
      </div>
    </div>
  );
}

// ── SUB-TAB BAR ───────────────────────────────────────────
export function SubTabBar({ tabs, active, onChange, color }) {
  return (
    <div style={{ display:"flex", gap:4, marginBottom:"1.25rem" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={()=>onChange(t.id)} style={{
          padding:"7px 18px", borderRadius:8, border:`1px solid ${active===t.id?color:"#e2e8f0"}`,
          background:active===t.id?`${color}12`:"#fff",
          color:active===t.id?color:"#64748b",
          fontSize:13, fontWeight:active===t.id?600:400,
          cursor:"pointer", fontFamily:"inherit", transition:"all 0.15s",
        }}>{t.label}</button>
      ))}
    </div>
  );
}

// ── DATA TABLE + EXCEL EXPORT ─────────────────────────────
export function DataTable({ columns, data, color, filename="rapor" }) {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({ key:null, dir:"asc" });
  const PER = 25;

  const sorted = sort.key ? [...data].sort((a,b) => {
    const [av,bv]=[a[sort.key],b[sort.key]];
    if (av===bv) return 0;
    return (av>bv?1:-1)*(sort.dir==="asc"?1:-1);
  }) : data;

  const pages = Math.ceil(sorted.length/PER);
  const rows  = sorted.slice((page-1)*PER, page*PER);

  function exportExcel() {
    const ws=XLSX.utils.aoa_to_sheet([columns.map(c=>c.label),...data.map(row=>columns.map(c=>row[c.key]??""))]);
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Rapor");
    XLSX.writeFile(wb,`${filename}_${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  return (
    <div style={{ background:"#fff", borderRadius:14, border:"1px solid #e2e8f0", overflow:"hidden" }}>
      <div style={{ padding:"0.9rem 1.25rem", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:13, fontWeight:600, color:"#334155" }}>
          Kayıtlar <span style={{ marginLeft:6, background:`${color}18`, color, fontSize:11, padding:"2px 9px", borderRadius:20, fontWeight:600 }}>{data.length}</span>
        </div>
        <button onClick={exportExcel} style={{ display:"flex", alignItems:"center", gap:5, padding:"6px 14px", borderRadius:8, border:`1px solid ${color}44`, background:`${color}0e`, color, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:"inherit" }}>⬇ Excel İndir</button>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {columns.map(c=>(
                <th key={c.key} onClick={()=>{ setSort(s=>({key:c.key,dir:s.key===c.key&&s.dir==="asc"?"desc":"asc"})); setPage(1); }}
                  style={{ padding:"9px 12px", textAlign:"left", fontWeight:600, color:"#475569", fontSize:10, textTransform:"uppercase", letterSpacing:"0.06em", cursor:"pointer", whiteSpace:"nowrap", borderBottom:"1px solid #e2e8f0" }}>
                  {c.label}{sort.key===c.key&&<span style={{marginLeft:3,color}}>{sort.dir==="asc"?"↑":"↓"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row,i)=>(
              <tr key={i} style={{ borderBottom:"1px solid #f1f5f9" }}
                onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                {columns.map(c=>(
                  <td key={c.key} style={{ padding:"9px 12px", color:"#334155", whiteSpace:"nowrap", maxWidth:200, overflow:"hidden", textOverflow:"ellipsis" }}>
                    {c.render?c.render(row[c.key],row):(row[c.key]??"-")}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length===0&&<tr><td colSpan={columns.length} style={{ padding:"3rem", textAlign:"center", color:"#94a3b8" }}>Kayıt bulunamadı</td></tr>}
          </tbody>
        </table>
      </div>
      {pages>1&&(
        <div style={{ padding:"9px 1.25rem", borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:11, color:"#94a3b8" }}>Sayfa {page}/{pages} · {data.length} kayıt</span>
          <div style={{ display:"flex", gap:3 }}>
            {[...Array(Math.min(pages,8))].map((_,i)=>{const p=i+1;return(
              <button key={p} onClick={()=>setPage(p)} style={{ width:28,height:28,borderRadius:7,border:"1px solid",borderColor:page===p?color:"#e2e8f0",background:page===p?color:"#fff",color:page===p?"#fff":"#64748b",fontSize:11,cursor:"pointer",fontFamily:"inherit" }}>{p}</button>
            );})}
          </div>
        </div>
      )}
    </div>
  );
}

// ── CHART CARD ────────────────────────────────────────────
export function ChartCard({ title, children, style={} }) {
  return (
    <div style={{ background:"#fff", borderRadius:14, padding:"1.1rem 1.25rem", border:"1px solid #e2e8f0", ...style }}>
      <div style={{ fontSize:12, fontWeight:600, color:"#475569", marginBottom:"0.9rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>{title}</div>
      {children}
    </div>
  );
}

// ── TOOLTIP ───────────────────────────────────────────────
export function TTip({ active, payload, label, prefix="€", suffix="" }) {
  if (!active||!payload?.length) return null;
  return (
    <div style={{ background:"#fff", border:"1px solid #e2e8f0", borderRadius:9, padding:"9px 13px", fontSize:12, boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }}>
      <div style={{ color:"#94a3b8", marginBottom:5, fontWeight:500 }}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:6 }}>
          <span style={{ width:7,height:7,borderRadius:2,background:p.color,display:"inline-block" }}/>
          <span style={{ color:"#64748b" }}>{p.name}:</span>
          <span style={{ fontWeight:600,color:"#0f172a" }}>{prefix}{typeof p.value==="number"?p.value.toLocaleString("tr-TR"):p.value}{suffix}</span>
        </div>
      ))}
    </div>
  );
}

// ── BADGE ─────────────────────────────────────────────────
export function Badge({ value, map }) {
  if (!value) return <span style={{ color:"#94a3b8" }}>-</span>;
  const s=map?.[value]||{bg:"#f1f5f9",color:"#64748b"};
  return <span style={{ padding:"2px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:s.bg,color:s.color,whiteSpace:"nowrap" }}>{value}</span>;
}

// ── HELPERS ───────────────────────────────────────────────
export function fmtDate(v){ if(!v)return"-"; return String(v).slice(0,10); }
export function fmtEur(v) { if(v==null||v==="")return"-"; const n=parseFloat(v); if(isNaN(n))return"-"; return "€"+n.toLocaleString("tr-TR",{minimumFractionDigits:2,maximumFractionDigits:2}); }
export function groupSum(rows,keyFn,valFn){ const m={}; rows.forEach(r=>{const k=keyFn(r);if(!k)return;m[k]=(m[k]||0)+(valFn(r)||0);}); return Object.entries(m).sort((a,b)=>b[1]-a[1]).map(([name,val])=>({name,val})); }
export function topN(arr,n=7){ return arr.slice(0,n); }

// Ortak API fetch hook helper
export async function apiFetch(url, filters, type = "all") {
  const p=new URLSearchParams();
  Object.entries(filters).forEach(([k,v])=>{ if(v) p.set(k,v); });
  
  // Local JSON Check (Excel Data)
  const excelMapping = {
    "/api/satis_siparis.php": "siparis", // siparis-raporu.xlsx (Sales Orders)
    "/api/teklif.php": "teklif",
    "/api/satinalma_teklif.php": "satinalma_teklif",
    "/api/satinalma_fatura.php": "satinalma_fatura",
    "/api/satinalma_siparis.php": "siparis",
    "/api/fatura.php": "satis", // satis-raporu.xlsx (Invoices)
    "/api/stok.php": "stok",
    "/api/crm.php": "crm",
    "siparis_raporu": "siparis"
  };

  const baseName = excelMapping[url];
  if (baseName) {
    try {
      // 1. Fetch Summary (KPIs and pre-calculated charts)
      const s = await fetch(`/data/${baseName}_summary.json`);
      const summary = await s.json();
      
      if (type === "summary") {
        return { kpi: summary.kpi, charts: summary.charts, isPartial: true };
      }

      // 2. Fetch Rows (The heavy data)
      const r = await fetch(`/data/${baseName}_rows.json`);
      const d = await r.json();
      let rows = d.rows || [];
      
      // Client-side filtering (Apply even when loading from local JSON)
      if (filters.musteri) {
        const m = filters.musteri.toLowerCase();
        rows = rows.filter(r => (r.TICARI_UNVANI||"").toLowerCase().includes(m));
      }
      if (filters.stok_search) {
        const s = filters.stok_search.toLowerCase();
        rows = rows.filter(r => (r.STOKKODU||"").toLowerCase().includes(s) || (r.STOK_ADI||"").toLowerCase().includes(s));
      }
      if (filters.bolge) rows = rows.filter(r => r.GRUBU === filters.bolge);
      if (filters.personel) rows = rows.filter(r => r.ARA_GRUBU === filters.personel);
      if (filters.kategori) rows = rows.filter(r => r.ALT_GRUBU === filters.kategori);
      if (filters.marka) rows = rows.filter(r => r.MARKASI === filters.marka);
      if (filters.model) rows = rows.filter(r => r.MODELI === filters.model);
      if (filters.il) rows = rows.filter(r => r.ILI === filters.il);

      // Recalculate KPIs based on filtered rows if any filter is active
      const hasFilter = Object.keys(filters).length > 0;
      let recKpi = summary.kpi;
      
      if (hasFilter) {
        recKpi = { sayi: rows.length };
        if (baseName === "satis") {
          recKpi.toplam = rows.reduce((s, r) => s + (parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0), 0);
          recKpi.iptal = rows.filter(r => r.IPTAL == 1 || r.IPTAL == "1").reduce((s, r) => s + (parseFloat(r.IKINCI_DVZ_IND_TUTAR) || 0), 0);
          recKpi.teslim = recKpi.toplam - recKpi.iptal;
          recKpi.kalan = 0;
        } else if (baseName === "siparis") {
          recKpi.teslim = rows.reduce((s, r) => s + (parseFloat(r.TESLIM_EUR_TUTAR) || 0), 0);
          recKpi.kalan = rows.reduce((s, r) => s + (parseFloat(r.KALAN_EUR_TUTAR) || 0), 0);
          recKpi.toplam = rows.reduce((s, r) => s + (parseFloat(r.DVZ_IND_TUTAR) || 0), 0);
          recKpi.iptal = 0;
        } else if (baseName === "stok") {
          recKpi.stokta = rows.filter(r => (parseFloat(r.STOK_MIKTARI) || 0) > 0).length;
          recKpi.kritik = rows.filter(r => ["KRİTİK STOK", "SIFIR BAKİYE - SATIN ALMA YOK"].includes(r.DURUM || "")).length;
        } else if (baseName.includes("teklif")) {
          recKpi.toplam = rows.reduce((s, r) => s + (parseFloat(r.DVZ_IND_TUTAR) || 0), 0);
          recKpi.acik = rows.filter(r => r.TEKLIF_DURUMU.includes("Açık") || r.TEKLIF_DURUMU.includes("Teklifte")).length;
          recKpi.kapali = rows.filter(r => r.TEKLIF_DURUMU.includes("Onay") || r.TEKLIF_DURUMU.includes("Aktarıldı")).length;
        }
      }

      return { rows: rows.slice(0, 500), kpi: recKpi, charts: summary.charts, isPartial: false };
    } catch (e) {
      console.warn("Local fetch failed, falling back to API", e);
    }
  }

  const r=await fetch(`${url}?${p}`,{credentials:"include"});
  if(r.status===401) { window.location.reload(); return null; }
  return r.json();
}

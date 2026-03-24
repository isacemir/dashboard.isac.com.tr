import { useState, useEffect } from "react";
import Login             from "./Login.jsx";
import OverviewTab       from "./tabs/OverviewTab.jsx";
import SatisTab          from "./tabs/SatisTab.jsx";
import SatinAlmaTab      from "./tabs/SatinAlmaTab.jsx";
import TeklifTab         from "./tabs/TeklifTab.jsx";
import StokTab           from "./tabs/StokTab.jsx";
import FaturaTab         from "./tabs/FaturaTab.jsx";
import SiparisTab        from "./tabs/SiparisTab.jsx";
import CrmTab            from "./tabs/CrmTab.jsx";
import ExcelUploadPanel  from "./components/ExcelUploadPanel.jsx";

const TABS=[
  {id:"genel",     label:"Genel Bakış",       icon:"🏠", color:"#0f172a", component:OverviewTab},
  {id:"satis",     label:"Satış Siparişleri", icon:"📦", color:"#0ea5e9", component:SatisTab},
  {id:"satinalma", label:"Satınalma",          icon:"🛒", color:"#8b5cf6", component:SatinAlmaTab},
  {id:"teklif",    label:"Teklifler",          icon:"📋", color:"#f59e0b", component:TeklifTab},
  {id:"stok",      label:"Stok & Sipariş",     icon:"📊", color:"#10b981", component:StokTab},
  {id:"fatura",    label:"Satış Raporu",       icon:"🧾", color:"#ef4444", component:FaturaTab},
  {id:"siparis",   label:"Sipariş Raporu",     icon:"📈", color:"#6366f1", component:SiparisTab},
  {id:"crm",       label:"CRM",               icon:"👥", color:"#ec4899", component:CrmTab},
];

const ADMIN_TAB={id:"upload", label:"Veri Güncelle", icon:"⬆️", color:"#059669", component:ExcelUploadPanel};

export default function Dashboard() {
  const [user,setUser]=useState(null);
  const [active,setActive]=useState("genel");
  const [checking,setChecking]=useState(true);

  useEffect(()=>{
    fetch("/api/login.php",{credentials:"include"})
      .then(r=>r.json()).then(d=>{if(d.ok)setUser(d.user);}).finally(()=>setChecking(false));
  },[]);

  async function logout(){ await fetch("/api/logout.php",{credentials:"include"}); setUser(null); }

  if(checking) return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <div style={{color:"#94a3b8",fontSize:14}}>Yükleniyor...</div>
    </div>
  );
  if(!user) return <Login onLogin={setUser}/>;

  const AT=TABS.find(t=>t.id===active);

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <header style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"0 2rem",display:"flex",alignItems:"center",justifyContent:"space-between",height:54,position:"sticky",top:0,zIndex:100,boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:"#0ea5e9",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:"#fff",fontWeight:700,fontSize:12}}>IS</span>
          </div>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#0f172a",lineHeight:1.2}}>ISAC Sense Digital</div>
            <div style={{fontSize:10,color:"#94a3b8",letterSpacing:"0.05em"}}>YÖNETİM PANELİ</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{fontSize:12,color:"#64748b",display:"flex",alignItems:"center",gap:5}}>
            <span style={{width:7,height:7,borderRadius:"50%",background:"#10b981",display:"inline-block"}}/>
            Wolvox ERP · {new Date().toLocaleDateString("tr-TR")}
          </div>
          <div style={{fontSize:12,color:"#334155"}}>👤 <b>{user}</b></div>
          <button onClick={logout} style={{fontSize:12,padding:"5px 12px",borderRadius:8,border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer",fontFamily:"inherit"}}>Çıkış</button>
        </div>
      </header>
      <nav style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"0 2rem",display:"flex",gap:2,overflowX:"auto",position:"sticky",top:54,zIndex:99}}>
        {[...TABS,...(user==="admin"?[ADMIN_TAB]:[])].map(t=>{
          const on=active===t.id;
          return(
            <button key={t.id} onClick={()=>setActive(t.id)} style={{
              padding:"12px 16px",border:"none",cursor:"pointer",background:"transparent",
              fontFamily:"inherit",fontSize:13,fontWeight:on?600:400,
              color:on?t.color:"#64748b",
              borderBottom:on?`2.5px solid ${t.color}`:"2.5px solid transparent",
              display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",transition:"all 0.15s",
            }}>
              <span style={{fontSize:15}}>{t.icon}</span>{t.label}
            </button>
          );
        })}
      </nav>
      <main style={{padding:"1.5rem 2rem",maxWidth:1700,margin:"0 auto"}}>
        {active==="upload" ? <ExcelUploadPanel/> : AT && <AT.component/>}
      </main>
    </div>
  );
}

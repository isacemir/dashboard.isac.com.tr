import { useState } from "react";
export default function Login({ onLogin }) {
  const [user,setUser]=useState(""); const [pass,setPass]=useState(""); const [err,setErr]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e){
    e.preventDefault(); setErr(""); setLoading(true);
    try{
      const r=await fetch("/api/login.php",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:user,password:pass})});
      const d=await r.json();
      if(d.ok) onLogin(d.user); else setErr(d.error||"Giriş başarısız.");
    }catch{ setErr("Sunucuya bağlanılamadı."); } finally{ setLoading(false); }
  }
  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif"}}>
      <div style={{background:"#fff",borderRadius:20,padding:"2.5rem 2.75rem",border:"1px solid #e2e8f0",width:"100%",maxWidth:400,boxShadow:"0 8px 40px rgba(0,0,0,0.06)"}}>
        <div style={{textAlign:"center",marginBottom:"2rem"}}>
          <div style={{width:52,height:52,background:"#0ea5e9",borderRadius:14,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12}}>
            <span style={{color:"#fff",fontWeight:800,fontSize:18}}>IS</span>
          </div>
          <div style={{fontSize:18,fontWeight:700,color:"#0f172a"}}>ISAC Sense Digital</div>
          <div style={{fontSize:12,color:"#94a3b8",marginTop:3}}>Yönetim Paneli</div>
        </div>
        <form onSubmit={submit}>
          {[["Kullanıcı Adı","text",user,setUser,"kullanici_adi"],["Şifre","password",pass,setPass,"••••••••"]].map(([label,type,val,set,ph])=>(
            <div key={label} style={{marginBottom:14}}>
              <label style={{display:"block",fontSize:11,fontWeight:600,color:"#475569",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</label>
              <input type={type} value={val} onChange={e=>set(e.target.value)} placeholder={ph} required
                style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid #e2e8f0",fontSize:14,fontFamily:"inherit",background:"#f8fafc",outline:"none",boxSizing:"border-box"}}/>
            </div>
          ))}
          {err&&<div style={{background:"#fee2e2",color:"#991b1b",borderRadius:9,padding:"9px 14px",fontSize:13,marginBottom:14}}>{err}</div>}
          <button type="submit" disabled={loading} style={{width:"100%",padding:11,borderRadius:10,border:"none",background:loading?"#94a3b8":"#0ea5e9",color:"#fff",fontSize:14,fontWeight:600,cursor:loading?"not-allowed":"pointer",fontFamily:"inherit"}}>
            {loading?"Giriş yapılıyor...":"Giriş Yap"}
          </button>
        </form>
        <div style={{textAlign:"center",marginTop:"1.5rem",fontSize:11,color:"#cbd5e1"}}>Oturum 2 saat sonra otomatik kapanır.</div>
      </div>
    </div>
  );
}

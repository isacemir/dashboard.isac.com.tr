import { useState, useRef } from "react";

const EXCEL_TARGETS = [
  { id: "satis",            label: "Satış Raporu",          icon: "📦", file: "satis-raporu.xlsx" },
  { id: "siparis",          label: "Sipariş Raporu",         icon: "📈", file: "siparis-raporu.xlsx" },
  { id: "teklif",           label: "Satış Teklifleri",       icon: "📋", file: "teklif-raporu.xlsx" },
  { id: "satinalma_teklif", label: "Satınalma Teklifleri",   icon: "🛒", file: "SATINALMA-TEKLIF.xlsx" },
  { id: "satinalma_fatura", label: "Satınalma Faturaları",   icon: "🧾", file: "satinalma-fatura.xlsx" },
  { id: "stok",             label: "Stok & Sipariş",         icon: "📊", file: "stok-siparis-raporu.xlsx" },
  { id: "crm",              label: "CRM",                    icon: "👥", file: "crm.xlsx" },
];

export default function ExcelUploadPanel() {
  const [target, setTarget]       = useState(EXCEL_TARGETS[0].id);
  const [file, setFile]           = useState(null);
  const [dragging, setDragging]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState(null); // {ok, message, rows, lastSync}
  const inputRef = useRef();

  const selectedTarget = EXCEL_TARGETS.find(t => t.id === target);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) setFile(f);
  }

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const fd = new FormData();
    fd.append("target", target);
    fd.append("excel", file);
    try {
      const res = await fetch("/api/upload.php", { method: "POST", credentials: "include", body: fd });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ ok: false, error: "Sunucuya ulaşılamadı." });
    }
    setLoading(false);
  }

  const S = {
    wrap:    { padding: "1.5rem", maxWidth: 680, margin: "0 auto" },
    card:    { background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", padding: "2rem", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" },
    title:   { fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 4 },
    sub:     { fontSize: 13, color: "#64748b", marginBottom: 24 },
    label:   { fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8, display: "block", letterSpacing: "0.03em" },
    select:  { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1e293b", background: "#f8fafc", marginBottom: 20, outline: "none", fontFamily: "inherit" },
    dropzone: (dragging, hasFile) => ({
      border: `2px dashed ${dragging ? "#0ea5e9" : hasFile ? "#10b981" : "#cbd5e1"}`,
      borderRadius: 14, padding: "2.5rem 1.5rem", textAlign: "center", cursor: "pointer",
      background: dragging ? "#f0f9ff" : hasFile ? "#f0fdf4" : "#f8fafc",
      transition: "all 0.2s", marginBottom: 20,
    }),
    dzIcon:  { fontSize: 36, marginBottom: 10 },
    dzText:  { fontSize: 14, color: "#64748b" },
    dzBold:  { color: "#0ea5e9", fontWeight: 600 },
    btn:     (disabled) => ({
      width: "100%", padding: "13px", borderRadius: 12, border: "none",
      background: disabled ? "#e2e8f0" : "linear-gradient(135deg,#0ea5e9,#2563eb)",
      color: disabled ? "#94a3b8" : "#fff", fontSize: 15, fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit",
      transition: "opacity 0.15s", boxShadow: disabled ? "none" : "0 4px 15px rgba(14,165,233,0.25)",
    }),
    success: { borderRadius: 12, padding: "14px 18px", background: "#f0fdf4", border: "1px solid #86efac", color: "#166534", fontSize: 13, marginTop: 16 },
    error:   { borderRadius: 12, padding: "14px 18px", background: "#fef2f2", border: "1px solid #fca5a5", color: "#991b1b", fontSize: 13, marginTop: 16 },
    grid:    { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginTop: 12 },
    stat:    { background: "#f8fafc", borderRadius: 10, padding: "12px 16px", textAlign: "center" },
    statN:   { fontSize: 20, fontWeight: 700, color: "#0f172a" },
    statL:   { fontSize: 11, color: "#64748b", marginTop: 2 },
  };

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.title}>📤 Veri Güncelle</div>
        <div style={S.sub}>Excel dosyası yükleyerek dashboard verilerini otomatik güncelleyin.</div>

        {/* Target Selector */}
        <label style={S.label}>Güncellenecek Rapor</label>
        <select style={S.select} value={target} onChange={e => { setTarget(e.target.value); setFile(null); setResult(null); }}>
          {EXCEL_TARGETS.map(t => (
            <option key={t.id} value={t.id}>{t.icon} {t.label} — {t.file}</option>
          ))}
        </select>

        {/* Dropzone */}
        <div
          style={S.dropzone(dragging, !!file)}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div style={S.dzIcon}>{file ? "✅" : "📂"}</div>
          {file
            ? <><div style={{ fontSize: 14, fontWeight: 600, color: "#166534" }}>{file.name}</div><div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{(file.size / 1024 / 1024).toFixed(2)} MB · Değiştirmek için tıklayın</div></>
            : <><div style={S.dzText}><span style={S.dzBold}>Dosya seçin</span> veya buraya sürükleyin</div><div style={{ ...S.dzText, fontSize: 12, marginTop: 6 }}>.xlsx, .xls formatında — {selectedTarget?.file}</div></>
          }
        </div>
        <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => { setFile(e.target.files[0]); setResult(null); }} />

        {/* Upload Button */}
        <button style={S.btn(!file || loading)} onClick={handleUpload} disabled={!file || loading}>
          {loading ? "⏳ Dönüştürülüyor..." : "🚀 Yükle ve Güncelle"}
        </button>

        {/* Result */}
        {result && result.ok && (
          <div style={S.success}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>✅ {result.message}</div>
            <div style={S.grid}>
              <div style={S.stat}><div style={S.statN}>{result.rows?.toLocaleString("tr-TR")}</div><div style={S.statL}>Satır</div></div>
              <div style={S.stat}><div style={S.statN}>JSON</div><div style={S.statL}>Dönüşüm Tamam</div></div>
              <div style={S.stat}><div style={S.statN}>{result.lastSync ? new Date(result.lastSync).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "—"}</div><div style={S.statL}>Senkron Saati</div></div>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: "#166534" }}>Sayfayı yenileyin (F5) veya ilgili sekmeye geçin — veriler anında güncellendi.</div>
          </div>
        )}
        {result && !result.ok && (
          <div style={S.error}>❌ {result.error || "Bilinmeyen hata oluştu."}</div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// OPENIMIS CLAIMS MANAGEMENT SYSTEM - ENHANCED MVP
// Every element has data-testid, aria-label, and id attributes
// Built for TestARQ demo - perfect automation compatibility
// Features: Login, Dashboard, Enrollment, Claims, Batch, EDI
// ═══════════════════════════════════════════════════════════════

const USERS = {
  Admin: { password: "admin123", role: "Admin", name: "System Administrator" },
  EOFF001: { password: "officer123", role: "Enrollment Officer", name: "Sarah Mitchell" },
  CLRK001: { password: "clerk123", role: "Claims Administrator", name: "James Chen" },
  RVWR001: { password: "review123", role: "Claims Reviewer", name: "Dr. Emily Roberts" },
};

const REGIONS = ["Northeast", "Southeast", "Midwest", "West Coast", "Pacific Northwest"];
const DISTRICTS = {
  Northeast: ["Manhattan", "Brooklyn", "Queens", "Bronx"],
  Southeast: ["Miami-Dade", "Broward", "Palm Beach", "Hillsborough"],
  Midwest: ["Cook", "Wayne", "Cuyahoga", "Franklin"],
  "West Coast": ["Los Angeles", "San Diego", "San Francisco", "Sacramento"],
  "Pacific Northwest": ["King", "Multnomah", "Clark", "Pierce"],
};
const GENDERS = ["Male", "Female", "Other"];
const ID_TYPES = ["SSN", "National ID", "Passport", "Driver License"];
const DIAGNOSIS_CODES = [
  { code: "Z00.00", desc: "General adult medical exam" },
  { code: "J06.9", desc: "Acute upper respiratory infection" },
  { code: "E11.9", desc: "Type 2 diabetes mellitus" },
  { code: "I10", desc: "Essential hypertension" },
  { code: "M54.5", desc: "Low back pain" },
  { code: "K21.0", desc: "Gastroesophageal reflux disease" },
];
const PROCEDURE_CODES = [
  { code: "99213", desc: "Office visit, established patient" },
  { code: "99214", desc: "Office visit, detailed" },
  { code: "99203", desc: "Office visit, new patient" },
  { code: "85025", desc: "Complete blood count" },
  { code: "80053", desc: "Comprehensive metabolic panel" },
  { code: "71046", desc: "Chest X-ray, 2 views" },
];
const VISIT_TYPES = ["Outpatient", "Inpatient", "Emergency", "Telehealth", "Preventive"];
const CLAIM_STATUSES = ["Entered", "Checked", "Processed", "Valuated", "Rejected"];
const FACILITIES = [
  { id: "FACI001", name: "Memorial General Hospital" },
  { id: "FACI002", name: "Riverside Community Clinic" },
  { id: "FACI003", name: "Pacific Health Center" },
  { id: "FACI004", name: "Sunrise Medical Group" },
];
const EDI_TYPES = ["EDI 834", "EDI 837", "EDI 835", "EDI 999"];
const EDI_STATUSES = ["Pending", "Validated", "Transmitted", "Acknowledged", "Rejected", "Error"];
const BATCH_TYPES = ["Payment", "Processing", "Remittance", "Reconciliation"];

// ── Sample Data ──────────────────────────────────────────────

const SAMPLE_FAMILIES = [
  { id: "FAM-001", lastName: "Anderson", givenNames: "Robert James", dob: "1978-03-15", gender: "Male", insuranceNo: "INS-100001", region: "Northeast", district: "Manhattan", email: "r.anderson@email.com", phone: "(555) 101-2001", idType: "SSN", idNo: "123-45-6789", status: "Active", members: 3 },
  { id: "FAM-002", lastName: "Williams", givenNames: "Maria Elena", dob: "1985-07-22", gender: "Female", insuranceNo: "INS-100002", region: "Southeast", district: "Miami-Dade", email: "m.williams@email.com", phone: "(555) 202-3002", idType: "SSN", idNo: "234-56-7890", status: "Active", members: 4 },
  { id: "FAM-003", lastName: "Thompson", givenNames: "David Lee", dob: "1990-11-08", gender: "Male", insuranceNo: "INS-100003", region: "Midwest", district: "Cook", email: "d.thompson@email.com", phone: "(555) 303-4003", idType: "National ID", idNo: "NID-778899", status: "Active", members: 2 },
];

const SAMPLE_CLAIMS = [
  { id: "CLM-2026-001", insuranceNo: "INS-100001", patientName: "Robert Anderson", facility: "Memorial General Hospital", facilityId: "FACI001", visitType: "Outpatient", diagnosisCode: "Z00.00", procedureCode: "99213", serviceDate: "2026-01-15", amount: 150.00, status: "Valuated", submittedDate: "2026-01-16", reviewedBy: "Dr. Emily Roberts" },
  { id: "CLM-2026-002", insuranceNo: "INS-100002", patientName: "Maria Williams", facility: "Riverside Community Clinic", facilityId: "FACI002", visitType: "Emergency", diagnosisCode: "J06.9", procedureCode: "99214", serviceDate: "2026-01-20", amount: 320.00, status: "Processed", submittedDate: "2026-01-21", reviewedBy: "" },
  { id: "CLM-2026-003", insuranceNo: "INS-100003", patientName: "David Thompson", facility: "Pacific Health Center", facilityId: "FACI003", visitType: "Preventive", diagnosisCode: "E11.9", procedureCode: "80053", serviceDate: "2026-02-01", amount: 85.00, status: "Entered", submittedDate: "2026-02-02", reviewedBy: "" },
  { id: "CLM-2026-004", insuranceNo: "INS-100001", patientName: "Robert Anderson", facility: "Sunrise Medical Group", facilityId: "FACI004", visitType: "Telehealth", diagnosisCode: "I10", procedureCode: "99213", serviceDate: "2026-02-05", amount: 95.00, status: "Checked", submittedDate: "2026-02-05", reviewedBy: "" },
  { id: "CLM-2026-005", insuranceNo: "INS-100002", patientName: "Maria Williams", facility: "Memorial General Hospital", facilityId: "FACI001", visitType: "Inpatient", diagnosisCode: "M54.5", procedureCode: "99214", serviceDate: "2026-01-28", amount: 475.00, status: "Valuated", submittedDate: "2026-01-29", reviewedBy: "Dr. Emily Roberts" },
  { id: "CLM-2026-006", insuranceNo: "INS-100003", patientName: "David Thompson", facility: "Riverside Community Clinic", facilityId: "FACI002", visitType: "Outpatient", diagnosisCode: "K21.0", procedureCode: "99203", serviceDate: "2026-02-03", amount: 210.00, status: "Valuated", submittedDate: "2026-02-04", reviewedBy: "Dr. Emily Roberts" },
];

const SAMPLE_BATCHES = [
  { id: "BATCH-2026-001", name: "January Payment Run", type: "Payment", status: "Completed", facility: "All Facilities", dateFrom: "2026-01-01", dateTo: "2026-01-31", claimCount: 3, totalAmount: 945.00, createdAt: "2026-02-01", completedAt: "2026-02-01", processedCount: 3, failedCount: 0, runDuration: "2m 34s" },
  { id: "BATCH-2026-002", name: "Feb Week 1 Processing", type: "Processing", status: "Completed", facility: "Memorial General Hospital", dateFrom: "2026-02-01", dateTo: "2026-02-07", claimCount: 2, totalAmount: 305.00, createdAt: "2026-02-07", completedAt: "2026-02-07", processedCount: 2, failedCount: 0, runDuration: "1m 12s" },
  { id: "BATCH-2026-003", name: "EDI 835 Remittance Feb", type: "Remittance", status: "Processing", facility: "All Facilities", dateFrom: "2026-02-01", dateTo: "2026-02-09", claimCount: 5, totalAmount: 1335.00, createdAt: "2026-02-09", completedAt: "", processedCount: 3, failedCount: 0, runDuration: "" },
];

const SAMPLE_EDI = [
  { id: "EDI-2026-001", type: "EDI 837", direction: "Outbound", transactionId: "ST*837*0001", senderId: "OPENIMIS-001", receiverId: "PAYER-BCBS-001", claimCount: 3, totalAmount: 945.00, status: "Acknowledged", createdAt: "2026-01-31", transmittedAt: "2026-01-31", acknowledgedAt: "2026-02-01", segments: 47, errorCount: 0, batchId: "BATCH-2026-001", isa: "ISA*00*          *00*          *ZZ*OPENIMIS001    *ZZ*PAYERBCBS001   *260131*1423*^*00501*000000001*0*P*:~", gs: "GS*HC*OPENIMIS001*PAYERBCBS001*20260131*1423*1*X*005010X222A1~", st: "ST*837*0001*005010X222A1~" },
  { id: "EDI-2026-002", type: "EDI 834", direction: "Outbound", transactionId: "ST*834*0001", senderId: "OPENIMIS-001", receiverId: "PAYER-BCBS-001", claimCount: 0, totalAmount: 0, status: "Transmitted", createdAt: "2026-02-01", transmittedAt: "2026-02-01", acknowledgedAt: "", segments: 28, errorCount: 0, batchId: "", isa: "ISA*00*          *00*          *ZZ*OPENIMIS001    *ZZ*PAYERBCBS001   *260201*0900*^*00501*000000002*0*P*:~", gs: "GS*BE*OPENIMIS001*PAYERBCBS001*20260201*0900*2*X*005010X220A1~", st: "ST*834*0001*005010X220A1~" },
  { id: "EDI-2026-003", type: "EDI 835", direction: "Inbound", transactionId: "ST*835*0001", senderId: "PAYER-BCBS-001", receiverId: "OPENIMIS-001", claimCount: 3, totalAmount: 890.00, status: "Validated", createdAt: "2026-02-02", transmittedAt: "2026-02-02", acknowledgedAt: "", segments: 52, errorCount: 0, batchId: "BATCH-2026-001", isa: "ISA*00*          *00*          *ZZ*PAYERBCBS001   *ZZ*OPENIMIS001    *260202*1100*^*00501*000000003*0*P*:~", gs: "GS*HP*PAYERBCBS001*OPENIMIS001*20260202*1100*3*X*005010X221A1~", st: "ST*835*0001*005010X221A1~" },
  { id: "EDI-2026-004", type: "EDI 999", direction: "Inbound", transactionId: "ST*999*0001", senderId: "PAYER-BCBS-001", receiverId: "OPENIMIS-001", claimCount: 0, totalAmount: 0, status: "Acknowledged", createdAt: "2026-02-01", transmittedAt: "2026-02-01", acknowledgedAt: "2026-02-01", segments: 12, errorCount: 0, batchId: "", isa: "ISA*00*          *00*          *ZZ*PAYERBCBS001   *ZZ*OPENIMIS001    *260201*1500*^*00501*000000004*0*P*:~", gs: "GS*FA*PAYERBCBS001*OPENIMIS001*20260201*1500*4*X*005010X231A1~", st: "ST*999*0001*005010X231A1~" },
  { id: "EDI-2026-005", type: "EDI 837", direction: "Outbound", transactionId: "ST*837*0002", senderId: "OPENIMIS-001", receiverId: "PAYER-AETNA-001", claimCount: 2, totalAmount: 685.00, status: "Rejected", createdAt: "2026-02-05", transmittedAt: "2026-02-05", acknowledgedAt: "2026-02-06", segments: 35, errorCount: 2, batchId: "BATCH-2026-002", isa: "ISA*00*          *00*          *ZZ*OPENIMIS001    *ZZ*PAYERAETNA001  *260205*0830*^*00501*000000005*0*P*:~", gs: "GS*HC*OPENIMIS001*PAYERAETNA001*20260205*0830*5*X*005010X222A1~", st: "ST*837*0002*005010X222A1~" },
];

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const c = {
  pri: "#0F4C75", priDk: "#0A3555", priLt: "#1B6CA8",
  acc: "#00B4D8", accDk: "#0096B7",
  ok: "#059669", warn: "#D97706", err: "#DC2626", info: "#6366F1",
  bg: "#F0F4F8", card: "#FFFFFF", sb: "#0A2540",
  txt: "#1E293B", mut: "#64748B", bdr: "#E2E8F0",
  inBg: "#F8FAFC", inBdr: "#CBD5E1",
};

const s = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", color: c.txt, background: c.bg },
  sidebar: { width: 260, background: `linear-gradient(180deg, ${c.sb} 0%, #0D1B2A 100%)`, color: "#fff", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, boxShadow: "4px 0 24px rgba(0,0,0,0.15)" },
  sidebarLogo: { padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${c.acc} 0%, ${c.priLt} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff" },
  sidebarNav: { flex: 1, padding: "16px 12px", overflowY: "auto" },
  navSec: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.35)", padding: "16px 12px 8px", marginTop: 8 },
  navItem: (a) => ({ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: a ? 600 : 400, background: a ? "rgba(0,180,216,0.15)" : "transparent", color: a ? c.acc : "rgba(255,255,255,0.7)", transition: "all 0.2s", marginBottom: 2, border: a ? "1px solid rgba(0,180,216,0.2)" : "1px solid transparent" }),
  navIcon: { fontSize: 18, width: 24, textAlign: "center" },
  sidebarUser: { padding: "16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 },
  userAvatar: { width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${c.acc}, ${c.priLt})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 },
  main: { flex: 1, marginLeft: 260, display: "flex", flexDirection: "column" },
  header: { background: "#fff", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${c.bdr}`, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  content: { padding: 32, flex: 1 },
  card: { background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: `1px solid ${c.bdr}`, marginBottom: 24 },
  cardTitle: { fontSize: 17, fontWeight: 700, marginBottom: 20, color: c.txt, display: "flex", alignItems: "center", gap: 10 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 },
  formGrid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: c.mut, display: "flex", alignItems: "center", gap: 4 },
  req: { color: c.err, fontWeight: 700 },
  input: { padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${c.inBdr}`, fontSize: 14, outline: "none", background: c.inBg, transition: "all 0.2s", color: c.txt },
  select: { padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${c.inBdr}`, fontSize: 14, outline: "none", background: c.inBg, cursor: "pointer", color: c.txt },
  btnPri: { padding: "11px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.pri} 0%, ${c.priDk} 100%)`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(15,76,117,0.25)" },
  btnOk: { padding: "11px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.ok} 0%, #047857 100%)`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(5,150,105,0.25)" },
  btnWarn: { padding: "11px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.warn} 0%, #B45309 100%)`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 },
  btnErr: { padding: "10px 20px", borderRadius: 8, border: "none", background: c.err, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnInfo: { padding: "10px 20px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${c.info} 0%, #4F46E5 100%)`, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 },
  btnOut: { padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${c.inBdr}`, background: "#fff", color: c.txt, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnSm: { padding: "6px 14px", fontSize: 12, borderRadius: 6 },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 },
  th: { padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", color: c.mut, borderBottom: `2px solid ${c.bdr}`, background: c.inBg },
  td: { padding: "14px 16px", borderBottom: `1px solid ${c.bdr}`, verticalAlign: "middle" },
  badge: (type) => {
    const m = { Active: c.ok, Entered: c.acc, Checked: c.warn, Processed: c.priLt, Valuated: c.ok, Rejected: c.err, Pending: c.warn, Validated: c.acc, Transmitted: c.priLt, Acknowledged: c.ok, Error: c.err, Created: c.mut, Validating: c.warn, Processing: c.info, Completed: c.ok, Failed: c.err, "Partially Completed": c.warn, Outbound: c.priLt, Inbound: c.acc };
    const cl = m[type] || c.mut;
    return { display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${cl}18`, color: cl, border: `1px solid ${cl}30` };
  },
  stat: { padding: 20, borderRadius: 12, background: "#fff", border: `1px solid ${c.bdr}`, display: "flex", flexDirection: "column", gap: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  statVal: { fontSize: 32, fontWeight: 800, letterSpacing: "-1px" },
  statLbl: { fontSize: 13, color: c.mut, fontWeight: 500 },
  toast: { position: "fixed", top: 24, right: 24, background: c.ok, color: "#fff", padding: "14px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10, animation: "slideIn 0.3s ease" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" },
  modalC: { background: "#fff", borderRadius: 16, padding: 32, width: 800, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" },
  modalT: { fontSize: 20, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" },
  fab: { position: "fixed", bottom: 32, right: 32, width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${c.acc} 0%, ${c.accDk} 100%)`, color: "#fff", border: "none", fontSize: 28, cursor: "pointer", boxShadow: "0 6px 24px rgba(0,180,216,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 80 },
  progBar: { width: "100%", height: 10, background: c.bdr, borderRadius: 5, overflow: "hidden" },
  progFill: (pct, col) => ({ width: `${pct}%`, height: "100%", background: col || c.ok, borderRadius: 5, transition: "width 0.5s ease" }),
  code: { background: "#0D1B2A", color: "#00B4D8", padding: 20, borderRadius: 10, fontSize: 13, fontFamily: "'Cascadia Code', 'Fira Code', monospace", lineHeight: 1.6, overflowX: "auto", whiteSpace: "pre-wrap", maxHeight: 300, overflowY: "auto" },
  segLbl: { color: "#D97706", fontWeight: 600, minWidth: 45 },
  segVal: { color: "#E2E8F0" },
  timeline: { display: "flex", flexDirection: "column", gap: 16, padding: "0 0 0 20px", borderLeft: `3px solid ${c.bdr}` },
  tlItem: (a) => ({ padding: "12px 16px", borderRadius: 8, background: a ? `${c.acc}10` : c.inBg, border: `1px solid ${a ? c.acc + "40" : c.bdr}`, position: "relative", marginLeft: 16 }),
  tlDot: (col) => ({ width: 12, height: 12, borderRadius: "50%", background: col || c.acc, position: "absolute", left: -25, top: 16, border: "2px solid #fff", boxShadow: "0 0 0 2px " + (col || c.acc) }),
  loginPage: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: `linear-gradient(135deg, ${c.sb} 0%, #0D1B2A 50%, ${c.priDk} 100%)` },
  loginCard: { background: "#fff", borderRadius: 16, padding: "48px 40px", width: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.3)" },
  loginInput: { width: "100%", padding: "13px 16px", borderRadius: 10, border: `1.5px solid ${c.inBdr}`, fontSize: 15, outline: "none", background: c.inBg, boxSizing: "border-box" },
  loginBtn: { width: "100%", padding: "14px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${c.pri} 0%, ${c.priDk} 100%)`, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8, boxShadow: "0 4px 16px rgba(15,76,117,0.3)" },
};

// ═══════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
function FI({ id, label, required, type = "text", value, onChange, placeholder, testId, readOnly, disabled }) {
  const tid = testId || id;
  return (
    <div style={s.formGroup}>
      <label htmlFor={id} style={s.label} data-testid={`label-${tid}`} id={`label-${id}`}>
        {label} {required && <span style={s.req} aria-hidden="true">*</span>}
      </label>
      <input id={id} name={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || `Enter ${label.toLowerCase()}`} required={required} aria-label={label} aria-required={required} data-testid={`input-${tid}`} style={{ ...s.input, ...(readOnly ? { background: "#f0f0f0" } : {}) }} readOnly={readOnly} disabled={disabled}
        onFocus={(e) => { if (!readOnly) { e.target.style.borderColor = c.pri; e.target.style.boxShadow = `0 0 0 3px ${c.pri}20`; } }}
        onBlur={(e) => { e.target.style.borderColor = c.inBdr; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function FS({ id, label, required, value, onChange, options, placeholder, testId, disabled }) {
  const tid = testId || id;
  return (
    <div style={s.formGroup}>
      <label htmlFor={id} style={s.label} data-testid={`label-${tid}`} id={`label-${id}`}>
        {label} {required && <span style={s.req} aria-hidden="true">*</span>}
      </label>
      <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)} required={required} aria-label={label} aria-required={required} data-testid={`select-${tid}`} style={s.select} disabled={disabled}>
        <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
        {options.map((o) => (
          <option key={typeof o === "string" ? o : o.code} value={typeof o === "string" ? o : o.code}>
            {typeof o === "string" ? o : `${o.code} - ${o.desc}`}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div style={s.toast} data-testid="toast-notification" role="alert" aria-live="polite"><span>✓</span> {message}</div>;
}

// ═══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");
  const go = (e) => {
    e.preventDefault();
    const user = USERS[u];
    if (!user || user.password !== p) { setErr("Invalid username or password. Try: Admin / admin123"); return; }
    onLogin({ username: u, ...user });
  };
  return (
    <div style={s.loginPage} data-testid="login-page" id="login-page">
      <div style={s.loginCard} data-testid="login-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ ...s.logoIcon, margin: "0 auto 16px", width: 56, height: 56, fontSize: 26 }}>⚕</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: c.txt, letterSpacing: "-0.5px" }} data-testid="login-title">Login - Claims Management System</div>
          <div style={{ fontSize: 14, color: c.mut, marginTop: 4 }} data-testid="login-subtitle">OpenIMIS Healthcare Platform</div>
        </div>
        <form onSubmit={go} data-testid="login-form" id="login-form">
          <div style={{ ...s.formGroup, marginBottom: 16 }}>
            <label htmlFor="username" style={s.label} data-testid="label-username" id="label-username">Username <span style={s.req}>*</span></label>
            <input id="username" name="username" type="text" value={u} onChange={(e) => { setU(e.target.value); setErr(""); }} placeholder="Enter username" required aria-label="Username" aria-required="true" data-testid="input-username" style={s.loginInput} autoFocus />
          </div>
          <div style={{ ...s.formGroup, marginBottom: 20 }}>
            <label htmlFor="password" style={s.label} data-testid="label-password" id="label-password">Password <span style={s.req}>*</span></label>
            <input id="password" name="password" type="password" value={p} onChange={(e) => { setP(e.target.value); setErr(""); }} placeholder="Enter password" required aria-label="Password" aria-required="true" data-testid="input-password" style={s.loginInput} />
          </div>
          {err && <div style={{ color: c.err, fontSize: 13, textAlign: "center", marginTop: 12, fontWeight: 500 }} data-testid="login-error" role="alert">{err}</div>}
          <button type="submit" style={s.loginBtn} data-testid="btn-login" id="btn-login" aria-label="Log In">Log In</button>
        </form>
        <div style={{ marginTop: 24, padding: 16, background: c.inBg, borderRadius: 10, fontSize: 12, color: c.mut }} data-testid="login-help">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Demo Credentials:</div>
          <div>Admin / admin123 · EOFF001 / officer123</div>
          <div>CLRK001 / clerk123 · RVWR001 / review123</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════
function DashboardPage({ claims, families, batches, edi }) {
  const entered = claims.filter((x) => x.status === "Entered").length;
  const total$ = claims.reduce((a, x) => a + x.amount, 0);
  const activeBatch = batches.filter((x) => x.status === "Processing").length;
  const ediErr = edi.filter((x) => x.status === "Rejected" || x.status === "Error").length;
  return (
    <div data-testid="dashboard-page" id="dashboard-page">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={s.stat} data-testid="stat-families"><div style={s.statLbl}>Total Families</div><div style={{ ...s.statVal, color: c.pri }} data-testid="stat-families-value">{families.length}</div></div>
        <div style={s.stat} data-testid="stat-claims"><div style={s.statLbl}>Total Claims</div><div style={{ ...s.statVal, color: c.acc }} data-testid="stat-claims-value">{claims.length}</div></div>
        <div style={s.stat} data-testid="stat-pending"><div style={s.statLbl}>Pending Review</div><div style={{ ...s.statVal, color: c.warn }} data-testid="stat-pending-value">{entered}</div></div>
        <div style={s.stat} data-testid="stat-amount"><div style={s.statLbl}>Total Billed</div><div style={{ ...s.statVal, color: c.ok }} data-testid="stat-amount-value">${total$.toLocaleString()}</div></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
        <div style={s.stat} data-testid="stat-batches"><div style={s.statLbl}>Active Batches</div><div style={{ ...s.statVal, color: c.info }} data-testid="stat-batches-value">{activeBatch}</div></div>
        <div style={s.stat} data-testid="stat-edi-errors"><div style={s.statLbl}>EDI Errors / Rejections</div><div style={{ ...s.statVal, color: c.err }} data-testid="stat-edi-errors-value">{ediErr}</div></div>
      </div>
      <div style={s.card} data-testid="recent-claims-card">
        <div style={s.cardTitle}>📋 Recent Claims</div>
        <table style={s.table} data-testid="recent-claims-table" aria-label="Recent Claims">
          <thead><tr><th style={s.th}>Claim ID</th><th style={s.th}>Patient</th><th style={s.th}>Facility</th><th style={s.th}>Amount</th><th style={s.th}>Status</th></tr></thead>
          <tbody>{claims.slice(0, 5).map((x) => (
            <tr key={x.id} data-testid={`claim-row-${x.id}`}><td style={s.td} data-testid={`claim-id-${x.id}`}>{x.id}</td><td style={s.td}>{x.patientName}</td><td style={s.td}>{x.facility}</td><td style={s.td}>${x.amount.toFixed(2)}</td><td style={s.td}><span style={s.badge(x.status)} data-testid={`claim-status-${x.id}`}>{x.status}</span></td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ENROLLMENT PAGE
// ═══════════════════════════════════════════════════════════════
function EnrollmentPage({ families, setFamilies }) {
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [f, setF] = useState({ lastName: "", givenNames: "", dob: "", gender: "", region: "", district: "", email: "", phone: "", idType: "", idNo: "", insuranceNo: "" });

  const filtered = families.filter((x) => x.lastName.toLowerCase().includes(search.toLowerCase()) || x.givenNames.toLowerCase().includes(search.toLowerCase()) || x.insuranceNo.toLowerCase().includes(search.toLowerCase()));

  const save = (e) => {
    e.preventDefault();
    const nf = { id: `FAM-${String(families.length + 1).padStart(3, "0")}`, ...f, insuranceNo: f.insuranceNo || `INS-${100000 + families.length + 1}`, status: "Active", members: 1 };
    setFamilies([...families, nf]);
    setShow(false);
    setF({ lastName: "", givenNames: "", dob: "", gender: "", region: "", district: "", email: "", phone: "", idType: "", idNo: "", insuranceNo: "" });
    setToast("Family record created successfully!");
  };

  return (
    <div data-testid="enrollment-page" id="enrollment-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div style={{ display: "flex", gap: 12, marginBottom: 24, alignItems: "flex-end" }} data-testid="enrollment-search-bar">
        <div style={{ ...s.formGroup, flex: 1, maxWidth: 400 }}>
          <label htmlFor="search-families" style={s.label} data-testid="label-search-families">Search Families</label>
          <input id="search-families" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or insurance number..." aria-label="Search Families" data-testid="input-search-families" style={s.input} />
        </div>
        <button onClick={() => setShow(true)} style={s.btnPri} data-testid="btn-add-family" id="btn-add-family" aria-label="Add New Family">+ Add Family</button>
      </div>
      <div style={s.card} data-testid="families-list-card">
        <div style={s.cardTitle}>👨‍👩‍👧‍👦 Enrolled Families ({filtered.length})</div>
        <table style={s.table} data-testid="families-table" aria-label="Enrolled Families">
          <thead><tr><th style={s.th} data-testid="th-family-id">Family ID</th><th style={s.th} data-testid="th-last-name">Last Name</th><th style={s.th} data-testid="th-given-names">Given Names</th><th style={s.th} data-testid="th-insurance-no">Insurance No.</th><th style={s.th} data-testid="th-region">Region</th><th style={s.th} data-testid="th-members">Members</th><th style={s.th} data-testid="th-status">Status</th></tr></thead>
          <tbody>{filtered.map((x) => (
            <tr key={x.id} data-testid={`family-row-${x.id}`}><td style={s.td} data-testid={`family-id-${x.id}`}>{x.id}</td><td style={{ ...s.td, fontWeight: 600 }}>{x.lastName}</td><td style={s.td}>{x.givenNames}</td><td style={s.td}><code style={{ background: c.inBg, padding: "2px 8px", borderRadius: 4, fontSize: 13 }}>{x.insuranceNo}</code></td><td style={s.td}>{x.region}</td><td style={s.td}>{x.members}</td><td style={s.td}><span style={s.badge(x.status)}>{x.status}</span></td></tr>
          ))}</tbody>
        </table>
      </div>
      <button onClick={() => setShow(true)} style={s.fab} data-testid="fab-add-family" id="fab-add-family" aria-label="Add New Family" title="Add New Family">+</button>
      {show && (
        <div style={s.modal} data-testid="modal-add-family" role="dialog" aria-label="Add New Family" aria-modal="true">
          <div style={s.modalC} data-testid="modal-content-add-family">
            <div style={s.modalT}><span data-testid="modal-title-text">👨‍👩‍👧 Add New Family / Group</span><button onClick={() => setShow(false)} style={{ ...s.btnOut, ...s.btnSm }} data-testid="btn-close-modal" aria-label="Close Modal">✕</button></div>
            <form onSubmit={save} data-testid="form-add-family" id="form-add-family">
              <div style={{ ...s.cardTitle, fontSize: 14, marginBottom: 16, color: c.priLt }}>Head of Family / Group</div>
              <div style={s.formGrid}>
                <FI id="last-name" label="Last Name" required value={f.lastName} onChange={(v) => setF({ ...f, lastName: v })} testId="last-name" />
                <FI id="given-names" label="Given Names" required value={f.givenNames} onChange={(v) => setF({ ...f, givenNames: v })} testId="given-names" />
                <FI id="birth-date" label="Birth Date" type="date" required value={f.dob} onChange={(v) => setF({ ...f, dob: v })} testId="birth-date" />
                <FS id="gender" label="Gender" required value={f.gender} onChange={(v) => setF({ ...f, gender: v })} options={GENDERS} testId="gender" />
                <FS id="region" label="Region" required value={f.region} onChange={(v) => setF({ ...f, region: v, district: "" })} options={REGIONS} testId="region" />
                <FS id="district" label="District" required value={f.district} onChange={(v) => setF({ ...f, district: v })} options={f.region ? DISTRICTS[f.region] || [] : []} testId="district" />
              </div>
              <div style={{ ...s.cardTitle, fontSize: 14, marginTop: 24, marginBottom: 16, color: c.priLt }}>Contact & Identification</div>
              <div style={s.formGrid}>
                <FI id="email" label="Email" type="email" value={f.email} onChange={(v) => setF({ ...f, email: v })} testId="email" />
                <FI id="phone" label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} placeholder="(555) 000-0000" testId="phone" />
                <FI id="insurance-number" label="Insurance Number" value={f.insuranceNo} onChange={(v) => setF({ ...f, insuranceNo: v })} placeholder="Auto-generated if empty" testId="insurance-number" />
                <FS id="identification-type" label="Identification Type" value={f.idType} onChange={(v) => setF({ ...f, idType: v })} options={ID_TYPES} testId="identification-type" />
                <FI id="identification-no" label="Identification No." value={f.idNo} onChange={(v) => setF({ ...f, idNo: v })} placeholder="e.g., 123-45-6789" testId="identification-no" />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShow(false)} style={s.btnOut} data-testid="btn-cancel-family" aria-label="Cancel">Cancel</button>
                <button type="submit" style={s.btnOk} data-testid="btn-save-family" id="btn-save-family" aria-label="Save Family">✓ Save Family</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLAIMS SUBMISSION PAGE
// ═══════════════════════════════════════════════════════════════
function ClaimsSubmitPage({ claims, setClaims, families }) {
  const [show, setShow] = useState(false);
  const [toast, setToast] = useState("");
  const [f, setF] = useState({ insuranceNo: "", facility: "", visitType: "", diagnosisCode: "", procedureCode: "", serviceDate: "", amount: "", providerNPI: "", notes: "" });
  const pName = (ins) => { const fam = families.find((x) => x.insuranceNo === ins); return fam ? `${fam.givenNames} ${fam.lastName}` : ""; };
  const submit = (e) => {
    e.preventDefault();
    const fac = FACILITIES.find((x) => x.id === f.facility);
    const nc = { id: `CLM-2026-${String(claims.length + 1).padStart(3, "0")}`, insuranceNo: f.insuranceNo, patientName: pName(f.insuranceNo), facility: fac ? fac.name : f.facility, facilityId: f.facility, visitType: f.visitType, diagnosisCode: f.diagnosisCode, procedureCode: f.procedureCode, serviceDate: f.serviceDate, amount: parseFloat(f.amount), status: "Entered", submittedDate: new Date().toISOString().split("T")[0], reviewedBy: "" };
    setClaims([...claims, nc]);
    setShow(false);
    setF({ insuranceNo: "", facility: "", visitType: "", diagnosisCode: "", procedureCode: "", serviceDate: "", amount: "", providerNPI: "", notes: "" });
    setToast(`Claim ${nc.id} submitted successfully!`);
  };
  return (
    <div data-testid="claims-submit-page" id="claims-submit-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button onClick={() => setShow(true)} style={s.btnPri} data-testid="btn-new-claim" id="btn-new-claim" aria-label="New Claim">+ New Claim</button>
      </div>
      <div style={s.card} data-testid="claims-list-card">
        <div style={s.cardTitle}>🏥 Claims Register ({claims.length})</div>
        <table style={s.table} data-testid="claims-table" aria-label="Claims Register">
          <thead><tr><th style={s.th} data-testid="th-claim-id">Claim ID</th><th style={s.th} data-testid="th-patient">Patient</th><th style={s.th} data-testid="th-facility">Facility</th><th style={s.th} data-testid="th-visit-type">Visit Type</th><th style={s.th} data-testid="th-diagnosis">Diagnosis</th><th style={s.th} data-testid="th-amount">Amount</th><th style={s.th} data-testid="th-service-date">Service Date</th><th style={s.th} data-testid="th-claim-status">Status</th></tr></thead>
          <tbody>{claims.map((x) => (
            <tr key={x.id} data-testid={`claim-row-${x.id}`}><td style={{ ...s.td, fontWeight: 600 }} data-testid={`claim-id-${x.id}`}>{x.id}</td><td style={s.td}>{x.patientName}</td><td style={s.td}>{x.facility}</td><td style={s.td}>{x.visitType}</td><td style={s.td}><code style={{ background: c.inBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{x.diagnosisCode}</code></td><td style={s.td}>${x.amount.toFixed(2)}</td><td style={s.td}>{x.serviceDate}</td><td style={s.td}><span style={s.badge(x.status)} data-testid={`claim-status-${x.id}`}>{x.status}</span></td></tr>
          ))}</tbody>
        </table>
      </div>
      <button onClick={() => setShow(true)} style={s.fab} data-testid="fab-new-claim" aria-label="New Claim" title="Submit New Claim">+</button>
      {show && (
        <div style={s.modal} data-testid="modal-new-claim" role="dialog" aria-label="Submit New Claim" aria-modal="true">
          <div style={s.modalC} data-testid="modal-content-new-claim">
            <div style={s.modalT}><span data-testid="modal-title-claim">🏥 Submit New Healthcare Claim</span><button onClick={() => setShow(false)} style={{ ...s.btnOut, ...s.btnSm }} data-testid="btn-close-claim-modal" aria-label="Close">✕</button></div>
            <form onSubmit={submit} data-testid="form-new-claim" id="form-new-claim">
              <div style={{ ...s.cardTitle, fontSize: 14, marginBottom: 16, color: c.priLt }}>Patient Information</div>
              <div style={s.formGrid}>
                <FS id="insurance-no" label="Insurance Number" required value={f.insuranceNo} onChange={(v) => setF({ ...f, insuranceNo: v })} options={families.map((x) => ({ code: x.insuranceNo, desc: `${x.givenNames} ${x.lastName}` }))} testId="insurance-no" />
                <div style={s.formGroup}><label style={s.label} data-testid="label-patient-name">Patient Name</label><input style={{ ...s.input, background: "#f0f0f0" }} value={pName(f.insuranceNo)} readOnly aria-label="Patient Name" data-testid="input-patient-name" id="patient-name" /></div>
                <FS id="facility" label="Health Facility" required value={f.facility} onChange={(v) => setF({ ...f, facility: v })} options={FACILITIES.map((x) => ({ code: x.id, desc: x.name }))} testId="facility" />
              </div>
              <div style={{ ...s.cardTitle, fontSize: 14, marginTop: 24, marginBottom: 16, color: c.priLt }}>Service Details</div>
              <div style={s.formGrid}>
                <FS id="visit-type" label="Visit Type" required value={f.visitType} onChange={(v) => setF({ ...f, visitType: v })} options={VISIT_TYPES} testId="visit-type" />
                <FS id="diagnosis-code" label="Diagnosis Code (ICD-10)" required value={f.diagnosisCode} onChange={(v) => setF({ ...f, diagnosisCode: v })} options={DIAGNOSIS_CODES} testId="diagnosis-code" />
                <FS id="procedure-code" label="Procedure Code (CPT)" required value={f.procedureCode} onChange={(v) => setF({ ...f, procedureCode: v })} options={PROCEDURE_CODES} testId="procedure-code" />
                <FI id="service-date" label="Service Date" type="date" required value={f.serviceDate} onChange={(v) => setF({ ...f, serviceDate: v })} testId="service-date" />
                <FI id="billing-amount" label="Billing Amount ($)" type="number" required value={f.amount} onChange={(v) => setF({ ...f, amount: v })} placeholder="0.00" testId="billing-amount" />
                <FI id="provider-npi" label="Provider NPI" value={f.providerNPI} onChange={(v) => setF({ ...f, providerNPI: v })} placeholder="10-digit NPI" testId="provider-npi" />
              </div>
              <div style={{ ...s.cardTitle, fontSize: 14, marginTop: 24, marginBottom: 16, color: c.priLt }}>Additional Notes</div>
              <div style={s.formGroup}>
                <label htmlFor="claim-notes" style={s.label} data-testid="label-claim-notes">Notes</label>
                <textarea id="claim-notes" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} placeholder="Additional notes..." aria-label="Notes" data-testid="textarea-claim-notes" style={{ ...s.input, minHeight: 80, resize: "vertical", fontFamily: "inherit" }} />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShow(false)} style={s.btnOut} data-testid="btn-cancel-claim" aria-label="Cancel">Cancel</button>
                <button type="submit" style={s.btnOk} data-testid="btn-submit-claim" id="btn-submit-claim" aria-label="Submit Claim">✓ Submit Claim</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLAIMS REVIEW PAGE
// ═══════════════════════════════════════════════════════════════
function ClaimsReviewPage({ claims, setClaims }) {
  const [toast, setToast] = useState("");
  const [sf, setSf] = useState("");
  const [df, setDf] = useState("");
  const [dt, setDt] = useState("");
  const [st, setSt] = useState("");
  const [sel, setSel] = useState(null);
  const filtered = claims.filter((x) => {
    if (sf && x.status !== sf) return false;
    if (df && x.serviceDate < df) return false;
    if (dt && x.serviceDate > dt) return false;
    if (st && !x.id.toLowerCase().includes(st.toLowerCase()) && !x.patientName.toLowerCase().includes(st.toLowerCase())) return false;
    return true;
  });
  const upd = (id, ns) => { setClaims(claims.map((x) => x.id === id ? { ...x, status: ns } : x)); setSel(null); setToast(`Claim ${id} status updated to ${ns}`); };
  return (
    <div data-testid="claims-review-page" id="claims-review-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div style={s.card} data-testid="review-filters-card">
        <div style={s.cardTitle}>🔍 Search & Filter Claims</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 16, alignItems: "flex-end" }}>
          <div style={s.formGroup}><label htmlFor="search-claims" style={s.label} data-testid="label-search-claims">Search</label><input id="search-claims" type="text" value={st} onChange={(e) => setSt(e.target.value)} placeholder="Claim ID or patient name..." aria-label="Search Claims" data-testid="input-search-claims" style={s.input} /></div>
          <FS id="filter-status" label="Status" value={sf} onChange={setSf} options={CLAIM_STATUSES} placeholder="All Statuses" testId="filter-status" />
          <div style={s.formGroup}><label htmlFor="filter-date-from" style={s.label} data-testid="label-filter-date-from">Date From</label><input id="filter-date-from" type="date" value={df} onChange={(e) => setDf(e.target.value)} aria-label="Date From" data-testid="input-filter-date-from" style={s.input} /></div>
          <div style={s.formGroup}><label htmlFor="filter-date-to" style={s.label} data-testid="label-filter-date-to">Date To</label><input id="filter-date-to" type="date" value={dt} onChange={(e) => setDt(e.target.value)} aria-label="Date To" data-testid="input-filter-date-to" style={s.input} /></div>
          <button onClick={() => { setSf(""); setDf(""); setDt(""); setSt(""); }} style={s.btnOut} data-testid="btn-clear-filters" aria-label="Clear Filters">Clear</button>
        </div>
      </div>
      <div style={s.card} data-testid="review-results-card">
        <div style={s.cardTitle}>📋 Claims for Review ({filtered.length} results)</div>
        <table style={s.table} data-testid="review-table" aria-label="Claims Review">
          <thead><tr><th style={s.th}>Claim ID</th><th style={s.th}>Patient</th><th style={s.th}>Facility</th><th style={s.th}>Diagnosis</th><th style={s.th}>Amount</th><th style={s.th}>Service Date</th><th style={s.th}>Status</th><th style={s.th}>Actions</th></tr></thead>
          <tbody>{filtered.map((x) => (
            <tr key={x.id} data-testid={`review-row-${x.id}`}><td style={{ ...s.td, fontWeight: 600 }} data-testid={`review-id-${x.id}`}>{x.id}</td><td style={s.td}>{x.patientName}</td><td style={s.td}>{x.facility}</td><td style={s.td}><code style={{ background: c.inBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{x.diagnosisCode}</code></td><td style={s.td}>${x.amount.toFixed(2)}</td><td style={s.td}>{x.serviceDate}</td><td style={s.td}><span style={s.badge(x.status)} data-testid={`review-status-${x.id}`}>{x.status}</span></td><td style={s.td}><button onClick={() => setSel(x)} style={{ ...s.btnOut, ...s.btnSm }} data-testid={`btn-review-${x.id}`} aria-label={`Review claim ${x.id}`}>Review</button></td></tr>
          ))}</tbody>
        </table>
      </div>
      {sel && (
        <div style={s.modal} data-testid="modal-review-claim" role="dialog" aria-label="Review Claim" aria-modal="true">
          <div style={{ ...s.modalC, width: 600 }} data-testid="modal-content-review">
            <div style={s.modalT}><span data-testid="modal-review-title">Claim Review: {sel.id}</span><button onClick={() => setSel(null)} style={{ ...s.btnOut, ...s.btnSm }} data-testid="btn-close-review" aria-label="Close Review">✕</button></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div><span style={{ ...s.label, display: "block" }}>Patient</span><strong data-testid="review-detail-patient">{sel.patientName}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Insurance No.</span><strong data-testid="review-detail-insurance">{sel.insuranceNo}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Facility</span><strong data-testid="review-detail-facility">{sel.facility}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Visit Type</span><strong data-testid="review-detail-visit">{sel.visitType}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Diagnosis Code</span><strong data-testid="review-detail-diagnosis">{sel.diagnosisCode}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Procedure Code</span><strong data-testid="review-detail-procedure">{sel.procedureCode}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Service Date</span><strong data-testid="review-detail-date">{sel.serviceDate}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Billing Amount</span><strong data-testid="review-detail-amount">${sel.amount.toFixed(2)}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Current Status</span><span style={s.badge(sel.status)} data-testid="review-detail-status">{sel.status}</span></div>
              <div><span style={{ ...s.label, display: "block" }}>Submitted Date</span><strong data-testid="review-detail-submitted">{sel.submittedDate}</strong></div>
            </div>
            <div style={{ ...s.cardTitle, fontSize: 14, color: c.priLt }}>Update Status</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              {CLAIM_STATUSES.filter((x) => x !== sel.status).map((x) => (
                <button key={x} onClick={() => upd(sel.id, x)} style={x === "Rejected" ? s.btnErr : s.btnPri} data-testid={`btn-status-${x.toLowerCase()}`} aria-label={`Set status to ${x}`}>{x === "Rejected" ? "✕ " : "→ "}{x}</button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BATCH PROCESSING PAGE
// ═══════════════════════════════════════════════════════════════
function BatchPage({ batches, setBatches, claims }) {
  const [show, setShow] = useState(false);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState("");
  const [f, setF] = useState({ name: "", type: "Payment", facility: "", dateFrom: "", dateTo: "" });
  const [running, setRunning] = useState(null);
  const [prog, setProg] = useState(0);

  const eligible = claims.filter((x) => {
    if (x.status !== "Valuated" && x.status !== "Processed") return false;
    if (f.facility && x.facilityId !== f.facility) return false;
    if (f.dateFrom && x.serviceDate < f.dateFrom) return false;
    if (f.dateTo && x.serviceDate > f.dateTo) return false;
    return true;
  });

  const create = (e) => {
    e.preventDefault();
    const fac = f.facility ? FACILITIES.find((x) => x.id === f.facility) : null;
    const nb = { id: `BATCH-2026-${String(batches.length + 1).padStart(3, "0")}`, name: f.name, type: f.type, status: "Created", facility: fac ? fac.name : "All Facilities", dateFrom: f.dateFrom, dateTo: f.dateTo, claimCount: eligible.length, totalAmount: eligible.reduce((a, x) => a + x.amount, 0), createdAt: new Date().toISOString().split("T")[0], completedAt: "", processedCount: 0, failedCount: 0, runDuration: "" };
    setBatches([...batches, nb]);
    setShow(false);
    setF({ name: "", type: "Payment", facility: "", dateFrom: "", dateTo: "" });
    setToast(`Batch ${nb.id} created with ${nb.claimCount} claims`);
  };

  const run = (b) => {
    setRunning(b.id);
    setProg(0);
    setBatches(batches.map((x) => x.id === b.id ? { ...x, status: "Processing" } : x));
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        setBatches((prev) => prev.map((x) => x.id === b.id ? { ...x, status: "Completed", completedAt: new Date().toISOString().split("T")[0], processedCount: x.claimCount, runDuration: `${Math.floor(Math.random() * 3) + 1}m ${Math.floor(Math.random() * 50) + 10}s` } : x));
        setRunning(null);
        setToast(`Batch ${b.id} completed successfully!`);
      }
      setProg(Math.min(p, 100));
    }, 600);
  };

  return (
    <div data-testid="batch-processing-page" id="batch-processing-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={s.stat} data-testid="stat-total-batches"><div style={s.statLbl}>Total Batches</div><div style={{ ...s.statVal, fontSize: 28, color: c.pri }} data-testid="stat-total-batches-value">{batches.length}</div></div>
        <div style={s.stat} data-testid="stat-completed-batches"><div style={s.statLbl}>Completed</div><div style={{ ...s.statVal, fontSize: 28, color: c.ok }} data-testid="stat-completed-batches-value">{batches.filter((x) => x.status === "Completed").length}</div></div>
        <div style={s.stat} data-testid="stat-processing-batches"><div style={s.statLbl}>Processing</div><div style={{ ...s.statVal, fontSize: 28, color: c.info }} data-testid="stat-processing-batches-value">{batches.filter((x) => x.status === "Processing").length}</div></div>
        <div style={s.stat} data-testid="stat-total-batch-amount"><div style={s.statLbl}>Total Processed</div><div style={{ ...s.statVal, fontSize: 28, color: c.ok }} data-testid="stat-total-batch-amount-value">${batches.filter((x) => x.status === "Completed").reduce((a, x) => a + x.totalAmount, 0).toLocaleString()}</div></div>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button onClick={() => setShow(true)} style={s.btnPri} data-testid="btn-create-batch" id="btn-create-batch" aria-label="Create New Batch">+ Create Batch</button>
      </div>

      {running && (
        <div style={{ ...s.card, borderColor: c.info, borderWidth: 2 }} data-testid="batch-progress-card">
          <div style={s.cardTitle}>⚙️ Processing: {running}</div>
          <div style={{ marginBottom: 8, fontSize: 14, color: c.mut }} data-testid="batch-progress-label">Progress: {Math.round(prog)}%</div>
          <div style={s.progBar} data-testid="batch-progress-bar" role="progressbar" aria-valuenow={Math.round(prog)} aria-valuemin="0" aria-valuemax="100" aria-label="Batch processing progress">
            <div style={s.progFill(prog, c.info)} data-testid="batch-progress-fill" />
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: c.mut }} data-testid="batch-progress-status">
            {prog < 30 ? "Validating claims..." : prog < 60 ? "Processing payments..." : prog < 90 ? "Generating reports..." : "Finalizing..."}
          </div>
        </div>
      )}

      <div style={s.card} data-testid="batches-list-card">
        <div style={s.cardTitle}>📦 Batch Runs ({batches.length})</div>
        <table style={s.table} data-testid="batches-table" aria-label="Batch Processing Runs">
          <thead><tr><th style={s.th} data-testid="th-batch-id">Batch ID</th><th style={s.th} data-testid="th-batch-name">Name</th><th style={s.th} data-testid="th-batch-type">Type</th><th style={s.th} data-testid="th-batch-facility">Facility</th><th style={s.th} data-testid="th-batch-claims">Claims</th><th style={s.th} data-testid="th-batch-amount">Amount</th><th style={s.th} data-testid="th-batch-status">Status</th><th style={s.th} data-testid="th-batch-actions">Actions</th></tr></thead>
          <tbody>{batches.map((b) => (
            <tr key={b.id} data-testid={`batch-row-${b.id}`}>
              <td style={{ ...s.td, fontWeight: 600 }} data-testid={`batch-id-${b.id}`}>{b.id}</td>
              <td style={s.td} data-testid={`batch-name-${b.id}`}>{b.name}</td>
              <td style={s.td} data-testid={`batch-type-${b.id}`}>{b.type}</td>
              <td style={s.td}>{b.facility}</td>
              <td style={s.td} data-testid={`batch-claims-${b.id}`}>{b.claimCount}</td>
              <td style={s.td} data-testid={`batch-amount-${b.id}`}>${b.totalAmount.toFixed(2)}</td>
              <td style={s.td}><span style={s.badge(b.status)} data-testid={`batch-status-${b.id}`}>{b.status}</span></td>
              <td style={{ ...s.td, display: "flex", gap: 6 }}>
                {b.status === "Created" && <button onClick={() => run(b)} style={{ ...s.btnOk, ...s.btnSm }} data-testid={`btn-run-batch-${b.id}`} aria-label={`Run batch ${b.id}`}>▶ Run</button>}
                <button onClick={() => setDetail(b)} style={{ ...s.btnOut, ...s.btnSm }} data-testid={`btn-detail-batch-${b.id}`} aria-label={`View details for batch ${b.id}`}>Details</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {show && (
        <div style={s.modal} data-testid="modal-create-batch" role="dialog" aria-label="Create New Batch" aria-modal="true">
          <div style={{ ...s.modalC, width: 700 }} data-testid="modal-content-create-batch">
            <div style={s.modalT}><span data-testid="modal-title-batch">📦 Create New Batch Run</span><button onClick={() => setShow(false)} style={{ ...s.btnOut, ...s.btnSm }} data-testid="btn-close-batch-modal" aria-label="Close">✕</button></div>
            <form onSubmit={create} data-testid="form-create-batch" id="form-create-batch">
              <div style={{ ...s.cardTitle, fontSize: 14, marginBottom: 16, color: c.priLt }}>Batch Configuration</div>
              <div style={s.formGrid}>
                <FI id="batch-name" label="Batch Name" required value={f.name} onChange={(v) => setF({ ...f, name: v })} placeholder="e.g., February Payment Run" testId="batch-name" />
                <FS id="batch-type" label="Batch Type" required value={f.type} onChange={(v) => setF({ ...f, type: v })} options={BATCH_TYPES} testId="batch-type" />
                <FS id="batch-facility" label="Health Facility" value={f.facility} onChange={(v) => setF({ ...f, facility: v })} options={FACILITIES.map((x) => ({ code: x.id, desc: x.name }))} placeholder="All Facilities" testId="batch-facility" />
              </div>
              <div style={{ ...s.cardTitle, fontSize: 14, marginTop: 24, marginBottom: 16, color: c.priLt }}>Date Range</div>
              <div style={s.formGrid2}>
                <FI id="batch-date-from" label="Date From" type="date" required value={f.dateFrom} onChange={(v) => setF({ ...f, dateFrom: v })} testId="batch-date-from" />
                <FI id="batch-date-to" label="Date To" type="date" required value={f.dateTo} onChange={(v) => setF({ ...f, dateTo: v })} testId="batch-date-to" />
              </div>
              <div style={{ marginTop: 24, padding: 16, background: c.inBg, borderRadius: 10, border: `1px solid ${c.bdr}` }} data-testid="eligible-claims-preview">
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: c.txt }} data-testid="eligible-claims-title">Eligible Claims Preview</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                  <div><span style={s.label}>Claims Found</span><div style={{ fontSize: 24, fontWeight: 800, color: c.pri }} data-testid="eligible-claims-count">{eligible.length}</div></div>
                  <div><span style={s.label}>Total Amount</span><div style={{ fontSize: 24, fontWeight: 800, color: c.ok }} data-testid="eligible-claims-amount">${eligible.reduce((a, x) => a + x.amount, 0).toFixed(2)}</div></div>
                  <div><span style={s.label}>Facilities</span><div style={{ fontSize: 24, fontWeight: 800, color: c.acc }} data-testid="eligible-claims-facilities">{[...new Set(eligible.map((x) => x.facilityId))].length}</div></div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShow(false)} style={s.btnOut} data-testid="btn-cancel-batch" aria-label="Cancel">Cancel</button>
                <button type="submit" style={s.btnOk} data-testid="btn-save-batch" id="btn-save-batch" aria-label="Create Batch" disabled={eligible.length === 0}>✓ Create Batch ({eligible.length} claims)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detail && (
        <div style={s.modal} data-testid="modal-batch-detail" role="dialog" aria-label="Batch Details" aria-modal="true">
          <div style={{ ...s.modalC, width: 650 }} data-testid="modal-content-batch-detail">
            <div style={s.modalT}><span data-testid="modal-detail-title">📦 Batch Details: {detail.id}</span><button onClick={() => setDetail(null)} style={{ ...s.btnOut, ...s.btnSm }} data-testid="btn-close-batch-detail" aria-label="Close Details">✕</button></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div><span style={{ ...s.label, display: "block" }}>Batch Name</span><strong data-testid="detail-batch-name">{detail.name}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Type</span><strong data-testid="detail-batch-type">{detail.type}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Facility</span><strong data-testid="detail-batch-facility">{detail.facility}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Status</span><span style={s.badge(detail.status)} data-testid="detail-batch-status">{detail.status}</span></div>
              <div><span style={{ ...s.label, display: "block" }}>Date Range</span><strong data-testid="detail-batch-dates">{detail.dateFrom} to {detail.dateTo}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Claims Count</span><strong data-testid="detail-batch-claims">{detail.claimCount}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Total Amount</span><strong data-testid="detail-batch-amount">${detail.totalAmount.toFixed(2)}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Run Duration</span><strong data-testid="detail-batch-duration">{detail.runDuration || "N/A"}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Processed</span><strong data-testid="detail-batch-processed" style={{ color: c.ok }}>{detail.processedCount}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Failed</span><strong data-testid="detail-batch-failed" style={{ color: detail.failedCount > 0 ? c.err : c.txt }}>{detail.failedCount}</strong></div>
            </div>
            <div style={{ ...s.cardTitle, fontSize: 14, color: c.priLt }}>Processing Timeline</div>
            <div style={s.timeline} data-testid="batch-timeline">
              <div style={s.tlItem(true)} data-testid="timeline-created"><div style={s.tlDot(c.acc)} /><div style={{ fontSize: 12, color: c.mut }}>Created</div><div style={{ fontWeight: 600 }}>{detail.createdAt}</div></div>
              {detail.status !== "Created" && <div style={s.tlItem(true)} data-testid="timeline-processing"><div style={s.tlDot(c.info)} /><div style={{ fontSize: 12, color: c.mut }}>Processing Started</div><div style={{ fontWeight: 600 }}>{detail.createdAt}</div></div>}
              {detail.status === "Completed" && <div style={s.tlItem(true)} data-testid="timeline-completed"><div style={s.tlDot(c.ok)} /><div style={{ fontSize: 12, color: c.mut }}>Completed</div><div style={{ fontWeight: 600 }}>{detail.completedAt} ({detail.runDuration})</div></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EDI TRANSACTIONS PAGE
// ═══════════════════════════════════════════════════════════════
function EDIPage({ edi, setEdi }) {
  const [toast, setToast] = useState("");
  const [tf, setTf] = useState("");
  const [sf, setSf] = useState("");
  const [df, setDf] = useState("");
  const [sel, setSel] = useState(null);

  const filtered = edi.filter((x) => {
    if (tf && x.type !== tf) return false;
    if (sf && x.status !== sf) return false;
    if (df && x.direction !== df) return false;
    return true;
  });

  const retransmit = (e) => {
    setEdi(edi.map((x) => x.id === e.id ? { ...x, status: "Transmitted", transmittedAt: new Date().toISOString().split("T")[0], errorCount: 0 } : x));
    setSel(null);
    setToast(`${e.id} re-transmitted successfully`);
  };

  return (
    <div data-testid="edi-transactions-page" id="edi-transactions-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        <div style={s.stat} data-testid="stat-edi-total"><div style={s.statLbl}>Total Transactions</div><div style={{ ...s.statVal, fontSize: 28, color: c.pri }} data-testid="stat-edi-total-value">{edi.length}</div></div>
        <div style={s.stat} data-testid="stat-edi-837"><div style={s.statLbl}>EDI 837 (Claims)</div><div style={{ ...s.statVal, fontSize: 28, color: c.acc }} data-testid="stat-edi-837-value">{edi.filter((x) => x.type === "EDI 837").length}</div></div>
        <div style={s.stat} data-testid="stat-edi-834"><div style={s.statLbl}>EDI 834 (Enrollment)</div><div style={{ ...s.statVal, fontSize: 28, color: c.priLt }} data-testid="stat-edi-834-value">{edi.filter((x) => x.type === "EDI 834").length}</div></div>
        <div style={s.stat} data-testid="stat-edi-835"><div style={s.statLbl}>EDI 835 (Remittance)</div><div style={{ ...s.statVal, fontSize: 28, color: c.ok }} data-testid="stat-edi-835-value">{edi.filter((x) => x.type === "EDI 835").length}</div></div>
        <div style={s.stat} data-testid="stat-edi-rejected"><div style={s.statLbl}>Rejected / Errors</div><div style={{ ...s.statVal, fontSize: 28, color: c.err }} data-testid="stat-edi-rejected-value">{edi.filter((x) => x.status === "Rejected" || x.status === "Error").length}</div></div>
      </div>

      <div style={s.card} data-testid="edi-filters-card">
        <div style={s.cardTitle}>🔍 Filter EDI Transactions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 16, alignItems: "flex-end" }}>
          <FS id="filter-edi-type" label="Transaction Type" value={tf} onChange={setTf} options={EDI_TYPES} placeholder="All Types" testId="filter-edi-type" />
          <FS id="filter-edi-status" label="Status" value={sf} onChange={setSf} options={EDI_STATUSES} placeholder="All Statuses" testId="filter-edi-status" />
          <FS id="filter-edi-direction" label="Direction" value={df} onChange={setDf} options={["Inbound", "Outbound"]} placeholder="All Directions" testId="filter-edi-direction" />
          <button onClick={() => { setTf(""); setSf(""); setDf(""); }} style={s.btnOut} data-testid="btn-clear-edi-filters" aria-label="Clear EDI Filters">Clear</button>
        </div>
      </div>

      <div style={s.card} data-testid="edi-list-card">
        <div style={s.cardTitle}>📡 EDI Transaction Log ({filtered.length})</div>
        <table style={s.table} data-testid="edi-table" aria-label="EDI Transactions">
          <thead><tr><th style={s.th} data-testid="th-edi-id">Transaction ID</th><th style={s.th} data-testid="th-edi-type">Type</th><th style={s.th} data-testid="th-edi-direction">Direction</th><th style={s.th} data-testid="th-edi-sender">Sender</th><th style={s.th} data-testid="th-edi-receiver">Receiver</th><th style={s.th} data-testid="th-edi-segments">Segments</th><th style={s.th} data-testid="th-edi-errors">Errors</th><th style={s.th} data-testid="th-edi-status">Status</th><th style={s.th} data-testid="th-edi-actions">Actions</th></tr></thead>
          <tbody>{filtered.map((e) => (
            <tr key={e.id} data-testid={`edi-row-${e.id}`}>
              <td style={{ ...s.td, fontWeight: 600 }} data-testid={`edi-id-${e.id}`}>{e.id}</td>
              <td style={s.td} data-testid={`edi-type-${e.id}`}>{e.type}</td>
              <td style={s.td}><span style={s.badge(e.direction)} data-testid={`edi-direction-${e.id}`}>{e.direction}</span></td>
              <td style={s.td} data-testid={`edi-sender-${e.id}`}>{e.senderId}</td>
              <td style={s.td} data-testid={`edi-receiver-${e.id}`}>{e.receiverId}</td>
              <td style={s.td} data-testid={`edi-segments-${e.id}`}>{e.segments}</td>
              <td style={s.td} data-testid={`edi-errors-${e.id}`}><span style={{ color: e.errorCount > 0 ? c.err : c.ok, fontWeight: 600 }}>{e.errorCount}</span></td>
              <td style={s.td}><span style={s.badge(e.status)} data-testid={`edi-status-${e.id}`}>{e.status}</span></td>
              <td style={s.td}><button onClick={() => setSel(e)} style={{ ...s.btnInfo, ...s.btnSm }} data-testid={`btn-view-edi-${e.id}`} aria-label={`View EDI ${e.id}`}>View</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {sel && (
        <div style={s.modal} data-testid="modal-edi-detail" role="dialog" aria-label="EDI Transaction Details" aria-modal="true">
          <div style={{ ...s.modalC, width: 750 }} data-testid="modal-content-edi-detail">
            <div style={s.modalT}><span data-testid="modal-edi-title">📡 {sel.type} Transaction: {sel.id}</span><button onClick={() => setSel(null)} style={{ ...s.btnOut, ...s.btnSm }} data-testid="btn-close-edi-detail" aria-label="Close EDI Details">✕</button></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div><span style={{ ...s.label, display: "block" }}>Transaction Type</span><strong data-testid="edi-detail-type">{sel.type}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Direction</span><span style={s.badge(sel.direction)} data-testid="edi-detail-direction">{sel.direction}</span></div>
              <div><span style={{ ...s.label, display: "block" }}>Status</span><span style={s.badge(sel.status)} data-testid="edi-detail-status">{sel.status}</span></div>
              <div><span style={{ ...s.label, display: "block" }}>Sender ID</span><strong data-testid="edi-detail-sender">{sel.senderId}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Receiver ID</span><strong data-testid="edi-detail-receiver">{sel.receiverId}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Transaction Set</span><strong data-testid="edi-detail-transaction">{sel.transactionId}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Segments</span><strong data-testid="edi-detail-segments">{sel.segments}</strong></div>
              <div><span style={{ ...s.label, display: "block" }}>Errors</span><strong style={{ color: sel.errorCount > 0 ? c.err : c.ok }} data-testid="edi-detail-errors">{sel.errorCount}</strong></div>
              {sel.batchId && <div><span style={{ ...s.label, display: "block" }}>Linked Batch</span><strong data-testid="edi-detail-batch">{sel.batchId}</strong></div>}
              {sel.claimCount > 0 && <div><span style={{ ...s.label, display: "block" }}>Claims</span><strong data-testid="edi-detail-claims">{sel.claimCount}</strong></div>}
              {sel.totalAmount > 0 && <div><span style={{ ...s.label, display: "block" }}>Total Amount</span><strong data-testid="edi-detail-amount">${sel.totalAmount.toFixed(2)}</strong></div>}
            </div>
            <div style={{ ...s.cardTitle, fontSize: 14, color: c.priLt }}>EDI Segment Data</div>
            <div style={s.code} data-testid="edi-segment-viewer" aria-label="EDI Segment Data">
              <div data-testid="edi-isa-segment"><span style={s.segLbl}>ISA</span> <span style={s.segVal}>{sel.isa}</span></div>
              <div data-testid="edi-gs-segment"><span style={s.segLbl}>GS </span> <span style={s.segVal}>{sel.gs}</span></div>
              <div data-testid="edi-st-segment"><span style={s.segLbl}>ST </span> <span style={s.segVal}>{sel.st}</span></div>
              <div style={{ color: "#64748B", marginTop: 8 }}>... additional segments ({sel.segments - 3} more) ...</div>
              <div data-testid="edi-se-segment"><span style={s.segLbl}>SE </span> <span style={s.segVal}>SE*{sel.segments}*{sel.transactionId.split("*")[1]}~</span></div>
              <div data-testid="edi-ge-segment"><span style={s.segLbl}>GE </span> <span style={s.segVal}>GE*1*{sel.gs.split("*")[6]}~</span></div>
              <div data-testid="edi-iea-segment"><span style={s.segLbl}>IEA</span> <span style={s.segVal}>IEA*1*{sel.isa.split("*")[13]}~</span></div>
            </div>
            <div style={{ ...s.cardTitle, fontSize: 14, marginTop: 24, color: c.priLt }}>Transaction Timeline</div>
            <div style={s.timeline} data-testid="edi-timeline">
              <div style={s.tlItem(true)} data-testid="edi-timeline-created"><div style={s.tlDot(c.acc)} /><div style={{ fontSize: 12, color: c.mut }}>Created</div><div style={{ fontWeight: 600 }}>{sel.createdAt}</div></div>
              {sel.transmittedAt && <div style={s.tlItem(true)} data-testid="edi-timeline-transmitted"><div style={s.tlDot(c.priLt)} /><div style={{ fontSize: 12, color: c.mut }}>Transmitted</div><div style={{ fontWeight: 600 }}>{sel.transmittedAt}</div></div>}
              {sel.acknowledgedAt && <div style={s.tlItem(true)} data-testid="edi-timeline-acknowledged"><div style={s.tlDot(sel.status === "Rejected" ? c.err : c.ok)} /><div style={{ fontSize: 12, color: c.mut }}>{sel.status === "Rejected" ? "Rejected" : "Acknowledged"}</div><div style={{ fontWeight: 600 }}>{sel.acknowledgedAt}</div></div>}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
              {sel.status === "Rejected" && <button onClick={() => retransmit(sel)} style={s.btnWarn} data-testid="btn-retransmit-edi" aria-label="Retransmit EDI">🔄 Retransmit</button>}
              <button onClick={() => setSel(null)} style={s.btnOut} data-testid="btn-close-edi-modal" aria-label="Close">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [families, setFamilies] = useState([...SAMPLE_FAMILIES]);
  const [claims, setClaims] = useState([...SAMPLE_CLAIMS]);
  const [batches, setBatches] = useState([...SAMPLE_BATCHES]);
  const [edi, setEdi] = useState([...SAMPLE_EDI]);

  if (!user) return <LoginPage onLogin={(u) => { setUser(u); setPage("dashboard"); }} />;

  const pages = {
    dashboard: { title: "Dashboard", icon: "📊", bc: "Home > Dashboard" },
    enrollment: { title: "Families / Groups", icon: "👨‍👩‍👧‍👦", bc: "Insurees > Families / Groups" },
    "claims-submit": { title: "Health Facility Claims", icon: "🏥", bc: "Claims > Health Facility Claims" },
    "claims-review": { title: "Claims Review", icon: "📋", bc: "Claims > Review" },
    "batch-processing": { title: "Batch Processing", icon: "📦", bc: "Claims > Batch Processing" },
    "edi-transactions": { title: "EDI Transactions", icon: "📡", bc: "Claims > EDI Transactions" },
  };
  const cp = pages[page] || pages.dashboard;

  return (
    <div style={s.app} data-testid="app-container">
      <div style={s.sidebar} data-testid="sidebar" id="sidebar" role="navigation" aria-label="Main Navigation">
        <div style={s.sidebarLogo} data-testid="sidebar-logo">
          <div style={s.logoIcon}>⚕</div>
          <div><div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" }}>OpenIMIS</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Claims Management</div></div>
        </div>
        <nav style={s.sidebarNav} data-testid="sidebar-nav">
          <div style={s.navSec}>Main</div>
          <div style={s.navItem(page === "dashboard")} onClick={() => setPage("dashboard")} data-testid="nav-dashboard" id="nav-dashboard" role="button" aria-label="Dashboard" aria-current={page === "dashboard" ? "page" : undefined}><span style={s.navIcon}>📊</span> Dashboard</div>
          <div style={s.navSec}>Insurees & Policies</div>
          <div style={s.navItem(page === "enrollment")} onClick={() => setPage("enrollment")} data-testid="nav-families-groups" id="nav-families-groups" role="button" aria-label="Families / Groups" aria-current={page === "enrollment" ? "page" : undefined}><span style={s.navIcon}>👨‍👩‍👧‍👦</span> Families / Groups</div>
          <div style={s.navSec}>Claims</div>
          <div style={s.navItem(page === "claims-submit")} onClick={() => setPage("claims-submit")} data-testid="nav-health-facility-claims" id="nav-health-facility-claims" role="button" aria-label="Health Facility Claims" aria-current={page === "claims-submit" ? "page" : undefined}><span style={s.navIcon}>🏥</span> Health Facility Claims</div>
          <div style={s.navItem(page === "claims-review")} onClick={() => setPage("claims-review")} data-testid="nav-claims-review" id="nav-claims-review" role="button" aria-label="Claims Review" aria-current={page === "claims-review" ? "page" : undefined}><span style={s.navIcon}>📋</span> Claims Review</div>
          <div style={s.navSec}>Batch & EDI</div>
          <div style={s.navItem(page === "batch-processing")} onClick={() => setPage("batch-processing")} data-testid="nav-batch-processing" id="nav-batch-processing" role="button" aria-label="Batch Processing" aria-current={page === "batch-processing" ? "page" : undefined}><span style={s.navIcon}>📦</span> Batch Processing</div>
          <div style={s.navItem(page === "edi-transactions")} onClick={() => setPage("edi-transactions")} data-testid="nav-edi-transactions" id="nav-edi-transactions" role="button" aria-label="EDI Transactions" aria-current={page === "edi-transactions" ? "page" : undefined}><span style={s.navIcon}>📡</span> EDI Transactions</div>
        </nav>
        <div style={s.sidebarUser} data-testid="user-menu-toggle" id="user-menu-toggle" aria-label="User Menu">
          <div style={s.userAvatar} data-testid="user-avatar">{user.name.charAt(0)}</div>
          <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }} data-testid="user-name">{user.name}</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} data-testid="user-role">{user.role}</div></div>
          <button onClick={() => setUser(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18, padding: 4 }} data-testid="btn-logout" id="btn-logout" aria-label="Logout" title="Logout">⏻</button>
        </div>
      </div>

      <div style={s.main} data-testid="main-content">
        <div style={s.header} data-testid="page-header">
          <div><div style={{ fontSize: 22, fontWeight: 700, color: c.txt, letterSpacing: "-0.3px" }} data-testid="page-title">{cp.icon} {cp.title}</div><div style={{ fontSize: 13, color: c.mut, marginTop: 2 }} data-testid="page-breadcrumb">{cp.bc}</div></div>
          <span style={{ fontSize: 13, color: c.mut }} data-testid="header-user">Logged in as <strong>{user.username}</strong></span>
        </div>
        <div style={s.content} data-testid="page-content">
          {page === "dashboard" && <DashboardPage claims={claims} families={families} batches={batches} edi={edi} />}
          {page === "enrollment" && <EnrollmentPage families={families} setFamilies={setFamilies} />}
          {page === "claims-submit" && <ClaimsSubmitPage claims={claims} setClaims={setClaims} families={families} />}
          {page === "claims-review" && <ClaimsReviewPage claims={claims} setClaims={setClaims} />}
          {page === "batch-processing" && <BatchPage batches={batches} setBatches={setBatches} claims={claims} />}
          {page === "edi-transactions" && <EDIPage edi={edi} setEdi={setEdi} />}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// OPENIMIS CLAIMS MANAGEMENT SYSTEM - MVP
// Every element has data-testid, aria-label, and id attributes
// Built for TestARQ demo - perfect automation compatibility
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

// Sample data
const SAMPLE_FAMILIES = [
  { id: "FAM-001", lastName: "Anderson", givenNames: "Robert James", dob: "1978-03-15", gender: "Male", insuranceNo: "INS-100001", region: "Northeast", district: "Manhattan", email: "r.anderson@email.com", phone: "(555) 101-2001", idType: "SSN", idNo: "123-45-6789", status: "Active", members: 3 },
  { id: "FAM-002", lastName: "Williams", givenNames: "Maria Elena", dob: "1985-07-22", gender: "Female", insuranceNo: "INS-100002", region: "Southeast", district: "Miami-Dade", email: "m.williams@email.com", phone: "(555) 202-3002", idType: "SSN", idNo: "234-56-7890", status: "Active", members: 4 },
  { id: "FAM-003", lastName: "Thompson", givenNames: "David Lee", dob: "1990-11-08", gender: "Male", insuranceNo: "INS-100003", region: "Midwest", district: "Cook", email: "d.thompson@email.com", phone: "(555) 303-4003", idType: "National ID", idNo: "NID-778899", status: "Active", members: 2 },
];

const SAMPLE_CLAIMS = [
  { id: "CLM-2026-001", insuranceNo: "INS-100001", patientName: "Robert Anderson", facility: "Memorial General Hospital", visitType: "Outpatient", diagnosisCode: "Z00.00", procedureCode: "99213", serviceDate: "2026-01-15", amount: 150.00, status: "Valuated", submittedDate: "2026-01-16", reviewedBy: "Dr. Emily Roberts" },
  { id: "CLM-2026-002", insuranceNo: "INS-100002", patientName: "Maria Williams", facility: "Riverside Community Clinic", visitType: "Emergency", diagnosisCode: "J06.9", procedureCode: "99214", serviceDate: "2026-01-20", amount: 320.00, status: "Processed", submittedDate: "2026-01-21", reviewedBy: "" },
  { id: "CLM-2026-003", insuranceNo: "INS-100003", patientName: "David Thompson", facility: "Pacific Health Center", visitType: "Preventive", diagnosisCode: "E11.9", procedureCode: "80053", serviceDate: "2026-02-01", amount: 85.00, status: "Entered", submittedDate: "2026-02-02", reviewedBy: "" },
  { id: "CLM-2026-004", insuranceNo: "INS-100001", patientName: "Robert Anderson", facility: "Sunrise Medical Group", visitType: "Telehealth", diagnosisCode: "I10", procedureCode: "99213", serviceDate: "2026-02-05", amount: 95.00, status: "Checked", submittedDate: "2026-02-05", reviewedBy: "" },
];

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const colors = {
  primary: "#0F4C75",
  primaryDark: "#0A3555",
  primaryLight: "#1B6CA8",
  accent: "#00B4D8",
  accentDark: "#0096B7",
  success: "#059669",
  warning: "#D97706",
  danger: "#DC2626",
  bg: "#F0F4F8",
  card: "#FFFFFF",
  sidebar: "#0A2540",
  sidebarHover: "#0F3460",
  text: "#1E293B",
  textMuted: "#64748B",
  border: "#E2E8F0",
  inputBg: "#F8FAFC",
  inputBorder: "#CBD5E1",
  inputFocus: "#0F4C75",
};

const styles = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", color: colors.text, background: colors.bg },
  sidebar: { width: 260, background: `linear-gradient(180deg, ${colors.sidebar} 0%, #0D1B2A 100%)`, color: "#fff", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, boxShadow: "4px 0 24px rgba(0,0,0,0.15)" },
  sidebarLogo: { padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.primaryLight} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff" },
  logoText: { fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" },
  logoSub: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  sidebarNav: { flex: 1, padding: "16px 12px", overflowY: "auto" },
  navSection: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.35)", padding: "16px 12px 8px", marginTop: 8 },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 400, background: active ? "rgba(0,180,216,0.15)" : "transparent", color: active ? colors.accent : "rgba(255,255,255,0.7)", transition: "all 0.2s", marginBottom: 2, border: active ? `1px solid rgba(0,180,216,0.2)` : "1px solid transparent" }),
  navIcon: { fontSize: 18, width: 24, textAlign: "center" },
  sidebarUser: { padding: "16px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 },
  userAvatar: { width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.accent}, ${colors.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 },
  main: { flex: 1, marginLeft: 260, display: "flex", flexDirection: "column" },
  header: { background: "#fff", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${colors.border}`, position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  headerTitle: { fontSize: 22, fontWeight: 700, color: colors.text, letterSpacing: "-0.3px" },
  headerBreadcrumb: { fontSize: 13, color: colors.textMuted, marginTop: 2 },
  content: { padding: 32, flex: 1 },
  card: { background: "#fff", borderRadius: 12, padding: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)", border: `1px solid ${colors.border}` },
  cardTitle: { fontSize: 17, fontWeight: 700, marginBottom: 20, color: colors.text, display: "flex", alignItems: "center", gap: 10 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 600, color: colors.textMuted, display: "flex", alignItems: "center", gap: 4 },
  required: { color: colors.danger, fontWeight: 700 },
  input: { padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${colors.inputBorder}`, fontSize: 14, outline: "none", background: colors.inputBg, transition: "all 0.2s", color: colors.text },
  select: { padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${colors.inputBorder}`, fontSize: 14, outline: "none", background: colors.inputBg, cursor: "pointer", color: colors.text },
  btnPrimary: { padding: "11px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s", boxShadow: "0 2px 8px rgba(15,76,117,0.25)" },
  btnSuccess: { padding: "11px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${colors.success} 0%, #047857 100%)`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(5,150,105,0.25)" },
  btnDanger: { padding: "10px 20px", borderRadius: 8, border: "none", background: colors.danger, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnOutline: { padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${colors.inputBorder}`, background: "#fff", color: colors.text, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 },
  th: { padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", color: colors.textMuted, borderBottom: `2px solid ${colors.border}`, background: colors.inputBg },
  td: { padding: "14px 16px", borderBottom: `1px solid ${colors.border}`, verticalAlign: "middle" },
  badge: (type) => {
    const map = { Active: colors.success, Entered: colors.accent, Checked: colors.warning, Processed: colors.primaryLight, Valuated: colors.success, Rejected: colors.danger, Expired: colors.textMuted };
    const c = map[type] || colors.textMuted;
    return { display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${c}18`, color: c, border: `1px solid ${c}30` };
  },
  stat: { padding: 20, borderRadius: 12, background: "#fff", border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", gap: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  statValue: { fontSize: 32, fontWeight: 800, letterSpacing: "-1px" },
  statLabel: { fontSize: 13, color: colors.textMuted, fontWeight: 500 },
  toast: { position: "fixed", top: 24, right: 24, background: colors.success, color: "#fff", padding: "14px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10, animation: "slideIn 0.3s ease" },
  loginPage: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: `linear-gradient(135deg, ${colors.sidebar} 0%, #0D1B2A 50%, ${colors.primaryDark} 100%)` },
  loginCard: { background: "#fff", borderRadius: 16, padding: "48px 40px", width: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.3)" },
  loginTitle: { fontSize: 26, fontWeight: 800, textAlign: "center", color: colors.text, marginBottom: 4, letterSpacing: "-0.5px" },
  loginSub: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 32 },
  loginInput: { width: "100%", padding: "13px 16px", borderRadius: 10, border: `1.5px solid ${colors.inputBorder}`, fontSize: 15, outline: "none", background: colors.inputBg, boxSizing: "border-box", transition: "border-color 0.2s" },
  loginBtn: { width: "100%", padding: "14px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8, boxShadow: "0 4px 16px rgba(15,76,117,0.3)", transition: "transform 0.2s" },
  error: { color: colors.danger, fontSize: 13, textAlign: "center", marginTop: 12, fontWeight: 500 },
  searchBar: { display: "flex", gap: 12, marginBottom: 24, alignItems: "flex-end" },
  fab: { position: "fixed", bottom: 32, right: 32, width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`, color: "#fff", border: "none", fontSize: 28, cursor: "pointer", boxShadow: "0 6px 24px rgba(0,180,216,0.4)", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s, box-shadow 0.2s", zIndex: 80 },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" },
  modalContent: { background: "#fff", borderRadius: 16, padding: 32, width: 800, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" },
  modalTitle: { fontSize: 20, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// --- FORM INPUT with full testability ---
function FormInput({ id, label, required, type = "text", value, onChange, placeholder, testId }) {
  const tid = testId || id;
  return (
    <div style={styles.formGroup}>
      <label htmlFor={id} style={styles.label} data-testid={`label-${tid}`} id={`label-${id}`}>
        {label} {required && <span style={styles.required} aria-hidden="true">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        required={required}
        aria-label={label}
        aria-required={required}
        data-testid={`input-${tid}`}
        style={styles.input}
        onFocus={(e) => { e.target.style.borderColor = colors.inputFocus; e.target.style.boxShadow = `0 0 0 3px ${colors.inputFocus}20`; }}
        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

// --- FORM SELECT with full testability ---
function FormSelect({ id, label, required, value, onChange, options, placeholder, testId }) {
  const tid = testId || id;
  return (
    <div style={styles.formGroup}>
      <label htmlFor={id} style={styles.label} data-testid={`label-${tid}`} id={`label-${id}`}>
        {label} {required && <span style={styles.required} aria-hidden="true">*</span>}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        aria-label={label}
        aria-required={required}
        data-testid={`select-${tid}`}
        style={styles.select}
        onFocus={(e) => { e.target.style.borderColor = colors.inputFocus; }}
        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; }}
      >
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

// --- TOAST NOTIFICATION ---
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={styles.toast} data-testid="toast-notification" role="alert" aria-live="polite">
      <span>✓</span> {message}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════════════════════════
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const user = USERS[username];
    if (!user || user.password !== password) {
      setError("Invalid username or password. Try: Admin / admin123");
      return;
    }
    onLogin({ username, ...user });
  };

  return (
    <div style={styles.loginPage} data-testid="login-page" id="login-page">
      <div style={styles.loginCard} data-testid="login-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ ...styles.logoIcon, margin: "0 auto 16px", width: 56, height: 56, fontSize: 26 }}>⚕</div>
          <div style={styles.loginTitle} data-testid="login-title">Claims Management System</div>
          <div style={styles.loginSub} data-testid="login-subtitle">OpenIMIS Healthcare Platform</div>
        </div>
        <form onSubmit={handleLogin} data-testid="login-form" id="login-form">
          <div style={{ ...styles.formGroup, marginBottom: 16 }}>
            <label htmlFor="username" style={styles.label} data-testid="label-username" id="label-username">
              Username <span style={styles.required}>*</span>
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              placeholder="Enter username"
              required
              aria-label="Username"
              aria-required="true"
              data-testid="input-username"
              style={styles.loginInput}
              autoFocus
            />
          </div>
          <div style={{ ...styles.formGroup, marginBottom: 20 }}>
            <label htmlFor="password" style={styles.label} data-testid="label-password" id="label-password">
              Password <span style={styles.required}>*</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Enter password"
              required
              aria-label="Password"
              aria-required="true"
              data-testid="input-password"
              style={styles.loginInput}
            />
          </div>
          {error && <div style={styles.error} data-testid="login-error" role="alert">{error}</div>}
          <button type="submit" style={styles.loginBtn} data-testid="btn-login" id="btn-login" aria-label="Log In">
            Log In
          </button>
        </form>
        <div style={{ marginTop: 24, padding: "16px", background: colors.inputBg, borderRadius: 10, fontSize: 12, color: colors.textMuted }} data-testid="login-help">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Demo Credentials:</div>
          <div>Admin / admin123 · EOFF001 / officer123</div>
          <div>CLRK001 / clerk123 · RVWR001 / review123</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════
function DashboardPage({ user, claims, families }) {
  const entered = claims.filter((c) => c.status === "Entered").length;
  const processed = claims.filter((c) => c.status === "Processed" || c.status === "Valuated").length;
  const totalAmount = claims.reduce((s, c) => s + c.amount, 0);

  return (
    <div data-testid="dashboard-page" id="dashboard-page">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20, marginBottom: 32 }}>
        <div style={styles.stat} data-testid="stat-families">
          <div style={styles.statLabel}>Total Families</div>
          <div style={{ ...styles.statValue, color: colors.primary }} data-testid="stat-families-value">{families.length}</div>
        </div>
        <div style={styles.stat} data-testid="stat-claims">
          <div style={styles.statLabel}>Total Claims</div>
          <div style={{ ...styles.statValue, color: colors.accent }} data-testid="stat-claims-value">{claims.length}</div>
        </div>
        <div style={styles.stat} data-testid="stat-pending">
          <div style={styles.statLabel}>Pending Review</div>
          <div style={{ ...styles.statValue, color: colors.warning }} data-testid="stat-pending-value">{entered}</div>
        </div>
        <div style={styles.stat} data-testid="stat-amount">
          <div style={styles.statLabel}>Total Billed</div>
          <div style={{ ...styles.statValue, color: colors.success }} data-testid="stat-amount-value">${totalAmount.toLocaleString()}</div>
        </div>
      </div>

      <div style={styles.card} data-testid="recent-claims-card">
        <div style={styles.cardTitle}>📋 Recent Claims</div>
        <table style={styles.table} data-testid="recent-claims-table" aria-label="Recent Claims">
          <thead>
            <tr>
              <th style={styles.th}>Claim ID</th>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Facility</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.slice(0, 5).map((c) => (
              <tr key={c.id} data-testid={`claim-row-${c.id}`}>
                <td style={styles.td} data-testid={`claim-id-${c.id}`}>{c.id}</td>
                <td style={styles.td}>{c.patientName}</td>
                <td style={styles.td}>{c.facility}</td>
                <td style={styles.td}>${c.amount.toFixed(2)}</td>
                <td style={styles.td}><span style={styles.badge(c.status)} data-testid={`claim-status-${c.id}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ENROLLMENT PAGE (Family/Member Management)
// ═══════════════════════════════════════════════════════════════
function EnrollmentPage({ families, setFamilies }) {
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ lastName: "", givenNames: "", dob: "", gender: "", region: "", district: "", email: "", phone: "", idType: "", idNo: "", insuranceNo: "" });

  const filteredFamilies = families.filter((f) =>
    f.lastName.toLowerCase().includes(search.toLowerCase()) ||
    f.givenNames.toLowerCase().includes(search.toLowerCase()) ||
    f.insuranceNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    const newFamily = {
      id: `FAM-${String(families.length + 1).padStart(3, "0")}`,
      ...form,
      insuranceNo: form.insuranceNo || `INS-${100000 + families.length + 1}`,
      status: "Active",
      members: 1,
    };
    setFamilies([...families, newFamily]);
    setShowForm(false);
    setForm({ lastName: "", givenNames: "", dob: "", gender: "", region: "", district: "", email: "", phone: "", idType: "", idNo: "", insuranceNo: "" });
    setToast("Family record created successfully!");
  };

  return (
    <div data-testid="enrollment-page" id="enrollment-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      {/* Search Bar */}
      <div style={styles.searchBar} data-testid="enrollment-search-bar">
        <div style={{ ...styles.formGroup, flex: 1, maxWidth: 400 }}>
          <label htmlFor="search-families" style={styles.label} data-testid="label-search-families">Search Families</label>
          <input
            id="search-families"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or insurance number..."
            aria-label="Search Families"
            data-testid="input-search-families"
            style={styles.input}
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          style={styles.btnPrimary}
          data-testid="btn-add-family"
          id="btn-add-family"
          aria-label="Add New Family"
        >
          + Add Family
        </button>
      </div>

      {/* Families Table */}
      <div style={styles.card} data-testid="families-list-card">
        <div style={styles.cardTitle}>👨‍👩‍👧‍👦 Enrolled Families ({filteredFamilies.length})</div>
        <table style={styles.table} data-testid="families-table" aria-label="Enrolled Families">
          <thead>
            <tr>
              <th style={styles.th} data-testid="th-family-id">Family ID</th>
              <th style={styles.th} data-testid="th-last-name">Last Name</th>
              <th style={styles.th} data-testid="th-given-names">Given Names</th>
              <th style={styles.th} data-testid="th-insurance-no">Insurance No.</th>
              <th style={styles.th} data-testid="th-region">Region</th>
              <th style={styles.th} data-testid="th-members">Members</th>
              <th style={styles.th} data-testid="th-status">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredFamilies.map((f) => (
              <tr key={f.id} data-testid={`family-row-${f.id}`}>
                <td style={styles.td} data-testid={`family-id-${f.id}`}>{f.id}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{f.lastName}</td>
                <td style={styles.td}>{f.givenNames}</td>
                <td style={styles.td}><code style={{ background: colors.inputBg, padding: "2px 8px", borderRadius: 4, fontSize: 13 }}>{f.insuranceNo}</code></td>
                <td style={styles.td}>{f.region}</td>
                <td style={styles.td}>{f.members}</td>
                <td style={styles.td}><span style={styles.badge(f.status)}>{f.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FAB Button */}
      <button
        onClick={() => setShowForm(true)}
        style={styles.fab}
        data-testid="fab-add-family"
        id="fab-add-family"
        aria-label="Add New Family"
        title="Add New Family"
      >+</button>

      {/* Add Family Modal */}
      {showForm && (
        <div style={styles.modal} data-testid="modal-add-family" role="dialog" aria-label="Add New Family" aria-modal="true">
          <div style={styles.modalContent} data-testid="modal-content-add-family">
            <div style={styles.modalTitle}>
              <span data-testid="modal-title-text">👨‍👩‍👧 Add New Family / Group</span>
              <button
                onClick={() => setShowForm(false)}
                style={{ ...styles.btnOutline, padding: "6px 14px" }}
                data-testid="btn-close-modal"
                aria-label="Close Modal"
              >✕</button>
            </div>

            <form onSubmit={handleSave} data-testid="form-add-family" id="form-add-family">
              {/* Head of Family Section */}
              <div style={{ ...styles.cardTitle, fontSize: 14, marginBottom: 16, color: colors.primaryLight }}>Head of Family / Group</div>
              <div style={styles.formGrid}>
                <FormInput id="last-name" label="Last Name" required value={form.lastName} onChange={(v) => setForm({ ...form, lastName: v })} testId="last-name" />
                <FormInput id="given-names" label="Given Names" required value={form.givenNames} onChange={(v) => setForm({ ...form, givenNames: v })} testId="given-names" />
                <FormInput id="birth-date" label="Birth Date" type="date" required value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} testId="birth-date" />
                <FormSelect id="gender" label="Gender" required value={form.gender} onChange={(v) => setForm({ ...form, gender: v })} options={GENDERS} testId="gender" />
                <FormSelect id="region" label="Region" required value={form.region} onChange={(v) => setForm({ ...form, region: v, district: "" })} options={REGIONS} testId="region" />
                <FormSelect id="district" label="District" required value={form.district} onChange={(v) => setForm({ ...form, district: v })} options={form.region ? DISTRICTS[form.region] || [] : []} testId="district" />
              </div>

              <div style={{ ...styles.cardTitle, fontSize: 14, marginTop: 24, marginBottom: 16, color: colors.primaryLight }}>Contact & Identification</div>
              <div style={styles.formGrid}>
                <FormInput id="email" label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} testId="email" />
                <FormInput id="phone" label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="(555) 000-0000" testId="phone" />
                <FormInput id="insurance-number" label="Insurance Number" value={form.insuranceNo} onChange={(v) => setForm({ ...form, insuranceNo: v })} placeholder="Auto-generated if empty" testId="insurance-number" />
                <FormSelect id="identification-type" label="Identification Type" value={form.idType} onChange={(v) => setForm({ ...form, idType: v })} options={ID_TYPES} testId="identification-type" />
                <FormInput id="identification-no" label="Identification No." value={form.idNo} onChange={(v) => setForm({ ...form, idNo: v })} placeholder="e.g., 123-45-6789" testId="identification-no" />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowForm(false)} style={styles.btnOutline} data-testid="btn-cancel-family" aria-label="Cancel">Cancel</button>
                <button type="submit" style={styles.btnSuccess} data-testid="btn-save-family" id="btn-save-family" aria-label="Save Family">
                  ✓ Save Family
                </button>
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
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ insuranceNo: "", facility: "", visitType: "", diagnosisCode: "", procedureCode: "", serviceDate: "", amount: "", providerNPI: "", notes: "" });

  const getPatientName = (insNo) => {
    const f = families.find((fam) => fam.insuranceNo === insNo);
    return f ? `${f.givenNames} ${f.lastName}` : "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const facility = FACILITIES.find((f) => f.id === form.facility);
    const newClaim = {
      id: `CLM-2026-${String(claims.length + 1).padStart(3, "0")}`,
      insuranceNo: form.insuranceNo,
      patientName: getPatientName(form.insuranceNo),
      facility: facility ? facility.name : form.facility,
      visitType: form.visitType,
      diagnosisCode: form.diagnosisCode,
      procedureCode: form.procedureCode,
      serviceDate: form.serviceDate,
      amount: parseFloat(form.amount),
      status: "Entered",
      submittedDate: new Date().toISOString().split("T")[0],
      reviewedBy: "",
    };
    setClaims([...claims, newClaim]);
    setShowForm(false);
    setForm({ insuranceNo: "", facility: "", visitType: "", diagnosisCode: "", procedureCode: "", serviceDate: "", amount: "", providerNPI: "", notes: "" });
    setToast(`Claim ${newClaim.id} submitted successfully!`);
  };

  return (
    <div data-testid="claims-submit-page" id="claims-submit-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        <button onClick={() => setShowForm(true)} style={styles.btnPrimary} data-testid="btn-new-claim" id="btn-new-claim" aria-label="New Claim">
          + New Claim
        </button>
      </div>

      <div style={styles.card} data-testid="claims-list-card">
        <div style={styles.cardTitle}>🏥 Claims Register ({claims.length})</div>
        <table style={styles.table} data-testid="claims-table" aria-label="Claims Register">
          <thead>
            <tr>
              <th style={styles.th} data-testid="th-claim-id">Claim ID</th>
              <th style={styles.th} data-testid="th-patient">Patient</th>
              <th style={styles.th} data-testid="th-facility">Facility</th>
              <th style={styles.th} data-testid="th-visit-type">Visit Type</th>
              <th style={styles.th} data-testid="th-diagnosis">Diagnosis</th>
              <th style={styles.th} data-testid="th-amount">Amount</th>
              <th style={styles.th} data-testid="th-service-date">Service Date</th>
              <th style={styles.th} data-testid="th-claim-status">Status</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((c) => (
              <tr key={c.id} data-testid={`claim-row-${c.id}`}>
                <td style={{ ...styles.td, fontWeight: 600 }} data-testid={`claim-id-${c.id}`}>{c.id}</td>
                <td style={styles.td}>{c.patientName}</td>
                <td style={styles.td}>{c.facility}</td>
                <td style={styles.td}>{c.visitType}</td>
                <td style={styles.td}><code style={{ background: colors.inputBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{c.diagnosisCode}</code></td>
                <td style={styles.td}>${c.amount.toFixed(2)}</td>
                <td style={styles.td}>{c.serviceDate}</td>
                <td style={styles.td}><span style={styles.badge(c.status)} data-testid={`claim-status-${c.id}`}>{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button onClick={() => setShowForm(true)} style={styles.fab} data-testid="fab-new-claim" aria-label="New Claim" title="Submit New Claim">+</button>

      {showForm && (
        <div style={styles.modal} data-testid="modal-new-claim" role="dialog" aria-label="Submit New Claim" aria-modal="true">
          <div style={styles.modalContent} data-testid="modal-content-new-claim">
            <div style={styles.modalTitle}>
              <span data-testid="modal-title-claim">🏥 Submit New Healthcare Claim</span>
              <button onClick={() => setShowForm(false)} style={{ ...styles.btnOutline, padding: "6px 14px" }} data-testid="btn-close-claim-modal" aria-label="Close">✕</button>
            </div>

            <form onSubmit={handleSubmit} data-testid="form-new-claim" id="form-new-claim">
              <div style={{ ...styles.cardTitle, fontSize: 14, marginBottom: 16, color: colors.primaryLight }}>Patient Information</div>
              <div style={styles.formGrid}>
                <FormSelect
                  id="insurance-no" label="Insurance Number" required value={form.insuranceNo}
                  onChange={(v) => setForm({ ...form, insuranceNo: v })}
                  options={families.map((f) => ({ code: f.insuranceNo, desc: `${f.givenNames} ${f.lastName}` }))}
                  testId="insurance-no"
                />
                <div style={styles.formGroup}>
                  <label style={styles.label} data-testid="label-patient-name">Patient Name</label>
                  <input style={{ ...styles.input, background: "#f0f0f0" }} value={getPatientName(form.insuranceNo)} readOnly aria-label="Patient Name" data-testid="input-patient-name" id="patient-name" />
                </div>
                <FormSelect id="facility" label="Health Facility" required value={form.facility} onChange={(v) => setForm({ ...form, facility: v })} options={FACILITIES.map((f) => ({ code: f.id, desc: f.name }))} testId="facility" />
              </div>

              <div style={{ ...styles.cardTitle, fontSize: 14, marginTop: 24, marginBottom: 16, color: colors.primaryLight }}>Service Details</div>
              <div style={styles.formGrid}>
                <FormSelect id="visit-type" label="Visit Type" required value={form.visitType} onChange={(v) => setForm({ ...form, visitType: v })} options={VISIT_TYPES} testId="visit-type" />
                <FormSelect id="diagnosis-code" label="Diagnosis Code (ICD-10)" required value={form.diagnosisCode} onChange={(v) => setForm({ ...form, diagnosisCode: v })} options={DIAGNOSIS_CODES} testId="diagnosis-code" />
                <FormSelect id="procedure-code" label="Procedure Code (CPT)" required value={form.procedureCode} onChange={(v) => setForm({ ...form, procedureCode: v })} options={PROCEDURE_CODES} testId="procedure-code" />
                <FormInput id="service-date" label="Service Date" type="date" required value={form.serviceDate} onChange={(v) => setForm({ ...form, serviceDate: v })} testId="service-date" />
                <FormInput id="billing-amount" label="Billing Amount ($)" type="number" required value={form.amount} onChange={(v) => setForm({ ...form, amount: v })} placeholder="0.00" testId="billing-amount" />
                <FormInput id="provider-npi" label="Provider NPI" value={form.providerNPI} onChange={(v) => setForm({ ...form, providerNPI: v })} placeholder="10-digit NPI" testId="provider-npi" />
              </div>

              <div style={{ ...styles.cardTitle, fontSize: 14, marginTop: 24, marginBottom: 16, color: colors.primaryLight }}>Additional Notes</div>
              <div style={styles.formGroup}>
                <label htmlFor="claim-notes" style={styles.label} data-testid="label-claim-notes">Notes</label>
                <textarea
                  id="claim-notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional notes or comments..."
                  aria-label="Notes"
                  data-testid="textarea-claim-notes"
                  style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowForm(false)} style={styles.btnOutline} data-testid="btn-cancel-claim" aria-label="Cancel">Cancel</button>
                <button type="submit" style={styles.btnSuccess} data-testid="btn-submit-claim" id="btn-submit-claim" aria-label="Submit Claim">
                  ✓ Submit Claim
                </button>
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
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchText, setSearchText] = useState("");
  const [selectedClaim, setSelectedClaim] = useState(null);

  const filtered = claims.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (dateFrom && c.serviceDate < dateFrom) return false;
    if (dateTo && c.serviceDate > dateTo) return false;
    if (searchText && !c.id.toLowerCase().includes(searchText.toLowerCase()) && !c.patientName.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const updateStatus = (claimId, newStatus) => {
    setClaims(claims.map((c) => (c.id === claimId ? { ...c, status: newStatus } : c)));
    setSelectedClaim(null);
    setToast(`Claim ${claimId} status updated to ${newStatus}`);
  };

  return (
    <div data-testid="claims-review-page" id="claims-review-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      {/* Filters */}
      <div style={{ ...styles.card, marginBottom: 24 }} data-testid="review-filters-card">
        <div style={styles.cardTitle}>🔍 Search & Filter Claims</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 16, alignItems: "flex-end" }}>
          <div style={styles.formGroup}>
            <label htmlFor="search-claims" style={styles.label} data-testid="label-search-claims">Search</label>
            <input
              id="search-claims"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Claim ID or patient name..."
              aria-label="Search Claims"
              data-testid="input-search-claims"
              style={styles.input}
            />
          </div>
          <FormSelect
            id="filter-status" label="Status" value={statusFilter}
            onChange={setStatusFilter}
            options={CLAIM_STATUSES}
            placeholder="All Statuses"
            testId="filter-status"
          />
          <div style={styles.formGroup}>
            <label htmlFor="filter-date-from" style={styles.label} data-testid="label-filter-date-from">Date From</label>
            <input id="filter-date-from" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} aria-label="Date From" data-testid="input-filter-date-from" style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="filter-date-to" style={styles.label} data-testid="label-filter-date-to">Date To</label>
            <input id="filter-date-to" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} aria-label="Date To" data-testid="input-filter-date-to" style={styles.input} />
          </div>
          <button
            onClick={() => { setStatusFilter(""); setDateFrom(""); setDateTo(""); setSearchText(""); }}
            style={styles.btnOutline}
            data-testid="btn-clear-filters"
            aria-label="Clear Filters"
          >Clear</button>
        </div>
      </div>

      {/* Results */}
      <div style={styles.card} data-testid="review-results-card">
        <div style={styles.cardTitle}>📋 Claims for Review ({filtered.length} results)</div>
        <table style={styles.table} data-testid="review-table" aria-label="Claims Review">
          <thead>
            <tr>
              <th style={styles.th}>Claim ID</th>
              <th style={styles.th}>Patient</th>
              <th style={styles.th}>Facility</th>
              <th style={styles.th}>Diagnosis</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Service Date</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} data-testid={`review-row-${c.id}`}>
                <td style={{ ...styles.td, fontWeight: 600 }} data-testid={`review-id-${c.id}`}>{c.id}</td>
                <td style={styles.td}>{c.patientName}</td>
                <td style={styles.td}>{c.facility}</td>
                <td style={styles.td}><code style={{ background: colors.inputBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{c.diagnosisCode}</code></td>
                <td style={styles.td}>${c.amount.toFixed(2)}</td>
                <td style={styles.td}>{c.serviceDate}</td>
                <td style={styles.td}><span style={styles.badge(c.status)} data-testid={`review-status-${c.id}`}>{c.status}</span></td>
                <td style={styles.td}>
                  <button
                    onClick={() => setSelectedClaim(c)}
                    style={{ ...styles.btnOutline, padding: "6px 12px", fontSize: 12 }}
                    data-testid={`btn-review-${c.id}`}
                    aria-label={`Review claim ${c.id}`}
                  >Review</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selectedClaim && (
        <div style={styles.modal} data-testid="modal-review-claim" role="dialog" aria-label="Review Claim" aria-modal="true">
          <div style={{ ...styles.modalContent, width: 600 }} data-testid="modal-content-review">
            <div style={styles.modalTitle}>
              <span data-testid="modal-review-title">Claim Review: {selectedClaim.id}</span>
              <button onClick={() => setSelectedClaim(null)} style={{ ...styles.btnOutline, padding: "6px 14px" }} data-testid="btn-close-review" aria-label="Close Review">✕</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div><span style={{ ...styles.label, display: "block" }}>Patient</span><strong data-testid="review-detail-patient">{selectedClaim.patientName}</strong></div>
              <div><span style={{ ...styles.label, display: "block" }}>Insurance No.</span><strong data-testid="review-detail-insurance">{selectedClaim.insuranceNo}</strong></div>
              <div><span style={{ ...styles.label, display: "block" }}>Facility</span><strong data-testid="review-detail-facility">{selectedClaim.facility}</strong></div>
              <div><span style={{ ...styles.label, display: "block" }}>Visit Type</span><strong data-testid="review-detail-visit">{selectedClaim.visitType}</strong></div>
              <div><span style={{ ...styles.label, display: "block" }}>Diagnosis Code</span><strong data-testid="review-detail-diagnosis">{selectedClaim.diagnosisCode}</strong></div>
              <div><span style={{ ...styles.label, display: "block" }}>Procedure Code</span><strong data-testid="review-detail-procedure">{selectedClaim.procedureCode}</strong></div>
              <div><span style={{ ...styles.label, display: "block" }}>Service Date</span><strong data-testid="review-detail-date">{selectedClaim.serviceDate}</strong></div>
              <div><span style={{ ...styles.label, display: "block" }}>Billing Amount</span><strong data-testid="review-detail-amount">${selectedClaim.amount.toFixed(2)}</strong></div>
              <div><span style={{ ...styles.label, display: "block" }}>Current Status</span><span style={styles.badge(selectedClaim.status)} data-testid="review-detail-status">{selectedClaim.status}</span></div>
              <div><span style={{ ...styles.label, display: "block" }}>Submitted Date</span><strong data-testid="review-detail-submitted">{selectedClaim.submittedDate}</strong></div>
            </div>

            <div style={{ ...styles.cardTitle, fontSize: 14, color: colors.primaryLight }}>Update Status</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              {CLAIM_STATUSES.filter((s) => s !== selectedClaim.status).map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selectedClaim.id, s)}
                  style={s === "Rejected" ? styles.btnDanger : styles.btnPrimary}
                  data-testid={`btn-status-${s.toLowerCase()}`}
                  aria-label={`Set status to ${s}`}
                >
                  {s === "Rejected" ? "✕ " : "→ "}{s}
                </button>
              ))}
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

  if (!user) return <LoginPage onLogin={(u) => { setUser(u); setPage("dashboard"); }} />;

  const pages = {
    dashboard: { title: "Dashboard", icon: "📊", breadcrumb: "Home > Dashboard" },
    enrollment: { title: "Families / Groups", icon: "👨‍👩‍👧‍👦", breadcrumb: "Insurees > Families / Groups" },
    "claims-submit": { title: "Health Facility Claims", icon: "🏥", breadcrumb: "Claims > Health Facility Claims" },
    "claims-review": { title: "Claims Review", icon: "📋", breadcrumb: "Claims > Review" },
  };

  const currentPage = pages[page] || pages.dashboard;

  return (
    <div style={styles.app} data-testid="app-container">
      {/* Sidebar */}
      <div style={styles.sidebar} data-testid="sidebar" id="sidebar" role="navigation" aria-label="Main Navigation">
        <div style={styles.sidebarLogo} data-testid="sidebar-logo">
          <div style={styles.logoIcon}>⚕</div>
          <div>
            <div style={styles.logoText}>OpenIMIS</div>
            <div style={styles.logoSub}>Claims Management</div>
          </div>
        </div>

        <nav style={styles.sidebarNav} data-testid="sidebar-nav">
          <div style={styles.navSection}>Main</div>
          <div
            style={styles.navItem(page === "dashboard")}
            onClick={() => setPage("dashboard")}
            data-testid="nav-dashboard"
            id="nav-dashboard"
            role="button"
            aria-label="Dashboard"
            aria-current={page === "dashboard" ? "page" : undefined}
          >
            <span style={styles.navIcon}>📊</span> Dashboard
          </div>

          <div style={styles.navSection}>Insurees & Policies</div>
          <div
            style={styles.navItem(page === "enrollment")}
            onClick={() => setPage("enrollment")}
            data-testid="nav-enrollment"
            id="nav-enrollment"
            role="button"
            aria-label="Families / Groups"
            aria-current={page === "enrollment" ? "page" : undefined}
          >
            <span style={styles.navIcon}>👨‍👩‍👧‍👦</span> Families / Groups
          </div>

          <div style={styles.navSection}>Claims</div>
          <div
            style={styles.navItem(page === "claims-submit")}
            onClick={() => setPage("claims-submit")}
            data-testid="nav-claims-submit"
            id="nav-claims-submit"
            role="button"
            aria-label="Health Facility Claims"
            aria-current={page === "claims-submit" ? "page" : undefined}
          >
            <span style={styles.navIcon}>🏥</span> Health Facility Claims
          </div>
          <div
            style={styles.navItem(page === "claims-review")}
            onClick={() => setPage("claims-review")}
            data-testid="nav-claims-review"
            id="nav-claims-review"
            role="button"
            aria-label="Claims Review"
            aria-current={page === "claims-review" ? "page" : undefined}
          >
            <span style={styles.navIcon}>📋</span> Claims Review
          </div>
        </nav>

        <div style={styles.sidebarUser} data-testid="sidebar-user-info">
          <div style={styles.userAvatar} data-testid="user-avatar">{user.name.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }} data-testid="user-name">{user.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} data-testid="user-role">{user.role}</div>
          </div>
          <button
            onClick={() => setUser(null)}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18, padding: 4 }}
            data-testid="btn-logout"
            id="btn-logout"
            aria-label="Logout"
            title="Logout"
          >⏻</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.main} data-testid="main-content">
        <div style={styles.header} data-testid="page-header">
          <div>
            <div style={styles.headerTitle} data-testid="page-title">{currentPage.icon} {currentPage.title}</div>
            <div style={styles.headerBreadcrumb} data-testid="page-breadcrumb">{currentPage.breadcrumb}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 13, color: colors.textMuted }} data-testid="header-user">Logged in as <strong>{user.username}</strong></span>
          </div>
        </div>

        <div style={styles.content} data-testid="page-content">
          {page === "dashboard" && <DashboardPage user={user} claims={claims} families={families} />}
          {page === "enrollment" && <EnrollmentPage families={families} setFamilies={setFamilies} />}
          {page === "claims-submit" && <ClaimsSubmitPage claims={claims} setClaims={setClaims} families={families} />}
          {page === "claims-review" && <ClaimsReviewPage claims={claims} setClaims={setClaims} />}
        </div>
      </div>
    </div>
  );
}

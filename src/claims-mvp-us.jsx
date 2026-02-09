import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// US HEALTH INSURANCE CLAIMS MANAGEMENT SYSTEM
// Role: Claim Analyst | Context: US Health Insurance
// Every element has data-testid, aria-label, and id attributes
// Built for TestARQ demo - perfect automation compatibility
// ═══════════════════════════════════════════════════════════════

const USERS = {
  "claim.analyst": { password: "analyst123", role: "Claim Analyst", name: "Sarah Mitchell" },
  Admin: { password: "admin123", role: "Administrator", name: "System Administrator" },
};

const CLAIM_STATUSES = ["Submitted", "Under Review", "Approved", "Rejected"];
const PRIORITIES = ["High", "Medium", "Low"];
const VISIT_TYPES = ["Outpatient", "Inpatient", "Emergency", "Telehealth", "Preventive"];

const DIAGNOSIS_CODES = [
  { code: "J06.9", desc: "Acute upper respiratory infection" },
  { code: "M54.5", desc: "Low back pain" },
  { code: "E11.9", desc: "Type 2 diabetes mellitus" },
  { code: "I10", desc: "Essential hypertension" },
  { code: "K21.0", desc: "Gastroesophageal reflux disease" },
  { code: "S82.001A", desc: "Fracture of right patella, initial" },
  { code: "Z00.00", desc: "General adult medical examination" },
  { code: "R50.9", desc: "Fever, unspecified" },
];

const PROCEDURE_CODES = [
  { code: "99213", desc: "Office visit, established, moderate" },
  { code: "99214", desc: "Office visit, established, mod-high" },
  { code: "99283", desc: "ED visit, moderate severity" },
  { code: "99385", desc: "Preventive medicine, 18-39 years" },
  { code: "27447", desc: "Total knee replacement" },
  { code: "70553", desc: "MRI brain with/without contrast" },
  { code: "80053", desc: "Comprehensive metabolic panel" },
  { code: "93000", desc: "Electrocardiogram, complete" },
];

const FACILITIES = [
  { id: "FAC-001", name: "Mayo Clinic", location: "Rochester, MN", npi: "1234567890" },
  { id: "FAC-002", name: "Cleveland Clinic", location: "Cleveland, OH", npi: "2345678901" },
  { id: "FAC-003", name: "Johns Hopkins Hospital", location: "Baltimore, MD", npi: "3456789012" },
  { id: "FAC-004", name: "Mass General Hospital", location: "Boston, MA", npi: "4567890123" },
  { id: "FAC-005", name: "Stanford Health Care", location: "Palo Alto, CA", npi: "5678901234" },
  { id: "FAC-006", name: "Mount Sinai Hospital", location: "New York, NY", npi: "6789012345" },
  { id: "FAC-007", name: "Cedars-Sinai Medical Center", location: "Los Angeles, CA", npi: "7890123456" },
  { id: "FAC-008", name: "Duke University Hospital", location: "Durham, NC", npi: "8901234567" },
];

const HEALTH_PLANS = [
  { code: "PPO-GOLD-2026", name: "PPO Gold Plus", type: "PPO", state: "CA", minAge: 18, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active",
    benefits: [
      { service: "Primary Care Visit", copay: "$25", coinsurance: "0%", priorAuth: "No", limit: "Unlimited" },
      { service: "Specialist Visit", copay: "$50", coinsurance: "20%", priorAuth: "No", limit: "Unlimited" },
      { service: "Emergency Room", copay: "$250", coinsurance: "20%", priorAuth: "No", limit: "Unlimited" },
      { service: "Inpatient Hospital", copay: "$500/day", coinsurance: "20%", priorAuth: "Yes", limit: "$500,000" },
      { service: "Outpatient Surgery", copay: "$200", coinsurance: "20%", priorAuth: "Yes", limit: "$250,000" },
      { service: "Lab / Diagnostics", copay: "$10", coinsurance: "0%", priorAuth: "No", limit: "Unlimited" },
      { service: "Mental Health", copay: "$25", coinsurance: "20%", priorAuth: "No", limit: "Unlimited" },
      { service: "Prescription Drugs", copay: "$10/$35/$70", coinsurance: "Varies", priorAuth: "Tier 3+", limit: "Unlimited" },
    ],
    network: [
      { service: "Primary Care", inNetwork: "$25 copay", outNetwork: "40% coinsurance", size: "12,500+ providers" },
      { service: "Specialist", inNetwork: "$50 copay", outNetwork: "50% coinsurance", size: "8,200+ providers" },
      { service: "Hospital", inNetwork: "20% after deductible", outNetwork: "50% after deductible", size: "450+ facilities" },
      { service: "Pharmacy", inNetwork: "$10/$35/$70 tiers", outNetwork: "Not covered", size: "45,000+ pharmacies" },
    ],
    deductibles: { indivIn: "$1,500", famIn: "$3,000", indivOut: "$3,000", famOut: "$6,000", oopIndivIn: "$6,500", oopFamIn: "$13,000", oopIndivOut: "$13,000", oopFamOut: "$26,000" },
  },
  { code: "PPO-SLV-2026", name: "PPO Silver", type: "PPO", state: "TX", minAge: 18, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active", benefits: [], network: [], deductibles: {} },
  { code: "HMO-STD-2026", name: "HMO Standard", type: "HMO", state: "NY", minAge: 0, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active", benefits: [], network: [], deductibles: {} },
  { code: "HMO-PLS-2026", name: "HMO Plus", type: "HMO", state: "CA", minAge: 0, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active", benefits: [], network: [], deductibles: {} },
  { code: "MCR-ADV-2026", name: "Medicare Advantage", type: "Medicare", state: "FL", minAge: 65, maxAge: 99, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active", benefits: [], network: [], deductibles: {} },
  { code: "HDHP-BRZ-2026", name: "HDHP Bronze", type: "HDHP", state: "IL", minAge: 18, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active", benefits: [], network: [], deductibles: {} },
];

const SAMPLE_MEMBERS = [
  { id: "MBR-100001", name: "Robert Anderson", dob: "1985-03-12", gender: "Male", ssn: "***-**-4521", address: "123 Oak St, Austin, TX 78701", phone: "(555) 101-2001", email: "r.anderson@email.com", planId: "INS-100001", planName: "PPO Gold Plus", groupNo: "GRP-5001", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", dependents: [{ name: "Susan Anderson", rel: "Spouse", dob: "1987-06-15", status: "Active" }, { name: "Tommy Anderson", rel: "Child", dob: "2015-09-22", status: "Active" }] },
  { id: "MBR-100002", name: "Maria Garcia", dob: "1990-07-22", gender: "Female", ssn: "***-**-7832", address: "456 Pine Ave, Miami, FL 33101", phone: "(555) 202-3002", email: "m.garcia@email.com", planId: "INS-100002", planName: "HMO Standard", groupNo: "GRP-5002", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", dependents: [{ name: "Carlos Garcia", rel: "Spouse", dob: "1988-02-10", status: "Active" }] },
  { id: "MBR-100003", name: "James Wilson", dob: "1978-11-05", gender: "Male", ssn: "***-**-9145", address: "789 Elm Dr, Denver, CO 80201", phone: "(555) 303-4003", email: "j.wilson@email.com", planId: "INS-100003", planName: "PPO Silver", groupNo: "GRP-5003", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", dependents: [] },
  { id: "MBR-100004", name: "Emily Chen", dob: "1992-01-30", gender: "Female", ssn: "***-**-2678", address: "321 Maple Ln, Seattle, WA 98101", phone: "(555) 404-5004", email: "e.chen@email.com", planId: "INS-100004", planName: "HMO Plus", groupNo: "GRP-5004", effectiveDate: "2025-01-01", termDate: "2025-12-31", status: "Inactive", dependents: [] },
  { id: "MBR-100005", name: "William Thompson", dob: "1955-09-18", gender: "Male", ssn: "***-**-3389", address: "654 Cedar Ct, Tampa, FL 33602", phone: "(555) 505-6005", email: "w.thompson@email.com", planId: "INS-100005", planName: "Medicare Advantage", groupNo: "GRP-5005", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", dependents: [{ name: "Margaret Thompson", rel: "Spouse", dob: "1957-03-25", status: "Active" }] },
  { id: "MBR-100006", name: "Sarah Mitchell", dob: "1988-06-14", gender: "Female", ssn: "***-**-5544", address: "987 Birch Rd, Chicago, IL 60601", phone: "(555) 606-7006", email: "s.mitchell@email.com", planId: "INS-100006", planName: "PPO Gold Plus", groupNo: "GRP-5001", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", dependents: [] },
  { id: "MBR-100007", name: "David Kim", dob: "1972-12-03", gender: "Male", ssn: "***-**-8877", address: "147 Walnut St, Portland, OR 97201", phone: "(555) 707-8007", email: "d.kim@email.com", planId: "INS-100007", planName: "HDHP Bronze", groupNo: "GRP-5006", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", dependents: [{ name: "Jennifer Kim", rel: "Spouse", dob: "1975-08-19", status: "Active" }, { name: "Alex Kim", rel: "Child", dob: "2010-04-12", status: "Active" }] },
  { id: "MBR-100008", name: "Lisa Rodriguez", dob: "1995-04-28", gender: "Female", ssn: "***-**-1122", address: "258 Spruce Way, Phoenix, AZ 85001", phone: "(555) 808-9008", email: "l.rodriguez@email.com", planId: "INS-100008", planName: "HMO Standard", groupNo: "GRP-5002", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", dependents: [] },
];

const SAMPLE_CLAIMS = [
  { id: "CLM-2026-001", planId: "INS-100001", patientName: "Robert Anderson", facility: "Mayo Clinic", visitType: "Outpatient", diagnosisCode: "J06.9", procedureCode: "99213", serviceDate: "2026-01-15", amount: 1250.00, status: "Submitted", priority: "High", submittedDate: "2026-01-16" },
  { id: "CLM-2026-002", planId: "INS-100002", patientName: "Maria Garcia", facility: "Cleveland Clinic", visitType: "Emergency", diagnosisCode: "S82.001A", procedureCode: "99283", serviceDate: "2026-01-16", amount: 3450.00, status: "Under Review", priority: "Medium", submittedDate: "2026-01-17" },
  { id: "CLM-2026-003", planId: "INS-100003", patientName: "James Wilson", facility: "Johns Hopkins Hospital", visitType: "Outpatient", diagnosisCode: "M54.5", procedureCode: "99214", serviceDate: "2026-01-17", amount: 890.00, status: "Approved", priority: "Low", submittedDate: "2026-01-18" },
  { id: "CLM-2026-004", planId: "INS-100004", patientName: "Emily Chen", facility: "Mass General Hospital", visitType: "Inpatient", diagnosisCode: "E11.9", procedureCode: "80053", serviceDate: "2026-01-18", amount: 12500.00, status: "Rejected", priority: "High", submittedDate: "2026-01-19" },
  { id: "CLM-2026-005", planId: "INS-100005", patientName: "William Thompson", facility: "Stanford Health Care", visitType: "Preventive", diagnosisCode: "Z00.00", procedureCode: "99385", serviceDate: "2026-01-20", amount: 350.00, status: "Approved", priority: "Low", submittedDate: "2026-01-21" },
  { id: "CLM-2026-006", planId: "INS-100001", patientName: "Robert Anderson", facility: "Mayo Clinic", visitType: "Telehealth", diagnosisCode: "I10", procedureCode: "99213", serviceDate: "2026-01-22", amount: 150.00, status: "Submitted", priority: "Medium", submittedDate: "2026-01-22" },
  { id: "CLM-2026-007", planId: "INS-100006", patientName: "Sarah Mitchell", facility: "Mount Sinai Hospital", visitType: "Outpatient", diagnosisCode: "K21.0", procedureCode: "99214", serviceDate: "2026-01-25", amount: 480.00, status: "Under Review", priority: "Medium", submittedDate: "2026-01-26" },
  { id: "CLM-2026-008", planId: "INS-100007", patientName: "David Kim", facility: "Cedars-Sinai Medical Center", visitType: "Inpatient", diagnosisCode: "S82.001A", procedureCode: "27447", serviceDate: "2026-01-28", amount: 28500.00, status: "Submitted", priority: "High", submittedDate: "2026-01-29" },
  { id: "CLM-2026-009", planId: "INS-100008", patientName: "Lisa Rodriguez", facility: "Duke University Hospital", visitType: "Outpatient", diagnosisCode: "R50.9", procedureCode: "93000", serviceDate: "2026-02-01", amount: 275.00, status: "Approved", priority: "Low", submittedDate: "2026-02-02" },
  { id: "CLM-2026-010", planId: "INS-100002", patientName: "Maria Garcia", facility: "Cleveland Clinic", visitType: "Outpatient", diagnosisCode: "E11.9", procedureCode: "80053", serviceDate: "2026-02-03", amount: 195.00, status: "Submitted", priority: "Medium", submittedDate: "2026-02-04" },
];

const SAMPLE_BATCHES = [
  { id: "BATCH-001", name: "January Week 3", claimCount: 4, totalAmount: 18090.00, status: "Completed", createdDate: "2026-01-24", processedDate: "2026-01-25" },
  { id: "BATCH-002", name: "January Week 4", claimCount: 3, totalAmount: 29130.00, status: "Processing", createdDate: "2026-01-31", processedDate: "" },
  { id: "BATCH-003", name: "February Week 1", claimCount: 2, totalAmount: 470.00, status: "Pending", createdDate: "2026-02-07", processedDate: "" },
];

const SAMPLE_EDI = [
  { id: "EDI-837-001", type: "837", direction: "Outbound", sender: "CLAUSE-001", receiver: "PAYER-001", claimCount: 4, amount: 18090.00, status: "Transmitted", date: "2026-01-25" },
  { id: "EDI-835-001", type: "835", direction: "Inbound", sender: "PAYER-001", receiver: "CLAUSE-001", claimCount: 3, amount: 14540.00, status: "Received", date: "2026-01-28" },
  { id: "EDI-834-001", type: "834", direction: "Outbound", sender: "CLAUSE-001", receiver: "PAYER-001", claimCount: 0, amount: 0, status: "Transmitted", date: "2026-01-20" },
  { id: "EDI-999-001", type: "999", direction: "Inbound", sender: "PAYER-001", receiver: "CLAUSE-001", claimCount: 0, amount: 0, status: "Accepted", date: "2026-01-26" },
];

// ═══════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════
const colors = {
  primary: "#4F46E5",
  primaryDark: "#3730A3",
  primaryLight: "#6366F1",
  accent: "#06B6D4",
  success: "#16A34A",
  warning: "#D97706",
  danger: "#DC2626",
  info: "#2563EB",
  bg: "#F1F5F9",
  card: "#FFFFFF",
  sidebar: "#1E293B",
  sidebarHover: "#334155",
  text: "#1E293B",
  textMuted: "#64748B",
  border: "#E2E8F0",
  inputBg: "#F8FAFC",
  inputBorder: "#CBD5E1",
};

const styles = {
  app: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif", color: colors.text, background: colors.bg },
  sidebar: { width: 260, background: `linear-gradient(180deg, ${colors.sidebar} 0%, #0F172A 100%)`, color: "#fff", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100, boxShadow: "4px 0 24px rgba(0,0,0,0.15)" },
  sidebarLogo: { padding: "24px 20px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12 },
  logoIcon: { width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryLight} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff" },
  logoText: { fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" },
  logoSub: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  sidebarNav: { flex: 1, padding: "16px 12px", overflowY: "auto" },
  navSection: { fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1.5px", color: "rgba(255,255,255,0.35)", padding: "16px 12px 8px", marginTop: 8 },
  navItem: (active) => ({ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: active ? 600 : 400, background: active ? "rgba(79,70,229,0.2)" : "transparent", color: active ? "#A5B4FC" : "rgba(255,255,255,0.7)", transition: "all 0.2s", marginBottom: 2, border: active ? "1px solid rgba(79,70,229,0.3)" : "1px solid transparent" }),
  navIcon: { fontSize: 18, width: 24, textAlign: "center" },
  sidebarUser: { padding: "16px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 },
  userAvatar: { width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 },
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
  btnPrimary: { padding: "11px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s", boxShadow: "0 2px 8px rgba(79,70,229,0.25)" },
  btnSuccess: { padding: "11px 24px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${colors.success} 0%, #15803D 100%)`, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 2px 8px rgba(22,163,74,0.25)" },
  btnDanger: { padding: "10px 20px", borderRadius: 8, border: "none", background: colors.danger, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnInfo: { padding: "10px 20px", borderRadius: 8, border: "none", background: colors.info, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" },
  btnOutline: { padding: "10px 20px", borderRadius: 8, border: `1.5px solid ${colors.inputBorder}`, background: "#fff", color: colors.text, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "separate", borderSpacing: 0, fontSize: 14 },
  th: { padding: "12px 16px", textAlign: "left", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", color: colors.textMuted, borderBottom: `2px solid ${colors.border}`, background: colors.inputBg },
  td: { padding: "14px 16px", borderBottom: `1px solid ${colors.border}`, verticalAlign: "middle" },
  badge: (type) => {
    const map = { Active: colors.success, Submitted: colors.info, "Under Review": colors.warning, Approved: colors.success, Rejected: colors.danger, Inactive: colors.textMuted, Pending: colors.textMuted, Processing: colors.info, Completed: colors.success, Failed: colors.danger, Transmitted: "#0D9488", Received: colors.info, Accepted: colors.success, High: colors.danger, Medium: colors.warning, Low: colors.textMuted };
    const c = map[type] || colors.textMuted;
    return { display: "inline-block", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: `${c}18`, color: c, border: `1px solid ${c}30` };
  },
  stat: { padding: 20, borderRadius: 12, background: "#fff", border: `1px solid ${colors.border}`, display: "flex", flexDirection: "column", gap: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  statValue: { fontSize: 32, fontWeight: 800, letterSpacing: "-1px" },
  statLabel: { fontSize: 13, color: colors.textMuted, fontWeight: 500 },
  statSub: { fontSize: 11, color: colors.textMuted },
  toast: { position: "fixed", top: 24, right: 24, background: colors.success, color: "#fff", padding: "14px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, zIndex: 999, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10, animation: "slideIn 0.3s ease" },
  loginPage: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: `linear-gradient(135deg, ${colors.sidebar} 0%, #0F172A 50%, ${colors.primaryDark} 100%)` },
  loginCard: { background: "#fff", borderRadius: 16, padding: "48px 40px", width: 420, boxShadow: "0 24px 64px rgba(0,0,0,0.3)" },
  loginTitle: { fontSize: 26, fontWeight: 800, textAlign: "center", color: colors.text, marginBottom: 4, letterSpacing: "-0.5px" },
  loginSub: { fontSize: 14, color: colors.textMuted, textAlign: "center", marginBottom: 32 },
  loginInput: { width: "100%", padding: "13px 16px", borderRadius: 10, border: `1.5px solid ${colors.inputBorder}`, fontSize: 15, outline: "none", background: colors.inputBg, boxSizing: "border-box", transition: "border-color 0.2s" },
  loginBtn: { width: "100%", padding: "14px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", marginTop: 8, boxShadow: "0 4px 16px rgba(79,70,229,0.3)", transition: "transform 0.2s" },
  error: { color: colors.danger, fontSize: 13, textAlign: "center", marginTop: 12, fontWeight: 500 },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" },
  modalContent: { background: "#fff", borderRadius: 16, padding: 32, width: 800, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" },
  modalTitle: { fontSize: 20, fontWeight: 700, marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between" },
  tab: (active) => ({ padding: "10px 20px", border: "none", borderBottom: active ? `3px solid ${colors.primary}` : "3px solid transparent", background: "transparent", color: active ? colors.primary : colors.textMuted, fontWeight: active ? 700 : 500, fontSize: 14, cursor: "pointer", transition: "all 0.2s" }),
  detailRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 },
  detailLabel: { fontSize: 12, fontWeight: 600, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 },
  detailValue: { fontSize: 15, fontWeight: 600, color: colors.text },
};

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════
function FormInput({ id, label, required, type = "text", value, onChange, placeholder, testId, readOnly }) {
  const tid = testId || id;
  return (
    <div style={styles.formGroup}>
      <label htmlFor={id} style={styles.label} data-testid={`label-${tid}`} id={`label-${id}`}>
        {label} {required && <span style={styles.required}>*</span>}
      </label>
      <input id={id} name={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || `Enter ${label.toLowerCase()}`} required={required} aria-label={label} aria-required={required} data-testid={`input-${tid}`} style={{ ...styles.input, ...(readOnly ? { background: "#f0f0f0" } : {}) }} readOnly={readOnly}
        onFocus={(e) => { if (!readOnly) { e.target.style.borderColor = colors.primary; e.target.style.boxShadow = `0 0 0 3px ${colors.primary}20`; } }}
        onBlur={(e) => { e.target.style.borderColor = colors.inputBorder; e.target.style.boxShadow = "none"; }}
      />
    </div>
  );
}

function FormSelect({ id, label, required, value, onChange, options, placeholder, testId }) {
  const tid = testId || id;
  return (
    <div style={styles.formGroup}>
      <label htmlFor={id} style={styles.label} data-testid={`label-${tid}`} id={`label-${id}`}>
        {label} {required && <span style={styles.required}>*</span>}
      </label>
      <select id={id} name={id} value={value} onChange={(e) => onChange(e.target.value)} required={required} aria-label={label} aria-required={required} data-testid={`select-${tid}`} style={styles.select}>
        <option value="">{placeholder || `Select ${label.toLowerCase()}`}</option>
        {options.map((o) => (
          <option key={typeof o === "string" ? o : o.code} value={typeof o === "string" ? o : o.code}>
            {typeof o === "string" ? o : `${o.code} - ${o.desc || o.name}`}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (<div style={styles.toast} data-testid="toast-notification" role="alert" aria-live="polite"><span>✓</span> {message}</div>);
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
    if (!user || user.password !== password) { setError("Invalid credentials. Try: claim.analyst / analyst123"); return; }
    onLogin({ username, ...user });
  };

  return (
    <div style={styles.loginPage} data-testid="login-page" id="login-page">
      <div style={styles.loginCard} data-testid="login-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ ...styles.logoIcon, margin: "0 auto 16px", width: 56, height: 56, fontSize: 26 }}>⚕</div>
          <div style={styles.loginTitle} data-testid="login-title">Claims Management System</div>
          <div style={styles.loginSub} data-testid="login-subtitle">US Health Insurance Platform</div>
        </div>
        <form onSubmit={handleLogin} data-testid="login-form" id="login-form">
          <div style={{ ...styles.formGroup, marginBottom: 16 }}>
            <label htmlFor="username" style={styles.label} data-testid="label-username" id="label-username">Username <span style={styles.required}>*</span></label>
            <input id="username" name="username" type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} placeholder="Enter username" required aria-label="Username" aria-required="true" data-testid="input-username" style={styles.loginInput} autoFocus />
          </div>
          <div style={{ ...styles.formGroup, marginBottom: 20 }}>
            <label htmlFor="password" style={styles.label} data-testid="label-password" id="label-password">Password <span style={styles.required}>*</span></label>
            <input id="password" name="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Enter password" required aria-label="Password" aria-required="true" data-testid="input-password" style={styles.loginInput} />
          </div>
          {error && <div style={styles.error} data-testid="login-error" role="alert">{error}</div>}
          <button type="submit" style={styles.loginBtn} data-testid="btn-login" id="btn-login" aria-label="Log In">Log In</button>
        </form>
        <div style={{ marginTop: 24, padding: "16px", background: colors.inputBg, borderRadius: 10, fontSize: 12, color: colors.textMuted }} data-testid="login-help">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Demo Credentials:</div>
          <div>claim.analyst / analyst123</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════
function DashboardPage({ user, claims }) {
  const submitted = claims.filter(c => c.status === "Submitted").length;
  const underReview = claims.filter(c => c.status === "Under Review").length;
  const approved = claims.filter(c => c.status === "Approved");
  const rejected = claims.filter(c => c.status === "Rejected");
  const totalAmount = claims.reduce((s, c) => s + c.amount, 0);
  const approvedAmount = approved.reduce((s, c) => s + c.amount, 0);
  const rejectedAmount = rejected.reduce((s, c) => s + c.amount, 0);
  const facilityCount = new Set(claims.map(c => c.facility)).size;

  return (
    <div data-testid="dashboard-page" id="dashboard-page">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
        <div style={styles.stat} data-testid="stat-total-claims">
          <div style={styles.statLabel}>Total Claims</div>
          <div style={{ ...styles.statValue, color: colors.primary }} data-testid="stat-total-claims-value">{claims.length}</div>
          <div style={styles.statSub}>Submitted: {submitted} · Review: {underReview}</div>
        </div>
        <div style={styles.stat} data-testid="stat-total-amount">
          <div style={styles.statLabel}>Total Claim Amount</div>
          <div style={{ ...styles.statValue, color: colors.info }} data-testid="stat-total-amount-value">${totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
        </div>
        <div style={styles.stat} data-testid="stat-approved">
          <div style={styles.statLabel}>Total Approved</div>
          <div style={{ ...styles.statValue, color: colors.success }} data-testid="stat-approved-value">${approvedAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          <div style={styles.statSub}>{approved.length} claims · {((approved.length/claims.length)*100).toFixed(1)}%</div>
        </div>
        <div style={styles.stat} data-testid="stat-rejected">
          <div style={styles.statLabel}>Total Rejected</div>
          <div style={{ ...styles.statValue, color: colors.danger }} data-testid="stat-rejected-value">${rejectedAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          <div style={styles.statSub}>{rejected.length} claims · {((rejected.length/claims.length)*100).toFixed(1)}%</div>
        </div>
        <div style={styles.stat} data-testid="stat-facilities">
          <div style={styles.statLabel}>Health Facilities</div>
          <div style={{ ...styles.statValue, color: "#0D9488" }} data-testid="stat-facilities-value">{facilityCount}</div>
          <div style={styles.statSub}>Submitted claims</div>
        </div>
      </div>

      <div style={styles.card} data-testid="recent-claims-card">
        <div style={styles.cardTitle}>📋 Recent Claims</div>
        <table style={styles.table} data-testid="recent-claims-table" aria-label="Recent Claims">
          <thead>
            <tr>
              <th style={styles.th}>Claim ID</th><th style={styles.th}>Patient</th><th style={styles.th}>Facility</th>
              <th style={styles.th}>Amount</th><th style={styles.th}>Status</th><th style={styles.th}>Priority</th><th style={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {claims.slice(0, 8).map(c => (
              <tr key={c.id} data-testid={`claim-row-${c.id}`}>
                <td style={{ ...styles.td, fontWeight: 600 }} data-testid={`claim-id-${c.id}`}>{c.id}</td>
                <td style={styles.td}>{c.patientName}</td>
                <td style={styles.td}>{c.facility}</td>
                <td style={styles.td}>${c.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td style={styles.td}><span style={styles.badge(c.status)} data-testid={`claim-status-${c.id}`}>{c.status}</span></td>
                <td style={styles.td}><span style={styles.badge(c.priority)} data-testid={`claim-priority-${c.id}`}>{c.priority}</span></td>
                <td style={styles.td}>{c.serviceDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MEMBERS PAGE
// ═══════════════════════════════════════════════════════════════
function MembersPage({ members }) {
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase()) ||
    m.planId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-testid="members-page" id="members-page">
      <div style={{ ...styles.formGroup, maxWidth: 400, marginBottom: 24 }}>
        <label htmlFor="search-members" style={styles.label} data-testid="label-search-members">Search Members</label>
        <input id="search-members" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, member ID, or plan ID..." aria-label="Search Members" data-testid="input-search-members" style={styles.input} />
      </div>

      <div style={styles.card} data-testid="members-list-card">
        <div style={styles.cardTitle}>👥 Members ({filtered.length})</div>
        <table style={styles.table} data-testid="members-table" aria-label="Members">
          <thead>
            <tr>
              <th style={styles.th} data-testid="th-member-id">Member ID</th>
              <th style={styles.th} data-testid="th-member-name">Name</th>
              <th style={styles.th} data-testid="th-member-dob">DOB</th>
              <th style={styles.th} data-testid="th-member-plan">Plan</th>
              <th style={styles.th} data-testid="th-member-plan-id">Plan ID</th>
              <th style={styles.th} data-testid="th-member-status">Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} data-testid={`member-row-${m.id}`}>
                <td style={{ ...styles.td, fontWeight: 600 }} data-testid={`member-id-${m.id}`}>{m.id}</td>
                <td style={styles.td}>{m.name}</td>
                <td style={styles.td}>{m.dob}</td>
                <td style={styles.td}>{m.planName}</td>
                <td style={styles.td}><code style={{ background: colors.inputBg, padding: "2px 8px", borderRadius: 4, fontSize: 13 }}>{m.planId}</code></td>
                <td style={styles.td}><span style={styles.badge(m.status)}>{m.status}</span></td>
                <td style={styles.td}>
                  <button onClick={() => setSelectedMember(m)} style={{ ...styles.btnOutline, padding: "6px 12px", fontSize: 12 }} data-testid={`btn-view-${m.id}`} aria-label={`View ${m.name}`}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMember && (
        <div style={styles.modal} data-testid="modal-member-detail" role="dialog" aria-label="Member Detail" aria-modal="true">
          <div style={{ ...styles.modalContent, width: 700 }} data-testid="modal-content-member">
            <div style={styles.modalTitle}>
              <span data-testid="modal-member-title">Member: {selectedMember.name}</span>
              <button onClick={() => setSelectedMember(null)} style={{ ...styles.btnOutline, padding: "6px 14px" }} data-testid="btn-close-member" aria-label="Close">✕</button>
            </div>

            <div style={{ ...styles.cardTitle, fontSize: 14, color: colors.primaryLight }}>Personal Information</div>
            <div style={styles.detailRow}>
              <div><div style={styles.detailLabel}>Full Name</div><div style={styles.detailValue} data-testid="member-detail-name">{selectedMember.name}</div></div>
              <div><div style={styles.detailLabel}>Date of Birth</div><div style={styles.detailValue} data-testid="member-detail-dob">{selectedMember.dob}</div></div>
              <div><div style={styles.detailLabel}>Gender</div><div style={styles.detailValue} data-testid="member-detail-gender">{selectedMember.gender}</div></div>
              <div><div style={styles.detailLabel}>SSN (Last 4)</div><div style={styles.detailValue} data-testid="member-detail-ssn">{selectedMember.ssn}</div></div>
              <div><div style={styles.detailLabel}>Address</div><div style={styles.detailValue} data-testid="member-detail-address">{selectedMember.address}</div></div>
              <div><div style={styles.detailLabel}>Phone</div><div style={styles.detailValue} data-testid="member-detail-phone">{selectedMember.phone}</div></div>
            </div>

            <div style={{ ...styles.cardTitle, fontSize: 14, color: colors.primaryLight, marginTop: 16 }}>Coverage</div>
            <div style={styles.detailRow}>
              <div><div style={styles.detailLabel}>Plan ID</div><div style={styles.detailValue} data-testid="member-detail-plan-id">{selectedMember.planId}</div></div>
              <div><div style={styles.detailLabel}>Plan Name</div><div style={styles.detailValue} data-testid="member-detail-plan-name">{selectedMember.planName}</div></div>
              <div><div style={styles.detailLabel}>Group #</div><div style={styles.detailValue} data-testid="member-detail-group">{selectedMember.groupNo}</div></div>
              <div><div style={styles.detailLabel}>Effective Date</div><div style={styles.detailValue} data-testid="member-detail-effective">{selectedMember.effectiveDate}</div></div>
              <div><div style={styles.detailLabel}>Term Date</div><div style={styles.detailValue} data-testid="member-detail-term">{selectedMember.termDate}</div></div>
              <div><div style={styles.detailLabel}>Status</div><span style={styles.badge(selectedMember.status)} data-testid="member-detail-status">{selectedMember.status}</span></div>
            </div>

            {selectedMember.dependents.length > 0 && (
              <>
                <div style={{ ...styles.cardTitle, fontSize: 14, color: colors.primaryLight, marginTop: 16 }}>Dependents</div>
                <table style={styles.table} data-testid="member-dependents-table">
                  <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Relationship</th><th style={styles.th}>DOB</th><th style={styles.th}>Status</th></tr></thead>
                  <tbody>
                    {selectedMember.dependents.map((d, i) => (
                      <tr key={i} data-testid={`dependent-row-${i}`}>
                        <td style={styles.td}>{d.name}</td><td style={styles.td}>{d.rel}</td><td style={styles.td}>{d.dob}</td>
                        <td style={styles.td}><span style={styles.badge(d.status)}>{d.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HEALTH PLANS PAGE (Read-Only)
// ═══════════════════════════════════════════════════════════════
function HealthPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("benefits");
  const [searchCode, setSearchCode] = useState("");
  const [searchName, setSearchName] = useState("");

  const filtered = HEALTH_PLANS.filter(p =>
    p.code.toLowerCase().includes(searchCode.toLowerCase()) &&
    p.name.toLowerCase().includes(searchName.toLowerCase())
  );

  const plan = selectedPlan || HEALTH_PLANS[0]; // PPO Gold Plus has full data

  return (
    <div data-testid="health-plans-page" id="health-plans-page">
      <div style={{ ...styles.card, marginBottom: 24 }} data-testid="plans-search-card">
        <div style={styles.cardTitle}>🔍 Search Health Plans</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <FormInput id="search-product-code" label="Product Code" value={searchCode} onChange={setSearchCode} placeholder="e.g., PPO-GOLD" testId="search-product-code" />
          <FormInput id="search-plan-name" label="Plan Name" value={searchName} onChange={setSearchName} placeholder="e.g., PPO Gold" testId="search-plan-name" />
        </div>
      </div>

      {!selectedPlan ? (
        <div style={styles.card} data-testid="plans-list-card">
          <div style={styles.cardTitle}>📋 Health Plans ({filtered.length})</div>
          <table style={styles.table} data-testid="plans-table" aria-label="Health Plans">
            <thead>
              <tr>
                <th style={styles.th}>Product Code</th><th style={styles.th}>Plan Name</th><th style={styles.th}>Type</th>
                <th style={styles.th}>State</th><th style={styles.th}>Min Age</th><th style={styles.th}>Period</th>
                <th style={styles.th}>Status</th><th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.code} data-testid={`plan-row-${p.code}`}>
                  <td style={{ ...styles.td, fontWeight: 600 }}>{p.code}</td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}><span style={{ ...styles.badge("Active"), color: colors.primary, background: `${colors.primary}15`, border: `1px solid ${colors.primary}30` }}>{p.type}</span></td>
                  <td style={styles.td}>{p.state}</td>
                  <td style={styles.td}>{p.minAge}</td>
                  <td style={styles.td}>{p.period}</td>
                  <td style={styles.td}><span style={styles.badge(p.status)}>{p.status}</span></td>
                  <td style={styles.td}><button onClick={() => { setSelectedPlan(p); setActiveTab("benefits"); }} style={{ ...styles.btnOutline, padding: "6px 12px", fontSize: 12, color: colors.info }} data-testid={`btn-open-${p.code}`}>Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.card} data-testid="plan-detail-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div style={styles.cardTitle}>📄 {selectedPlan.name}</div>
            <button onClick={() => setSelectedPlan(null)} style={styles.btnOutline} data-testid="btn-back-plans" aria-label="Back to Plans">← Back to Plans</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
            <div><div style={styles.detailLabel}>Product Code</div><div style={styles.detailValue} data-testid="plan-product-code">{selectedPlan.code}</div></div>
            <div><div style={styles.detailLabel}>Plan Type</div><div style={styles.detailValue} data-testid="plan-type">{selectedPlan.type}</div></div>
            <div><div style={styles.detailLabel}>State</div><div style={styles.detailValue} data-testid="plan-state">{selectedPlan.state}</div></div>
            <div><div style={styles.detailLabel}>Status</div><span style={styles.badge(selectedPlan.status)} data-testid="plan-status">{selectedPlan.status}</span></div>
            <div><div style={styles.detailLabel}>Age Range</div><div style={styles.detailValue} data-testid="plan-age-range">{selectedPlan.minAge} - {selectedPlan.maxAge}</div></div>
            <div><div style={styles.detailLabel}>Period</div><div style={styles.detailValue} data-testid="plan-period">{selectedPlan.period}</div></div>
            <div><div style={styles.detailLabel}>Valid From</div><div style={styles.detailValue} data-testid="plan-valid-from">{selectedPlan.validFrom}</div></div>
            <div><div style={styles.detailLabel}>Valid To</div><div style={styles.detailValue} data-testid="plan-valid-to">{selectedPlan.validTo}</div></div>
          </div>

          <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${colors.border}`, marginBottom: 24 }}>
            <button style={styles.tab(activeTab === "benefits")} onClick={() => setActiveTab("benefits")} data-testid="tab-benefits">Plan Benefits</button>
            <button style={styles.tab(activeTab === "network")} onClick={() => setActiveTab("network")} data-testid="tab-network">Provider Network</button>
            <button style={styles.tab(activeTab === "deductibles")} onClick={() => setActiveTab("deductibles")} data-testid="tab-deductibles">Deductibles & OOP Max</button>
          </div>

          {activeTab === "benefits" && selectedPlan.benefits.length > 0 && (
            <table style={styles.table} data-testid="benefits-table" aria-label="Plan Benefits">
              <thead><tr><th style={styles.th}>Service</th><th style={styles.th}>Copay</th><th style={styles.th}>Coinsurance</th><th style={styles.th}>Prior Auth?</th><th style={styles.th}>Annual Limit</th></tr></thead>
              <tbody>
                {selectedPlan.benefits.map((b, i) => (
                  <tr key={i} data-testid={`benefit-row-${i}`}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{b.service}</td><td style={styles.td}>{b.copay}</td><td style={styles.td}>{b.coinsurance}</td>
                    <td style={styles.td}><span style={{ color: b.priorAuth === "No" ? colors.success : colors.danger, fontWeight: 600 }}>{b.priorAuth}</span></td><td style={styles.td}>{b.limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === "benefits" && selectedPlan.benefits.length === 0 && <div style={{ padding: 40, textAlign: "center", color: colors.textMuted }}>Benefits data available for PPO Gold Plus. Open that plan for full details.</div>}

          {activeTab === "network" && selectedPlan.network.length > 0 && (
            <table style={styles.table} data-testid="network-table" aria-label="Provider Network">
              <thead><tr><th style={styles.th}>Service</th><th style={styles.th}>In-Network</th><th style={styles.th}>Out-of-Network</th><th style={styles.th}>Network Size</th></tr></thead>
              <tbody>
                {selectedPlan.network.map((n, i) => (
                  <tr key={i} data-testid={`network-row-${i}`}>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{n.service}</td>
                    <td style={{ ...styles.td, color: colors.success }}>{n.inNetwork}</td>
                    <td style={{ ...styles.td, color: colors.danger }}>{n.outNetwork}</td>
                    <td style={styles.td}>{n.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {activeTab === "network" && selectedPlan.network.length === 0 && <div style={{ padding: 40, textAlign: "center", color: colors.textMuted }}>Network data available for PPO Gold Plus.</div>}

          {activeTab === "deductibles" && selectedPlan.deductibles.indivIn && (
            <table style={styles.table} data-testid="deductibles-table" aria-label="Deductibles">
              <thead><tr><th style={styles.th}>Cost Category</th><th style={styles.th}>Individual</th><th style={styles.th}>Family</th></tr></thead>
              <tbody>
                <tr data-testid="deductible-in"><td style={{ ...styles.td, fontWeight: 600 }}>Annual Deductible (In-Network)</td><td style={styles.td}>{selectedPlan.deductibles.indivIn}</td><td style={styles.td}>{selectedPlan.deductibles.famIn}</td></tr>
                <tr data-testid="deductible-out"><td style={{ ...styles.td, fontWeight: 600 }}>Annual Deductible (Out-of-Network)</td><td style={styles.td}>{selectedPlan.deductibles.indivOut}</td><td style={styles.td}>{selectedPlan.deductibles.famOut}</td></tr>
                <tr data-testid="oop-in"><td style={{ ...styles.td, fontWeight: 600 }}>Out-of-Pocket Max (In-Network)</td><td style={styles.td}>{selectedPlan.deductibles.oopIndivIn}</td><td style={styles.td}>{selectedPlan.deductibles.oopFamIn}</td></tr>
                <tr data-testid="oop-out"><td style={{ ...styles.td, fontWeight: 600 }}>Out-of-Pocket Max (Out-of-Network)</td><td style={styles.td}>{selectedPlan.deductibles.oopIndivOut}</td><td style={styles.td}>{selectedPlan.deductibles.oopFamOut}</td></tr>
              </tbody>
            </table>
          )}
          {activeTab === "deductibles" && !selectedPlan.deductibles.indivIn && <div style={{ padding: 40, textAlign: "center", color: colors.textMuted }}>Deductible data available for PPO Gold Plus.</div>}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLAIMS PAGE (Submit + List)
// ═══════════════════════════════════════════════════════════════
function ClaimsPage({ claims, setClaims, members }) {
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ planId: "", facility: "", visitType: "", diagnosisCode: "", procedureCode: "", serviceDate: "", amount: "", priority: "" });

  const getMemberName = (pid) => { const m = members.find(mb => mb.planId === pid); return m ? m.name : ""; };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fac = FACILITIES.find(f => f.id === form.facility);
    const newClaim = {
      id: `CLM-2026-${String(claims.length + 1).padStart(3, "0")}`,
      planId: form.planId, patientName: getMemberName(form.planId), facility: fac ? fac.name : form.facility,
      visitType: form.visitType, diagnosisCode: form.diagnosisCode, procedureCode: form.procedureCode,
      serviceDate: form.serviceDate, amount: parseFloat(form.amount), status: "Submitted", priority: form.priority || "Medium",
      submittedDate: new Date().toISOString().split("T")[0],
    };
    setClaims([...claims, newClaim]);
    setShowForm(false);
    setForm({ planId: "", facility: "", visitType: "", diagnosisCode: "", procedureCode: "", serviceDate: "", amount: "", priority: "" });
    setToast(`Claim ${newClaim.id} submitted successfully!`);
  };

  return (
    <div data-testid="claims-page" id="claims-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div style={{ marginBottom: 24 }}>
        <button onClick={() => setShowForm(true)} style={styles.btnPrimary} data-testid="btn-new-claim" id="btn-new-claim" aria-label="New Claim">+ New Claim</button>
      </div>

      <div style={styles.card} data-testid="claims-list-card">
        <div style={styles.cardTitle}>🏥 Claims Register ({claims.length})</div>
        <table style={styles.table} data-testid="claims-table" aria-label="Claims Register">
          <thead>
            <tr>
              <th style={styles.th} data-testid="th-claim-id">Claim ID</th><th style={styles.th} data-testid="th-patient">Patient</th>
              <th style={styles.th} data-testid="th-facility">Facility</th><th style={styles.th} data-testid="th-diagnosis">ICD Code</th>
              <th style={styles.th} data-testid="th-procedure">CPT Code</th><th style={styles.th} data-testid="th-amount">Amount</th>
              <th style={styles.th} data-testid="th-claim-status">Status</th><th style={styles.th} data-testid="th-priority">Priority</th>
            </tr>
          </thead>
          <tbody>
            {claims.map(c => (
              <tr key={c.id} data-testid={`claim-row-${c.id}`}>
                <td style={{ ...styles.td, fontWeight: 600 }} data-testid={`claim-id-${c.id}`}>{c.id}</td>
                <td style={styles.td}>{c.patientName}</td><td style={styles.td}>{c.facility}</td>
                <td style={styles.td}><code style={{ background: colors.inputBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{c.diagnosisCode}</code></td>
                <td style={styles.td}><code style={{ background: colors.inputBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{c.procedureCode}</code></td>
                <td style={styles.td}>${c.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td style={styles.td}><span style={styles.badge(c.status)} data-testid={`claim-status-${c.id}`}>{c.status}</span></td>
                <td style={styles.td}><span style={styles.badge(c.priority)} data-testid={`claim-priority-${c.id}`}>{c.priority}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                <FormSelect id="plan-id" label="Plan ID" required value={form.planId} onChange={v => setForm({ ...form, planId: v })} options={members.map(m => ({ code: m.planId, desc: m.name }))} testId="plan-id" />
                <FormInput id="patient-name" label="Patient Name" value={getMemberName(form.planId)} onChange={() => {}} readOnly testId="patient-name" />
                <FormSelect id="facility" label="Health Facility" required value={form.facility} onChange={v => setForm({ ...form, facility: v })} options={FACILITIES.map(f => ({ code: f.id, desc: f.name }))} testId="facility" />
              </div>
              <div style={{ ...styles.cardTitle, fontSize: 14, marginTop: 24, marginBottom: 16, color: colors.primaryLight }}>Service Details</div>
              <div style={styles.formGrid}>
                <FormSelect id="visit-type" label="Visit Type" required value={form.visitType} onChange={v => setForm({ ...form, visitType: v })} options={VISIT_TYPES} testId="visit-type" />
                <FormSelect id="diagnosis-code" label="ICD Code" required value={form.diagnosisCode} onChange={v => setForm({ ...form, diagnosisCode: v })} options={DIAGNOSIS_CODES} testId="diagnosis-code" />
                <FormSelect id="procedure-code" label="CPT Code" required value={form.procedureCode} onChange={v => setForm({ ...form, procedureCode: v })} options={PROCEDURE_CODES} testId="procedure-code" />
                <FormInput id="service-date" label="Service Date" type="date" required value={form.serviceDate} onChange={v => setForm({ ...form, serviceDate: v })} testId="service-date" />
                <FormInput id="billing-amount" label="Billing Amount ($)" type="number" required value={form.amount} onChange={v => setForm({ ...form, amount: v })} placeholder="0.00" testId="billing-amount" />
                <FormSelect id="priority" label="Priority" required value={form.priority} onChange={v => setForm({ ...form, priority: v })} options={PRIORITIES} testId="priority" />
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 28, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowForm(false)} style={styles.btnOutline} data-testid="btn-cancel-claim" aria-label="Cancel">Cancel</button>
                <button type="submit" style={styles.btnSuccess} data-testid="btn-submit-claim" id="btn-submit-claim" aria-label="Submit Claim">✓ Submit Claim</button>
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
  const [searchText, setSearchText] = useState("");
  const [selectedClaim, setSelectedClaim] = useState(null);

  const filtered = claims.filter(c => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (searchText && !c.id.toLowerCase().includes(searchText.toLowerCase()) && !c.patientName.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const updateStatus = (claimId, newStatus) => {
    setClaims(claims.map(c => c.id === claimId ? { ...c, status: newStatus } : c));
    setSelectedClaim(null);
    setToast(`Claim ${claimId} → ${newStatus}`);
  };

  return (
    <div data-testid="claims-review-page" id="claims-review-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}

      <div style={{ ...styles.card, marginBottom: 24 }} data-testid="review-filters-card">
        <div style={styles.cardTitle}>🔍 Search & Filter</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 16, alignItems: "flex-end" }}>
          <FormInput id="search-claims" label="Search" value={searchText} onChange={setSearchText} placeholder="Claim ID or patient name..." testId="search-claims" />
          <FormSelect id="filter-status" label="Status" value={statusFilter} onChange={setStatusFilter} options={CLAIM_STATUSES} placeholder="All Statuses" testId="filter-status" />
          <button onClick={() => { setStatusFilter(""); setSearchText(""); }} style={styles.btnOutline} data-testid="btn-clear-filters" aria-label="Clear Filters">Clear</button>
        </div>
      </div>

      <div style={styles.card} data-testid="review-results-card">
        <div style={styles.cardTitle}>📋 Claims for Review ({filtered.length})</div>
        <table style={styles.table} data-testid="review-table" aria-label="Claims Review">
          <thead>
            <tr><th style={styles.th}>Claim ID</th><th style={styles.th}>Patient</th><th style={styles.th}>Facility</th><th style={styles.th}>ICD</th><th style={styles.th}>Amount</th><th style={styles.th}>Status</th><th style={styles.th}>Priority</th><th style={styles.th}>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} data-testid={`review-row-${c.id}`}>
                <td style={{ ...styles.td, fontWeight: 600 }} data-testid={`review-id-${c.id}`}>{c.id}</td>
                <td style={styles.td}>{c.patientName}</td><td style={styles.td}>{c.facility}</td>
                <td style={styles.td}><code style={{ background: colors.inputBg, padding: "2px 6px", borderRadius: 4, fontSize: 12 }}>{c.diagnosisCode}</code></td>
                <td style={styles.td}>${c.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td style={styles.td}><span style={styles.badge(c.status)} data-testid={`review-status-${c.id}`}>{c.status}</span></td>
                <td style={styles.td}><span style={styles.badge(c.priority)}>{c.priority}</span></td>
                <td style={styles.td}><button onClick={() => setSelectedClaim(c)} style={{ ...styles.btnOutline, padding: "6px 12px", fontSize: 12 }} data-testid={`btn-review-${c.id}`}>Review</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedClaim && (
        <div style={styles.modal} data-testid="modal-review-claim" role="dialog" aria-label="Review Claim" aria-modal="true">
          <div style={{ ...styles.modalContent, width: 600 }} data-testid="modal-content-review">
            <div style={styles.modalTitle}>
              <span data-testid="modal-review-title">Claim Review: {selectedClaim.id}</span>
              <button onClick={() => setSelectedClaim(null)} style={{ ...styles.btnOutline, padding: "6px 14px" }} data-testid="btn-close-review" aria-label="Close">✕</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div><span style={styles.detailLabel}>Patient</span><strong data-testid="review-detail-patient">{selectedClaim.patientName}</strong></div>
              <div><span style={styles.detailLabel}>Plan ID</span><strong data-testid="review-detail-plan-id">{selectedClaim.planId}</strong></div>
              <div><span style={styles.detailLabel}>Facility</span><strong data-testid="review-detail-facility">{selectedClaim.facility}</strong></div>
              <div><span style={styles.detailLabel}>Visit Type</span><strong data-testid="review-detail-visit">{selectedClaim.visitType}</strong></div>
              <div><span style={styles.detailLabel}>ICD Code</span><strong data-testid="review-detail-diagnosis">{selectedClaim.diagnosisCode}</strong></div>
              <div><span style={styles.detailLabel}>CPT Code</span><strong data-testid="review-detail-procedure">{selectedClaim.procedureCode}</strong></div>
              <div><span style={styles.detailLabel}>Service Date</span><strong data-testid="review-detail-date">{selectedClaim.serviceDate}</strong></div>
              <div><span style={styles.detailLabel}>Billing Amount</span><strong data-testid="review-detail-amount">${selectedClaim.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></div>
              <div><span style={styles.detailLabel}>Current Status</span><span style={styles.badge(selectedClaim.status)} data-testid="review-detail-status">{selectedClaim.status}</span></div>
              <div><span style={styles.detailLabel}>Submitted Date</span><strong data-testid="review-detail-submitted">{selectedClaim.submittedDate}</strong></div>
            </div>
            <div style={{ ...styles.cardTitle, fontSize: 14, color: colors.primaryLight }}>Update Status</div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
              {selectedClaim.status !== "Under Review" && <button onClick={() => updateStatus(selectedClaim.id, "Under Review")} style={styles.btnInfo} data-testid="btn-under-review" aria-label="Under Review">→ Under Review</button>}
              {selectedClaim.status !== "Approved" && <button onClick={() => updateStatus(selectedClaim.id, "Approved")} style={{ ...styles.btnSuccess, padding: "10px 20px", fontSize: 13 }} data-testid="btn-approve" aria-label="Approve">✓ Approve</button>}
              {selectedClaim.status !== "Rejected" && <button onClick={() => updateStatus(selectedClaim.id, "Rejected")} style={styles.btnDanger} data-testid="btn-reject" aria-label="Reject">✕ Reject</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FACILITY CLAIMS PAGE
// ═══════════════════════════════════════════════════════════════
function FacilityClaimsPage({ claims }) {
  const [selectedFacility, setSelectedFacility] = useState(null);

  const facilityStats = FACILITIES.map(f => {
    const fClaims = claims.filter(c => c.facility === f.name);
    return {
      ...f, totalClaims: fClaims.length,
      approved: fClaims.filter(c => c.status === "Approved").length,
      rejected: fClaims.filter(c => c.status === "Rejected").length,
      totalAmount: fClaims.reduce((s, c) => s + c.amount, 0),
      claims: fClaims,
    };
  }).filter(f => f.totalClaims > 0);

  return (
    <div data-testid="facility-claims-page" id="facility-claims-page">
      <div style={styles.card} data-testid="facility-summary-card">
        <div style={styles.cardTitle}>🏥 Health Facility Claims Summary</div>
        <table style={styles.table} data-testid="facility-table" aria-label="Facility Claims">
          <thead>
            <tr><th style={styles.th}>Health Facility</th><th style={styles.th}>Total Claims</th><th style={styles.th}>Approved</th><th style={styles.th}>Rejected</th><th style={styles.th}>Total Amount</th><th style={styles.th}>Action</th></tr>
          </thead>
          <tbody>
            {facilityStats.map(f => (
              <tr key={f.id} data-testid={`facility-row-${f.id}`}>
                <td style={{ ...styles.td, fontWeight: 600 }}>{f.name}</td>
                <td style={styles.td}>{f.totalClaims}</td>
                <td style={{ ...styles.td, color: colors.success, fontWeight: 600 }}>{f.approved}</td>
                <td style={{ ...styles.td, color: colors.danger, fontWeight: 600 }}>{f.rejected}</td>
                <td style={styles.td}>${f.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td style={styles.td}><button onClick={() => setSelectedFacility(f)} style={{ ...styles.btnOutline, padding: "6px 12px", fontSize: 12, color: colors.info }} data-testid={`btn-view-facility-${f.id}`}>View Claims</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedFacility && (
        <div style={{ ...styles.card, marginTop: 24 }} data-testid="facility-claims-detail">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={styles.cardTitle}>📋 {selectedFacility.name} — Claims ({selectedFacility.totalClaims})</div>
            <button onClick={() => setSelectedFacility(null)} style={styles.btnOutline} data-testid="btn-close-facility-detail">Close</button>
          </div>
          <table style={styles.table} data-testid="facility-claims-table">
            <thead><tr><th style={styles.th}>Claim ID</th><th style={styles.th}>Patient</th><th style={styles.th}>ICD</th><th style={styles.th}>Amount</th><th style={styles.th}>Status</th><th style={styles.th}>Date</th></tr></thead>
            <tbody>
              {selectedFacility.claims.map(c => (
                <tr key={c.id}><td style={{ ...styles.td, fontWeight: 600 }}>{c.id}</td><td style={styles.td}>{c.patientName}</td><td style={styles.td}>{c.diagnosisCode}</td><td style={styles.td}>${c.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td><td style={styles.td}><span style={styles.badge(c.status)}>{c.status}</span></td><td style={styles.td}>{c.serviceDate}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COVERAGE / ELIGIBILITY PAGE
// ═══════════════════════════════════════════════════════════════
function CoveragePage({ members }) {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);

  const handleVerify = () => {
    const m = members.find(mb => mb.planId.toLowerCase() === search.toLowerCase() || mb.name.toLowerCase().includes(search.toLowerCase()) || mb.id.toLowerCase() === search.toLowerCase());
    setResult(m || "not_found");
  };

  return (
    <div data-testid="coverage-page" id="coverage-page">
      <div style={styles.card} data-testid="eligibility-search-card">
        <div style={styles.cardTitle}>🔍 Verify Coverage / Eligibility</div>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
          <div style={{ ...styles.formGroup, flex: 1, maxWidth: 400 }}>
            <label htmlFor="eligibility-search" style={styles.label} data-testid="label-eligibility-search">Member ID, Plan ID, or Name</label>
            <input id="eligibility-search" type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="e.g., MBR-100001, INS-100001, Robert Anderson" aria-label="Eligibility Search" data-testid="input-eligibility-search" style={styles.input} onKeyDown={e => e.key === "Enter" && handleVerify()} />
          </div>
          <button onClick={handleVerify} style={styles.btnPrimary} data-testid="btn-verify-eligibility" aria-label="Verify Eligibility">Verify Eligibility</button>
        </div>
      </div>

      {result && result !== "not_found" && (
        <div style={{ ...styles.card, marginTop: 24 }} data-testid="eligibility-result-card">
          <div style={styles.cardTitle}>✓ Eligibility Verified</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <div><div style={styles.detailLabel}>Member</div><div style={styles.detailValue} data-testid="elig-name">{result.name}</div></div>
            <div><div style={styles.detailLabel}>Member ID</div><div style={styles.detailValue} data-testid="elig-member-id">{result.id}</div></div>
            <div><div style={styles.detailLabel}>Plan</div><div style={styles.detailValue} data-testid="elig-plan">{result.planName}</div></div>
            <div><div style={styles.detailLabel}>Plan ID</div><div style={styles.detailValue} data-testid="elig-plan-id">{result.planId}</div></div>
            <div><div style={styles.detailLabel}>Effective</div><div style={styles.detailValue} data-testid="elig-effective">{result.effectiveDate}</div></div>
            <div><div style={styles.detailLabel}>Term Date</div><div style={styles.detailValue} data-testid="elig-term">{result.termDate}</div></div>
            <div><div style={styles.detailLabel}>Status</div><span style={styles.badge(result.status)} data-testid="elig-status">{result.status}</span></div>
            <div><div style={styles.detailLabel}>Group #</div><div style={styles.detailValue} data-testid="elig-group">{result.groupNo}</div></div>
            <div><div style={styles.detailLabel}>Dependents</div><div style={styles.detailValue} data-testid="elig-dependents">{result.dependents.length}</div></div>
          </div>
        </div>
      )}

      {result === "not_found" && (
        <div style={{ ...styles.card, marginTop: 24, borderColor: colors.danger }} data-testid="eligibility-not-found">
          <div style={{ ...styles.cardTitle, color: colors.danger }}>✕ Member Not Found</div>
          <p style={{ color: colors.textMuted }}>No member found matching "{search}". Please check the ID or name and try again.</p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BATCH RUNS PAGE
// ═══════════════════════════════════════════════════════════════
function BatchRunsPage({ batches, setBatches }) {
  const [toast, setToast] = useState("");

  const processBatch = (batchId) => {
    setBatches(batches.map(b => b.id === batchId ? { ...b, status: "Completed", processedDate: new Date().toISOString().split("T")[0] } : b));
    setToast(`${batchId} processed successfully`);
  };

  return (
    <div data-testid="batch-runs-page" id="batch-runs-page">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div style={styles.card} data-testid="batch-list-card">
        <div style={styles.cardTitle}>📦 Batch Runs</div>
        <table style={styles.table} data-testid="batch-table" aria-label="Batch Runs">
          <thead>
            <tr><th style={styles.th}>Batch ID</th><th style={styles.th}>Name</th><th style={styles.th}>Claims</th><th style={styles.th}>Amount</th><th style={styles.th}>Status</th><th style={styles.th}>Created</th><th style={styles.th}>Processed</th><th style={styles.th}>Action</th></tr>
          </thead>
          <tbody>
            {batches.map(b => (
              <tr key={b.id} data-testid={`batch-row-${b.id}`}>
                <td style={{ ...styles.td, fontWeight: 600 }} data-testid={`batch-id-${b.id}`}>{b.id}</td>
                <td style={styles.td}>{b.name}</td><td style={styles.td}>{b.claimCount}</td>
                <td style={styles.td}>${b.totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td style={styles.td}><span style={styles.badge(b.status)} data-testid={`batch-status-${b.id}`}>{b.status}</span></td>
                <td style={styles.td}>{b.createdDate}</td><td style={styles.td}>{b.processedDate || "—"}</td>
                <td style={styles.td}>
                  {(b.status === "Pending" || b.status === "Processing") && (
                    <button onClick={() => processBatch(b.id)} style={{ ...styles.btnPrimary, padding: "6px 14px", fontSize: 12 }} data-testid={`btn-process-batch-${b.id}`} aria-label={`Process ${b.id}`}>Process Batch</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// EDI TRANSACTIONS PAGE
// ═══════════════════════════════════════════════════════════════
function EDIPage() {
  return (
    <div data-testid="edi-page" id="edi-page">
      <div style={styles.card} data-testid="edi-list-card">
        <div style={styles.cardTitle}>📡 EDI Transactions</div>
        <table style={styles.table} data-testid="edi-table" aria-label="EDI Transactions">
          <thead>
            <tr><th style={styles.th}>Transaction ID</th><th style={styles.th}>Type</th><th style={styles.th}>Direction</th><th style={styles.th}>Sender</th><th style={styles.th}>Receiver</th><th style={styles.th}>Claims</th><th style={styles.th}>Amount</th><th style={styles.th}>Status</th><th style={styles.th}>Date</th></tr>
          </thead>
          <tbody>
            {SAMPLE_EDI.map(e => (
              <tr key={e.id} data-testid={`edi-row-${e.id}`}>
                <td style={{ ...styles.td, fontWeight: 600 }} data-testid={`edi-id-${e.id}`}>{e.id}</td>
                <td style={styles.td}><span style={{ ...styles.badge("Active"), color: colors.primary, background: `${colors.primary}15`, border: `1px solid ${colors.primary}30` }}>{e.type}</span></td>
                <td style={styles.td}>{e.direction}</td><td style={styles.td}>{e.sender}</td><td style={styles.td}>{e.receiver}</td>
                <td style={styles.td}>{e.claimCount || "—"}</td>
                <td style={styles.td}>{e.amount ? `$${e.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}` : "—"}</td>
                <td style={styles.td}><span style={styles.badge(e.status)} data-testid={`edi-status-${e.id}`}>{e.status}</span></td>
                <td style={styles.td}>{e.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [members] = useState([...SAMPLE_MEMBERS]);
  const [claims, setClaims] = useState([...SAMPLE_CLAIMS]);
  const [batches, setBatches] = useState([...SAMPLE_BATCHES]);

  if (!user) return <LoginPage onLogin={(u) => { setUser(u); setPage("dashboard"); }} />;

  const pages = {
    dashboard: { title: "Dashboard", icon: "📊", breadcrumb: "Home > Dashboard" },
    members: { title: "Members", icon: "👥", breadcrumb: "Members > Subscribers" },
    claims: { title: "Claims", icon: "🏥", breadcrumb: "Claims > Submit & View" },
    "claims-review": { title: "Claims Review", icon: "📋", breadcrumb: "Claims > Review" },
    "facility-claims": { title: "Facility Claims", icon: "🏥", breadcrumb: "Claims > By Facility" },
    "health-plans": { title: "Health Plans", icon: "📄", breadcrumb: "Products > Health Plans" },
    coverage: { title: "Coverage / Eligibility", icon: "🔍", breadcrumb: "Coverage > Eligibility Verification" },
    "batch-runs": { title: "Batch Runs", icon: "📦", breadcrumb: "Processing > Batch Runs" },
    edi: { title: "EDI Transactions", icon: "📡", breadcrumb: "Processing > EDI Transactions" },
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
          <div style={styles.navItem(page === "dashboard")} onClick={() => setPage("dashboard")} data-testid="nav-dashboard" id="nav-dashboard" role="button" aria-label="Dashboard" aria-current={page === "dashboard" ? "page" : undefined}>
            <span style={styles.navIcon}>📊</span> Dashboard
          </div>

          <div style={styles.navSection}>People</div>
          <div style={styles.navItem(page === "members")} onClick={() => setPage("members")} data-testid="nav-members" id="nav-members" role="button" aria-label="Members" aria-current={page === "members" ? "page" : undefined}>
            <span style={styles.navIcon}>👥</span> Members
          </div>

          <div style={styles.navSection}>Claims</div>
          <div style={styles.navItem(page === "claims")} onClick={() => setPage("claims")} data-testid="nav-claims" id="nav-claims" role="button" aria-label="Claims" aria-current={page === "claims" ? "page" : undefined}>
            <span style={styles.navIcon}>🏥</span> Claims
          </div>
          <div style={styles.navItem(page === "claims-review")} onClick={() => setPage("claims-review")} data-testid="nav-claims-review" id="nav-claims-review" role="button" aria-label="Claims Review" aria-current={page === "claims-review" ? "page" : undefined}>
            <span style={styles.navIcon}>📋</span> Claims Review
          </div>
          <div style={styles.navItem(page === "facility-claims")} onClick={() => setPage("facility-claims")} data-testid="nav-facility-claims" id="nav-facility-claims" role="button" aria-label="Facility Claims" aria-current={page === "facility-claims" ? "page" : undefined}>
            <span style={styles.navIcon}>🏢</span> Facility Claims
          </div>

          <div style={styles.navSection}>Products</div>
          <div style={styles.navItem(page === "health-plans")} onClick={() => setPage("health-plans")} data-testid="nav-health-plans" id="nav-health-plans" role="button" aria-label="Health Plans" aria-current={page === "health-plans" ? "page" : undefined}>
            <span style={styles.navIcon}>📄</span> Health Plans
          </div>

          <div style={styles.navSection}>Processing</div>
          <div style={styles.navItem(page === "coverage")} onClick={() => setPage("coverage")} data-testid="nav-coverage" id="nav-coverage" role="button" aria-label="Coverage / Eligibility" aria-current={page === "coverage" ? "page" : undefined}>
            <span style={styles.navIcon}>🔍</span> Coverage / Eligibility
          </div>
          <div style={styles.navItem(page === "batch-runs")} onClick={() => setPage("batch-runs")} data-testid="nav-batch-runs" id="nav-batch-runs" role="button" aria-label="Batch Runs" aria-current={page === "batch-runs" ? "page" : undefined}>
            <span style={styles.navIcon}>📦</span> Batch Runs
          </div>
          <div style={styles.navItem(page === "edi")} onClick={() => setPage("edi")} data-testid="nav-edi" id="nav-edi" role="button" aria-label="EDI Transactions" aria-current={page === "edi" ? "page" : undefined}>
            <span style={styles.navIcon}>📡</span> EDI Transactions
          </div>
        </nav>

        <div style={styles.sidebarUser} data-testid="sidebar-user-info">
          <div style={styles.userAvatar} data-testid="user-avatar">{user.name.charAt(0)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }} data-testid="user-name">{user.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }} data-testid="user-role">{user.role}</div>
          </div>
          <button onClick={() => setUser(null)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 18, padding: 4 }} data-testid="btn-logout" id="btn-logout" aria-label="Logout" title="Logout">⏻</button>
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
            <span style={{ fontSize: 13, color: colors.textMuted }} data-testid="header-user">Welcome, <strong>{user.name}</strong> — {user.role}</span>
          </div>
        </div>

        <div style={styles.content} data-testid="page-content">
          {page === "dashboard" && <DashboardPage user={user} claims={claims} />}
          {page === "members" && <MembersPage members={members} />}
          {page === "claims" && <ClaimsPage claims={claims} setClaims={setClaims} members={members} />}
          {page === "claims-review" && <ClaimsReviewPage claims={claims} setClaims={setClaims} />}
          {page === "facility-claims" && <FacilityClaimsPage claims={claims} />}
          {page === "health-plans" && <HealthPlansPage />}
          {page === "coverage" && <CoveragePage members={members} />}
          {page === "batch-runs" && <BatchRunsPage batches={batches} setBatches={setBatches} />}
          {page === "edi" && <EDIPage />}
        </div>
      </div>
    </div>
  );
}

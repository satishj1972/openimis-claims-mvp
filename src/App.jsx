import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// US HEALTH INSURANCE CLAIMS MANAGEMENT SYSTEM
// Persona: Medical Claims Analyst (Payer-Side)
// Use Case: Manual Line-Item Adjudication
// Every element has data-testid, aria-label, and id attributes
// Built for TestARQ demo - perfect automation compatibility
// ═══════════════════════════════════════════════════════════════

const USERS = {
  "claim.analyst": { password: "analyst123", role: "Medical Claims Analyst", name: "Sarah Mitchell" },
  Admin: { password: "admin123", role: "Administrator", name: "System Administrator" },
};

const CLAIM_STATUSES = ["Submitted", "Under Review", "Approved", "Pended", "Rejected"];
const PRIORITIES = ["High", "Medium", "Low"];
const VISIT_TYPES = ["Outpatient", "Inpatient", "Emergency", "Telehealth", "Preventive"];

// CARC (Claim Adjustment Reason Codes) for denial
const CARC_CODES = [
  { code: "CO-16", desc: "Claim/service lacks information needed for adjudication" },
  { code: "CO-18", desc: "Exact duplicate claim/service" },
  { code: "CO-27", desc: "Expenses incurred after coverage terminated" },
  { code: "CO-29", desc: "The time limit for filing has expired" },
  { code: "CO-45", desc: "Charges exceed your contracted/legislated fee arrangement" },
  { code: "CO-50", desc: "Non-covered service — not deemed medically necessary" },
  { code: "CO-96", desc: "Non-covered charge(s) — not a covered benefit" },
  { code: "CO-97", desc: "Payment adjusted — benefit for this service included in another service/procedure" },
  { code: "CO-236", desc: "This procedure/service is not paid separately" },
];

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
  { code: "99213", desc: "Office visit, established, moderate", allowedAmt: 125.00 },
  { code: "99214", desc: "Office visit, established, mod-high", allowedAmt: 185.00 },
  { code: "99283", desc: "ED visit, moderate severity", allowedAmt: 450.00 },
  { code: "99385", desc: "Preventive medicine, 18-39 years", allowedAmt: 275.00 },
  { code: "27447", desc: "Total knee replacement", allowedAmt: 22500.00 },
  { code: "70553", desc: "MRI brain with/without contrast", allowedAmt: 1200.00 },
  { code: "80053", desc: "Comprehensive metabolic panel", allowedAmt: 45.00 },
  { code: "93000", desc: "Electrocardiogram, complete", allowedAmt: 85.00 },
];

// Service Price List / Fee Schedule
const FEE_SCHEDULE = [
  { cptCode: "99213", description: "Office visit, established, moderate", category: "E&M", billedAvg: 250.00, allowedAmount: 125.00, medicareRate: 110.00 },
  { cptCode: "99214", description: "Office visit, established, mod-high", category: "E&M", billedAvg: 350.00, allowedAmount: 185.00, medicareRate: 165.00 },
  { cptCode: "99283", description: "ED visit, moderate severity", category: "Emergency", billedAvg: 850.00, allowedAmount: 450.00, medicareRate: 380.00 },
  { cptCode: "99385", description: "Preventive medicine, 18-39 years", category: "Preventive", billedAvg: 450.00, allowedAmount: 275.00, medicareRate: 240.00 },
  { cptCode: "27447", description: "Total knee replacement", category: "Surgery", billedAvg: 45000.00, allowedAmount: 22500.00, medicareRate: 18000.00 },
  { cptCode: "70553", description: "MRI brain with/without contrast", category: "Radiology", billedAvg: 2800.00, allowedAmount: 1200.00, medicareRate: 950.00 },
  { cptCode: "80053", description: "Comprehensive metabolic panel", category: "Lab", billedAvg: 120.00, allowedAmount: 45.00, medicareRate: 35.00 },
  { cptCode: "93000", description: "Electrocardiogram, complete", category: "Cardiology", billedAvg: 200.00, allowedAmount: 85.00, medicareRate: 70.00 },
  { cptCode: "99291", description: "Critical care, first 30-74 min", category: "Critical Care", billedAvg: 950.00, allowedAmount: 520.00, medicareRate: 450.00 },
  { cptCode: "99232", description: "Subsequent hospital care, moderate", category: "Hospital", billedAvg: 280.00, allowedAmount: 140.00, medicareRate: 120.00 },
];

const FACILITIES = [
  { id: "FAC-001", name: "Mayo Clinic", location: "Rochester, MN", npi: "1234567890", networkStatus: "In-Network", type: "Hospital" },
  { id: "FAC-002", name: "Cleveland Clinic", location: "Cleveland, OH", npi: "2345678901", networkStatus: "In-Network", type: "Hospital" },
  { id: "FAC-003", name: "Johns Hopkins Hospital", location: "Baltimore, MD", npi: "3456789012", networkStatus: "In-Network", type: "Hospital" },
  { id: "FAC-004", name: "Mass General Hospital", location: "Boston, MA", npi: "4567890123", networkStatus: "In-Network", type: "Hospital" },
  { id: "FAC-005", name: "Stanford Health Care", location: "Palo Alto, CA", npi: "5678901234", networkStatus: "Out-of-Network", type: "Hospital" },
  { id: "FAC-006", name: "Mount Sinai Hospital", location: "New York, NY", npi: "6789012345", networkStatus: "In-Network", type: "Hospital" },
  { id: "FAC-007", name: "Cedars-Sinai Medical Center", location: "Los Angeles, CA", npi: "7890123456", networkStatus: "Out-of-Network", type: "Hospital" },
  { id: "FAC-008", name: "Duke University Hospital", location: "Durham, NC", npi: "8901234567", networkStatus: "In-Network", type: "Hospital" },
];

const HEALTH_PLANS = [
  { code: "PPO-GOLD-2026", name: "PPO Gold Plus", type: "PPO", state: "CA", minAge: 18, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active",
    benefits: [
      { service: "Primary Care Visit", copay: "$25", coinsurance: "0%", priorAuth: "No", limit: "Unlimited", annualMax: "-" },
      { service: "Specialist Visit", copay: "$50", coinsurance: "20%", priorAuth: "No", limit: "Unlimited", annualMax: "-" },
      { service: "Emergency Room", copay: "$250", coinsurance: "20%", priorAuth: "No", limit: "Unlimited", annualMax: "-" },
      { service: "Inpatient Hospital", copay: "$500/day", coinsurance: "20%", priorAuth: "Yes", limit: "$500,000", annualMax: "$500,000" },
      { service: "Outpatient Surgery", copay: "$200", coinsurance: "20%", priorAuth: "Yes", limit: "$250,000", annualMax: "$250,000" },
      { service: "Lab / Diagnostics", copay: "$10", coinsurance: "0%", priorAuth: "No", limit: "Unlimited", annualMax: "-" },
      { service: "Mental Health", copay: "$25", coinsurance: "20%", priorAuth: "No", limit: "30 visits/year", annualMax: "30 visits" },
      { service: "Prescription Drugs", copay: "$10/$35/$70", coinsurance: "Varies", priorAuth: "Tier 3+", limit: "Unlimited", annualMax: "-" },
    ],
    network: [
      { service: "Primary Care", inNetwork: "$25 copay", outNetwork: "40% coinsurance", size: "12,500+ providers" },
      { service: "Specialist", inNetwork: "$50 copay", outNetwork: "50% coinsurance", size: "8,200+ providers" },
      { service: "Hospital", inNetwork: "20% after deductible", outNetwork: "50% after deductible", size: "450+ facilities" },
      { service: "Pharmacy", inNetwork: "$10/$35/$70 tiers", outNetwork: "Not covered", size: "45,000+ pharmacies" },
    ],
    deductibles: { indivIn: "$1,500", famIn: "$3,000", indivOut: "$3,000", famOut: "$6,000", oopIndivIn: "$6,500", oopFamIn: "$13,000", oopIndivOut: "$13,000", oopFamOut: "$26,000" },
  },
  { code: "PPO-SLV-2026", name: "PPO Silver", type: "PPO", state: "TX", minAge: 18, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active",
    benefits: [
      { service: "Primary Care Visit", copay: "$40", coinsurance: "10%", priorAuth: "No", limit: "Unlimited", annualMax: "-" },
      { service: "Specialist Visit", copay: "$75", coinsurance: "30%", priorAuth: "No", limit: "Unlimited", annualMax: "-" },
      { service: "Emergency Room", copay: "$350", coinsurance: "30%", priorAuth: "No", limit: "Unlimited", annualMax: "-" },
      { service: "Inpatient Hospital", copay: "$750/day", coinsurance: "30%", priorAuth: "Yes", limit: "$300,000", annualMax: "$300,000" },
    ],
    network: [
      { service: "Primary Care", inNetwork: "$40 copay", outNetwork: "50% coinsurance", size: "10,000+ providers" },
      { service: "Hospital", inNetwork: "30% after deductible", outNetwork: "60% after deductible", size: "350+ facilities" },
    ],
    deductibles: { indivIn: "$2,500", famIn: "$5,000", indivOut: "$5,000", famOut: "$10,000", oopIndivIn: "$8,500", oopFamIn: "$17,000", oopIndivOut: "$17,000", oopFamOut: "$34,000" },
  },
  { code: "HMO-STD-2026", name: "HMO Standard", type: "HMO", state: "NY", minAge: 0, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active",
    benefits: [
      { service: "Primary Care Visit", copay: "$20", coinsurance: "0%", priorAuth: "No", limit: "Unlimited", annualMax: "-" },
      { service: "Specialist Visit", copay: "$40", coinsurance: "10%", priorAuth: "Yes", limit: "Unlimited", annualMax: "-" },
      { service: "Emergency Room", copay: "$200", coinsurance: "15%", priorAuth: "No", limit: "Unlimited", annualMax: "-" },
    ],
    network: [
      { service: "Primary Care", inNetwork: "$20 copay", outNetwork: "Not covered", size: "8,000+ providers" },
    ],
    deductibles: { indivIn: "$1,000", famIn: "$2,000", indivOut: "N/A", famOut: "N/A", oopIndivIn: "$5,000", oopFamIn: "$10,000", oopIndivOut: "N/A", oopFamOut: "N/A" },
  },
  { code: "HMO-PLS-2026", name: "HMO Plus", type: "HMO", state: "CA", minAge: 0, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active", benefits: [], network: [], deductibles: {} },
  { code: "MCR-ADV-2026", name: "Medicare Advantage", type: "Medicare", state: "FL", minAge: 65, maxAge: 99, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active", benefits: [], network: [], deductibles: {} },
  { code: "HDHP-BRZ-2026", name: "HDHP Bronze", type: "HDHP", state: "IL", minAge: 18, maxAge: 64, period: "12 months", validFrom: "2026-01-01", validTo: "2026-12-31", status: "Active", benefits: [], network: [], deductibles: {} },
];

const SAMPLE_MEMBERS = [
  { id: "MBR-100001", name: "Robert Anderson", dob: "1985-03-12", gender: "Male", ssn: "***-**-4521", address: "123 Oak St, Austin, TX 78701", phone: "(555) 101-2001", email: "r.anderson@email.com", planId: "INS-100001", planCode: "PPO-GOLD-2026", planName: "PPO Gold Plus", groupNo: "GRP-5001", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", benefitUsed: { inpatient: 12500, outOfPocketUsed: 2100 }, dependents: [{ name: "Susan Anderson", rel: "Spouse", dob: "1987-06-15", status: "Active" }, { name: "Tommy Anderson", rel: "Child", dob: "2015-09-22", status: "Active" }] },
  { id: "MBR-100002", name: "Maria Garcia", dob: "1990-07-22", gender: "Female", ssn: "***-**-7832", address: "456 Pine Ave, Miami, FL 33101", phone: "(555) 202-3002", email: "m.garcia@email.com", planId: "INS-100002", planCode: "HMO-STD-2026", planName: "HMO Standard", groupNo: "GRP-5002", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", benefitUsed: { inpatient: 0, outOfPocketUsed: 450 }, dependents: [{ name: "Carlos Garcia", rel: "Spouse", dob: "1988-02-10", status: "Active" }] },
  { id: "MBR-100003", name: "James Wilson", dob: "1978-11-05", gender: "Male", ssn: "***-**-9145", address: "789 Elm Dr, Denver, CO 80201", phone: "(555) 303-4003", email: "j.wilson@email.com", planId: "INS-100003", planCode: "PPO-SLV-2026", planName: "PPO Silver", groupNo: "GRP-5003", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", benefitUsed: { inpatient: 0, outOfPocketUsed: 890 }, dependents: [] },
  { id: "MBR-100004", name: "Emily Chen", dob: "1992-01-30", gender: "Female", ssn: "***-**-2678", address: "321 Maple Ln, Seattle, WA 98101", phone: "(555) 404-5004", email: "e.chen@email.com", planId: "INS-100004", planCode: "HMO-PLS-2026", planName: "HMO Plus", groupNo: "GRP-5004", effectiveDate: "2025-01-01", termDate: "2025-12-31", status: "Inactive", benefitUsed: { inpatient: 0, outOfPocketUsed: 0 }, dependents: [] },
  { id: "MBR-100005", name: "William Thompson", dob: "1955-09-18", gender: "Male", ssn: "***-**-3389", address: "654 Cedar Ct, Tampa, FL 33602", phone: "(555) 505-6005", email: "w.thompson@email.com", planId: "INS-100005", planCode: "MCR-ADV-2026", planName: "Medicare Advantage", groupNo: "GRP-5005", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", benefitUsed: { inpatient: 35000, outOfPocketUsed: 4200 }, dependents: [{ name: "Margaret Thompson", rel: "Spouse", dob: "1957-03-25", status: "Active" }] },
  { id: "MBR-100006", name: "Sarah Mitchell", dob: "1988-06-14", gender: "Female", ssn: "***-**-5544", address: "987 Birch Rd, Chicago, IL 60601", phone: "(555) 606-7006", email: "s.mitchell@email.com", planId: "INS-100006", planCode: "PPO-GOLD-2026", planName: "PPO Gold Plus", groupNo: "GRP-5001", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", benefitUsed: { inpatient: 0, outOfPocketUsed: 175 }, dependents: [] },
  { id: "MBR-100007", name: "David Kim", dob: "1972-12-03", gender: "Male", ssn: "***-**-8877", address: "147 Walnut St, Portland, OR 97201", phone: "(555) 707-8007", email: "d.kim@email.com", planId: "INS-100007", planCode: "HDHP-BRZ-2026", planName: "HDHP Bronze", groupNo: "GRP-5006", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", benefitUsed: { inpatient: 0, outOfPocketUsed: 3200 }, dependents: [{ name: "Jennifer Kim", rel: "Spouse", dob: "1975-08-19", status: "Active" }, { name: "Alex Kim", rel: "Child", dob: "2010-04-12", status: "Active" }] },
  { id: "MBR-100008", name: "Lisa Rodriguez", dob: "1995-04-28", gender: "Female", ssn: "***-**-1122", address: "258 Spruce Way, Phoenix, AZ 85001", phone: "(555) 808-9008", email: "l.rodriguez@email.com", planId: "INS-100008", planCode: "HMO-STD-2026", planName: "HMO Standard", groupNo: "GRP-5002", effectiveDate: "2026-01-01", termDate: "2026-12-31", status: "Active", benefitUsed: { inpatient: 0, outOfPocketUsed: 120 }, dependents: [] },
];

const SAMPLE_CLAIMS = [
  { id: "CLM-2026-001", memberId: "MBR-100001", planId: "INS-100001", patientName: "Robert Anderson", facility: "Mayo Clinic", facilityNpi: "1234567890", visitType: "Outpatient", diagnosisCode: "J06.9", procedureCode: "99213", serviceDate: "2026-01-15", billedAmount: 250.00, allowedAmount: 125.00, status: "Submitted", priority: "High", submittedDate: "2026-01-16", carcCode: "", notes: "" },
  { id: "CLM-2026-002", memberId: "MBR-100002", planId: "INS-100002", patientName: "Maria Garcia", facility: "Cleveland Clinic", facilityNpi: "2345678901", visitType: "Emergency", diagnosisCode: "S82.001A", procedureCode: "99283", serviceDate: "2026-01-16", billedAmount: 850.00, allowedAmount: 450.00, status: "Under Review", priority: "High", submittedDate: "2026-01-17", carcCode: "", notes: "" },
  { id: "CLM-2026-003", memberId: "MBR-100003", planId: "INS-100003", patientName: "James Wilson", facility: "Johns Hopkins Hospital", facilityNpi: "3456789012", visitType: "Outpatient", diagnosisCode: "M54.5", procedureCode: "99214", serviceDate: "2026-01-17", billedAmount: 350.00, allowedAmount: 185.00, status: "Approved", priority: "Low", submittedDate: "2026-01-18", carcCode: "", notes: "" },
  { id: "CLM-2026-004", memberId: "MBR-100004", planId: "INS-100004", patientName: "Emily Chen", facility: "Stanford Health Care", facilityNpi: "5678901234", visitType: "Outpatient", diagnosisCode: "E11.9", procedureCode: "99214", serviceDate: "2026-01-18", billedAmount: 350.00, allowedAmount: 185.00, status: "Submitted", priority: "Medium", submittedDate: "2026-01-19", carcCode: "", notes: "" },
  { id: "CLM-2026-005", memberId: "MBR-100005", planId: "INS-100005", patientName: "William Thompson", facility: "Mass General Hospital", facilityNpi: "4567890123", visitType: "Inpatient", diagnosisCode: "I10", procedureCode: "27447", serviceDate: "2026-01-10", billedAmount: 45000.00, allowedAmount: 22500.00, status: "Submitted", priority: "High", submittedDate: "2026-01-11", carcCode: "", notes: "" },
  { id: "CLM-2026-006", memberId: "MBR-100006", planId: "INS-100006", patientName: "Sarah Mitchell", facility: "Mount Sinai Hospital", facilityNpi: "6789012345", visitType: "Preventive", diagnosisCode: "Z00.00", procedureCode: "99385", serviceDate: "2026-01-20", billedAmount: 450.00, allowedAmount: 275.00, status: "Submitted", priority: "Low", submittedDate: "2026-01-21", carcCode: "", notes: "" },
  { id: "CLM-2026-007", memberId: "MBR-100007", planId: "INS-100007", patientName: "David Kim", facility: "Cedars-Sinai Medical Center", facilityNpi: "7890123456", visitType: "Outpatient", diagnosisCode: "K21.0", procedureCode: "80053", serviceDate: "2026-01-22", billedAmount: 120.00, allowedAmount: 45.00, status: "Under Review", priority: "Medium", submittedDate: "2026-01-23", carcCode: "", notes: "" },
  { id: "CLM-2026-008", memberId: "MBR-100008", planId: "INS-100008", patientName: "Lisa Rodriguez", facility: "Duke University Hospital", facilityNpi: "8901234567", visitType: "Outpatient", diagnosisCode: "R50.9", procedureCode: "93000", serviceDate: "2026-01-24", billedAmount: 200.00, allowedAmount: 85.00, status: "Submitted", priority: "Medium", submittedDate: "2026-01-25", carcCode: "", notes: "" },
  { id: "CLM-2026-009", memberId: "MBR-100001", planId: "INS-100001", patientName: "Robert Anderson", facility: "Mayo Clinic", facilityNpi: "1234567890", visitType: "Outpatient", diagnosisCode: "J06.9", procedureCode: "99213", serviceDate: "2026-01-15", billedAmount: 250.00, allowedAmount: 125.00, status: "Submitted", priority: "Medium", submittedDate: "2026-01-28", carcCode: "", notes: "Potential duplicate of CLM-2026-001" },
  { id: "CLM-2026-010", memberId: "MBR-100002", planId: "INS-100002", patientName: "Maria Garcia", facility: "Cleveland Clinic", facilityNpi: "2345678901", visitType: "Outpatient", diagnosisCode: "E11.9", procedureCode: "99214", serviceDate: "2026-01-28", billedAmount: 350.00, allowedAmount: 185.00, status: "Rejected", priority: "Low", submittedDate: "2026-01-29", carcCode: "CO-96", notes: "Non-covered benefit under HMO Standard" },
];

const SAMPLE_BATCHES = [
  { id: "BATCH-001", date: "2026-01-20", claimCount: 12, totalAmount: 15400.00, status: "Completed", type: "Auto-Adjudication" },
  { id: "BATCH-002", date: "2026-01-27", claimCount: 8, totalAmount: 9200.00, status: "Processing", type: "Clean Claims" },
  { id: "BATCH-003", date: "2026-02-01", claimCount: 15, totalAmount: 22800.00, status: "Pending", type: "Bulk Adjudication" },
];

// ═══════════════════════════════════════════════════════════════
// THEME & STYLES
// ═══════════════════════════════════════════════════════════════

const colors = {
  primary: "#4F46E5",
  primaryDark: "#4338CA",
  primaryLight: "#EEF2FF",
  success: "#059669",
  successLight: "#ECFDF5",
  warning: "#D97706",
  warningLight: "#FFFBEB",
  danger: "#DC2626",
  dangerLight: "#FEF2F2",
  info: "#2563EB",
  infoLight: "#EFF6FF",
  pended: "#7C3AED",
  pendedLight: "#F5F3FF",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#1E293B",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  sidebar: "#1E293B",
  sidebarHover: "#334155",
  sidebarActive: "#4F46E5",
};

const styles = {
  app: { display: "flex", height: "100vh", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: colors.bg, color: colors.text },
  sidebar: { width: 260, background: colors.sidebar, display: "flex", flexDirection: "column", flexShrink: 0 },
  sidebarLogo: { padding: "20px 16px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.1)" },
  logoIcon: { fontSize: 28, background: colors.primary, borderRadius: 8, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", color: "white" },
  logoText: { fontSize: 16, fontWeight: 700, color: "white", letterSpacing: -0.5 },
  logoSub: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
  sidebarNav: { flex: 1, padding: "12px 0", overflowY: "auto" },
  navSection: { padding: "16px 20px 6px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: 1.2 },
  navItem: (active) => ({ padding: "10px 20px", fontSize: 13, color: active ? "white" : "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, background: active ? colors.sidebarActive : "transparent", borderLeft: active ? "3px solid white" : "3px solid transparent", transition: "all 0.15s" }),
  navIcon: { fontSize: 16, width: 20, textAlign: "center" },
  sidebarUser: { padding: 16, borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: 10 },
  userAvatar: { width: 34, height: 34, borderRadius: "50%", background: colors.primary, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 },
  main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { padding: "16px 28px", background: "white", borderBottom: `1px solid ${colors.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { fontSize: 20, fontWeight: 700, color: colors.text },
  headerBreadcrumb: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  content: { flex: 1, overflow: "auto", padding: 24 },
  card: { background: "white", borderRadius: 10, border: `1px solid ${colors.border}`, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 15, fontWeight: 700, marginBottom: 16, color: colors.text },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th: { textAlign: "left", padding: "10px 12px", background: colors.bg, borderBottom: `2px solid ${colors.border}`, fontWeight: 600, color: colors.textSecondary, fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  td: { padding: "10px 12px", borderBottom: `1px solid ${colors.border}`, color: colors.text },
  btn: (variant = "primary") => {
    const map = { primary: { bg: colors.primary, color: "white" }, success: { bg: colors.success, color: "white" }, danger: { bg: colors.danger, color: "white" }, warning: { bg: colors.warning, color: "white" }, pended: { bg: colors.pended, color: "white" }, outline: { bg: "white", color: colors.primary, border: `1px solid ${colors.primary}` }, ghost: { bg: "transparent", color: colors.textSecondary } };
    const v = map[variant] || map.primary;
    return { padding: "8px 16px", borderRadius: 6, border: v.border || "none", background: v.bg, color: v.color, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, transition: "all 0.15s" };
  },
  input: { width: "100%", padding: "9px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box", color: colors.text },
  select: { width: "100%", padding: "9px 12px", border: `1px solid ${colors.border}`, borderRadius: 6, fontSize: 13, outline: "none", boxSizing: "border-box", color: colors.text, background: "white" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 },
  grid4: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 },
  grid5: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 },
  modal: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalContent: { background: "white", borderRadius: 12, padding: 24, maxWidth: 700, width: "90%", maxHeight: "85vh", overflowY: "auto" },
};

// ═══════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════

function Badge({ type, children, testId, id }) {
  const map = { Active: colors.success, Submitted: colors.info, "Under Review": colors.warning, Approved: colors.success, Rejected: colors.danger, Pended: colors.pended, Inactive: colors.textMuted, Pending: colors.textMuted, Processing: colors.info, Completed: colors.success, Failed: colors.danger, "In-Network": colors.success, "Out-of-Network": colors.danger, High: colors.danger, Medium: colors.warning, Low: colors.textMuted, "Clean Claims": colors.success, "Auto-Adjudication": colors.info, "Bulk Adjudication": colors.primary };
  const c = map[type] || colors.textMuted;
  const tid = testId || id;
  return <span data-testid={tid} id={id} style={{ display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: c + "18", color: c }}>{children || type}</span>;
}

function StatCard({ icon, label, value, sub, color, testId, id }) {
  const tid = testId || id;
  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${color || colors.primary}`, padding: "16px 20px" }} data-testid={tid} id={id}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600, textTransform: "uppercase" }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: colors.text }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div style={{ position: "fixed", bottom: 24, right: 24, background: colors.success, color: "white", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, zIndex: 2000, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }} data-testid="toast-message">{message}</div>;
}

function TabBar({ tabs, active, onChange, testIdPrefix }) {
  return (
    <div style={{ display: "flex", gap: 0, borderBottom: `2px solid ${colors.border}`, marginBottom: 16 }}>
      {tabs.map(t => (
        <button key={t.key} onClick={() => onChange(t.key)} data-testid={`${testIdPrefix}-tab-${t.key}`} id={`${testIdPrefix}-tab-${t.key}`}
          style={{ padding: "10px 20px", fontSize: 13, fontWeight: active === t.key ? 700 : 500, color: active === t.key ? colors.primary : colors.textSecondary, background: "none", border: "none", borderBottom: active === t.key ? `2px solid ${colors.primary}` : "2px solid transparent", cursor: "pointer", marginBottom: -2 }}>
          {t.label}
        </button>
      ))}
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
    if (user && user.password === password) { onLogin({ username, ...user }); }
    else { setError("Invalid credentials"); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(135deg, ${colors.sidebar} 0%, ${colors.primary} 100%)` }} data-testid="login-page" id="login-page">
      <div style={{ background: "white", borderRadius: 16, padding: 40, width: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} data-testid="login-form-container">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚕</div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: colors.text, margin: 0 }} data-testid="login-title">OpenIMIS Claims</h1>
          <p style={{ fontSize: 13, color: colors.textMuted, margin: "4px 0 0" }} data-testid="login-subtitle">Medical Claims Analyst Portal</p>
        </div>
        <form onSubmit={handleLogin} data-testid="login-form" id="login-form">
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, display: "block", marginBottom: 6 }}>Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="claim.analyst" style={styles.input} data-testid="input-username" id="input-username" aria-label="Username" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, display: "block", marginBottom: 6 }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={styles.input} data-testid="input-password" id="input-password" aria-label="Password" />
          </div>
          {error && <div style={{ color: colors.danger, fontSize: 13, marginBottom: 12, textAlign: "center" }} data-testid="login-error">{error}</div>}
          <button type="submit" style={{ ...styles.btn("primary"), width: "100%", justifyContent: "center", padding: "12px 16px", fontSize: 15 }} data-testid="btn-login" id="btn-login" aria-label="Sign In">Sign In</button>
        </form>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: colors.textMuted }} data-testid="login-hint">Demo: claim.analyst / analyst123</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// DASHBOARD - Adjudication KPIs, Queue Metrics, Aging Claims
// ═══════════════════════════════════════════════════════════════

function DashboardPage({ user, claims }) {
  const today = new Date("2026-02-09");
  const calcAge = (d) => Math.floor((today - new Date(d)) / (1000 * 60 * 60 * 24));

  const submitted = claims.filter(c => c.status === "Submitted");
  const underReview = claims.filter(c => c.status === "Under Review");
  const approved = claims.filter(c => c.status === "Approved");
  const rejected = claims.filter(c => c.status === "Rejected");
  const pended = claims.filter(c => c.status === "Pended");
  const pendingQueue = [...submitted, ...underReview];
  const totalBilled = claims.reduce((s, c) => s + c.billedAmount, 0);
  const totalAllowed = claims.filter(c => c.status === "Approved").reduce((s, c) => s + c.allowedAmount, 0);
  const contractualAdj = claims.filter(c => c.status === "Approved").reduce((s, c) => s + (c.billedAmount - c.allowedAmount), 0);

  // Aging buckets
  const agingClaims = pendingQueue.map(c => ({ ...c, ageDays: calcAge(c.submittedDate) }));
  const aging0_15 = agingClaims.filter(c => c.ageDays <= 15).length;
  const aging16_30 = agingClaims.filter(c => c.ageDays > 15 && c.ageDays <= 30).length;
  const aging30plus = agingClaims.filter(c => c.ageDays > 30).length;
  const highAgingClaims = agingClaims.filter(c => c.ageDays > 10).sort((a, b) => b.ageDays - a.ageDays);

  return (
    <div data-testid="dashboard-page" id="dashboard-page">
      {/* KPI Stats */}
      <div style={styles.grid5} data-testid="dashboard-kpis">
        <StatCard icon="📋" label="Pending Queue" value={pendingQueue.length} sub={`${submitted.length} submitted, ${underReview.length} in review`} color={colors.warning} testId="stat-pending-queue" id="stat-pending-queue" />
        <StatCard icon="✅" label="Approved" value={approved.length} sub={`$${totalAllowed.toLocaleString()} allowed`} color={colors.success} testId="stat-approved" id="stat-approved" />
        <StatCard icon="❌" label="Rejected" value={rejected.length} sub={`${pended.length} pended`} color={colors.danger} testId="stat-rejected" id="stat-rejected" />
        <StatCard icon="💰" label="Total Billed" value={`$${totalBilled.toLocaleString()}`} sub={`Adj: $${contractualAdj.toLocaleString()}`} color={colors.info} testId="stat-total-billed" id="stat-total-billed" />
        <StatCard icon="⏱" label="Avg Aging" value={`${agingClaims.length > 0 ? Math.round(agingClaims.reduce((s, c) => s + c.ageDays, 0) / agingClaims.length) : 0}d`} sub={`${aging30plus} claims > 30 days`} color={aging30plus > 0 ? colors.danger : colors.success} testId="stat-avg-aging" id="stat-avg-aging" />
      </div>

      {/* Queue Metrics */}
      <div style={styles.grid3}>
        <div style={styles.card} data-testid="queue-metrics-aging">
          <div style={styles.cardTitle}>📊 Claims Aging Buckets</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[{ label: "0-15 Days", count: aging0_15, color: colors.success }, { label: "16-30 Days", count: aging16_30, color: colors.warning }, { label: "30+ Days", count: aging30plus, color: colors.danger }].map(b => (
              <div key={b.label} data-testid={`aging-bucket-${b.label.replace(/\s/g, "-").toLowerCase()}`}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span>{b.label}</span><span style={{ fontWeight: 700 }}>{b.count}</span>
                </div>
                <div style={{ height: 8, background: colors.bg, borderRadius: 4 }}>
                  <div style={{ height: "100%", width: `${pendingQueue.length > 0 ? (b.count / pendingQueue.length) * 100 : 0}%`, background: b.color, borderRadius: 4, transition: "width 0.3s" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card} data-testid="queue-metrics-priority">
          <div style={styles.cardTitle}>🎯 Priority Distribution</div>
          {["High", "Medium", "Low"].map(p => {
            const count = pendingQueue.filter(c => c.priority === p).length;
            return (
              <div key={p} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${colors.border}` }} data-testid={`priority-${p.toLowerCase()}`}>
                <Badge type={p}>{p} Priority</Badge>
                <span style={{ fontWeight: 700, fontSize: 18 }}>{count}</span>
              </div>
            );
          })}
        </div>

        <div style={styles.card} data-testid="queue-metrics-dollar">
          <div style={styles.cardTitle}>💵 Dollar Risk Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderBottom: `1px solid ${colors.border}` }}>
              <span>Pending Billed</span><span style={{ fontWeight: 700 }}>${pendingQueue.reduce((s, c) => s + c.billedAmount, 0).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0", borderBottom: `1px solid ${colors.border}` }}>
              <span>High Priority $</span><span style={{ fontWeight: 700, color: colors.danger }}>${pendingQueue.filter(c => c.priority === "High").reduce((s, c) => s + c.billedAmount, 0).toLocaleString()}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "8px 0" }}>
              <span>Contractual Adj.</span><span style={{ fontWeight: 700, color: colors.success }}>${contractualAdj.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* High-Aging Claims Table */}
      <div style={styles.card} data-testid="aging-claims-table">
        <div style={styles.cardTitle}>⏱ High-Aging Claims (Requires Attention)</div>
        {highAgingClaims.length === 0 ? <div style={{ fontSize: 13, color: colors.textMuted, padding: 16, textAlign: "center" }}>No high-aging claims</div> : (
          <table style={styles.table} data-testid="table-aging-claims" aria-label="Aging Claims Table">
            <thead>
              <tr>
                <th style={styles.th}>Claim ID</th><th style={styles.th}>Patient</th><th style={styles.th}>Service Date</th>
                <th style={styles.th}>Billed</th><th style={styles.th}>Priority</th><th style={styles.th}>Age (Days)</th><th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {highAgingClaims.map(c => (
                <tr key={c.id} data-testid={`aging-row-${c.id}`}>
                  <td style={{ ...styles.td, fontWeight: 600, color: colors.primary }}>{c.id}</td>
                  <td style={styles.td}>{c.patientName}</td>
                  <td style={styles.td}>{c.serviceDate}</td>
                  <td style={styles.td}>${c.billedAmount.toLocaleString()}</td>
                  <td style={styles.td}><Badge type={c.priority} testId={`aging-priority-${c.id}`}>{c.priority}</Badge></td>
                  <td style={{ ...styles.td, fontWeight: 700, color: c.ageDays > 30 ? colors.danger : c.ageDays > 15 ? colors.warning : colors.text }}>{c.ageDays}d</td>
                  <td style={styles.td}><Badge type={c.status} testId={`aging-status-${c.id}`}>{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// CLAIMS WORKLIST - Queue + Search + Adjudication
// ═══════════════════════════════════════════════════════════════

function ClaimsWorklistPage({ claims, setClaims, members }) {
  const [activeTab, setActiveTab] = useState("queue");
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [toast, setToast] = useState("");
  const [statusFilter, setStatusFilter] = useState("Submitted");
  const [searchMemberId, setSearchMemberId] = useState("");
  const [searchDOS, setSearchDOS] = useState("");
  const [searchCPT, setSearchCPT] = useState("");

  const today = new Date("2026-02-09");
  const calcAge = (d) => Math.floor((today - new Date(d)) / (1000 * 60 * 60 * 24));

  // Queue: claims awaiting manual analysis
  const queueClaims = claims.filter(c => {
    if (statusFilter === "All") return true;
    return c.status === statusFilter;
  });

  // Search: duplicate discovery & historical audit
  const searchResults = claims.filter(c => {
    let match = true;
    if (searchMemberId) match = match && c.memberId.toLowerCase().includes(searchMemberId.toLowerCase());
    if (searchDOS) match = match && c.serviceDate === searchDOS;
    if (searchCPT) match = match && c.procedureCode.includes(searchCPT);
    return match && (searchMemberId || searchDOS || searchCPT);
  });

  // Adjudication actions
  const adjudicate = (claimId, action, carcCode = "", notes = "", allowedAmount = null) => {
    setClaims(prev => prev.map(c => {
      if (c.id !== claimId) return c;
      const updated = { ...c, status: action, notes: notes || c.notes, carcCode: carcCode || c.carcCode };
      if (allowedAmount !== null) updated.allowedAmount = allowedAmount;
      return updated;
    }));
    setToast(`Claim ${claimId} ${action.toLowerCase()} successfully`);
    setSelectedClaim(null);
  };

  return (
    <div data-testid="claims-worklist-page" id="claims-worklist-page">
      <TabBar tabs={[{ key: "queue", label: "📋 Claims Queue" }, { key: "search", label: "🔍 Claims Search" }]} active={activeTab} onChange={setActiveTab} testIdPrefix="worklist" />

      {activeTab === "queue" && (
        <div data-testid="claims-queue-panel">
          {/* Status Filter */}
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {["Submitted", "Under Review", "Pended", "Approved", "Rejected", "All"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} data-testid={`filter-${s.toLowerCase().replace(/\s/g, "-")}`} id={`filter-${s.toLowerCase().replace(/\s/g, "-")}`}
                style={{ ...styles.btn(statusFilter === s ? "primary" : "outline"), padding: "6px 14px", fontSize: 12 }}>{s} {s !== "All" ? `(${claims.filter(c => c.status === s).length})` : `(${claims.length})`}</button>
            ))}
          </div>

          {/* Claims Queue Table */}
          <div style={styles.card}>
            <table style={styles.table} data-testid="table-claims-queue" aria-label="Claims Queue Table">
              <thead>
                <tr>
                  <th style={styles.th}>Claim ID</th><th style={styles.th}>Member ID</th><th style={styles.th}>Patient</th>
                  <th style={styles.th}>NPI</th><th style={styles.th}>DOS</th><th style={styles.th}>ICD-10</th>
                  <th style={styles.th}>CPT</th><th style={styles.th}>Billed</th><th style={styles.th}>Allowed</th>
                  <th style={styles.th}>Age</th><th style={styles.th}>Priority</th><th style={styles.th}>Status</th><th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {queueClaims.map(c => (
                  <tr key={c.id} data-testid={`queue-row-${c.id}`} style={{ background: c.notes?.includes("duplicate") ? colors.warningLight : "transparent" }}>
                    <td style={{ ...styles.td, fontWeight: 600, color: colors.primary }}>{c.id}</td>
                    <td style={{ ...styles.td, fontSize: 11, fontFamily: "monospace" }}>{c.memberId}</td>
                    <td style={styles.td}>{c.patientName}</td>
                    <td style={{ ...styles.td, fontSize: 11, fontFamily: "monospace" }}>{c.facilityNpi}</td>
                    <td style={styles.td}>{c.serviceDate}</td>
                    <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 11 }}>{c.diagnosisCode}</td>
                    <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 11 }}>{c.procedureCode}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>${c.billedAmount.toLocaleString()}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: colors.success }}>${c.allowedAmount.toLocaleString()}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: calcAge(c.submittedDate) > 30 ? colors.danger : calcAge(c.submittedDate) > 15 ? colors.warning : colors.text }}>{calcAge(c.submittedDate)}d</td>
                    <td style={styles.td}><Badge type={c.priority} testId={`queue-priority-${c.id}`}>{c.priority}</Badge></td>
                    <td style={styles.td}><Badge type={c.status} testId={`queue-status-${c.id}`}>{c.status}</Badge></td>
                    <td style={styles.td}>
                      {(c.status === "Submitted" || c.status === "Under Review" || c.status === "Pended") && (
                        <button onClick={() => setSelectedClaim(c)} style={{ ...styles.btn("primary"), padding: "5px 12px", fontSize: 11 }} data-testid={`btn-review-${c.id}`} id={`btn-review-${c.id}`} aria-label={`Review claim ${c.id}`}>Review</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "search" && (
        <div data-testid="claims-search-panel">
          <div style={styles.card}>
            <div style={styles.cardTitle}>🔍 Duplicate Discovery & Historical Audit</div>
            <div style={styles.grid3}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, display: "block", marginBottom: 6 }}>Member ID</label>
                <input value={searchMemberId} onChange={e => setSearchMemberId(e.target.value)} placeholder="e.g. MBR-100001" style={styles.input} data-testid="search-member-id" id="search-member-id" aria-label="Search by Member ID" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, display: "block", marginBottom: 6 }}>Date of Service</label>
                <input type="date" value={searchDOS} onChange={e => setSearchDOS(e.target.value)} style={styles.input} data-testid="search-dos" id="search-dos" aria-label="Search by Date of Service" />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, display: "block", marginBottom: 6 }}>CPT Code</label>
                <input value={searchCPT} onChange={e => setSearchCPT(e.target.value)} placeholder="e.g. 99213" style={styles.input} data-testid="search-cpt" id="search-cpt" aria-label="Search by CPT Code" />
              </div>
            </div>
          </div>
          {(searchMemberId || searchDOS || searchCPT) && (
            <div style={styles.card}>
              <div style={styles.cardTitle}>Search Results ({searchResults.length} found)</div>
              {searchResults.length === 0 ? <div style={{ fontSize: 13, color: colors.textMuted, textAlign: "center", padding: 16 }}>No matching claims found</div> : (
                <table style={styles.table} data-testid="table-claims-search" aria-label="Claims Search Results Table">
                  <thead>
                    <tr>
                      <th style={styles.th}>Claim ID</th><th style={styles.th}>Member</th><th style={styles.th}>DOS</th>
                      <th style={styles.th}>CPT</th><th style={styles.th}>Billed</th><th style={styles.th}>Status</th><th style={styles.th}>Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map(c => (
                      <tr key={c.id} data-testid={`search-row-${c.id}`} style={{ background: c.status === "Approved" ? colors.successLight : "transparent" }}>
                        <td style={{ ...styles.td, fontWeight: 600, color: colors.primary }}>{c.id}</td>
                        <td style={styles.td}>{c.patientName} ({c.memberId})</td>
                        <td style={styles.td}>{c.serviceDate}</td>
                        <td style={{ ...styles.td, fontFamily: "monospace" }}>{c.procedureCode}</td>
                        <td style={styles.td}>${c.billedAmount.toLocaleString()}</td>
                        <td style={styles.td}><Badge type={c.status}>{c.status}</Badge></td>
                        <td style={styles.td}>{c.submittedDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* Adjudication Modal */}
      {selectedClaim && <AdjudicationModal claim={selectedClaim} onClose={() => setSelectedClaim(null)} onAdjudicate={adjudicate} members={members} />}
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ADJUDICATION MODAL - Three-Way Match Workflow
// ═══════════════════════════════════════════════════════════════

function AdjudicationModal({ claim, onClose, onAdjudicate, members }) {
  const [decision, setDecision] = useState("");
  const [carcCode, setCarcCode] = useState("");
  const [notes, setNotes] = useState(claim.notes || "");
  const [allowedAmt, setAllowedAmt] = useState(claim.allowedAmount.toString());

  const member = members.find(m => m.memberId === claim.memberId || m.planId === claim.planId);
  const facility = FACILITIES.find(f => f.npi === claim.facilityNpi);
  const feeEntry = FEE_SCHEDULE.find(f => f.cptCode === claim.procedureCode);
  const diagDesc = DIAGNOSIS_CODES.find(d => d.code === claim.diagnosisCode)?.desc || "";
  const procDesc = PROCEDURE_CODES.find(p => p.code === claim.procedureCode)?.desc || "";

  // Validation checks
  const isEligible = member?.status === "Active";
  const isInNetwork = facility?.networkStatus === "In-Network";
  const hasMemberData = !!(claim.memberId && claim.facilityNpi && claim.serviceDate);
  const isDuplicate = claim.notes?.toLowerCase().includes("duplicate");
  const contractualAdj = claim.billedAmount - parseFloat(allowedAmt || 0);

  const handleSubmit = () => {
    if (!decision) return;
    onAdjudicate(claim.id, decision, carcCode, notes, parseFloat(allowedAmt));
  };

  const checkStyle = (pass) => ({ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, background: pass ? colors.successLight : colors.dangerLight, fontSize: 13, marginBottom: 8 });

  return (
    <div style={styles.modal} data-testid="adjudication-modal" id="adjudication-modal" onClick={onClose}>
      <div style={{ ...styles.modalContent, maxWidth: 850 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }} data-testid="adjudication-title">⚖️ Claim Adjudication — {claim.id}</h2>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>Manual Line-Item Review</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: colors.textMuted }} data-testid="btn-close-adjudication" aria-label="Close adjudication">×</button>
        </div>

        {/* Stage 1: Claim Data */}
        <div style={{ ...styles.card, background: colors.bg }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: colors.primary }}>📄 CLAIM DETAILS</div>
          <div style={styles.grid3}>
            <div><span style={{ fontSize: 11, color: colors.textMuted }}>Member ID</span><div style={{ fontWeight: 600, fontFamily: "monospace" }} data-testid="adj-member-id">{claim.memberId}</div></div>
            <div><span style={{ fontSize: 11, color: colors.textMuted }}>Patient</span><div style={{ fontWeight: 600 }} data-testid="adj-patient-name">{claim.patientName}</div></div>
            <div><span style={{ fontSize: 11, color: colors.textMuted }}>Provider NPI</span><div style={{ fontWeight: 600, fontFamily: "monospace" }} data-testid="adj-npi">{claim.facilityNpi}</div></div>
            <div><span style={{ fontSize: 11, color: colors.textMuted }}>Facility</span><div style={{ fontWeight: 600 }} data-testid="adj-facility">{claim.facility}</div></div>
            <div><span style={{ fontSize: 11, color: colors.textMuted }}>Date of Service</span><div style={{ fontWeight: 600 }} data-testid="adj-dos">{claim.serviceDate}</div></div>
            <div><span style={{ fontSize: 11, color: colors.textMuted }}>Visit Type</span><div style={{ fontWeight: 600 }} data-testid="adj-visit-type">{claim.visitType}</div></div>
            <div><span style={{ fontSize: 11, color: colors.textMuted }}>ICD-10: {claim.diagnosisCode}</span><div style={{ fontWeight: 600, fontSize: 12 }} data-testid="adj-diagnosis">{diagDesc}</div></div>
            <div><span style={{ fontSize: 11, color: colors.textMuted }}>CPT: {claim.procedureCode}</span><div style={{ fontWeight: 600, fontSize: 12 }} data-testid="adj-procedure">{procDesc}</div></div>
            <div><span style={{ fontSize: 11, color: colors.textMuted }}>Billed Amount</span><div style={{ fontWeight: 700, fontSize: 18, color: colors.text }} data-testid="adj-billed-amount">${claim.billedAmount.toLocaleString()}</div></div>
          </div>
        </div>

        {/* Stage 2: Validation Checks */}
        <div style={{ ...styles.card, background: colors.bg }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: colors.primary }}>✅ VALIDATION CHECKS (Three-Way Match)</div>
          <div style={checkStyle(hasMemberData)} data-testid="check-data-integrity">
            <span>{hasMemberData ? "✅" : "❌"}</span>
            <span><strong>Data Integrity:</strong> Member ID, NPI, and Dates {hasMemberData ? "present and clear" : "— Missing data (CO-16)"}</span>
          </div>
          <div style={checkStyle(isEligible)} data-testid="check-eligibility">
            <span>{isEligible ? "✅" : "❌"}</span>
            <span><strong>Eligibility:</strong> Plan {isEligible ? `active (${member?.planName})` : "inactive on Date of Service (CO-27)"}</span>
          </div>
          <div style={checkStyle(!isDuplicate)} data-testid="check-duplicate">
            <span>{isDuplicate ? "⚠️" : "✅"}</span>
            <span><strong>Duplicate Check:</strong> {isDuplicate ? "Potential duplicate detected (CO-18)" : "No duplicate claims found"}</span>
          </div>
          <div style={checkStyle(isInNetwork)} data-testid="check-network">
            <span>{isInNetwork ? "✅" : "⚠️"}</span>
            <span><strong>Network Status:</strong> {facility?.name} is <strong>{facility?.networkStatus}</strong>{!isInNetwork ? " — OON deductible penalty applies" : ""}</span>
          </div>
        </div>

        {/* Stage 3: Pricing */}
        <div style={{ ...styles.card, background: colors.bg }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: colors.primary }}>💰 PRICING / ADJUDICATION</div>
          <div style={styles.grid3}>
            <div>
              <label style={{ fontSize: 11, color: colors.textMuted, display: "block", marginBottom: 4 }}>Billed Amount</label>
              <div style={{ fontWeight: 700, fontSize: 16 }} data-testid="adj-pricing-billed">${claim.billedAmount.toLocaleString()}</div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: colors.textMuted, display: "block", marginBottom: 4 }}>Fee Schedule Rate</label>
              <div style={{ fontWeight: 700, fontSize: 16, color: colors.info }} data-testid="adj-pricing-fee-schedule">{feeEntry ? `$${feeEntry.allowedAmount.toLocaleString()}` : "N/A"}</div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: colors.textMuted, display: "block", marginBottom: 4 }}>Contractual Adj.</label>
              <div style={{ fontWeight: 700, fontSize: 16, color: colors.success }} data-testid="adj-pricing-adjustment">${contractualAdj.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, display: "block", marginBottom: 4 }}>Allowed Amount</label>
            <input type="number" value={allowedAmt} onChange={e => setAllowedAmt(e.target.value)} style={{ ...styles.input, maxWidth: 200, fontWeight: 700, fontSize: 16 }} data-testid="input-allowed-amount" id="input-allowed-amount" aria-label="Allowed Amount" />
          </div>
        </div>

        {/* Stage 4: Decision */}
        <div style={{ ...styles.card, background: colors.bg }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, color: colors.primary }}>⚖️ FINAL DECISION</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <button onClick={() => setDecision("Approved")} style={{ ...styles.btn(decision === "Approved" ? "success" : "outline"), flex: 1, justifyContent: "center" }} data-testid="btn-decision-approve" id="btn-decision-approve" aria-label="Approve claim">✅ Approve</button>
            <button onClick={() => setDecision("Pended")} style={{ ...styles.btn(decision === "Pended" ? "pended" : "outline"), flex: 1, justifyContent: "center" }} data-testid="btn-decision-pend" id="btn-decision-pend" aria-label="Pend claim">⏸ Pend / Defer</button>
            <button onClick={() => setDecision("Rejected")} style={{ ...styles.btn(decision === "Rejected" ? "danger" : "outline"), flex: 1, justifyContent: "center" }} data-testid="btn-decision-reject" id="btn-decision-reject" aria-label="Reject claim">❌ Reject / Deny</button>
          </div>

          {decision === "Rejected" && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, display: "block", marginBottom: 4 }}>CARC Code (Denial Reason)</label>
              <select value={carcCode} onChange={e => setCarcCode(e.target.value)} style={styles.select} data-testid="select-carc-code" id="select-carc-code" aria-label="Select CARC denial code">
                <option value="">-- Select CARC Code --</option>
                {CARC_CODES.map(c => <option key={c.code} value={c.code}>{c.code}: {c.desc}</option>)}
              </select>
            </div>
          )}

          {decision === "Pended" && (
            <div style={{ marginBottom: 12, padding: 12, background: colors.pendedLight, borderRadius: 6, fontSize: 13 }}>
              <strong>Pend Reason:</strong> Clinical information missing or high-dollar surgery requires manual clinical review.
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: colors.textSecondary, display: "block", marginBottom: 4 }}>Internal Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder={decision === "Pended" ? "e.g. Need Medical Records, Operative Report required" : "Add internal notes..."} style={{ ...styles.input, resize: "vertical" }} data-testid="input-adjudication-notes" id="input-adjudication-notes" aria-label="Internal notes" />
          </div>

          <button onClick={handleSubmit} disabled={!decision || (decision === "Rejected" && !carcCode)} style={{ ...styles.btn("primary"), width: "100%", justifyContent: "center", padding: "12px 16px", opacity: (!decision || (decision === "Rejected" && !carcCode)) ? 0.5 : 1 }} data-testid="btn-submit-adjudication" id="btn-submit-adjudication" aria-label="Submit adjudication decision">
            Submit {decision || "Decision"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HEALTH PLANS - Plan Master + Benefit Limits + Service Price List
// ═══════════════════════════════════════════════════════════════

function HealthPlansPage({ members }) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [activeTab, setActiveTab] = useState("planMaster");
  const [feeSearch, setFeeSearch] = useState("");

  const plan = selectedPlan || HEALTH_PLANS[0];

  const filteredFees = FEE_SCHEDULE.filter(f =>
    f.cptCode.includes(feeSearch) || f.description.toLowerCase().includes(feeSearch.toLowerCase()) || f.category.toLowerCase().includes(feeSearch.toLowerCase())
  );

  return (
    <div data-testid="health-plans-page" id="health-plans-page">
      <TabBar tabs={[
        { key: "planMaster", label: "📋 Plan Master" },
        { key: "benefitLimits", label: "📊 Benefit Limits" },
        { key: "priceList", label: "💰 Service Price List" },
      ]} active={activeTab} onChange={setActiveTab} testIdPrefix="healthplans" />

      {activeTab === "planMaster" && (
        <div data-testid="plan-master-panel">
          <div style={styles.card}>
            <div style={styles.cardTitle}>Plan Master — Insurance Policies & Coverage Rules</div>
            <table style={styles.table} data-testid="table-plan-master" aria-label="Plan Master Table">
              <thead>
                <tr>
                  <th style={styles.th}>Plan Code</th><th style={styles.th}>Plan Name</th><th style={styles.th}>Type</th>
                  <th style={styles.th}>State</th><th style={styles.th}>Age Range</th><th style={styles.th}>Valid Period</th><th style={styles.th}>Status</th><th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {HEALTH_PLANS.map(p => (
                  <tr key={p.code} data-testid={`plan-row-${p.code}`} style={{ background: selectedPlan?.code === p.code ? colors.primaryLight : "transparent" }}>
                    <td style={{ ...styles.td, fontWeight: 600, fontFamily: "monospace" }}>{p.code}</td>
                    <td style={{ ...styles.td, fontWeight: 600 }}>{p.name}</td>
                    <td style={styles.td}><Badge type={p.type}>{p.type}</Badge></td>
                    <td style={styles.td}>{p.state}</td>
                    <td style={styles.td}>{p.minAge}-{p.maxAge}</td>
                    <td style={styles.td}>{p.validFrom} to {p.validTo}</td>
                    <td style={styles.td}><Badge type={p.status}>{p.status}</Badge></td>
                    <td style={styles.td}>
                      <button onClick={() => setSelectedPlan(p)} style={{ ...styles.btn("primary"), padding: "4px 12px", fontSize: 11 }} data-testid={`btn-view-plan-${p.code}`}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Plan Detail */}
          {plan && plan.benefits.length > 0 && (
            <div style={styles.card} data-testid="plan-detail-panel">
              <div style={styles.cardTitle}>{plan.name} — Coverage Details</div>
              <div style={styles.grid2}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 8 }}>Benefits & Copays</div>
                  <table style={styles.table} data-testid="table-plan-benefits" aria-label="Plan Benefits Table">
                    <thead><tr><th style={styles.th}>Service</th><th style={styles.th}>Copay</th><th style={styles.th}>Coinsurance</th><th style={styles.th}>Prior Auth</th><th style={styles.th}>Annual Max</th></tr></thead>
                    <tbody>
                      {plan.benefits.map((b, i) => (
                        <tr key={i} data-testid={`benefit-row-${i}`}>
                          <td style={styles.td}>{b.service}</td><td style={{ ...styles.td, fontWeight: 600 }}>{b.copay}</td>
                          <td style={styles.td}>{b.coinsurance}</td><td style={styles.td}>{b.priorAuth}</td><td style={styles.td}>{b.annualMax || b.limit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 8 }}>Deductibles & Out-of-Pocket</div>
                  {plan.deductibles && Object.keys(plan.deductibles).length > 0 ? (
                    <table style={styles.table} data-testid="table-plan-deductibles" aria-label="Plan Deductibles Table">
                      <thead><tr><th style={styles.th}>Category</th><th style={styles.th}>In-Network</th><th style={styles.th}>Out-of-Network</th></tr></thead>
                      <tbody>
                        <tr><td style={styles.td}>Individual Deductible</td><td style={{ ...styles.td, fontWeight: 600 }}>{plan.deductibles.indivIn}</td><td style={styles.td}>{plan.deductibles.indivOut}</td></tr>
                        <tr><td style={styles.td}>Family Deductible</td><td style={{ ...styles.td, fontWeight: 600 }}>{plan.deductibles.famIn}</td><td style={styles.td}>{plan.deductibles.famOut}</td></tr>
                        <tr><td style={styles.td}>Individual OOP Max</td><td style={{ ...styles.td, fontWeight: 600 }}>{plan.deductibles.oopIndivIn}</td><td style={styles.td}>{plan.deductibles.oopIndivOut}</td></tr>
                        <tr><td style={styles.td}>Family OOP Max</td><td style={{ ...styles.td, fontWeight: 600 }}>{plan.deductibles.oopFamIn}</td><td style={styles.td}>{plan.deductibles.oopFamOut}</td></tr>
                      </tbody>
                    </table>
                  ) : <div style={{ fontSize: 13, color: colors.textMuted, padding: 12 }}>No deductible data available for this plan</div>}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "benefitLimits" && (
        <div data-testid="benefit-limits-panel">
          <div style={styles.card}>
            <div style={styles.cardTitle}>📊 Member Benefit Limits — Patient-Specific Usage Tracking</div>
            <table style={styles.table} data-testid="table-benefit-limits" aria-label="Benefit Limits Table">
              <thead>
                <tr>
                  <th style={styles.th}>Member ID</th><th style={styles.th}>Member Name</th><th style={styles.th}>Plan</th>
                  <th style={styles.th}>Inpatient Used</th><th style={styles.th}>Inpatient Limit</th><th style={styles.th}>OOP Used</th><th style={styles.th}>OOP Max</th><th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => {
                  const plan = HEALTH_PLANS.find(p => p.code === m.planCode);
                  const oopMax = plan?.deductibles?.oopIndivIn ? parseInt(plan.deductibles.oopIndivIn.replace(/[^0-9]/g, "")) : 0;
                  const inLimit = plan?.benefits?.find(b => b.service === "Inpatient Hospital")?.limit || "N/A";
                  const oopPct = oopMax > 0 ? Math.round((m.benefitUsed.outOfPocketUsed / oopMax) * 100) : 0;
                  return (
                    <tr key={m.id} data-testid={`benefit-limit-row-${m.id}`}>
                      <td style={{ ...styles.td, fontFamily: "monospace", fontSize: 12 }}>{m.id}</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>{m.name}</td>
                      <td style={styles.td}>{m.planName}</td>
                      <td style={{ ...styles.td, fontWeight: 600 }}>${m.benefitUsed.inpatient.toLocaleString()}</td>
                      <td style={styles.td}>{inLimit}</td>
                      <td style={{ ...styles.td, fontWeight: 600, color: oopPct > 80 ? colors.danger : colors.text }}>${m.benefitUsed.outOfPocketUsed.toLocaleString()}</td>
                      <td style={styles.td}>{plan?.deductibles?.oopIndivIn || "N/A"}</td>
                      <td style={styles.td}><Badge type={m.status}>{m.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "priceList" && (
        <div data-testid="service-price-list-panel">
          <div style={styles.card}>
            <div style={styles.cardTitle}>💰 Service Price List — Contracted Fee Schedules (CPT/HCPCS)</div>
            <div style={{ marginBottom: 16 }}>
              <input value={feeSearch} onChange={e => setFeeSearch(e.target.value)} placeholder="Search by CPT code, description, or category..." style={{ ...styles.input, maxWidth: 400 }} data-testid="search-fee-schedule" id="search-fee-schedule" aria-label="Search fee schedule" />
            </div>
            <table style={styles.table} data-testid="table-fee-schedule" aria-label="Fee Schedule Table">
              <thead>
                <tr>
                  <th style={styles.th}>CPT Code</th><th style={styles.th}>Description</th><th style={styles.th}>Category</th>
                  <th style={styles.th}>Avg Billed</th><th style={styles.th}>Allowed Amount</th><th style={styles.th}>Medicare Rate</th><th style={styles.th}>Variance</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map(f => (
                  <tr key={f.cptCode} data-testid={`fee-row-${f.cptCode}`}>
                    <td style={{ ...styles.td, fontWeight: 600, fontFamily: "monospace" }}>{f.cptCode}</td>
                    <td style={styles.td}>{f.description}</td>
                    <td style={styles.td}><Badge type={f.category}>{f.category}</Badge></td>
                    <td style={styles.td}>${f.billedAvg.toLocaleString()}</td>
                    <td style={{ ...styles.td, fontWeight: 700, color: colors.success }}>${f.allowedAmount.toLocaleString()}</td>
                    <td style={styles.td}>${f.medicareRate.toLocaleString()}</td>
                    <td style={{ ...styles.td, color: colors.danger }}>{Math.round(((f.billedAvg - f.allowedAmount) / f.billedAvg) * 100)}% adj.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// HEALTHCARE FACILITIES - Provider Registry with Network Status
// ═══════════════════════════════════════════════════════════════

function FacilitiesPage() {
  const [search, setSearch] = useState("");
  const filtered = FACILITIES.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) || f.npi.includes(search) || f.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div data-testid="facilities-page" id="facilities-page">
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={styles.cardTitle}>Provider Registry — NPI & Network Verification</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, NPI, or location..." style={{ ...styles.input, maxWidth: 300 }} data-testid="search-facilities" id="search-facilities" aria-label="Search facilities" />
        </div>
        <table style={styles.table} data-testid="table-facilities" aria-label="Healthcare Facilities Table">
          <thead>
            <tr>
              <th style={styles.th}>Facility ID</th><th style={styles.th}>Facility Name</th><th style={styles.th}>Location</th>
              <th style={styles.th}>NPI</th><th style={styles.th}>Type</th><th style={styles.th}>Network Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(f => (
              <tr key={f.id} data-testid={`facility-row-${f.id}`}>
                <td style={{ ...styles.td, fontFamily: "monospace" }}>{f.id}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{f.name}</td>
                <td style={styles.td}>{f.location}</td>
                <td style={{ ...styles.td, fontFamily: "monospace" }}>{f.npi}</td>
                <td style={styles.td}>{f.type}</td>
                <td style={styles.td}><Badge type={f.networkStatus} testId={`network-${f.id}`}>{f.networkStatus}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MEMBER PORTAL - Eligibility Check + Member Details
// ═══════════════════════════════════════════════════════════════

function MemberPortalPage({ members }) {
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.id.includes(search) || m.planId.includes(search)
  );

  return (
    <div data-testid="member-portal-page" id="member-portal-page">
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div style={styles.cardTitle}>Eligibility Check & Member Details</div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, member ID, or plan ID..." style={{ ...styles.input, maxWidth: 350 }} data-testid="search-members" id="search-members" aria-label="Search members" />
        </div>
        <table style={styles.table} data-testid="table-members" aria-label="Members Table">
          <thead>
            <tr>
              <th style={styles.th}>Member ID</th><th style={styles.th}>Name</th><th style={styles.th}>DOB</th>
              <th style={styles.th}>Plan</th><th style={styles.th}>Group #</th><th style={styles.th}>Effective</th><th style={styles.th}>Term</th><th style={styles.th}>Status</th><th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} data-testid={`member-row-${m.id}`} style={{ background: m.status === "Inactive" ? colors.dangerLight : "transparent" }}>
                <td style={{ ...styles.td, fontWeight: 600, fontFamily: "monospace" }}>{m.id}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{m.name}</td>
                <td style={styles.td}>{m.dob}</td>
                <td style={styles.td}>{m.planName}</td>
                <td style={{ ...styles.td, fontFamily: "monospace" }}>{m.groupNo}</td>
                <td style={styles.td}>{m.effectiveDate}</td>
                <td style={styles.td}>{m.termDate}</td>
                <td style={styles.td}><Badge type={m.status} testId={`member-status-${m.id}`}>{m.status}</Badge></td>
                <td style={styles.td}>
                  <button onClick={() => setSelectedMember(m)} style={{ ...styles.btn("primary"), padding: "4px 12px", fontSize: 11 }} data-testid={`btn-view-member-${m.id}`} id={`btn-view-member-${m.id}`}>Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div style={styles.modal} data-testid="member-detail-modal" onClick={() => setSelectedMember(null)}>
          <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }} data-testid="member-detail-name">👤 {selectedMember.name}</h2>
              <button onClick={() => setSelectedMember(null)} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: colors.textMuted }} data-testid="btn-close-member-detail" aria-label="Close member detail">×</button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <Badge type={selectedMember.status} testId="member-detail-status">{selectedMember.status}</Badge>
              <span style={{ fontSize: 13, color: colors.textMuted }}>{selectedMember.planName}</span>
            </div>

            <div style={styles.grid2}>
              <div style={{ ...styles.card, background: colors.bg }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 12 }}>Personal Information</div>
                {[["Member ID", selectedMember.id], ["DOB", selectedMember.dob], ["Gender", selectedMember.gender], ["SSN", selectedMember.ssn], ["Phone", selectedMember.phone], ["Email", selectedMember.email], ["Address", selectedMember.address]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${colors.border}`, fontSize: 13 }}>
                    <span style={{ color: colors.textMuted }}>{l}</span><span style={{ fontWeight: 600 }} data-testid={`member-detail-${l.toLowerCase().replace(/\s/g, "-")}`}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ ...styles.card, background: colors.bg }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 12 }}>Coverage Information</div>
                {[["Plan ID", selectedMember.planId], ["Plan", selectedMember.planName], ["Group #", selectedMember.groupNo], ["Effective", selectedMember.effectiveDate], ["Termination", selectedMember.termDate], ["OOP Used", `$${selectedMember.benefitUsed.outOfPocketUsed.toLocaleString()}`]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${colors.border}`, fontSize: 13 }}>
                    <span style={{ color: colors.textMuted }}>{l}</span><span style={{ fontWeight: 600 }} data-testid={`member-coverage-${l.toLowerCase().replace(/\s/g, "-")}`}>{v}</span>
                  </div>
                ))}

                {selectedMember.dependents.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: colors.primary, marginBottom: 8 }}>Dependents</div>
                    {selectedMember.dependents.map((d, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13, borderBottom: `1px solid ${colors.border}` }} data-testid={`dependent-${i}`}>
                        <span>{d.name} ({d.rel})</span>
                        <Badge type={d.status} testId={`dependent-status-${i}`}>{d.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// BATCH PROCESSING - Bulk Adjudication
// ═══════════════════════════════════════════════════════════════

function BatchProcessingPage({ batches, setBatches, claims, setClaims }) {
  const [toast, setToast] = useState("");

  const processBatch = (batchId) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: "Completed" } : b));
    // Auto-adjudicate submitted clean claims (low priority, low amount)
    setClaims(prev => prev.map(c => {
      if (c.status === "Submitted" && c.priority === "Low" && c.billedAmount < 500) {
        return { ...c, status: "Approved", notes: `Auto-adjudicated via ${batchId}` };
      }
      return c;
    }));
    setToast(`${batchId} processed — clean claims auto-adjudicated`);
  };

  return (
    <div data-testid="batch-processing-page" id="batch-processing-page">
      <div style={styles.card}>
        <div style={styles.cardTitle}>Bulk Adjudication — One-Click Processing for Clean Claims</div>
        <table style={styles.table} data-testid="table-batches" aria-label="Batch Processing Table">
          <thead>
            <tr>
              <th style={styles.th}>Batch ID</th><th style={styles.th}>Date</th><th style={styles.th}>Type</th>
              <th style={styles.th}>Claims</th><th style={styles.th}>Total Amount</th><th style={styles.th}>Status</th><th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(b => (
              <tr key={b.id} data-testid={`batch-row-${b.id}`}>
                <td style={{ ...styles.td, fontWeight: 600, fontFamily: "monospace" }}>{b.id}</td>
                <td style={styles.td}>{b.date}</td>
                <td style={styles.td}><Badge type={b.type}>{b.type}</Badge></td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{b.claimCount}</td>
                <td style={{ ...styles.td, fontWeight: 600 }}>${b.totalAmount.toLocaleString()}</td>
                <td style={styles.td}><Badge type={b.status} testId={`batch-status-${b.id}`}>{b.status}</Badge></td>
                <td style={styles.td}>
                  {b.status !== "Completed" && (
                    <button onClick={() => processBatch(b.id)} style={{ ...styles.btn("success"), padding: "5px 12px", fontSize: 11 }} data-testid={`btn-process-batch-${b.id}`} id={`btn-process-batch-${b.id}`} aria-label={`Process batch ${b.id}`}>
                      ⚡ Process Batch
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════

export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [claims, setClaims] = useState(SAMPLE_CLAIMS);
  const [members] = useState(SAMPLE_MEMBERS);
  const [batches, setBatches] = useState(SAMPLE_BATCHES);

  if (!user) return <LoginPage onLogin={setUser} />;

  const pages = {
    dashboard: { title: "Dashboard", icon: "📊", breadcrumb: "Main > Adjudication Dashboard" },
    "claims-worklist": { title: "Claims Worklist", icon: "📋", breadcrumb: "Claims > Worklist" },
    "health-plans": { title: "Health Plans / Products", icon: "📄", breadcrumb: "Products > Health Plans" },
    facilities: { title: "Healthcare Facilities", icon: "🏥", breadcrumb: "Registry > Healthcare Facilities" },
    "member-portal": { title: "Member Portal", icon: "👤", breadcrumb: "Members > Eligibility & Details" },
    "batch-processing": { title: "Batch Processing", icon: "📦", breadcrumb: "Processing > Bulk Adjudication" },
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

          <div style={styles.navSection}>Claims</div>
          <div style={styles.navItem(page === "claims-worklist")} onClick={() => setPage("claims-worklist")} data-testid="nav-claims-worklist" id="nav-claims-worklist" role="button" aria-label="Claims Worklist" aria-current={page === "claims-worklist" ? "page" : undefined}>
            <span style={styles.navIcon}>📋</span> Claims Worklist
          </div>

          <div style={styles.navSection}>Products</div>
          <div style={styles.navItem(page === "health-plans")} onClick={() => setPage("health-plans")} data-testid="nav-health-plans" id="nav-health-plans" role="button" aria-label="Health Plans / Products" aria-current={page === "health-plans" ? "page" : undefined}>
            <span style={styles.navIcon}>📄</span> Health Plans / Products
          </div>

          <div style={styles.navSection}>Registry</div>
          <div style={styles.navItem(page === "facilities")} onClick={() => setPage("facilities")} data-testid="nav-facilities" id="nav-facilities" role="button" aria-label="Healthcare Facilities" aria-current={page === "facilities" ? "page" : undefined}>
            <span style={styles.navIcon}>🏥</span> Healthcare Facilities
          </div>

          <div style={styles.navSection}>Members</div>
          <div style={styles.navItem(page === "member-portal")} onClick={() => setPage("member-portal")} data-testid="nav-member-portal" id="nav-member-portal" role="button" aria-label="Member Portal" aria-current={page === "member-portal" ? "page" : undefined}>
            <span style={styles.navIcon}>👤</span> Member Portal
          </div>

          <div style={styles.navSection}>Processing</div>
          <div style={styles.navItem(page === "batch-processing")} onClick={() => setPage("batch-processing")} data-testid="nav-batch-processing" id="nav-batch-processing" role="button" aria-label="Batch Processing" aria-current={page === "batch-processing" ? "page" : undefined}>
            <span style={styles.navIcon}>📦</span> Batch Processing
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
          {page === "claims-worklist" && <ClaimsWorklistPage claims={claims} setClaims={setClaims} members={members} />}
          {page === "health-plans" && <HealthPlansPage members={members} />}
          {page === "facilities" && <FacilitiesPage />}
          {page === "member-portal" && <MemberPortalPage members={members} />}
          {page === "batch-processing" && <BatchProcessingPage batches={batches} setBatches={setBatches} claims={claims} setClaims={setClaims} />}
        </div>
      </div>
    </div>
  );
}

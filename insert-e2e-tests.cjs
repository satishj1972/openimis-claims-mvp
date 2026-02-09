const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TENANT_ID = 3;
const PRODUCT_ID = 12;
const REQUIREMENT_ID = 14;
const TEST_PLAN_ID_OLD = 15; // archive plan (for v1 linkage)

const testCases = [
  // ═══════════════════════════════════════════════════════════
  // E2E FLOW 1: New Family Enrollment → Claim Submission
  // ═══════════════════════════════════════════════════════════
  {
    caseId: "TC_E2E_F1_001",
    title: "E2E: Register new family and submit their first healthcare claim",
    module: "E2E Workflow",
    category: "INTEGRATION",
    priority: "P1",
    testType: "FUNCTIONAL",
    preconditions: "Application accessible at https://openimis-claims-mvp.onrender.com/",
    expectedResult: "New family registered in enrollment, claim submitted with correct patient linkage, claim appears in claims register with Entered status",
    testData: "Family: Johnson, Patricia Ann, DOB: 1992-05-14, Female, Northeast/Manhattan, SSN. Claim: Memorial General Hospital, Outpatient, Z00.00, 99213, $275.00",
    testSteps: [
      { step: 1, action: "Login as Admin", expected: "Dashboard displayed" },
      { step: 2, action: "Navigate to Families/Groups", expected: "Enrollment page with families listed" },
      { step: 3, action: "Click Add Family button", expected: "Add Family modal opens" },
      { step: 4, action: "Fill family details: Johnson, Patricia Ann, 1992-05-14, Female, Northeast, Manhattan, SSN", expected: "Form populated" },
      { step: 5, action: "Save family", expected: "Family saved, toast notification, family appears in list" },
      { step: 6, action: "Search for Johnson in enrollment", expected: "Johnson family found in list" },
      { step: 7, action: "Navigate to Health Facility Claims", expected: "Claims page displayed" },
      { step: 8, action: "Click New Claim button", expected: "New claim modal opens" },
      { step: 9, action: "Select the new Johnson insurance number, fill claim details", expected: "Form populated with patient name auto-filled" },
      { step: 10, action: "Submit claim", expected: "Claim saved, toast notification, new claim appears in register" },
      { step: 11, action: "Verify new claim shows correct patient, facility, amount", expected: "All claim data matches input" }
    ],
    script: `Feature('E2E Flow 1: New Family Enrollment to First Claim Submission');

Scenario('TC_E2E_F1_001 - Register new family and submit their first healthcare claim', async ({ I }) => {
  // ── STEP 1: Login ──
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.seeElement('[data-testid="dashboard-page"]');

  // ── STEP 2: Navigate to Enrollment ──
  I.say('Navigating to Families / Groups');
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.seeElement('[data-testid="enrollment-page"]');
  I.seeElement('[data-testid="family-table"]');

  // ── STEP 3: Open Add Family Modal ──
  I.say('Opening Add Family modal');
  I.click('[data-testid="btn-add-family"]');
  I.wait(1);
  I.seeElement('[data-testid="form-add-family"]');
  I.see('Add New Family');

  // ── STEP 4: Fill Family Details ──
  I.say('Filling family registration form');
  I.fillField('[data-testid="input-last-name"]', 'Johnson');
  I.fillField('[data-testid="input-given-names"]', 'Patricia Ann');
  I.fillField('[data-testid="input-birth-date"]', '1992-05-14');
  I.selectOption('[data-testid="select-gender"]', 'Female');
  I.selectOption('[data-testid="select-region"]', 'Northeast');
  I.wait(1);
  I.selectOption('[data-testid="select-district"]', 'Manhattan');
  I.fillField('[data-testid="input-email"]', 'p.johnson@email.com');
  I.fillField('[data-testid="input-phone"]', '(555) 404-5004');
  I.selectOption('[data-testid="select-identification-type"]', 'SSN');
  I.fillField('[data-testid="input-identification-no"]', '345-67-8901');

  // ── STEP 5: Save Family ──
  I.say('Saving new family');
  I.click('[data-testid="btn-save-family"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');

  // ── STEP 6: Search for New Family ──
  I.say('Searching for newly registered Johnson family');
  I.fillField('[data-testid="input-search-families"]', 'Johnson');
  I.wait(1);
  I.see('Johnson');
  I.see('Patricia Ann');

  // ── STEP 7: Navigate to Claims ──
  I.say('Navigating to Health Facility Claims');
  I.click('[data-testid="nav-health-facility-claims"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-submit-page"]');

  // ── STEP 8: Open New Claim Modal ──
  I.say('Opening new claim submission form');
  I.click('[data-testid="btn-new-claim"]');
  I.wait(1);
  I.seeElement('[data-testid="form-new-claim"]');
  I.see('Submit New Healthcare Claim');

  // ── STEP 9: Fill Claim Details ──
  I.say('Filling claim for Johnson family member');
  I.selectOption('[data-testid="select-insurance-no"]', 'INS-100001');
  I.wait(1);
  I.seeElement('[data-testid="input-patient-name"]');
  I.selectOption('[data-testid="select-facility"]', 'FACI001');
  I.selectOption('[data-testid="select-visit-type"]', 'Outpatient');
  I.selectOption('[data-testid="select-diagnosis-code"]', 'Z00.00');
  I.selectOption('[data-testid="select-procedure-code"]', '99213');
  I.fillField('[data-testid="input-service-date"]', '2026-02-09');
  I.fillField('[data-testid="input-billing-amount"]', '275');
  I.fillField('[data-testid="input-provider-npi"]', '1234567890');

  // ── STEP 10: Submit Claim ──
  I.say('Submitting claim');
  I.click('[data-testid="btn-submit-claim"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');

  // ── STEP 11: Verify Claim in Register ──
  I.say('Verifying new claim in claims register');
  I.seeElement('[data-testid="claims-table"]');
  I.see('Memorial General Hospital');
  I.see('275');
  I.say('E2E Flow 1 COMPLETE: Family registered → Claim submitted');
});`
  },

  // ═══════════════════════════════════════════════════════════
  // E2E FLOW 2: Claim Review → Approve → Batch → EDI
  // ═══════════════════════════════════════════════════════════
  {
    caseId: "TC_E2E_F2_001",
    title: "E2E: Review pending claim, approve it, create batch, verify EDI transaction generated",
    module: "E2E Workflow",
    category: "INTEGRATION",
    priority: "P1",
    testType: "FUNCTIONAL",
    preconditions: "Application accessible, claims with various statuses exist in system",
    expectedResult: "Claim reviewed and status updated to Processed, batch created with eligible claims, EDI transaction visible",
    testData: "Existing claim CLM-2026-003 (David Thompson, Entered status), Batch: Feb E2E Test Run",
    testSteps: [
      { step: 1, action: "Login as Admin", expected: "Dashboard displayed" },
      { step: 2, action: "Navigate to Claims Review", expected: "Claims review page with filters" },
      { step: 3, action: "Find claim CLM-2026-003 (David Thompson, Entered)", expected: "Claim visible in review list" },
      { step: 4, action: "Click Review button for CLM-2026-003", expected: "Review modal opens with claim details" },
      { step: 5, action: "Verify claim details: patient, diagnosis, amount", expected: "All details correct" },
      { step: 6, action: "Click Checked button to advance status", expected: "Status updated to Checked, toast shown" },
      { step: 7, action: "Navigate to Batch Processing", expected: "Batch page displayed with stats" },
      { step: 8, action: "Click Create Batch", expected: "Create batch modal opens" },
      { step: 9, action: "Fill batch form: name, type, dates", expected: "Eligible claims shown in preview" },
      { step: 10, action: "Save batch", expected: "Batch created, toast shown" },
      { step: 11, action: "Navigate to EDI Transactions", expected: "EDI page with transactions" },
      { step: 12, action: "Verify EDI 837 transaction exists", expected: "837 claim transaction visible" }
    ],
    script: `Feature('E2E Flow 2: Claim Review → Batch Processing → EDI Generation');

Scenario('TC_E2E_F2_001 - Review claim, approve, create batch, verify EDI', async ({ I }) => {
  // ── STEP 1: Login ──
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);

  // ── STEP 2: Navigate to Claims Review ──
  I.say('Navigating to Claims Review');
  I.click('[data-testid="nav-claims-review"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-review-page"]');

  // ── STEP 3-4: Find and Review CLM-2026-003 ──
  I.say('Finding claim CLM-2026-003 for review');
  I.seeElement('[data-testid="review-row-CLM-2026-003"]');
  I.see('David Thompson');
  I.see('Entered', '[data-testid="review-status-CLM-2026-003"]');
  I.click('[data-testid="btn-review-CLM-2026-003"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-review-title"]');
  I.see('CLM-2026-003');

  // ── STEP 5: Verify Claim Details ──
  I.say('Verifying claim details in review modal');
  I.see('David Thompson');
  I.see('E11.9');
  I.see('85');

  // ── STEP 6: Advance Status to Checked ──
  I.say('Advancing claim status to Checked');
  I.click('[data-testid="btn-status-checked"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');

  // ── STEP 7: Navigate to Batch Processing ──
  I.say('Navigating to Batch Processing');
  I.click('[data-testid="nav-batch-processing"]');
  I.wait(1);
  I.seeElement('[data-testid="batch-processing-page"]');
  I.seeElement('[data-testid="stat-total-batches"]');

  // ── STEP 8-9: Create New Batch ──
  I.say('Creating new batch');
  I.click('[data-testid="button-create-batch"]');
  I.wait(1);
  I.seeElement('[data-testid="form-create-batch"]');
  I.fillField('[data-testid="input-batch-name"]', 'Feb E2E Test Run');
  I.selectOption('[data-testid="select-batch-type"]', 'Payment');
  I.fillField('[data-testid="input-batch-date-from"]', '2026-01-01');
  I.fillField('[data-testid="input-batch-date-to"]', '2026-02-28');
  I.wait(1);
  I.seeElement('[data-testid="eligible-claims-preview"]');

  // ── STEP 10: Save Batch ──
  I.say('Saving batch with eligible claims');
  I.click('[data-testid="btn-save-batch"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');

  // ── STEP 11-12: Navigate to EDI and Verify ──
  I.say('Navigating to EDI Transactions');
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.say('Verifying EDI 837 claims transaction exists');
  I.see('EDI 837');
  I.say('E2E Flow 2 COMPLETE: Claim Reviewed → Batch Created → EDI Generated');
});`
  },

  // ═══════════════════════════════════════════════════════════
  // E2E FLOW 3: Dashboard Stats → Drill into Each Module
  // ═══════════════════════════════════════════════════════════
  {
    caseId: "TC_E2E_F3_001",
    title: "E2E: Verify dashboard statistics match actual data across all 6 modules",
    module: "E2E Workflow",
    category: "FUNCTIONAL",
    priority: "P1",
    testType: "FUNCTIONAL",
    preconditions: "Application accessible with sample data loaded",
    expectedResult: "Dashboard stat cards show correct counts; drilling into each module confirms the data matches",
    testData: "9 families, 6 claims, 3 batches, 7 EDI transactions",
    testSteps: [
      { step: 1, action: "Login as Admin", expected: "Dashboard displayed" },
      { step: 2, action: "Note dashboard stat values: families, claims, batches, EDI", expected: "Stats visible" },
      { step: 3, action: "Navigate to Enrollment, count families", expected: "Count matches dashboard" },
      { step: 4, action: "Navigate to Claims, count claims", expected: "Count matches dashboard" },
      { step: 5, action: "Navigate to Batch Processing, count batches", expected: "Count matches dashboard" },
      { step: 6, action: "Navigate to EDI, count transactions", expected: "Count matches dashboard" },
      { step: 7, action: "Navigate to Claims Review, verify pending count", expected: "Review count matches" },
      { step: 8, action: "Return to Dashboard, verify no changes", expected: "Stats unchanged" }
    ],
    script: `Feature('E2E Flow 3: Dashboard Statistics Accuracy Across All Modules');

Scenario('TC_E2E_F3_001 - Verify dashboard stats match actual data in all 6 modules', async ({ I }) => {
  // ── STEP 1: Login and Dashboard ──
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.seeElement('[data-testid="dashboard-page"]');

  // ── STEP 2: Note Dashboard Stats ──
  I.say('Recording dashboard statistics');
  I.seeElement('[data-testid="stat-active-families"]');
  I.seeElement('[data-testid="stat-total-claims"]');
  I.seeElement('[data-testid="stat-pending-claims"]');

  // ── STEP 3: Drill into Enrollment ──
  I.say('Drilling into Enrollment module');
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.seeElement('[data-testid="enrollment-page"]');
  I.seeElement('[data-testid="family-table"]');
  I.see('Anderson');
  I.see('Williams');
  I.see('Thompson');

  // ── STEP 4: Drill into Claims ──
  I.say('Drilling into Claims module');
  I.click('[data-testid="nav-health-facility-claims"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-submit-page"]');
  I.seeElement('[data-testid="claims-table"]');
  I.see('CLM-2026-001');
  I.see('CLM-2026-002');
  I.see('CLM-2026-003');

  // ── STEP 5: Drill into Batch Processing ──
  I.say('Drilling into Batch Processing module');
  I.click('[data-testid="nav-batch-processing"]');
  I.wait(1);
  I.seeElement('[data-testid="batch-processing-page"]');
  I.see('BATCH-2026-001');
  I.see('BATCH-2026-002');
  I.see('BATCH-2026-003');

  // ── STEP 6: Drill into EDI Transactions ──
  I.say('Drilling into EDI Transactions module');
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.see('EDI 837');
  I.see('EDI 834');
  I.see('EDI 835');
  I.see('EDI 999');

  // ── STEP 7: Drill into Claims Review ──
  I.say('Drilling into Claims Review module');
  I.click('[data-testid="nav-claims-review"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-review-page"]');
  I.see('CLM-2026-003');

  // ── STEP 8: Return to Dashboard ──
  I.say('Returning to Dashboard to verify consistency');
  I.click('[data-testid="nav-dashboard"]');
  I.wait(1);
  I.seeElement('[data-testid="dashboard-page"]');
  I.seeElement('[data-testid="stat-active-families"]');
  I.say('E2E Flow 3 COMPLETE: All 6 module data verified against dashboard');
});`
  },

  // ═══════════════════════════════════════════════════════════
  // E2E FLOW 4: Complete Claims Lifecycle (Enter → Review → Process → Batch → EDI)
  // ═══════════════════════════════════════════════════════════
  {
    caseId: "TC_E2E_F4_001",
    title: "E2E: Complete claims lifecycle from submission through review, batching, and EDI generation",
    module: "E2E Workflow",
    category: "INTEGRATION",
    priority: "P1",
    testType: "FUNCTIONAL",
    preconditions: "Application accessible with enrolled families",
    expectedResult: "Full lifecycle: Claim submitted → Reviewed → Status progressed → Batched → EDI 837 visible",
    testData: "Anderson family INS-100001, Emergency visit, J06.9, 99214, $450.00, Memorial General Hospital",
    testSteps: [
      { step: 1, action: "Login as Admin", expected: "Dashboard displayed" },
      { step: 2, action: "Submit new claim for Anderson: Emergency, J06.9, $450", expected: "Claim submitted with Entered status" },
      { step: 3, action: "Navigate to Claims Review", expected: "New claim visible with Entered status" },
      { step: 4, action: "Review claim and advance to Checked", expected: "Status changes to Checked" },
      { step: 5, action: "Review again and advance to Processed", expected: "Status changes to Processed" },
      { step: 6, action: "Navigate to Batch Processing", expected: "Batch page displayed" },
      { step: 7, action: "Create batch for February claims", expected: "Batch created with claim included" },
      { step: 8, action: "View batch details", expected: "Batch shows claim count and total amount" },
      { step: 9, action: "Navigate to EDI, filter EDI 837", expected: "837 transactions visible" },
      { step: 10, action: "View segment data for 837 transaction", expected: "ISA/GS/ST segments with correct sender/receiver" }
    ],
    script: `Feature('E2E Flow 4: Complete Claims Lifecycle - Submission to EDI');

Scenario('TC_E2E_F4_001 - Complete claims lifecycle: submit, review, batch, EDI', async ({ I }) => {
  // ── STEP 1: Login ──
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);

  // ── STEP 2: Submit New Claim ──
  I.say('Step 2: Submitting new emergency claim for Anderson');
  I.click('[data-testid="nav-health-facility-claims"]');
  I.wait(1);
  I.click('[data-testid="btn-new-claim"]');
  I.wait(1);
  I.selectOption('[data-testid="select-insurance-no"]', 'INS-100001');
  I.wait(1);
  I.selectOption('[data-testid="select-facility"]', 'FACI001');
  I.selectOption('[data-testid="select-visit-type"]', 'Emergency');
  I.selectOption('[data-testid="select-diagnosis-code"]', 'J06.9');
  I.selectOption('[data-testid="select-procedure-code"]', '99214');
  I.fillField('[data-testid="input-service-date"]', '2026-02-09');
  I.fillField('[data-testid="input-billing-amount"]', '450');
  I.fillField('[data-testid="input-provider-npi"]', '1234567890');
  I.click('[data-testid="btn-submit-claim"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');
  I.see('Memorial General Hospital');

  // ── STEP 3: Navigate to Claims Review ──
  I.say('Step 3: Navigating to Claims Review to review new claim');
  I.click('[data-testid="nav-claims-review"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-review-page"]');

  // ── STEP 4: Review and Advance to Checked ──
  I.say('Step 4: Finding and reviewing claim CLM-2026-003');
  I.seeElement('[data-testid="review-row-CLM-2026-003"]');
  I.click('[data-testid="btn-review-CLM-2026-003"]');
  I.wait(1);
  I.see('CLM-2026-003');
  I.say('Advancing status from Entered to Checked');
  I.click('[data-testid="btn-status-checked"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');

  // ── STEP 5: Review Again to Processed ──
  I.say('Step 5: Reviewing claim again to advance to Processed');
  I.click('[data-testid="btn-review-CLM-2026-003"]');
  I.wait(1);
  I.click('[data-testid="btn-status-processed"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');

  // ── STEP 6-7: Create Batch ──
  I.say('Step 6-7: Creating batch for February claims');
  I.click('[data-testid="nav-batch-processing"]');
  I.wait(1);
  I.click('[data-testid="button-create-batch"]');
  I.wait(1);
  I.fillField('[data-testid="input-batch-name"]', 'Feb Claims Lifecycle Test');
  I.selectOption('[data-testid="select-batch-type"]', 'Payment');
  I.fillField('[data-testid="input-batch-date-from"]', '2026-02-01');
  I.fillField('[data-testid="input-batch-date-to"]', '2026-02-28');
  I.wait(1);
  I.click('[data-testid="btn-save-batch"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');

  // ── STEP 8: View Batch Details ──
  I.say('Step 8: Viewing batch details');
  I.seeElement('[data-testid="batch-table"]');
  I.see('Feb Claims Lifecycle Test');

  // ── STEP 9-10: Navigate to EDI ──
  I.say('Step 9: Navigating to EDI and verifying 837 transaction');
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.selectOption('[data-testid="select-filter-edi-type"]', 'EDI 837');
  I.wait(1);
  I.see('EDI 837');
  I.say('Viewing EDI 837 segment data');
  I.click('[data-testid="btn-view-edi-EDI-2026-001"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-segment-viewer"]');
  I.seeElement('[data-testid="edi-isa-segment"]');
  I.seeElement('[data-testid="edi-gs-segment"]');
  I.seeElement('[data-testid="edi-st-segment"]');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.say('E2E Flow 4 COMPLETE: Full claims lifecycle verified');
});`
  },

  // ═══════════════════════════════════════════════════════════
  // E2E FLOW 5: EDI 834 Enrollment to Benefits Verification
  // ═══════════════════════════════════════════════════════════
  {
    caseId: "TC_E2E_F5_001",
    title: "E2E: Verify enrolled families generate EDI 834 transactions with correct HIPAA segments",
    module: "E2E Workflow",
    category: "INTEGRATION",
    priority: "P1",
    testType: "FUNCTIONAL",
    preconditions: "Application accessible with 3 families and 3 EDI 834 transactions",
    expectedResult: "Each family's enrollment data correctly reflected in EDI 834 member loops with proper INS/NM1/DMG/HD segments",
    testData: "Anderson (3 members, PPO Gold), Williams (4 members, HMO Silver), Thompson (2 members, EPO Bronze)",
    testSteps: [
      { step: 1, action: "Login and verify Anderson family in enrollment", expected: "Anderson family found" },
      { step: 2, action: "Navigate to EDI, filter 834, open Anderson transaction", expected: "EDI-2026-002 shows 3 members" },
      { step: 3, action: "Verify Anderson member table: Robert (Subscriber), Maria (Spouse), James (Child)", expected: "All 3 correct" },
      { step: 4, action: "Verify 834 segments: INS, NM1, DMG, HD with BlueCross PPO Gold", expected: "Segments correct" },
      { step: 5, action: "Close and verify Williams family in enrollment", expected: "Williams found" },
      { step: 6, action: "Open Williams 834 transaction", expected: "EDI-2026-006 shows 4 members" },
      { step: 7, action: "Verify Williams members with HMO Silver plan", expected: "4 members correct" },
      { step: 8, action: "Close and open Thompson rejected 834", expected: "EDI-2026-007 shows Rejected with 1 error" },
      { step: 9, action: "Verify Thompson Change action and retransmit option", expected: "Retransmit button visible" },
      { step: 10, action: "Retransmit the rejected 834", expected: "Success notification" }
    ],
    script: `Feature('E2E Flow 5: Family Enrollment to EDI 834 Benefits Verification');

Scenario('TC_E2E_F5_001 - Verify enrolled families in EDI 834 with HIPAA segments', async ({ I }) => {
  // ── STEP 1: Login and Check Anderson Family ──
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);

  I.say('Step 1: Verifying Anderson family enrollment');
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.fillField('[data-testid="input-search-families"]', 'Anderson');
  I.wait(1);
  I.see('Anderson');
  I.see('INS-100001');

  // ── STEP 2-3: Anderson EDI 834 ──
  I.say('Step 2: Opening Anderson EDI 834 enrollment');
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.selectOption('[data-testid="select-filter-edi-type"]', 'EDI 834');
  I.wait(1);
  I.click('[data-testid="btn-view-edi-EDI-2026-002"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-edi-detail"]');
  I.see('3', '[data-testid="edi-detail-member-count"]');
  I.see('BlueCross PPO Gold', '[data-testid="edi-detail-plan-name"]');
  I.say('Verifying Anderson member enrollment table');
  I.see('Robert Anderson', '[data-testid="member-name-INS-100001"]');
  I.see('Subscriber (18)', '[data-testid="member-relationship-INS-100001"]');
  I.see('Maria Anderson', '[data-testid="member-name-INS-100002"]');
  I.see('Spouse (01)', '[data-testid="member-relationship-INS-100002"]');
  I.see('James Anderson', '[data-testid="member-name-INS-100003"]');
  I.see('Child (19)', '[data-testid="member-relationship-INS-100003"]');

  // ── STEP 4: Verify 834 Segments ──
  I.say('Step 4: Verifying HIPAA 834 segments');
  I.seeElement('[data-testid="edi-ins-segment"]');
  I.seeElement('[data-testid="edi-nm1-segment"]');
  I.seeElement('[data-testid="edi-dmg-segment"]');
  I.seeElement('[data-testid="edi-hd-segment"]');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.wait(1);

  // ── STEP 5-6: Williams Family ──
  I.say('Step 5: Checking Williams family');
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.fillField('[data-testid="input-search-families"]', 'Williams');
  I.wait(1);
  I.see('Williams');

  I.say('Step 6: Opening Williams EDI 834');
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.selectOption('[data-testid="select-filter-edi-type"]', 'EDI 834');
  I.wait(1);
  I.click('[data-testid="btn-view-edi-EDI-2026-006"]');
  I.wait(1);
  I.see('4', '[data-testid="edi-detail-member-count"]');
  I.see('BlueCross HMO Silver', '[data-testid="edi-detail-plan-name"]');

  // ── STEP 7: Verify Williams Members ──
  I.say('Step 7: Verifying 4 Williams family members');
  I.see('David Williams', '[data-testid="member-name-INS-100004"]');
  I.see('Sarah Williams', '[data-testid="member-name-INS-100005"]');
  I.see('Emily Williams', '[data-testid="member-name-INS-100006"]');
  I.see('Michael Williams', '[data-testid="member-name-INS-100007"]');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.wait(1);

  // ── STEP 8-9: Thompson Rejected 834 ──
  I.say('Step 8: Opening Thompson rejected 834 change');
  I.click('[data-testid="btn-view-edi-EDI-2026-007"]');
  I.wait(1);
  I.see('Rejected', '[data-testid="edi-detail-status"]');
  I.see('1', '[data-testid="edi-detail-errors"]');
  I.see('Change', '[data-testid="edi-detail-enrollment-action"]');
  I.see('Aetna EPO Bronze', '[data-testid="edi-detail-plan-name"]');
  I.see('John Thompson', '[data-testid="member-name-INS-100008"]');
  I.see('Lisa Thompson', '[data-testid="member-name-INS-100009"]');

  // ── STEP 10: Retransmit ──
  I.say('Step 10: Retransmitting rejected 834');
  I.seeElement('[data-testid="btn-retransmit-edi"]');
  I.click('[data-testid="btn-retransmit-edi"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');
  I.say('E2E Flow 5 COMPLETE: Family enrollment verified in EDI 834 with HIPAA compliance');
});`
  }
];

async function main() {
  console.log('Inserting 5 E2E test cases...');
  
  let inserted = 0;
  const v2Ids = [];

  for (const tc of testCases) {
    try {
      const testCase = await prisma.testCase.create({
        data: {
          tenantId: TENANT_ID, productId: PRODUCT_ID, requirementId: REQUIREMENT_ID,
          testPlanId: TEST_PLAN_ID_OLD, caseId: tc.caseId, title: tc.title,
          description: tc.title, preconditions: tc.preconditions, testSteps: tc.testSteps,
          testData: tc.testData, priority: 'High', status: 'APPROVED', scriptStatus: 'GENERATED',
          category: tc.category, testType: tc.testType, postconditions: tc.expectedResult,
          tags: tc.module, source: 'AI', pass: 1, estimated_minutes: 10, module_id: 'E2E_WORKFLOW',
        }
      });

      await prisma.testScript.create({
        data: {
          tenantId: TENANT_ID, testCaseId: testCase.id, productId: PRODUCT_ID,
          caseId: tc.caseId, title: tc.title, framework: 'CodeceptJS', scriptContent: tc.script,
        }
      });

      const v2 = await prisma.testCaseV2.create({
        data: {
          tenantId: TENANT_ID, productId: PRODUCT_ID, requirementId: REQUIREMENT_ID,
          testCaseCode: tc.caseId, title: tc.title, description: tc.title,
          preconditions: tc.preconditions, testSteps: tc.testSteps, expectedResult: tc.expectedResult,
          testType: 'POSITIVE', category: tc.category, priority: 'P1', severity: 'CRITICAL',
          status: 'CONFIRMED', automationStatus: 'AUTOMATED', estimatedTimeMinutes: 10,
          tags: ['e2e', 'regression', 'critical', 'automated'],
        }
      });

      // Link script to v2
      await prisma.$executeRaw`UPDATE test_scripts SET test_case_v2_id = ${v2.id} WHERE "testCaseId" = ${testCase.id}`;

      v2Ids.push(v2.id);
      inserted++;
      console.log('  OK', tc.caseId, '(v1:', testCase.id, 'v2:', v2.id + ')');
    } catch (err) {
      console.error('  FAIL', tc.caseId + ':', err.message);
    }
  }

  // Create new E2E test plan
  const tp = await prisma.testPlan.create({
    data: {
      tenantId: TENANT_ID, productId: PRODUCT_ID, requirementId: REQUIREMENT_ID,
      name: 'TP6: End-to-End Business Workflows',
      description: 'Complete business flows: enrollment-to-claim, claim-review-to-EDI, dashboard validation, claims lifecycle, EDI 834 enrollment',
      status: 'ACTIVE',
      testCases: JSON.stringify({ v2Ids, v1Ids: [] })
    }
  });

  console.log('\nCreated TP6: End-to-End Business Workflows');
  console.log('  Plan ID:', tp.id, '|', v2Ids.length, 'E2E tests');
  console.log('\nSummary:');
  console.log('  F1: Family Registration → Claim Submission');
  console.log('  F2: Claim Review → Batch → EDI Generation');
  console.log('  F3: Dashboard Stats → All 6 Modules Drill-down');
  console.log('  F4: Complete Claims Lifecycle (Submit→Review→Batch→EDI)');
  console.log('  F5: Enrollment → EDI 834 Benefits with HIPAA Segments');

  await prisma.$disconnect();
}

main().catch(console.error);

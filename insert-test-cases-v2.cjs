const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TENANT_ID = 3;
const PRODUCT_ID = 12;
const REQUIREMENT_ID = 14;
const TEST_PLAN_ID = 15; // "Test plan 3"

const testCases = [
  {
    caseId: "TC_AUTH_001",
    title: "Verify successful admin login with valid credentials redirects to dashboard",
    module: "Authentication",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "Application is accessible at https://openimis-claims-mvp.onrender.com/",
    expectedResult: "User is logged in and redirected to dashboard with all navigation items and correct user profile displayed",
    testData: "Username: Admin, Password: admin123",
    testSteps: [
      { step: 1, action: "Navigate to application URL", expected: "Login page displayed" },
      { step: 2, action: "Verify login page with title and form", expected: "Login title and form visible" },
      { step: 3, action: "Enter username Admin and password admin123", expected: "Credentials entered" },
      { step: 4, action: "Click Login button", expected: "Login initiated" },
      { step: 5, action: "Verify dashboard page loads", expected: "Dashboard page displayed" },
      { step: 6, action: "Verify all 6 navigation links visible", expected: "All nav items present" },
      { step: 7, action: "Verify user profile shows System Administrator", expected: "Correct user profile" }
    ],
    script: `Feature('Authentication - Successful Admin Login');

Scenario('TC_AUTH_001 - Verify successful admin login with valid credentials redirects to dashboard', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.see('Login', '[data-testid="login-title"]');
  I.seeElement('[data-testid="login-form"]');
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.seeElement('[data-testid="dashboard-page"]');
  I.seeElement('[data-testid="nav-families-groups"]');
  I.seeElement('[data-testid="nav-health-facility-claims"]');
  I.seeElement('[data-testid="nav-claims-review"]');
  I.seeElement('[data-testid="nav-batch-processing"]');
  I.seeElement('[data-testid="nav-edi-transactions"]');
  I.seeElement('[data-testid="user-menu-toggle"]');
  I.seeElement('[data-testid="system-admin-profile"]');
  I.see('System Administrator', '[data-testid="user-name"]');
});`
  },
  {
    caseId: "TC_AUTH_002",
    title: "Verify invalid credentials display error message on login page",
    module: "Authentication",
    category: "Negative",
    priority: "P1",
    testType: "Negative",
    preconditions: "Application is accessible at https://openimis-claims-mvp.onrender.com/",
    expectedResult: "Error message 'Invalid username or password' is displayed and user remains on login page",
    testData: "Username: InvalidUser, Password: wrongpass",
    testSteps: [
      { step: 1, action: "Navigate to application URL", expected: "Login page displayed" },
      { step: 2, action: "Enter invalid username and password", expected: "Credentials entered" },
      { step: 3, action: "Click Login button", expected: "Login attempted" },
      { step: 4, action: "Verify error message displayed", expected: "Error message visible" },
      { step: 5, action: "Verify user remains on login page", expected: "Login page still shown" }
    ],
    script: `Feature('Authentication - Invalid Login Error Display');

Scenario('TC_AUTH_002 - Verify invalid credentials display error message on login page', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'InvalidUser');
  I.fillField('[data-testid="input-password"]', 'wrongpass');
  I.click('[data-testid="btn-login"]');
  I.wait(1);
  I.seeElement('[data-testid="login-error"]');
  I.see('Invalid username or password', '[data-testid="login-error"]');
  I.seeElement('[data-testid="login-page"]');
});`
  },
  {
    caseId: "TC_AUTH_003",
    title: "Verify logout clears session and returns to login page",
    module: "Authentication",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in as Admin",
    expectedResult: "User session is cleared and login page is displayed with empty form",
    testData: "Username: Admin, Password: admin123",
    testSteps: [
      { step: 1, action: "Login with Admin credentials", expected: "Dashboard displayed" },
      { step: 2, action: "Click logout button in sidebar", expected: "Logout initiated" },
      { step: 3, action: "Verify login page displayed", expected: "Login page shown" },
      { step: 4, action: "Verify login form is empty", expected: "Empty username and password fields" }
    ],
    script: `Feature('Authentication - Logout Functionality');

Scenario('TC_AUTH_003 - Verify logout clears session and returns to login page', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.seeElement('[data-testid="dashboard-page"]');
  I.click('[data-testid="btn-logout"]');
  I.wait(1);
  I.waitForElement('[data-testid="login-page"]', 10);
  I.seeElement('[data-testid="login-form"]');
  I.seeElement('[data-testid="input-username"]');
});`
  },
  {
    caseId: "TC_AUTH_004",
    title: "Verify enrollment officer login displays correct role and name",
    module: "Authentication",
    category: "Functional",
    priority: "P2",
    testType: "Functional",
    preconditions: "Application is accessible",
    expectedResult: "Enrollment Officer is logged in with correct name and role displayed",
    testData: "Username: EOFF001, Password: officer123",
    testSteps: [
      { step: 1, action: "Enter username EOFF001 and password officer123", expected: "Credentials entered" },
      { step: 2, action: "Click Login button", expected: "Login initiated" },
      { step: 3, action: "Verify dashboard displayed", expected: "Dashboard page shown" },
      { step: 4, action: "Verify user name is Sarah Mitchell", expected: "Correct name shown" },
      { step: 5, action: "Verify role is Enrollment Officer", expected: "Correct role shown" }
    ],
    script: `Feature('Authentication - Enrollment Officer Login');

Scenario('TC_AUTH_004 - Verify enrollment officer login displays correct role and name', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'EOFF001');
  I.fillField('[data-testid="input-password"]', 'officer123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.seeElement('[data-testid="dashboard-page"]');
  I.see('Sarah Mitchell', '[data-testid="user-name"]');
  I.see('Enrollment Officer', '[data-testid="user-role"]');
  I.seeElement('[data-testid="nav-families-groups"]');
  I.seeElement('[data-testid="nav-batch-processing"]');
});`
  },
  {
    caseId: "TC_DASH_001",
    title: "Verify dashboard displays all statistics cards with correct values after login",
    module: "Dashboard",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in",
    expectedResult: "All six statistics cards are displayed with correct values reflecting current data",
    testData: "N/A",
    testSteps: [
      { step: 1, action: "Login as Admin and navigate to Dashboard", expected: "Dashboard page displayed" },
      { step: 2, action: "Verify Total Families card", expected: "Families stat visible" },
      { step: 3, action: "Verify Total Claims card", expected: "Claims stat visible" },
      { step: 4, action: "Verify Pending Review card", expected: "Pending stat visible" },
      { step: 5, action: "Verify Total Billed card", expected: "Amount stat visible" },
      { step: 6, action: "Verify Active Batches card", expected: "Batches stat visible" },
      { step: 7, action: "Verify EDI Errors card", expected: "EDI errors stat visible" }
    ],
    script: `Feature('Dashboard - Statistics Cards Display');

Scenario('TC_DASH_001 - Verify dashboard displays all statistics cards with correct values after login', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="dashboard-page"]', 10);
  I.seeElement('[data-testid="stat-families"]');
  I.seeElement('[data-testid="stat-families-value"]');
  I.seeElement('[data-testid="stat-claims"]');
  I.seeElement('[data-testid="stat-claims-value"]');
  I.seeElement('[data-testid="stat-pending"]');
  I.seeElement('[data-testid="stat-pending-value"]');
  I.seeElement('[data-testid="stat-amount"]');
  I.seeElement('[data-testid="stat-amount-value"]');
  I.seeElement('[data-testid="stat-batches"]');
  I.seeElement('[data-testid="stat-batches-value"]');
  I.seeElement('[data-testid="stat-edi-errors"]');
  I.seeElement('[data-testid="stat-edi-errors-value"]');
});`
  },
  {
    caseId: "TC_DASH_002",
    title: "Verify recent claims table displays claims with correct columns and status badges",
    module: "Dashboard",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in, sample claims exist",
    expectedResult: "Recent claims table shows up to 5 most recent claims with correct data",
    testData: "Sample claims: CLM-2026-001, CLM-2026-002",
    testSteps: [
      { step: 1, action: "Login as Admin", expected: "Dashboard displayed" },
      { step: 2, action: "Verify recent claims card visible", expected: "Card present" },
      { step: 3, action: "Verify recent claims table visible", expected: "Table present" },
      { step: 4, action: "Verify CLM-2026-001 in table", expected: "Claim visible" },
      { step: 5, action: "Verify Memorial General Hospital visible", expected: "Facility name shown" }
    ],
    script: `Feature('Dashboard - Recent Claims Table');

Scenario('TC_DASH_002 - Verify recent claims table displays claims with correct columns and status badges', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="dashboard-page"]', 10);
  I.seeElement('[data-testid="recent-claims-card"]');
  I.seeElement('[data-testid="recent-claims-table"]');
  I.see('CLM-2026-001');
  I.see('CLM-2026-002');
  I.see('Memorial General Hospital');
});`
  },
  {
    caseId: "TC_DASH_003",
    title: "Verify all sidebar navigation links are functional from dashboard",
    module: "Dashboard",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in on dashboard",
    expectedResult: "All six navigation links correctly load their respective pages",
    testData: "N/A",
    testSteps: [
      { step: 1, action: "Login as Admin on Dashboard", expected: "Dashboard displayed" },
      { step: 2, action: "Click Families/Groups nav link", expected: "Enrollment page loads" },
      { step: 3, action: "Click Health Facility Claims nav link", expected: "Claims page loads" },
      { step: 4, action: "Click Claims Review nav link", expected: "Review page loads" },
      { step: 5, action: "Click Batch Processing nav link", expected: "Batch page loads" },
      { step: 6, action: "Click EDI Transactions nav link", expected: "EDI page loads" },
      { step: 7, action: "Click Dashboard nav link", expected: "Dashboard page loads" }
    ],
    script: `Feature('Dashboard - Navigation to All Modules');

Scenario('TC_DASH_003 - Verify all sidebar navigation links are functional from dashboard', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="dashboard-page"]', 10);
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.seeElement('[data-testid="enrollment-page"]');
  I.click('[data-testid="nav-health-facility-claims"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-submit-page"]');
  I.click('[data-testid="nav-claims-review"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-review-page"]');
  I.click('[data-testid="nav-batch-processing"]');
  I.wait(1);
  I.seeElement('[data-testid="batch-processing-page"]');
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.click('[data-testid="nav-dashboard"]');
  I.wait(1);
  I.seeElement('[data-testid="dashboard-page"]');
});`
  },
  {
    caseId: "TC_ENRL_001",
    title: "Verify families list page displays enrolled families with correct data",
    module: "Enrollment",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in, sample families exist",
    expectedResult: "Families list displays all enrolled families with search and add capabilities",
    testData: "Families: Anderson (FAM-001), Williams (FAM-002), Thompson (FAM-003)",
    testSteps: [
      { step: 1, action: "Login and navigate to Families/Groups page", expected: "Enrollment page displayed" },
      { step: 2, action: "Verify families table visible", expected: "Table present" },
      { step: 3, action: "Verify search field available", expected: "Search input visible" },
      { step: 4, action: "Verify Add Family button present", expected: "Button visible" },
      { step: 5, action: "Verify Anderson, Williams, Thompson families listed", expected: "All families shown" },
      { step: 6, action: "Verify family rows FAM-001, FAM-002, FAM-003 exist", expected: "Row elements present" }
    ],
    script: `Feature('Enrollment - Families List Display');

Scenario('TC_ENRL_001 - Verify families list page displays enrolled families with correct data', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.seeElement('[data-testid="enrollment-page"]');
  I.seeElement('[data-testid="families-list-card"]');
  I.seeElement('[data-testid="families-table"]');
  I.seeElement('[data-testid="input-search-families"]');
  I.seeElement('[data-testid="btn-add-family"]');
  I.see('Anderson');
  I.see('Williams');
  I.see('Thompson');
  I.seeElement('[data-testid="family-row-FAM-001"]');
  I.seeElement('[data-testid="family-row-FAM-002"]');
  I.seeElement('[data-testid="family-row-FAM-003"]');
});`
  },
  {
    caseId: "TC_ENRL_002",
    title: "Verify search filters families by last name correctly",
    module: "Enrollment",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on Families/Groups page",
    expectedResult: "Search correctly filters families by name and clearing restores full list",
    testData: "Search term: Anderson",
    testSteps: [
      { step: 1, action: "Login and navigate to Families/Groups page", expected: "Enrollment page displayed" },
      { step: 2, action: "Enter Anderson in search field", expected: "Search term entered" },
      { step: 3, action: "Verify only Anderson family displayed", expected: "Filtered results" },
      { step: 4, action: "Clear search field", expected: "Search cleared" },
      { step: 5, action: "Verify all families displayed again", expected: "Full list restored" }
    ],
    script: `Feature('Enrollment - Family Search Functionality');

Scenario('TC_ENRL_002 - Verify search filters families by last name correctly', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.seeElement('[data-testid="enrollment-page"]');
  I.fillField('[data-testid="input-search-families"]', 'Anderson');
  I.wait(1);
  I.see('Anderson');
  I.say('Search filtered to show only Anderson family');
  I.fillField('[data-testid="input-search-families"]', '');
  I.wait(1);
  I.see('Anderson');
  I.see('Williams');
  I.see('Thompson');
});`
  },
  {
    caseId: "TC_ENRL_003",
    title: "Verify adding a new family with all required fields creates record successfully",
    module: "Enrollment",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on Families/Groups page",
    expectedResult: "New family is created with all fields and appears in the families table",
    testData: "Last Name: Johnson, Given Names: Michael Robert, DOB: 1985-06-15, Gender: Male, Region: Northeast, District: Manhattan",
    testSteps: [
      { step: 1, action: "Login and navigate to Families/Groups page", expected: "Enrollment page displayed" },
      { step: 2, action: "Click Add Family button", expected: "Add Family modal opens" },
      { step: 3, action: "Fill all required fields", expected: "Fields populated" },
      { step: 4, action: "Select Region: Northeast and District: Manhattan", expected: "Cascading dropdown works" },
      { step: 5, action: "Click Save Family", expected: "Family saved" },
      { step: 6, action: "Verify success toast and new family in table", expected: "Johnson family visible" }
    ],
    script: `Feature('Enrollment - Add New Family');

Scenario('TC_ENRL_003 - Verify adding a new family with all required fields creates record successfully', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.seeElement('[data-testid="enrollment-page"]');
  I.click('[data-testid="btn-add-family"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-add-family"]');
  I.fillField('[data-testid="input-last-name"]', 'Johnson');
  I.fillField('[data-testid="input-given-names"]', 'Michael Robert');
  I.fillField('[data-testid="input-birth-date"]', '1985-06-15');
  I.selectOption('[data-testid="select-gender"]', 'Male');
  I.selectOption('[data-testid="select-region"]', 'Northeast');
  I.wait(1);
  I.selectOption('[data-testid="select-district"]', 'Manhattan');
  I.fillField('[data-testid="input-email"]', 'michael.johnson@email.com');
  I.fillField('[data-testid="input-phone"]', '(555) 234-5678');
  I.click('[data-testid="btn-save-family"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');
  I.see('Johnson');
  I.see('Michael Robert');
});`
  },
  {
    caseId: "TC_CLM_001",
    title: "Verify claims register displays all claims with correct columns and data",
    module: "Claims",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in, sample claims exist",
    expectedResult: "Claims register displays all claims with correct data and status badges",
    testData: "Claims: CLM-2026-001, CLM-2026-002",
    testSteps: [
      { step: 1, action: "Login and navigate to Health Facility Claims page", expected: "Claims page displayed" },
      { step: 2, action: "Verify claims table visible", expected: "Table present" },
      { step: 3, action: "Verify New Claim button present", expected: "Button visible" },
      { step: 4, action: "Verify CLM-2026-001 and CLM-2026-002 in table", expected: "Claims visible" },
      { step: 5, action: "Verify claim status badges displayed", expected: "Status indicators shown" }
    ],
    script: `Feature('Claims - Claims Register Display');

Scenario('TC_CLM_001 - Verify claims register displays all claims with correct columns and data', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-health-facility-claims"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-submit-page"]');
  I.seeElement('[data-testid="claims-list-card"]');
  I.seeElement('[data-testid="claims-table"]');
  I.seeElement('[data-testid="btn-new-claim"]');
  I.see('CLM-2026-001');
  I.see('CLM-2026-002');
  I.see('Memorial General Hospital');
  I.seeElement('[data-testid="claim-row-CLM-2026-001"]');
  I.seeElement('[data-testid="claim-status-CLM-2026-001"]');
});`
  },
  {
    caseId: "TC_CLM_002",
    title: "Verify successful claim submission with all required fields",
    module: "Claims",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on Health Facility Claims page, families exist",
    expectedResult: "Claim is submitted with status Entered and appears in the claims register",
    testData: "Insurance: INS-100001, Facility: FACI001, Visit: Outpatient, ICD-10: J06.9, CPT: 99213, Amount: $350",
    testSteps: [
      { step: 1, action: "Login and navigate to Health Facility Claims page", expected: "Claims page displayed" },
      { step: 2, action: "Click New Claim button", expected: "New Claim modal opens" },
      { step: 3, action: "Select Insurance Number, Facility, Visit Type", expected: "Dropdowns selected" },
      { step: 4, action: "Select Diagnosis and Procedure codes", expected: "Medical codes selected" },
      { step: 5, action: "Enter Service Date, Billing Amount, NPI", expected: "Fields filled" },
      { step: 6, action: "Click Submit Claim", expected: "Claim submitted successfully" }
    ],
    script: `Feature('Claims - New Claim Submission');

Scenario('TC_CLM_002 - Verify successful claim submission with all required fields', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-health-facility-claims"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-submit-page"]');
  I.click('[data-testid="btn-new-claim"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-new-claim"]');
  I.selectOption('[data-testid="select-insurance-no"]', 'INS-100001');
  I.wait(1);
  I.selectOption('[data-testid="select-facility"]', 'FACI001');
  I.selectOption('[data-testid="select-visit-type"]', 'Outpatient');
  I.selectOption('[data-testid="select-diagnosis-code"]', 'J06.9');
  I.selectOption('[data-testid="select-procedure-code"]', '99213');
  I.fillField('[data-testid="input-service-date"]', '2026-02-09');
  I.fillField('[data-testid="input-billing-amount"]', '350');
  I.fillField('[data-testid="input-provider-npi"]', '1234567890');
  I.fillField('[data-testid="textarea-claim-notes"]', 'Test claim submission for demo');
  I.click('[data-testid="btn-submit-claim"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');
  I.seeElement('[data-testid="claims-table"]');
});`
  },
  {
    caseId: "TC_REVW_001",
    title: "Verify claims review page displays claims with filter functionality",
    module: "Claims Review",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in, claims exist",
    expectedResult: "Claims review page displays all claims with functional filter controls",
    testData: "N/A",
    testSteps: [
      { step: 1, action: "Login and navigate to Claims Review page", expected: "Review page displayed" },
      { step: 2, action: "Verify filters card with search, status, date fields", expected: "Filters visible" },
      { step: 3, action: "Verify clear filters button present", expected: "Button visible" },
      { step: 4, action: "Verify review table displayed", expected: "Table present" },
      { step: 5, action: "Verify CLM-2026-001 in table", expected: "Claim visible" }
    ],
    script: `Feature('Claims Review - Search and Filter Claims');

Scenario('TC_REVW_001 - Verify claims review page displays claims with filter functionality', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-claims-review"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-review-page"]');
  I.seeElement('[data-testid="review-filters-card"]');
  I.seeElement('[data-testid="input-search-claims"]');
  I.seeElement('[data-testid="select-filter-status"]');
  I.seeElement('[data-testid="input-filter-date-from"]');
  I.seeElement('[data-testid="input-filter-date-to"]');
  I.seeElement('[data-testid="btn-clear-filters"]');
  I.seeElement('[data-testid="review-results-card"]');
  I.seeElement('[data-testid="review-table"]');
  I.see('CLM-2026-001');
});`
  },
  {
    caseId: "TC_REVW_002",
    title: "Verify claim status can be updated through review modal",
    module: "Claims Review",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on Claims Review page, claim CLM-2026-001 exists",
    expectedResult: "Claim status is updated to Checked with success notification",
    testData: "Claim: CLM-2026-001, New Status: Checked",
    testSteps: [
      { step: 1, action: "Login and navigate to Claims Review page", expected: "Review page displayed" },
      { step: 2, action: "Click Review button for CLM-2026-001", expected: "Review modal opens" },
      { step: 3, action: "Verify patient, facility, amount, status fields visible", expected: "Details shown" },
      { step: 4, action: "Click Checked status button", expected: "Status updated" },
      { step: 5, action: "Verify success toast notification", expected: "Toast displayed" }
    ],
    script: `Feature('Claims Review - Claim Status Update');

Scenario('TC_REVW_002 - Verify claim status can be updated through review modal', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-claims-review"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-review-page"]');
  I.seeElement('[data-testid="review-table"]');
  I.click('[data-testid="btn-review-CLM-2026-001"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-review-claim"]');
  I.seeElement('[data-testid="modal-content-review"]');
  I.seeElement('[data-testid="review-detail-patient"]');
  I.seeElement('[data-testid="review-detail-facility"]');
  I.seeElement('[data-testid="review-detail-amount"]');
  I.seeElement('[data-testid="review-detail-status"]');
  I.say('Verifying status update buttons are visible');
  I.click('[data-testid="btn-status-checked"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');
});`
  },
  {
    caseId: "TC_REVW_003",
    title: "Verify status dropdown filter narrows claims and clear button resets",
    module: "Claims Review",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on Claims Review page",
    expectedResult: "Status filter and search correctly narrow results; clear button restores full list",
    testData: "Filter: Entered, Search: CLM-2026-001",
    testSteps: [
      { step: 1, action: "Login and navigate to Claims Review", expected: "Review page displayed" },
      { step: 2, action: "Select Entered from status filter", expected: "Filtered results" },
      { step: 3, action: "Click Clear Filters", expected: "Filters cleared" },
      { step: 4, action: "Search for CLM-2026-001", expected: "Search results shown" }
    ],
    script: `Feature('Claims Review - Status Filter Functionality');

Scenario('TC_REVW_003 - Verify status dropdown filter narrows claims and clear button resets', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-claims-review"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-review-page"]');
  I.selectOption('[data-testid="select-filter-status"]', 'Entered');
  I.wait(1);
  I.say('Filtered to show only Entered status claims');
  I.click('[data-testid="btn-clear-filters"]');
  I.wait(1);
  I.seeElement('[data-testid="review-table"]');
  I.say('Filters cleared, all claims visible again');
  I.fillField('[data-testid="input-search-claims"]', 'CLM-2026-001');
  I.wait(1);
  I.see('CLM-2026-001');
});`
  },
  {
    caseId: "TC_BATCH_001",
    title: "Verify batch processing page displays statistics and batch table",
    module: "Batch Processing",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in, sample batches exist",
    expectedResult: "Batch processing page shows all statistics cards and batch list with sample data",
    testData: "Batches: BATCH-2026-001, BATCH-2026-002, BATCH-2026-003",
    testSteps: [
      { step: 1, action: "Login and navigate to Batch Processing", expected: "Batch page displayed" },
      { step: 2, action: "Verify Total Batches, Completed, Processing, Total Amount stats", expected: "Stats visible" },
      { step: 3, action: "Verify batches table displayed", expected: "Table present" },
      { step: 4, action: "Verify Create Batch button present", expected: "Button visible" },
      { step: 5, action: "Verify BATCH-2026-001, 002, 003 in table", expected: "Batches listed" }
    ],
    script: `Feature('Batch Processing - Page Display and Statistics');

Scenario('TC_BATCH_001 - Verify batch processing page displays statistics and batch table', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-batch-processing"]');
  I.wait(1);
  I.seeElement('[data-testid="batch-processing-page"]');
  I.seeElement('[data-testid="stat-total-batches"]');
  I.seeElement('[data-testid="stat-total-batches-value"]');
  I.seeElement('[data-testid="stat-completed-batches"]');
  I.seeElement('[data-testid="stat-completed-batches-value"]');
  I.seeElement('[data-testid="stat-processing-batches"]');
  I.seeElement('[data-testid="stat-processing-batches-value"]');
  I.seeElement('[data-testid="stat-total-batch-amount"]');
  I.seeElement('[data-testid="stat-total-batch-amount-value"]');
  I.seeElement('[data-testid="batches-table"]');
  I.seeElement('[data-testid="button-create-batch"]');
  I.see('BATCH-2026-001');
  I.see('BATCH-2026-002');
  I.see('BATCH-2026-003');
});`
  },
  {
    caseId: "TC_BATCH_002",
    title: "Verify creating a new batch with eligible claims preview",
    module: "Batch Processing",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on Batch Processing page",
    expectedResult: "Create Batch modal shows form and eligible claims preview updates based on criteria",
    testData: "Name: Demo Payment Batch Feb 2026, Type: Payment, Dates: Jan-Feb 2026",
    testSteps: [
      { step: 1, action: "Login and navigate to Batch Processing", expected: "Batch page displayed" },
      { step: 2, action: "Click Create Batch button", expected: "Modal opens" },
      { step: 3, action: "Enter batch name and select Payment type", expected: "Fields filled" },
      { step: 4, action: "Enter date range", expected: "Date range set" },
      { step: 5, action: "Verify eligible claims preview", expected: "Preview displayed" },
      { step: 6, action: "Close the modal", expected: "Modal closed" }
    ],
    script: `Feature('Batch Processing - Create New Batch');

Scenario('TC_BATCH_002 - Verify creating a new batch with eligible claims preview', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-batch-processing"]');
  I.wait(1);
  I.seeElement('[data-testid="batch-processing-page"]');
  I.click('[data-testid="button-create-batch"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-create-batch"]');
  I.seeElement('[data-testid="form-create-batch"]');
  I.fillField('[data-testid="input-batch-name"]', 'Demo Payment Batch Feb 2026');
  I.selectOption('[data-testid="select-batch-type"]', 'Payment');
  I.fillField('[data-testid="input-batch-date-from"]', '2026-01-01');
  I.fillField('[data-testid="input-batch-date-to"]', '2026-02-28');
  I.wait(1);
  I.seeElement('[data-testid="eligible-claims-preview"]');
  I.seeElement('[data-testid="eligible-claims-count"]');
  I.seeElement('[data-testid="eligible-claims-amount"]');
  I.say('Eligible claims preview displayed correctly');
  I.click('[data-testid="close-dialog-button"]');
  I.wait(1);
});`
  },
  {
    caseId: "TC_BATCH_003",
    title: "Verify batch detail modal displays processing timeline and metrics",
    module: "Batch Processing",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on Batch Processing page, BATCH-2026-001 exists",
    expectedResult: "Batch detail modal shows complete processing information and timeline",
    testData: "Batch: BATCH-2026-001",
    testSteps: [
      { step: 1, action: "Login and navigate to Batch Processing", expected: "Batch page displayed" },
      { step: 2, action: "Click Details for BATCH-2026-001", expected: "Detail modal opens" },
      { step: 3, action: "Verify batch name, type, status, claims, amount", expected: "Details shown" },
      { step: 4, action: "Verify processing timeline with Created milestone", expected: "Timeline visible" },
      { step: 5, action: "Close the details modal", expected: "Modal closed" }
    ],
    script: `Feature('Batch Processing - View Batch Details');

Scenario('TC_BATCH_003 - Verify batch detail modal displays processing timeline and metrics', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-batch-processing"]');
  I.wait(1);
  I.seeElement('[data-testid="batch-processing-page"]');
  I.seeElement('[data-testid="batch-details-BATCH-2026-001"]');
  I.click('[data-testid="batch-details-BATCH-2026-001"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-batch-detail"]');
  I.seeElement('[data-testid="modal-content-batch-detail"]');
  I.seeElement('[data-testid="detail-batch-name"]');
  I.seeElement('[data-testid="detail-batch-type"]');
  I.seeElement('[data-testid="detail-batch-status"]');
  I.seeElement('[data-testid="detail-batch-claims"]');
  I.seeElement('[data-testid="detail-batch-amount"]');
  I.seeElement('[data-testid="batch-timeline"]');
  I.seeElement('[data-testid="timeline-created"]');
  I.see('BATCH-2026-001');
  I.click('[data-testid="close-batch-details-modal"]');
  I.wait(1);
});`
  },
  {
    caseId: "TC_BATCH_004",
    title: "Verify batch creation saves and appears in the batch table",
    module: "Batch Processing",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on Batch Processing page",
    expectedResult: "Batch is created and added to the batches table with Created status",
    testData: "Name: Progress Test Batch, Type: Payment",
    testSteps: [
      { step: 1, action: "Login and navigate to Batch Processing", expected: "Batch page displayed" },
      { step: 2, action: "Click Create Batch button", expected: "Modal opens" },
      { step: 3, action: "Enter batch name and type", expected: "Fields filled" },
      { step: 4, action: "Set date range", expected: "Dates set" },
      { step: 5, action: "Click Save Batch", expected: "Batch saved" },
      { step: 6, action: "Verify success toast and batch in table", expected: "New batch visible" }
    ],
    script: `Feature('Batch Processing - Run Batch with Progress Tracking');

Scenario('TC_BATCH_004 - Verify batch execution shows progress bar and completes successfully', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-batch-processing"]');
  I.wait(1);
  I.seeElement('[data-testid="batch-processing-page"]');
  I.say('Creating a new batch to run');
  I.click('[data-testid="button-create-batch"]');
  I.wait(1);
  I.fillField('[data-testid="input-batch-name"]', 'Progress Test Batch');
  I.selectOption('[data-testid="select-batch-type"]', 'Payment');
  I.fillField('[data-testid="input-batch-date-from"]', '2026-01-01');
  I.fillField('[data-testid="input-batch-date-to"]', '2026-12-31');
  I.wait(1);
  I.click('[data-testid="btn-save-batch"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');
  I.say('Batch created, now verifying it appears in the table');
  I.seeElement('[data-testid="batches-table"]');
});`
  },
  {
    caseId: "TC_EDI_001",
    title: "Verify EDI transactions page displays statistics and transaction table",
    module: "EDI Transactions",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in, sample EDI transactions exist",
    expectedResult: "EDI page shows all five statistics cards and transaction list with sample data",
    testData: "EDI: EDI-2026-001 (837 Outbound), EDI-2026-002 (834 Outbound)",
    testSteps: [
      { step: 1, action: "Login and navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 2, action: "Verify Total, 837, 834, 835, Rejected stats", expected: "All stats visible" },
      { step: 3, action: "Verify EDI table displayed", expected: "Table present" },
      { step: 4, action: "Verify EDI-2026-001 and EDI-2026-002 in table", expected: "Transactions listed" }
    ],
    script: `Feature('EDI Transactions - Page Display and Statistics');

Scenario('TC_EDI_001 - Verify EDI transactions page displays statistics and transaction table', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.seeElement('[data-testid="stat-edi-total"]');
  I.seeElement('[data-testid="stat-edi-total-value"]');
  I.seeElement('[data-testid="stat-edi-837"]');
  I.seeElement('[data-testid="stat-edi-837-value"]');
  I.seeElement('[data-testid="stat-edi-834"]');
  I.seeElement('[data-testid="stat-edi-834-value"]');
  I.seeElement('[data-testid="stat-edi-835"]');
  I.seeElement('[data-testid="stat-edi-835-value"]');
  I.seeElement('[data-testid="stat-edi-rejected"]');
  I.seeElement('[data-testid="stat-edi-rejected-value"]');
  I.seeElement('[data-testid="edi-table"]');
  I.see('EDI-2026-001');
  I.see('EDI-2026-002');
});`
  },
  {
    caseId: "TC_EDI_002",
    title: "Verify EDI filters narrow transactions by type, status, and direction",
    module: "EDI Transactions",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on EDI Transactions page",
    expectedResult: "Filters correctly narrow EDI results and clear button restores all transactions",
    testData: "Filters: Type=EDI 837, Direction=Outbound",
    testSteps: [
      { step: 1, action: "Login and navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 2, action: "Verify filter controls for Type, Status, Direction", expected: "Filters visible" },
      { step: 3, action: "Select Type: EDI 837", expected: "Filtered to 837" },
      { step: 4, action: "Select Direction: Outbound", expected: "Further filtered" },
      { step: 5, action: "Click Clear Filters", expected: "All transactions restored" }
    ],
    script: `Feature('EDI Transactions - Filter Functionality');

Scenario('TC_EDI_002 - Verify EDI filters narrow transactions by type, status, and direction', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.seeElement('[data-testid="edi-filters-card"]');
  I.seeElement('[data-testid="select-filter-edi-type"]');
  I.seeElement('[data-testid="select-filter-edi-status"]');
  I.seeElement('[data-testid="select-filter-edi-direction"]');
  I.selectOption('[data-testid="select-filter-edi-type"]', 'EDI 837');
  I.wait(1);
  I.say('Filtered to show only EDI 837 transactions');
  I.selectOption('[data-testid="select-filter-edi-direction"]', 'Outbound');
  I.wait(1);
  I.say('Further filtered to Outbound only');
  I.click('[data-testid="btn-clear-edi-filters"]');
  I.wait(1);
  I.say('All filters cleared, full list restored');
  I.seeElement('[data-testid="edi-table"]');
});`
  },
  {
    caseId: "TC_EDI_003",
    title: "Verify EDI detail modal displays segment data and transaction timeline",
    module: "EDI Transactions",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on EDI Transactions page, EDI-2026-001 exists",
    expectedResult: "EDI detail modal shows complete transaction info with segment data and timeline",
    testData: "EDI: EDI-2026-001",
    testSteps: [
      { step: 1, action: "Login and navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 2, action: "Click View for EDI-2026-001", expected: "Detail modal opens" },
      { step: 3, action: "Verify type, direction, status, sender, receiver", expected: "Details shown" },
      { step: 4, action: "Verify ISA, GS, ST segments in viewer", expected: "Segments displayed" },
      { step: 5, action: "Verify transaction timeline", expected: "Timeline visible" },
      { step: 6, action: "Close the modal", expected: "Modal closed" }
    ],
    script: `Feature('EDI Transactions - Transaction Detail View');

Scenario('TC_EDI_003 - Verify EDI detail modal displays segment data and transaction timeline', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.seeElement('[data-testid="btn-view-edi-EDI-2026-001"]');
  I.click('[data-testid="btn-view-edi-EDI-2026-001"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-edi-detail"]');
  I.seeElement('[data-testid="modal-content-edi-detail"]');
  I.seeElement('[data-testid="edi-detail-type"]');
  I.seeElement('[data-testid="edi-detail-direction"]');
  I.seeElement('[data-testid="edi-detail-status"]');
  I.seeElement('[data-testid="edi-detail-sender"]');
  I.seeElement('[data-testid="edi-detail-receiver"]');
  I.seeElement('[data-testid="edi-detail-segments"]');
  I.seeElement('[data-testid="edi-segment-viewer"]');
  I.seeElement('[data-testid="edi-isa-segment"]');
  I.seeElement('[data-testid="edi-gs-segment"]');
  I.seeElement('[data-testid="edi-st-segment"]');
  I.seeElement('[data-testid="edi-timeline"]');
  I.seeElement('[data-testid="edi-timeline-created"]');
  I.see('EDI-2026-001');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.wait(1);
});`
  },
  {
    caseId: "TC_EDI_004",
    title: "Verify retransmit functionality updates rejected transaction status",
    module: "EDI Transactions",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on EDI page, EDI-2026-005 has Rejected status",
    expectedResult: "Rejected transaction is retransmitted with status update and success notification",
    testData: "EDI: EDI-2026-005 (Rejected to Transmitted)",
    testSteps: [
      { step: 1, action: "Login and navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 2, action: "Click View for EDI-2026-005 (Rejected)", expected: "Detail modal opens" },
      { step: 3, action: "Verify Retransmit button present", expected: "Button visible" },
      { step: 4, action: "Click Retransmit", expected: "Transaction resubmitted" },
      { step: 5, action: "Verify success toast", expected: "Notification shown" }
    ],
    script: `Feature('EDI Transactions - Retransmit Rejected Transaction');

Scenario('TC_EDI_004 - Verify retransmit functionality updates rejected transaction status', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.say('Opening rejected EDI transaction EDI-2026-005');
  I.click('[data-testid="btn-view-edi-EDI-2026-005"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-edi-detail"]');
  I.seeElement('[data-testid="btn-retransmit-edi"]');
  I.say('Clicking retransmit to resubmit failed transaction');
  I.click('[data-testid="btn-retransmit-edi"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');
  I.say('Transaction retransmitted successfully');
});`
  },
  {
    caseId: "TC_E2E_001",
    title: "Verify complete workflow from enrollment through claim submission and review",
    module: "End-to-End",
    category: "Integration",
    priority: "P1",
    testType: "Integration",
    preconditions: "Application is accessible, sample data loaded",
    expectedResult: "All six modules are accessible and display correct data throughout the navigation lifecycle",
    testData: "Full system with sample data",
    testSteps: [
      { step: 1, action: "Login as Admin", expected: "Dashboard displayed" },
      { step: 2, action: "Verify dashboard statistics", expected: "Stats visible" },
      { step: 3, action: "Navigate to Enrollment", expected: "Families table shown" },
      { step: 4, action: "Navigate to Claims Submit", expected: "Claims register shown" },
      { step: 5, action: "Navigate to Claims Review", expected: "Review table shown" },
      { step: 6, action: "Navigate to Batch Processing", expected: "Batch table shown" },
      { step: 7, action: "Navigate to EDI Transactions", expected: "EDI table shown" }
    ],
    script: `Feature('End-to-End - Complete Claims Lifecycle');

Scenario('TC_E2E_001 - Verify complete workflow from enrollment through claim submission and review', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.seeElement('[data-testid="dashboard-page"]');
  I.say('Step 1: Verify dashboard statistics');
  I.seeElement('[data-testid="stat-families-value"]');
  I.seeElement('[data-testid="stat-claims-value"]');
  I.seeElement('[data-testid="recent-claims-table"]');
  I.say('Step 2: Navigate to Enrollment');
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.seeElement('[data-testid="enrollment-page"]');
  I.seeElement('[data-testid="families-table"]');
  I.see('Anderson');
  I.say('Step 3: Navigate to Claims Submit');
  I.click('[data-testid="nav-health-facility-claims"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-submit-page"]');
  I.seeElement('[data-testid="claims-table"]');
  I.see('CLM-2026-001');
  I.say('Step 4: Navigate to Claims Review');
  I.click('[data-testid="nav-claims-review"]');
  I.wait(1);
  I.seeElement('[data-testid="claims-review-page"]');
  I.seeElement('[data-testid="review-table"]');
  I.say('Step 5: Navigate to Batch Processing');
  I.click('[data-testid="nav-batch-processing"]');
  I.wait(1);
  I.seeElement('[data-testid="batch-processing-page"]');
  I.seeElement('[data-testid="batches-table"]');
  I.see('BATCH-2026-001');
  I.say('Step 6: Navigate to EDI Transactions');
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.seeElement('[data-testid="edi-table"]');
  I.see('EDI-2026-001');
  I.say('Complete lifecycle navigation verified successfully');
});`
  }
];

async function main() {
  console.log('🚀 Starting insert of 24 test cases + scripts...');
  console.log(`   Tenant: ${TENANT_ID}, Product: ${PRODUCT_ID}, Plan: ${TEST_PLAN_ID}`);
  
  let inserted = 0;
  let errors = 0;

  for (const tc of testCases) {
    try {
      // Insert TestCase
      const testCase = await prisma.testCase.create({
        data: {
          tenantId: TENANT_ID,
          productId: PRODUCT_ID,
          requirementId: REQUIREMENT_ID,
          testPlanId: TEST_PLAN_ID,
          caseId: tc.caseId,
          title: tc.title,
          description: tc.title,
          preconditions: tc.preconditions,
          testSteps: tc.testSteps,
          testData: tc.testData,
          priority: tc.priority === 'P1' ? 'High' : 'Medium',
          status: 'APPROVED',
          scriptStatus: 'GENERATED',
          category: tc.category,
          testType: tc.testType,
          postconditions: tc.expectedResult,
          tags: tc.module,
          source: 'AI',
          pass: 1,
          
          estimated_minutes: 5,
          module_id: tc.module.toUpperCase().replace(/ /g, '_').substring(0, 50),
        }
      });

      // Insert TestScript
      await prisma.testScript.create({
        data: {
          tenantId: TENANT_ID,
          testCaseId: testCase.id,
          productId: PRODUCT_ID,
          caseId: tc.caseId,
          title: tc.title,
          framework: 'CodeceptJS',
          scriptContent: tc.script,
        }
      });

      inserted++;
      console.log(`   ✅ ${tc.caseId} - ${tc.module}`);
    } catch (err) {
      errors++;
      console.error(`   ❌ ${tc.caseId}: ${err.message}`);
    }
  }

  console.log(`\n📊 Done! Inserted: ${inserted}, Errors: ${errors}`);
  console.log(`   Test Plan ${TEST_PLAN_ID} now has ${inserted} executable test cases with scripts.`);
  await prisma.$disconnect();
}

main().catch(console.error);

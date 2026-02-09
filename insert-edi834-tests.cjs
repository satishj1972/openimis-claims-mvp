const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TENANT_ID = 3;
const PRODUCT_ID = 12;
const REQUIREMENT_ID = 14;
const TEST_PLAN_ID = 15;

const testCases = [
  {
    caseId: "TC_EDI834_001",
    title: "Verify EDI 834 enrollment transactions display with member count and plan details",
    module: "EDI 834 Enrollment",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is logged in, EDI 834 transactions exist for Anderson, Williams, Thompson families",
    expectedResult: "EDI page shows 3 EDI 834 transactions with correct enrollment action, member count, and plan names",
    testData: "EDI-2026-002 (Anderson/3 members), EDI-2026-006 (Williams/4 members), EDI-2026-007 (Thompson/2 members)",
    testSteps: [
      { step: 1, action: "Login and navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 2, action: "Verify EDI 834 stat card shows count of 3", expected: "834 stat = 3" },
      { step: 3, action: "Filter by Type: EDI 834", expected: "Only 834 transactions shown" },
      { step: 4, action: "Verify EDI-2026-002 (Anderson enrollment) visible", expected: "Transaction listed" },
      { step: 5, action: "Verify EDI-2026-006 (Williams enrollment) visible", expected: "Transaction listed" },
      { step: 6, action: "Verify EDI-2026-007 (Thompson change) visible", expected: "Transaction listed" },
      { step: 7, action: "Clear filters and verify all transactions restored", expected: "Full list shown" }
    ],
    script: `Feature('EDI 834 - Enrollment Transactions Display');

Scenario('TC_EDI834_001 - Verify EDI 834 enrollment transactions display with member count and plan details', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.seeElement('[data-testid="stat-edi-834"]');
  I.see('3', '[data-testid="stat-edi-834-value"]');
  I.say('Filtering to EDI 834 transactions only');
  I.selectOption('[data-testid="select-filter-edi-type"]', 'EDI 834');
  I.wait(1);
  I.see('EDI-2026-002');
  I.see('EDI-2026-006');
  I.see('EDI-2026-007');
  I.click('[data-testid="btn-clear-edi-filters"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-table"]');
});`
  },
  {
    caseId: "TC_EDI834_002",
    title: "Verify Anderson family 834 enrollment detail shows 3 members with correct data",
    module: "EDI 834 Enrollment",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on EDI Transactions page, EDI-2026-002 exists",
    expectedResult: "834 detail modal shows Anderson family with Robert (Subscriber), Maria (Spouse), James (Child) with correct plan and sponsor",
    testData: "EDI-2026-002: Anderson family, BlueCross PPO Gold, 3 members",
    testSteps: [
      { step: 1, action: "Login and navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 2, action: "Click View for EDI-2026-002", expected: "Detail modal opens" },
      { step: 3, action: "Verify enrollment action is Add", expected: "Add action shown" },
      { step: 4, action: "Verify member count is 3", expected: "3 members shown" },
      { step: 5, action: "Verify plan name BlueCross PPO Gold", expected: "Plan name displayed" },
      { step: 6, action: "Verify sponsor name", expected: "Sponsor shown" },
      { step: 7, action: "Verify member enrollment table with Robert, Maria, James Anderson", expected: "All 3 members listed" },
      { step: 8, action: "Verify Robert Anderson is Subscriber with INS-100001", expected: "Subscriber data correct" },
      { step: 9, action: "Verify Maria Anderson is Spouse with INS-100002", expected: "Spouse data correct" },
      { step: 10, action: "Verify James Anderson is Child with INS-100003", expected: "Child data correct" },
      { step: 11, action: "Close modal", expected: "Modal closed" }
    ],
    script: `Feature('EDI 834 - Anderson Family Enrollment Details');

Scenario('TC_EDI834_002 - Verify Anderson family 834 enrollment detail shows 3 members with correct data', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.click('[data-testid="btn-view-edi-EDI-2026-002"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-edi-detail"]');
  I.see('EDI-2026-002');
  I.see('Add', '[data-testid="edi-detail-enrollment-action"]');
  I.see('3', '[data-testid="edi-detail-member-count"]');
  I.see('BlueCross PPO Gold', '[data-testid="edi-detail-plan-name"]');
  I.see('Northeast Regional Health Authority', '[data-testid="edi-detail-sponsor"]');
  I.say('Verifying member enrollment table');
  I.seeElement('[data-testid="edi-834-member-header"]');
  I.seeElement('[data-testid="edi-834-member-table"]');
  I.seeElement('[data-testid="edi-834-member-row-INS-100001"]');
  I.see('Robert Anderson', '[data-testid="member-name-INS-100001"]');
  I.see('Subscriber (18)', '[data-testid="member-relationship-INS-100001"]');
  I.seeElement('[data-testid="edi-834-member-row-INS-100002"]');
  I.see('Maria Anderson', '[data-testid="member-name-INS-100002"]');
  I.see('Spouse (01)', '[data-testid="member-relationship-INS-100002"]');
  I.seeElement('[data-testid="edi-834-member-row-INS-100003"]');
  I.see('James Anderson', '[data-testid="member-name-INS-100003"]');
  I.see('Child (19)', '[data-testid="member-relationship-INS-100003"]');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.wait(1);
});`
  },
  {
    caseId: "TC_EDI834_003",
    title: "Verify 834 segment viewer displays INS, REF, NM1, DMG, DTP, HD loops for enrollment",
    module: "EDI 834 Enrollment",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on EDI Transactions page, EDI-2026-002 exists",
    expectedResult: "Segment viewer shows all 834-specific segments: INS, REF, NM1, DMG, DTP, HD with correct HIPAA data",
    testData: "EDI-2026-002: Anderson family first member loop",
    testSteps: [
      { step: 1, action: "Login and navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 2, action: "Click View for EDI-2026-002", expected: "Detail modal opens" },
      { step: 3, action: "Verify ISA envelope segment", expected: "ISA segment shown" },
      { step: 4, action: "Verify GS functional group with BE (Benefit Enrollment)", expected: "GS*BE segment shown" },
      { step: 5, action: "Verify ST transaction set 834", expected: "ST*834 segment shown" },
      { step: 6, action: "Verify INS segment with subscriber indicator", expected: "INS*Y*18 shown" },
      { step: 7, action: "Verify NM1 segment with Anderson name", expected: "NM1*IL*1*ANDERSON shown" },
      { step: 8, action: "Verify DMG demographic segment with DOB", expected: "DMG*D8 shown" },
      { step: 9, action: "Verify HD health coverage segment with plan code", expected: "HD*021**HLT shown" },
      { step: 10, action: "Close modal", expected: "Modal closed" }
    ],
    script: `Feature('EDI 834 - Segment Viewer with Enrollment Loops');

Scenario('TC_EDI834_003 - Verify 834 segment viewer displays INS, REF, NM1, DMG, DTP, HD loops', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.click('[data-testid="btn-view-edi-EDI-2026-002"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-edi-detail"]');
  I.seeElement('[data-testid="edi-segment-viewer"]');
  I.say('Verifying envelope segments');
  I.seeElement('[data-testid="edi-isa-segment"]');
  I.seeElement('[data-testid="edi-gs-segment"]');
  I.seeElement('[data-testid="edi-st-segment"]');
  I.say('Verifying 834 member loop segments');
  I.seeElement('[data-testid="edi-ins-segment"]');
  I.seeElement('[data-testid="edi-ref-segment"]');
  I.seeElement('[data-testid="edi-nm1-segment"]');
  I.seeElement('[data-testid="edi-dmg-segment"]');
  I.seeElement('[data-testid="edi-dtp-segment"]');
  I.seeElement('[data-testid="edi-hd-segment"]');
  I.say('Verifying closing envelope segments');
  I.seeElement('[data-testid="edi-se-segment"]');
  I.seeElement('[data-testid="edi-ge-segment"]');
  I.seeElement('[data-testid="edi-iea-segment"]');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.wait(1);
});`
  },
  {
    caseId: "TC_EDI834_004",
    title: "Verify Williams family 834 enrollment with 4 members and HMO Silver plan",
    module: "EDI 834 Enrollment",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on EDI Transactions page, EDI-2026-006 exists",
    expectedResult: "Williams family enrollment shows 4 members with correct relationships and BlueCross HMO Silver plan",
    testData: "EDI-2026-006: Williams family, 4 members, BlueCross HMO Silver",
    testSteps: [
      { step: 1, action: "Login and navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 2, action: "Click View for EDI-2026-006", expected: "Detail modal opens" },
      { step: 3, action: "Verify member count is 4", expected: "4 members shown" },
      { step: 4, action: "Verify plan name BlueCross HMO Silver", expected: "Plan name correct" },
      { step: 5, action: "Verify David Williams (Subscriber) INS-100004", expected: "Subscriber listed" },
      { step: 6, action: "Verify Sarah Williams (Spouse) INS-100005", expected: "Spouse listed" },
      { step: 7, action: "Verify Emily Williams (Child) INS-100006", expected: "Child 1 listed" },
      { step: 8, action: "Verify Michael Williams (Child) INS-100007", expected: "Child 2 listed" },
      { step: 9, action: "Close modal", expected: "Modal closed" }
    ],
    script: `Feature('EDI 834 - Williams Family 4-Member Enrollment');

Scenario('TC_EDI834_004 - Verify Williams family 834 enrollment with 4 members and HMO Silver plan', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.click('[data-testid="btn-view-edi-EDI-2026-006"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-edi-detail"]');
  I.see('EDI-2026-006');
  I.see('4', '[data-testid="edi-detail-member-count"]');
  I.see('BlueCross HMO Silver', '[data-testid="edi-detail-plan-name"]');
  I.see('Southeast Community Health District', '[data-testid="edi-detail-sponsor"]');
  I.say('Verifying all 4 Williams family members');
  I.seeElement('[data-testid="edi-834-member-row-INS-100004"]');
  I.see('David Williams', '[data-testid="member-name-INS-100004"]');
  I.see('Subscriber (18)', '[data-testid="member-relationship-INS-100004"]');
  I.seeElement('[data-testid="edi-834-member-row-INS-100005"]');
  I.see('Sarah Williams', '[data-testid="member-name-INS-100005"]');
  I.seeElement('[data-testid="edi-834-member-row-INS-100006"]');
  I.see('Emily Williams', '[data-testid="member-name-INS-100006"]');
  I.seeElement('[data-testid="edi-834-member-row-INS-100007"]');
  I.see('Michael Williams', '[data-testid="member-name-INS-100007"]');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.wait(1);
});`
  },
  {
    caseId: "TC_EDI834_005",
    title: "Verify rejected 834 enrollment change for Thompson family with retransmit option",
    module: "EDI 834 Enrollment",
    category: "Functional",
    priority: "P1",
    testType: "Functional",
    preconditions: "User is on EDI Transactions page, EDI-2026-007 has Rejected status",
    expectedResult: "Rejected 834 change transaction shows error details and Retransmit button; retransmit updates status",
    testData: "EDI-2026-007: Thompson family, 2 members, Aetna EPO Bronze, Change action, Rejected",
    testSteps: [
      { step: 1, action: "Login and navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 2, action: "Click View for EDI-2026-007", expected: "Detail modal opens" },
      { step: 3, action: "Verify status is Rejected with 1 error", expected: "Rejected status shown" },
      { step: 4, action: "Verify enrollment action is Change", expected: "Change action shown" },
      { step: 5, action: "Verify Thompson members in table", expected: "John and Lisa Thompson listed" },
      { step: 6, action: "Verify maintenance type is 024 - Change", expected: "Change maintenance shown" },
      { step: 7, action: "Click Retransmit button", expected: "Transaction resubmitted" },
      { step: 8, action: "Verify success notification", expected: "Toast shown" }
    ],
    script: `Feature('EDI 834 - Rejected Enrollment Change Retransmit');

Scenario('TC_EDI834_005 - Verify rejected 834 enrollment change for Thompson family with retransmit', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.click('[data-testid="btn-view-edi-EDI-2026-007"]');
  I.wait(1);
  I.seeElement('[data-testid="modal-edi-detail"]');
  I.see('EDI-2026-007');
  I.see('Rejected', '[data-testid="edi-detail-status"]');
  I.see('1', '[data-testid="edi-detail-errors"]');
  I.see('Change', '[data-testid="edi-detail-enrollment-action"]');
  I.see('Aetna EPO Bronze', '[data-testid="edi-detail-plan-name"]');
  I.say('Verifying Thompson family members');
  I.seeElement('[data-testid="edi-834-member-row-INS-100008"]');
  I.see('John Thompson', '[data-testid="member-name-INS-100008"]');
  I.see('024 - Change', '[data-testid="member-action-INS-100008"]');
  I.seeElement('[data-testid="edi-834-member-row-INS-100009"]');
  I.see('Lisa Thompson', '[data-testid="member-name-INS-100009"]');
  I.say('Retransmitting rejected enrollment');
  I.seeElement('[data-testid="btn-retransmit-edi"]');
  I.click('[data-testid="btn-retransmit-edi"]');
  I.wait(2);
  I.seeElement('[data-testid="toast-notification"]');
});`
  },
  {
    caseId: "TC_EDI834_006",
    title: "Verify end-to-end enrollment to EDI 834 workflow across all three families",
    module: "EDI 834 Enrollment",
    category: "Integration",
    priority: "P1",
    testType: "Integration",
    preconditions: "Application accessible with sample data",
    expectedResult: "Complete flow: view enrolled families, navigate to EDI, filter 834s, verify each family's enrollment transaction",
    testData: "Anderson (FAM-001), Williams (FAM-002), Thompson (FAM-003)",
    testSteps: [
      { step: 1, action: "Login and navigate to Enrollment page", expected: "Families listed" },
      { step: 2, action: "Verify Anderson, Williams, Thompson families enrolled", expected: "All 3 families shown" },
      { step: 3, action: "Navigate to EDI Transactions", expected: "EDI page displayed" },
      { step: 4, action: "Filter to EDI 834 type", expected: "3 enrollment transactions shown" },
      { step: 5, action: "View Anderson enrollment (EDI-2026-002) - 3 members, Acknowledged", expected: "Anderson details correct" },
      { step: 6, action: "Close and view Williams enrollment (EDI-2026-006) - 4 members, Transmitted", expected: "Williams details correct" },
      { step: 7, action: "Close and view Thompson change (EDI-2026-007) - 2 members, Rejected", expected: "Thompson details correct" }
    ],
    script: `Feature('EDI 834 - End-to-End Enrollment to EDI Workflow');

Scenario('TC_EDI834_006 - Verify end-to-end enrollment to EDI 834 workflow across all families', async ({ I }) => {
  I.amOnPage('https://openimis-claims-mvp.onrender.com/');
  I.waitForElement('[data-testid="login-page"]', 10);
  I.fillField('[data-testid="input-username"]', 'Admin');
  I.fillField('[data-testid="input-password"]', 'admin123');
  I.click('[data-testid="btn-login"]');
  I.waitForElement('[data-testid="nav-dashboard"]', 10);
  I.say('Step 1: Verify enrolled families');
  I.click('[data-testid="nav-families-groups"]');
  I.wait(1);
  I.seeElement('[data-testid="enrollment-page"]');
  I.see('Anderson');
  I.see('Williams');
  I.see('Thompson');
  I.say('Step 2: Navigate to EDI and filter 834');
  I.click('[data-testid="nav-edi-transactions"]');
  I.wait(1);
  I.seeElement('[data-testid="edi-transactions-page"]');
  I.selectOption('[data-testid="select-filter-edi-type"]', 'EDI 834');
  I.wait(1);
  I.say('Step 3: View Anderson enrollment');
  I.click('[data-testid="btn-view-edi-EDI-2026-002"]');
  I.wait(1);
  I.see('3', '[data-testid="edi-detail-member-count"]');
  I.see('BlueCross PPO Gold', '[data-testid="edi-detail-plan-name"]');
  I.see('Acknowledged', '[data-testid="edi-detail-status"]');
  I.see('Robert Anderson', '[data-testid="member-name-INS-100001"]');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.wait(1);
  I.say('Step 4: View Williams enrollment');
  I.click('[data-testid="btn-view-edi-EDI-2026-006"]');
  I.wait(1);
  I.see('4', '[data-testid="edi-detail-member-count"]');
  I.see('BlueCross HMO Silver', '[data-testid="edi-detail-plan-name"]');
  I.see('Transmitted', '[data-testid="edi-detail-status"]');
  I.see('David Williams', '[data-testid="member-name-INS-100004"]');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.wait(1);
  I.say('Step 5: View Thompson enrollment change');
  I.click('[data-testid="btn-view-edi-EDI-2026-007"]');
  I.wait(1);
  I.see('2', '[data-testid="edi-detail-member-count"]');
  I.see('Aetna EPO Bronze', '[data-testid="edi-detail-plan-name"]');
  I.see('Rejected', '[data-testid="edi-detail-status"]');
  I.see('John Thompson', '[data-testid="member-name-INS-100008"]');
  I.click('[data-testid="btn-close-edi-detail"]');
  I.wait(1);
  I.say('Complete enrollment-to-EDI 834 workflow verified');
});`
  }
];

async function main() {
  console.log('🚀 Inserting 6 EDI 834 test cases...');
  
  let inserted = 0;
  const v2Ids = [];

  for (const tc of testCases) {
    try {
      // Insert TestCase (v1)
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
          module_id: 'EDI_834_ENROLLMENT',
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

      // Insert TestCaseV2
      const v2 = await prisma.testCaseV2.create({
        data: {
          tenantId: TENANT_ID,
          productId: PRODUCT_ID,
          requirementId: REQUIREMENT_ID,
          testCaseCode: tc.caseId,
          title: tc.title,
          description: tc.title,
          preconditions: tc.preconditions,
          testSteps: tc.testSteps,
          expectedResult: tc.expectedResult,
          testType: tc.testType === 'Negative' ? 'NEGATIVE' : 'POSITIVE',
          category: (tc.category || 'FUNCTIONAL').toUpperCase(),
          priority: 'P1',
          severity: 'MAJOR',
          status: 'APPROVED',
          automationStatus: 'AUTOMATED',
          estimatedTimeMinutes: 5,
          tags: JSON.stringify([tc.module]),
        }
      });
      v2Ids.push(v2.id);

      inserted++;
      console.log(`   ✅ ${tc.caseId} (v1: ${testCase.id}, v2: ${v2.id})`);
    } catch (err) {
      console.error(`   ❌ ${tc.caseId}: ${err.message}`);
    }
  }

  // Update test plan to include new v2Ids
  const plan = await prisma.testPlan.findUnique({ where: { id: TEST_PLAN_ID }, select: { testCases: true } });
  let existing = { v2Ids: [], v1Ids: [] };
  try { existing = JSON.parse(plan.testCases); } catch(e) {}
  existing.v2Ids = [...(existing.v2Ids || []), ...v2Ids];
  await prisma.testPlan.update({ 
    where: { id: TEST_PLAN_ID }, 
    data: { testCases: JSON.stringify(existing) } 
  });

  console.log(`\n📊 Done! Inserted: ${inserted} EDI 834 test cases`);
  console.log(`   Plan 15 now has ${existing.v2Ids.length} v2 test cases total`);
  await prisma.$disconnect();
}

main().catch(console.error);

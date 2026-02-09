const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  console.log('🚀 Creating 5 focused test plans...\n');

  // Get all our v2 test cases
  const allV2 = await p.testCaseV2.findMany({
    where: { id: { in: [436,437,438,439,440,441,442,443,444,445,446,447,448,449,450,451,452,453,454,455,456,457,458,459,460,461,462,463,464,465] } },
    select: { id: true, testCaseCode: true, title: true }
  });

  const byCode = {};
  allV2.forEach(tc => { byCode[tc.testCaseCode] = tc.id; });

  const plans = [
    {
      name: "TP1: Authentication & Navigation",
      desc: "Login flows, role verification, dashboard stats, and sidebar navigation across all 6 modules",
      cases: ["TC_AUTH_001","TC_AUTH_002","TC_AUTH_003","TC_AUTH_004","TC_DASH_001","TC_DASH_002","TC_DASH_003","TC_E2E_001"]
    },
    {
      name: "TP2: Enrollment & Claims Workflow",
      desc: "Family enrollment, search, new family creation, claims register, and claim submission",
      cases: ["TC_ENRL_001","TC_ENRL_002","TC_ENRL_003","TC_CLM_001","TC_CLM_002"]
    },
    {
      name: "TP3: Claims Review & Processing",
      desc: "Claims review filters, status updates, batch statistics, batch creation, and batch details",
      cases: ["TC_REVW_001","TC_REVW_002","TC_REVW_003","TC_BATCH_001","TC_BATCH_002","TC_BATCH_003","TC_BATCH_004"]
    },
    {
      name: "TP4: EDI Transactions",
      desc: "EDI statistics, filters, segment viewer, transaction timeline, and retransmit rejected",
      cases: ["TC_EDI_001","TC_EDI_002","TC_EDI_003","TC_EDI_004"]
    },
    {
      name: "TP5: EDI 834 Enrollment Insurance",
      desc: "Healthcare EDI 834 benefits enrollment: member details, segment loops, multi-family enrollment, rejected retransmit",
      cases: ["TC_EDI834_001","TC_EDI834_002","TC_EDI834_003","TC_EDI834_004","TC_EDI834_005","TC_EDI834_006"]
    }
  ];

  for (const plan of plans) {
    const v2Ids = plan.cases.map(code => byCode[code]).filter(Boolean);
    
    const tp = await p.testPlan.create({
      data: {
        tenantId: 3,
        productId: 12,
        requirementId: 14,
        name: plan.name,
        description: plan.desc,
        status: 'ACTIVE',
        testCases: JSON.stringify({ v2Ids, v1Ids: [] })
      }
    });

    console.log(`✅ ${plan.name}`);
    console.log(`   Plan ID: ${tp.id} | ${v2Ids.length} test cases | Status: ACTIVE`);
    console.log(`   Cases: ${plan.cases.join(', ')}\n`);
  }

  // Also mark old Plan 15 as ARCHIVED so it doesn't clutter
  await p.testPlan.update({ where: { id: 15 }, data: { status: 'DRAFT', name: 'Test plan 3 (All 30 - Archive)' } });
  console.log('📦 Archived old Plan 15 (all 30 cases)\n');

  console.log('📊 Summary:');
  console.log('   TP1: Auth & Navigation     → 8 tests  (~3 min)');
  console.log('   TP2: Enrollment & Claims   → 5 tests  (~2 min)');
  console.log('   TP3: Review & Batch        → 7 tests  (~3 min)');
  console.log('   TP4: EDI Transactions      → 4 tests  (~2 min)');
  console.log('   TP5: EDI 834 Enrollment    → 6 tests  (~3 min)');
  console.log('   Total: 30 tests in 5 plans (~13 min total)');

  await p.$disconnect();
}

main().catch(console.error);

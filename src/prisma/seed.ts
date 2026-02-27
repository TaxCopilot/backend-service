import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...\n');

  // ─── Create Users ───
  const user = await prisma.user.upsert({
    where: { email: 'arjun.mehta@taxfirm.com' },
    update: {},
    create: {
      email: 'arjun.mehta@taxfirm.com',
      name: 'Arjun Mehta',
      registrationId: 'MCA-2019-0892',
      phone: '+91 98765 43210',
      role: 'USER',
    },
  });

  console.log(`  ✓ User: ${user.name} (${user.email})`);

  // ─── Create a Case ───
  const sampleCase = await prisma.case.create({
    data: {
      title: 'GST REG-17 Reply for ABC Traders',
      clientName: 'ABC Traders Pvt Ltd',
      referenceNo: 'ZA2710230000000',
      description: 'Show Cause Notice for cancellation of GST registration due to non-filing of returns for 6 months.',
      status: 'IN_PROGRESS',
      dueDate: new Date('2024-11-01'),
      userId: user.id,
    },
  });

  console.log(`  ✓ Case: ${sampleCase.title}`);

  // ─── Create a Draft ───
  const draft = await prisma.draft.create({
    data: {
      title: 'SCN Reply - ABC Traders',
      category: 'SCN_REPLY',
      content: 'Draft reply content will go here...',
      status: 'DRAFT',
      userId: user.id,
      caseId: sampleCase.id,
    },
  });

  console.log(`  ✓ Draft: ${draft.title}`);

  // ─── Seed Law Library ───
  const lawEntries = await prisma.lawEntry.createMany({
    data: [
      {
        category: 'GST Law',
        section: 'Section 29(2)(c)',
        title: 'Cancellation or Suspension of Registration',
        description: 'The proper officer may cancel the registration of a person from such date as he may deem fit, where a registered person has not furnished returns for a continuous period of six months.',
        tags: ['CGST Act 2017', 'Registration', 'Non-Compliance'],
      },
      {
        category: 'Case Law',
        section: 'Madras HC • 2022',
        title: 'TVL. Suguna Cutpiece Center vs. The Appellate Deputy Commissioner',
        description: 'The High Court held that cancellation of GST registration for non-filing of returns is a drastic measure. Authorities must consider reasons and provide opportunity before cancellation.',
        tags: ['Section 29', 'Natural Justice', 'Cancellation'],
        court: 'Madras High Court',
        year: 2022,
      },
      {
        category: 'Income Tax',
        section: 'Section 148A',
        title: 'Conducting Inquiry Before Issue of Notice Under Section 148',
        description: 'The Assessing Officer shall conduct an inquiry with the prior approval of the specified authority, before issuing a notice under section 148.',
        tags: ['IT Act', 'Reassessment', 'Notice'],
      },
      {
        category: 'Notification',
        section: 'Circular No. 183/15/2022',
        title: 'GST Clarification on Provisions Relating to E-Commerce',
        description: 'Clarifications on registration and compliance requirements for persons supplying goods through an electronic commerce operator under Section 9(5) of the CGST Act.',
        tags: ['E-Commerce', 'GST', 'Circular'],
      },
    ],
    skipDuplicates: true,
  });

  console.log(`  ✓ Law entries: ${lawEntries.count} seeded`);

  console.log('\n✅ Seeding complete!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

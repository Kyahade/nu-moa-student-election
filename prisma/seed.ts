import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg(pool),
});

async function main() {

  const collegeData = [
  {
    name: "College of Dentistry",
    programs: [
      "Doctor of Dental Medicine",
      "Dental Hygiene",
      "Dental Technology",
    ],
  },
  {
    name: "School of Allied Health",
    programs: [
      "Medical Technology",
      "Nursing",
    ],
  },
  {
    name: "School of Optometry",
    programs: [
      "Doctor of Optometry",
    ],
  },
  {
    name: "School of Accountancy and Management",
    programs: [
      "BSA",
      "BSBM",
      "BSFINMA",
      "Tourism",
      "Hospitality Management",
    ],
  },
  {
    name: "School of Information Technology",
    programs: [
      "BSIT",
      "BSCS",
    ],
  },
  {
    name: "School of Arts and Sciences",
    programs: [
      "Psychology",
    ],
  },
  {
    name: "School of Architecture",
    programs: [
      "Architecture",
    ],
  },
];

for (const college of collegeData) {
  const createdCollege = await prisma.college.upsert({
    where: {
      name: college.name,
    },
    update: {},
    create: {
      name: college.name,
    },
  });

  for (const programName of college.programs) {
    await prisma.program.upsert({
      where: {
        collegeId_name: {
          collegeId: createdCollege.id,
          name: programName,
        },
      },
      update: {},
      create: {
        name: programName,
        collegeId: createdCollege.id,
      },
    });
  }
}
  // Create or update the admin test account
  const admin = await prisma.voter.upsert({
    where: {
      email: "test@students.nu-moa.edu.ph",
    },
    update: {
      isAdmin: true,
      hasVoted: false,
    },
    create: {
      email: "test@students.nu-moa.edu.ph",
      isAdmin: true,
      hasVoted: false,
    },
  });

  console.log("Admin account:", admin.email);

  // Find existing election
  let election = await prisma.election.findFirst({
    where: {
      name: "NU MOA Student Election 2026",
    },
  });

  // Create election only if it doesn't exist
  if (!election) {
    election = await prisma.election.create({
      data: {
        name: "NU MOA Student Election 2026",
        startDate: new Date("2026-01-01T00:00:00"),
        endDate: new Date("2030-12-31T23:59:59"),
        isActive: true,

        positions: {
          create: [
            {
              name: "President",
              maxVotes: 1,
              candidates: {
                create: [
                  {
                    name: "Candidate A",
                    party: "Party Alpha",
                  },
                  {
                    name: "Candidate B",
                    party: "Party Beta",
                  },
                ],
              },
            },
            {
              name: "Vice President",
              maxVotes: 1,
              candidates: {
                create: [
                  {
                    name: "Candidate C",
                    party: "Party Alpha",
                  },
                  {
                    name: "Candidate D",
                    party: "Party Beta",
                  },
                ],
              },
            },
          ],
        },
      },
    });

    console.log("Created election:", election.name);
  } else {
    console.log("Election already exists:", election.name);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

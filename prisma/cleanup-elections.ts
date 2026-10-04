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
  const idsToDelete = [1, 2];

  for (const electionId of idsToDelete) {
    const election = await prisma.election.findUnique({
      where: { id: electionId },
      include: {
        positions: {
          include: {
            candidates: true,
          },
        },
      },
    });

    if (!election) {
      console.log(`Election ${electionId} not found.`);
      continue;
    }

    for (const position of election.positions) {
      await prisma.ballotSelection.deleteMany({
        where: {
          positionId: position.id,
        },
      });

      await prisma.candidate.deleteMany({
        where: {
          positionId: position.id,
        },
      });
    }

    await prisma.position.deleteMany({
      where: {
        electionId,
      },
    });

    await prisma.election.delete({
      where: {
        id: electionId,
      },
    });

    console.log(`Deleted election ${electionId}: ${election.name}`);
  }

  console.log("Cleanup complete. Election ID 3 was preserved.");
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
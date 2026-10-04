/*
  Warnings:

  - You are about to drop the column `programId` on the `ElectionBody` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ElectionBody" DROP CONSTRAINT "ElectionBody_programId_fkey";

-- AlterTable
ALTER TABLE "ElectionBody" DROP COLUMN "programId";

-- CreateTable
CREATE TABLE "ElectionBodyProgram" (
    "electionBodyId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,

    CONSTRAINT "ElectionBodyProgram_pkey" PRIMARY KEY ("electionBodyId","programId")
);

-- AddForeignKey
ALTER TABLE "ElectionBodyProgram" ADD CONSTRAINT "ElectionBodyProgram_electionBodyId_fkey" FOREIGN KEY ("electionBodyId") REFERENCES "ElectionBody"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionBodyProgram" ADD CONSTRAINT "ElectionBodyProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

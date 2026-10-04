-- CreateEnum
CREATE TYPE "ElectionBodyType" AS ENUM ('STUDENT_GOVERNMENT', 'COUNCIL', 'ACADEMIC_RSO', 'ORGANIZATION');

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "politicalTeamId" INTEGER;

-- AlterTable
ALTER TABLE "Position" ADD COLUMN     "electionBodyId" INTEGER;

-- AlterTable
ALTER TABLE "Voter" ADD COLUMN     "programId" INTEGER;

-- CreateTable
CREATE TABLE "College" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "collegeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectionBody" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ElectionBodyType" NOT NULL,
    "electionId" INTEGER NOT NULL,
    "programId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectionBody_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PoliticalTeam" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "electionBodyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PoliticalTeam_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "College_name_key" ON "College"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Program_collegeId_name_key" ON "Program"("collegeId", "name");

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionBody" ADD CONSTRAINT "ElectionBody_electionId_fkey" FOREIGN KEY ("electionId") REFERENCES "Election"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectionBody" ADD CONSTRAINT "ElectionBody_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Position" ADD CONSTRAINT "Position_electionBodyId_fkey" FOREIGN KEY ("electionBodyId") REFERENCES "ElectionBody"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PoliticalTeam" ADD CONSTRAINT "PoliticalTeam_electionBodyId_fkey" FOREIGN KEY ("electionBodyId") REFERENCES "ElectionBody"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_politicalTeamId_fkey" FOREIGN KEY ("politicalTeamId") REFERENCES "PoliticalTeam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voter" ADD CONSTRAINT "Voter_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Ballot" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ballot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BallotSelection" (
    "id" SERIAL NOT NULL,
    "ballotId" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "positionId" INTEGER NOT NULL,

    CONSTRAINT "BallotSelection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BallotSelection" ADD CONSTRAINT "BallotSelection_ballotId_fkey" FOREIGN KEY ("ballotId") REFERENCES "Ballot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BallotSelection" ADD CONSTRAINT "BallotSelection_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BallotSelection" ADD CONSTRAINT "BallotSelection_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

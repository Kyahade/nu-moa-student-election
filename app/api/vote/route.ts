import { getCurrentVoter } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const voter = await getCurrentVoter();

    if (!voter) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (voter.hasVoted) {
      return NextResponse.json(
        { error: "You have already voted." },
        { status: 400 }
      );
    }

    if (!voter.programId) {
      return NextResponse.json(
        { error: "Please select your course first." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const selections = body.selections;

    if (
      !selections ||
      typeof selections !== "object" ||
      Array.isArray(selections)
    ) {
      return NextResponse.json(
        { error: "Invalid ballot." },
        { status: 400 }
      );
    }

    const election = await prisma.election.findFirst({
      where: { isActive: true },
      include: {
        electionBodies: {
          where: {
            OR: [
              { type: "STUDENT_GOVERNMENT" },
              {
                programs: {
                  some: {
                    programId: voter.programId,
                  },
                },
              },
            ],
          },
          include: {
            positions: {
              include: {
                candidates: true,
              },
            },
          },
        },
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "No active election found." },
        { status: 404 }
      );
    }

    const now = new Date();

    if (now < election.startDate) {
      return NextResponse.json(
        { error: "The election has not started yet." },
        { status: 400 }
      );
    }

    if (now > election.endDate) {
      return NextResponse.json(
        { error: "The election has already ended." },
        { status: 400 }
      );
    }

    const positions = election.electionBodies.flatMap(
      (body) => body.positions
    );

    // Every position must have exactly one choice.
    for (const position of positions) {
      const selection = selections[String(position.id)];

      if (selection === undefined) {
        return NextResponse.json(
          {
            error: `Please make a selection for ${position.name}.`,
          },
          { status: 400 }
        );
      }

      // 0 means Abstain.
      if (selection === 0) {
        continue;
      }

      const candidateId = Number(selection);

      if (!Number.isInteger(candidateId)) {
        return NextResponse.json(
          { error: "Invalid candidate selection." },
          { status: 400 }
        );
      }

      const candidate = position.candidates.find(
        (candidate) => candidate.id === candidateId
      );

      if (!candidate) {
        return NextResponse.json(
          {
            error: `Invalid candidate selected for ${position.name}.`,
          },
          { status: 400 }
        );
      }
    }

    // Make sure the client didn't submit extra positions.
    const validPositionIds = new Set(
      positions.map((position) => String(position.id))
    );

    for (const key of Object.keys(selections)) {
      if (!validPositionIds.has(key)) {
        return NextResponse.json(
          { error: "Invalid ballot." },
          { status: 400 }
        );
      }
    }

    const ballot = await prisma.$transaction(async (tx) => {
      const newBallot = await tx.ballot.create({
        data: {},
      });

      const ballotSelections = positions
        .map((position) => {
          const candidateId = Number(selections[String(position.id)]);

          // Abstain is not a candidate, so don't create a BallotSelection.
          if (candidateId === 0) {
            return null;
          }

          return {
            ballotId: newBallot.id,
            candidateId,
            positionId: position.id,
          };
        })
        .filter(
          (
            selection
          ): selection is {
            ballotId: number;
            candidateId: number;
            positionId: number;
          } => selection !== null
        );

      if (ballotSelections.length > 0) {
        await tx.ballotSelection.createMany({
          data: ballotSelections,
        });
      }

      await tx.voter.update({
        where: { id: voter.id },
        data: { hasVoted: true },
      });

      return newBallot;
    });

    return NextResponse.json({
      success: true,
      ballotId: ballot.id,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to submit your vote." },
      { status: 500 }
    );
  }
}
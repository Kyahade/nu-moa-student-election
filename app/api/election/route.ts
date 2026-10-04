import { getCurrentVoter } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const voter = await getCurrentVoter();

    if (!voter) {
      return NextResponse.json(
        { error: "You must be logged in." },
        { status: 401 }
      );
    }

    if (!voter.programId) {
      return NextResponse.json(
        { error: "Please select your course first." },
        { status: 400 }
      );
    }

    const election = await prisma.election.findFirst({
      where: {
        isActive: true,
      },
    });

    if (!election) {
      return NextResponse.json(
        { error: "No active election found." },
        { status: 404 }
      );
    }

    const electionBodies = await prisma.electionBody.findMany({
      where: {
        electionId: election.id,
        OR: [
          {
            type: "STUDENT_GOVERNMENT",
          },
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
            candidates: {
              include: {
                politicalTeam: true,
              },
            },
          },
        },
        teams: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json({
      election: {
        id: election.id,
        name: election.name,
        startDate: election.startDate,
        endDate: election.endDate,
      },
      electionBodies,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to load the election." },
      { status: 500 }
    );
  }
}
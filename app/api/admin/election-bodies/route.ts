import { getCurrentVoter } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

async function requireAdmin() {
  const voter = await getCurrentVoter();

  if (!voter) {
    return null;
  }

  if (!voter.isAdmin) {
    return null;
  }

  return voter;
}

// GET all election bodies for the active election
export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const election = await prisma.election.findFirst({
      where: { isActive: true },
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
      },
      include: {
        programs: {
          include: {
            program: {
              include: {
                college: true,
              },
            },
          },
        },
        positions: {
          include: {
            candidates: true,
          },
        },
        teams: {
          include: {
            candidates: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(electionBodies);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to load election bodies." },
      { status: 500 }
    );
  }
}

// CREATE an election body
export async function POST(request: Request) {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const election = await prisma.election.findFirst({
      where: { isActive: true },
    });

    if (!election) {
      return NextResponse.json(
        { error: "No active election found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const type = String(body.type ?? "").trim();

    const validTypes = [
      "STUDENT_GOVERNMENT",
      "COUNCIL",
      "ACADEMIC_RSO",
      "ORGANIZATION",
    ];

    if (!name) {
      return NextResponse.json(
        { error: "Election body name is required." },
        { status: 400 }
      );
    }

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: "Invalid election body type." },
        { status: 400 }
      );
    }

    // Only one NUSG election body should exist per election.
    if (type === "STUDENT_GOVERNMENT") {
      const existingNusg = await prisma.electionBody.findFirst({
        where: {
          electionId: election.id,
          type: "STUDENT_GOVERNMENT",
        },
      });

      if (existingNusg) {
        return NextResponse.json(
          {
            error: "The NUSG election body already exists.",
            electionBody: existingNusg,
          },
          { status: 409 }
        );
      }
    }

    const electionBody = await prisma.$transaction(async (tx) => {
  const newElectionBody = await tx.electionBody.create({
    data: {
      name,
      type: type as
        | "STUDENT_GOVERNMENT"
        | "COUNCIL"
        | "ACADEMIC_RSO"
        | "ORGANIZATION",
      electionId: election.id,
    },
  });

  if (type === "STUDENT_GOVERNMENT") {
    await tx.position.createMany({
      data: [
        {
          name: "President",
          maxVotes: 1,
          electionId: election.id,
          electionBodyId: newElectionBody.id,
        },
        {
          name: "Vice President",
          maxVotes: 1,
          electionId: election.id,
          electionBodyId: newElectionBody.id,
        },
        {
          name: "Secretary",
          maxVotes: 1,
          electionId: election.id,
          electionBodyId: newElectionBody.id,
        },
        {
          name: "Treasurer",
          maxVotes: 1,
          electionId: election.id,
          electionBodyId: newElectionBody.id,
        },
        {
          name: "Auditor",
          maxVotes: 1,
          electionId: election.id,
          electionBodyId: newElectionBody.id,
        },
        {
          name: "Public Relations Officer",
          maxVotes: 1,
          electionId: election.id,
          electionBodyId: newElectionBody.id,
        },
      ],
    });
  }

  return newElectionBody;
});

    return NextResponse.json(
      {
        success: true,
        electionBody,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to create election body." },
      { status: 500 }
    );
  }
}
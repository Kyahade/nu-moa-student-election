import { getCurrentVoter } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
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

    if (!voter.isAdmin) {
      return NextResponse.json(
        { error: "Admin access required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const electionId = Number(body.electionId);
    const name = String(body.name ?? "").trim();
    const maxVotes = Number(body.maxVotes ?? 1);

    if (!Number.isInteger(electionId)) {
      return NextResponse.json(
        { error: "Invalid election." },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: "Position name is required." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(maxVotes) || maxVotes < 1) {
      return NextResponse.json(
        { error: "Maximum votes must be at least 1." },
        { status: 400 }
      );
    }

    const election = await prisma.election.findUnique({
      where: { id: electionId },
    });

    if (!election) {
      return NextResponse.json(
        { error: "Election not found." },
        { status: 404 }
      );
    }

    const position = await prisma.position.create({
      data: {
        name,
        maxVotes,
        electionId,
      },
    });

    return NextResponse.json({
      success: true,
      position,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to create position." },
      { status: 500 }
    );
  }
}
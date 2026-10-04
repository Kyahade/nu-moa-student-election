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

    const body = await request.json();
    const programId = Number(body.programId);

    if (!Number.isInteger(programId)) {
      return NextResponse.json(
        { error: "Invalid program." },
        { status: 400 }
      );
    }

    const program = await prisma.program.findUnique({
      where: {
        id: programId,
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: "Program not found." },
        { status: 404 }
      );
    }

    await prisma.voter.update({
      where: {
        id: voter.id,
      },
      data: {
        programId: program.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to save program." },
      { status: 500 }
    );
  }
}
import { prisma } from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      include: {
        programs: {
          orderBy: {
            name: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(colleges);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to load programs." },
      { status: 500 }   
    );
  }
}
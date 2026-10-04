import { randomBytes } from "crypto";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    // MVP eligibility check
    if (!email.endsWith("@students.nu-moa.edu.ph")) {
      return NextResponse.json(
        { error: "Please use your NU student email." },
        { status: 400 }
      );
    }

    // Find or create the voter record
    const voter = await prisma.voter.upsert({
      where: { email },
      update: {},
      create: { email },
    });

    // Create a random session token
    const token = randomBytes(32).toString("hex");

    // Session expires after 2 hours
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        token,
        email: voter.email,
        expiresAt,
      },
    });

    const response = NextResponse.json({ success: true });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Unable to log in." },
      { status: 500 }
    );
  }
}
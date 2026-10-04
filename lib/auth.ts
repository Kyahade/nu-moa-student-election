import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentVoter() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: { id: session.id },
    });

    return null;
  }

  return prisma.voter.findUnique({
    where: { email: session.email },
  });
}
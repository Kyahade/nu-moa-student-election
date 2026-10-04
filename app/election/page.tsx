import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import { getCurrentVoter } from "../../lib/auth";
import ElectionClient from "./ElectionClient";

export default async function ElectionPage() {
  const voter = await getCurrentVoter();

  if (!voter) {
    redirect("/login");
  }

  if (voter.hasVoted) {
    redirect("/vote/success");
  }

  const election = await prisma.election.findFirst({
    where: { isActive: true },
  });

  if (!election) {
    redirect("/");
  }

  const now = new Date();

if (now < election.startDate) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Election Not Open</h1>
        <p className="mt-3 text-gray-600">
          The election has not started yet.
        </p>
      </div>
    </main>
  );
}

if (now > election.endDate) {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Election Closed</h1>
        <p className="mt-3 text-gray-600">
          The election has already ended.
        </p>
      </div>
    </main>
  );
}

  return <ElectionClient />;
}
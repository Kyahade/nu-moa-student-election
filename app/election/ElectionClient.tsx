"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Candidate = {
  id: number;
  name: string;
  party: string | null;
  photoUrl: string | null;
  politicalTeam: {
    id: number;
    name: string;
  } | null;
};

type Position = {
  id: number;
  name: string;
  maxVotes: number;
  candidates: Candidate[];
};

type ElectionBody = {
  id: number;
  name: string;
  type: string;
  positions: Position[];
};

type Election = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
};

export default function ElectionPage() {
  const router = useRouter();

  const [election, setElection] = useState<Election | null>(null);
  const [electionBodies, setElectionBodies] = useState<ElectionBody[]>([]);
  const [selections, setSelections] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const allPositions = electionBodies.flatMap(
  (body) => body.positions
);

const allPositionsSelected = allPositions.every(
  (position) => selections[position.id] !== undefined
);

  useEffect(() => {
    async function loadElection() {
      try {
        const response = await fetch("/api/election");

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load the election.");
          return;
        }

        setElection(data.election);
        setElectionBodies(data.electionBodies || []);
      } catch {
        setError("Unable to load the election.");
      } finally {
        setLoading(false);
      }
    }

    loadElection();
  }, []);

  function selectCandidate(positionId: number, candidateId: number) {
    setSelections((current) => ({
      ...current,
      [positionId]: candidateId,
    }));
  }

  function continueToConfirmation() {
    localStorage.setItem(
      "electionSelections",
      JSON.stringify(selections)
    );

    router.push("/vote/confirm");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading election...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  if (!election) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">{election.name}</h1>

        <p className="mt-2 text-gray-600">
          Select your preferred candidate for each position.
        </p>

        <div className="mt-8 space-y-12">
          {electionBodies.map((body) => (
            <section key={body.id}>
              <div className="border-b pb-3">
                <h2 className="text-2xl font-bold">
                  {body.name}
                </h2>
              </div>

              <div className="mt-6 space-y-8">
                {body.positions.map((position) => (
                  <div key={position.id}>
                    <h3 className="text-xl font-semibold">
                      {position.name}
                    </h3>

                    <div className="mt-4 space-y-3">
  {position.candidates.map((candidate) => {
    const selected =
      selections[position.id] === candidate.id;

    return (
      <button
        key={candidate.id}
        onClick={() =>
          selectCandidate(position.id, candidate.id)
        }
        className={`w-full rounded-2xl border p-5 text-left transition ${
          selected
            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600"
            : "border-gray-200 bg-white hover:border-blue-400"
        }`}
      >
        <div className="font-semibold">
          {candidate.name}
        </div>

        {candidate.politicalTeam && (
          <div className="mt-1 text-sm text-gray-600">
            {candidate.politicalTeam.name}
          </div>
        )}

        {candidate.party && (
          <div className="mt-1 text-sm text-gray-500">
            {candidate.party}
          </div>
        )}
      </button>
    );
  })}

  {/* Abstain */}
  <button
    onClick={() => selectCandidate(position.id, 0)}
    className={`w-full rounded-2xl border p-4 text-left transition ${
      selections[position.id] === 0
        ? "border-gray-700 bg-gray-100 ring-2 ring-gray-700"
        : "border-gray-200 bg-white hover:border-gray-400"
    }`}
  >
    <div className="font-semibold">Abstain</div>
    <div className="mt-1 text-sm text-gray-500">
      I choose not to vote for any candidate.
    </div>
  </button>
</div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 flex justify-end">
          <button
  onClick={continueToConfirmation}
  disabled={!allPositionsSelected}
  className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
>
  Continue to Confirmation
</button>
        </div>
      </div>
    </main>
  );
}
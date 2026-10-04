"use client";

import { useEffect, useState } from "react";

type Candidate = {
  id: number;
  name: string;
  party: string | null;
  politicalTeam: {
    id: number;
    name: string;
  } | null;
};

type Position = {
  id: number;
  name: string;
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

type Selection = Record<number, number>;

export default function ConfirmVotePage() {
  const [election, setElection] = useState<Election | null>(null);
  const [electionBodies, setElectionBodies] = useState<ElectionBody[]>([]);
  const [selections, setSelections] = useState<Selection>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  async function loadConfirmation() {
    try {
      const saved = localStorage.getItem("electionSelections");

      const response = await fetch("/api/election");
      const data = await response.json();

      if (saved) {
        const parsed: Selection = JSON.parse(saved);
        setSelections(parsed);
      }

      setElection(data.election);
      setElectionBodies(data.electionBodies || []);
    } catch {
      // Leave the page in its loading/error state.
    } finally {
      setLoading(false);
    }
  }

  loadConfirmation();
}, []);

  if (loading) {
    return <main className="p-8">Loading...</main>;
  }

  if (!election) {
    return <main className="p-8">Election not found.</main>;
  }

  const allPositions = electionBodies.flatMap(
    (body) => body.positions
  );

  const allPositionsSelected = allPositions.every(
    (position) => selections[position.id] !== undefined
  );

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">
          Confirm Your Vote
        </h1>

        <p className="mt-2 text-gray-600">
          Please carefully review your selections before submitting.
        </p>

        <div className="mt-8 space-y-8">
          {electionBodies.map((body) => (
            <section key={body.id}>
              <h2 className="mb-4 text-2xl font-bold">
                {body.name}
              </h2>

              <div className="space-y-4">
                {body.positions.map((position) => {
                  const selectedCandidateId =
                    selections[position.id];

                  const isAbstain =
                    selectedCandidateId === 0;

                  const candidate = position.candidates.find(
                    (candidate) =>
                      candidate.id === selectedCandidateId
                  );

                  return (
                    <div
                      key={position.id}
                      className="rounded-xl border bg-white p-6 shadow-sm"
                    >
                      <h3 className="text-xl font-semibold">
                        {position.name}
                      </h3>

                      {isAbstain ? (
                        <div className="mt-4">
                          <p className="text-lg font-medium">
                            Abstain
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            You chose not to vote for any candidate.
                          </p>
                        </div>
                      ) : candidate ? (
                        <div className="mt-4">
                          <p className="text-lg font-medium">
                            {candidate.name}
                          </p>

                          {candidate.politicalTeam && (
                            <p className="text-gray-600">
                              {candidate.politicalTeam.name}
                            </p>
                          )}

                          {candidate.party && (
                            <p className="text-sm text-gray-500">
                              {candidate.party}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p className="mt-4 text-red-600">
                          No selection made
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {!allPositionsSelected && (
          <p className="mt-6 text-sm text-red-600">
            Please make a selection for every position before
            submitting your vote.
          </p>
        )}

        <div className="mt-8 flex gap-4">
          <button
            className="flex-1 rounded-lg border bg-white px-6 py-3"
            onClick={() => {
              window.location.href = "/election";
            }}
            disabled={submitting}
          >
            Go Back
          </button>

          <button
            className="flex-1 rounded-lg bg-black px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
            disabled={submitting || !allPositionsSelected}
            onClick={async () => {
              setSubmitting(true);

              try {
                const response = await fetch("/api/vote", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    selections,
                  }),
                });

                const data = await response.json();

                if (!response.ok) {
                  alert(data.error ?? "Unable to submit vote.");
                  setSubmitting(false);
                  return;
                }

                localStorage.removeItem("electionSelections");

                window.location.href = "/vote/success";
              } catch {
                alert(
                  "Something went wrong while submitting your vote."
                );
                setSubmitting(false);
              }
            }}
          >
            {submitting ? "Submitting..." : "Submit Vote"}
          </button>
        </div>
      </div>
    </main>
  );
}
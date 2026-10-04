"use client";

import Link from "next/link";

const candidates = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    position: "President",
  },
  {
    id: 2,
    name: "Maria Santos",
    position: "President",
  },
  {
    id: 3,
    name: "Alex Reyes",
    position: "President",
  },
];

export default function ElectionPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <h1 className="text-xl font-bold text-blue-900">
            NU MOA Elections
          </h1>
        </div>
      </nav>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <p className="text-sm font-semibold text-blue-700">
          2026 STUDENT ELECTIONS
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Choose your candidate
        </h2>

        <p className="mt-2 text-gray-600">
          Select one candidate for President.
        </p>

        <div className="mt-8 space-y-4">
          {candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-gray-900">
                  {candidate.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {candidate.position}
                </p>
              </div>

              <button className="rounded-lg border border-blue-900 px-5 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50">
                Select
              </button>
            </div>
          ))}
        </div>

        <Link
          href="/vote/confirm"
          className="mt-8 block rounded-lg bg-blue-900 px-6 py-3 text-center font-semibold text-white hover:bg-blue-800"
        >
          Review Vote
        </Link>
      </section>
    </main>
  );
}
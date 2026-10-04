"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Program = {
  id: number;
  name: string;
};

type College = {
  id: number;
  name: string;
  programs: Program[];
};

export default function ProgramPage() {
  const router = useRouter();

  const [colleges, setColleges] = useState<College[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPrograms() {
      try {
        const response = await fetch("/api/programs");

        if (!response.ok) {
          throw new Error("Unable to load programs.");
        }

        const data = await response.json();
        setColleges(data);
      } catch {
        setError("Unable to load the available schools.");
      } finally {
        setLoading(false);
      }
    }

    loadPrograms();
  }, []);

  async function confirmSelection() {
    if (!selectedCollege || !selectedProgram) return;

    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/voter/program", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programId: selectedProgram.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to save your selection.");
        return;
      }

      router.push("/election");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading schools...</p>
      </main>
    );
  }

  if (selectedCollege && !selectedProgram) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => setSelectedCollege(null)}
            className="mb-6 text-sm font-medium text-blue-600"
          >
            ← Back to schools
          </button>

          <h1 className="text-3xl font-bold">
            {selectedCollege.name}
          </h1>

          <p className="mt-2 text-gray-600">
            Select your course.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {selectedCollege.programs.map((program) => (
              <button
                key={program.id}
                onClick={() => setSelectedProgram(program)}
                className="rounded-xl border bg-white p-5 text-left shadow-sm transition hover:border-blue-500 hover:shadow-md"
              >
                <div className="font-semibold">{program.name}</div>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (selectedCollege && selectedProgram) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-xl">
          <h1 className="text-3xl font-bold">
            Confirm your details
          </h1>

          <p className="mt-2 text-gray-600">
            Please make sure your selection is correct.
          </p>

          <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
            <div>
              <p className="text-sm text-gray-500">School</p>
              <p className="mt-1 font-semibold">
                {selectedCollege.name}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500">Course</p>
              <p className="mt-1 font-semibold">
                {selectedProgram.name}
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setSelectedProgram(null)}
              className="flex-1 rounded-xl border bg-white px-5 py-3 font-medium"
              disabled={saving}
            >
              Change
            </button>

            <button
              onClick={confirmSelection}
              disabled={saving}
              className="flex-1 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Yes, Continue"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">
          Select your school
        </h1>

        <p className="mt-2 text-gray-600">
          Choose the school you belong to.
        </p>

        {error && (
          <p className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {colleges.map((college) => (
            <button
              key={college.id}
              onClick={() => setSelectedCollege(college)}
              className="rounded-2xl border bg-white p-6 text-left shadow-sm transition hover:border-blue-500 hover:shadow-md"
            >
              <div className="text-lg font-semibold">
                {college.name}
              </div>

              <div className="mt-2 text-sm text-gray-500">
                {college.programs.length} course
                {college.programs.length !== 1 ? "s" : ""}
              </div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
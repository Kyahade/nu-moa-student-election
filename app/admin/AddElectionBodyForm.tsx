"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  electionId: number;
};

export default function AddElectionBodyForm({ electionId }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [type, setType] = useState("COUNCIL");
  const [programId, setProgramId] = useState("");
  const [programs, setPrograms] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);

  async function loadPrograms() {
    const response = await fetch("/api/programs");
    const colleges = await response.json();

    const allPrograms = colleges.flatMap(
      (college: {
        programs: { id: number; name: string }[];
      }) => college.programs
    );

    setPrograms(allPrograms);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/admin/election-bodies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionId,
          name,
          type,
          programId:
            type === "STUDENT_GOVERNMENT"
              ? null
              : programId
                ? Number(programId)
                : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error ?? "Unable to create election body.");
        return;
      }

      setName("");
      setProgramId("");

      router.refresh();
    } catch {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-lg border border-dashed p-4"
    >
      <h3 className="font-semibold">Add Election Body</h3>

      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. School of IT Council"
          className="rounded-lg border px-3 py-2"
        />

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);

            if (e.target.value !== "STUDENT_GOVERNMENT") {
              loadPrograms();
            }
          }}
          className="rounded-lg border px-3 py-2"
        >
          <option value="STUDENT_GOVERNMENT">
            Student Government
          </option>
          <option value="COUNCIL">Council</option>
          <option value="ACADEMIC_RSO">Academic RSO</option>
          <option value="ORGANIZATION">Organization</option>
        </select>

        {type !== "STUDENT_GOVERNMENT" ? (
          <select
            required
            value={programId}
            onChange={(e) => setProgramId(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">Select program</option>

            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))}
          </select>
        ) : (
          <div />
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-900 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Body"}
        </button>
      </div>
    </form>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  electionId: number;
};

export default function AddPositionForm({ electionId }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [maxVotes, setMaxVotes] = useState("1");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);

    try {
      const response = await fetch("/api/admin/positions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionId,
          name,
          maxVotes: Number(maxVotes),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error ?? "Unable to create position.");
        return;
      }

      setName("");
      setMaxVotes("1");

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
      className="mt-4 rounded-lg border border-dashed p-4"
    >
      <h4 className="font-semibold">Add Position</h4>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Secretary"
          className="rounded-lg border px-3 py-2"
        />

        <input
          required
          type="number"
          min="1"
          value={maxVotes}
          onChange={(e) => setMaxVotes(e.target.value)}
          className="rounded-lg border px-3 py-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-900 px-4 py-2 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Position"}
        </button>
      </div>
    </form>
  );
}
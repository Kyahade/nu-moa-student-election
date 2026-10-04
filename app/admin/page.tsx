"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "programs", label: "Programs" },
  { id: "nusg", label: "NUSG" },
  { id: "councils", label: "Student Councils" },
  { id: "rsos", label: "Academic RSOs" },
  { id: "organizations", label: "Organizations" },
  { id: "settings", label: "Settings" },
];

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <main className="min-h-screen bg-gray-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-white">
          <div className="border-b px-6 py-5">
            <h1 className="text-lg font-bold">
              Election Admin
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              NU MOA Student Elections
            </p>
          </div>

          <nav className="p-3">
            {sections.map((section) => {
              const active = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`mb-1 w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {section.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <section className="flex-1">
          <header className="border-b bg-white px-8 py-6">
            <h2 className="text-2xl font-bold">
              {sections.find(
                (section) => section.id === activeSection
              )?.label}
            </h2>
          </header>

          <div className="p-8">
            {activeSection === "overview" && (
              <Overview />
            )}

            {activeSection === "programs" && (
              <Placeholder
                title="Programs"
                description="Manage schools and courses available to students."
              />
            )}

            {activeSection === "nusg" && <NusgEditor />}

            {activeSection === "councils" && (
            <Placeholder
                title="Student Councils"
                description="Manage student council elections and their applicable courses."
            />
            )}

            {activeSection === "rsos" && (
              <Placeholder
                title="Academic RSOs"
                description="Manage academic registered student organizations."
              />
            )}

            {activeSection === "organizations" && (
              <Placeholder
                title="Organizations"
                description="Manage organization elections."
              />
            )}

            {activeSection === "settings" && (
              <Placeholder
                title="Settings"
                description="Configure election settings."
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">
          Election Overview
        </h3>
        <p className="mt-1 text-gray-600">
          Manage your student election from here.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <DashboardCard
          title="Election Status"
          value="Active"
          description="Current election"
        />

        <DashboardCard
          title="Election Bodies"
          value="0"
          description="Configured"
        />

        <DashboardCard
          title="Positions"
          value="0"
          description="Configured"
        />
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h3 className="font-semibold">
          Quick Start
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          Start by configuring your election bodies, positions,
          political teams, and candidates.
        </p>
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  );
}

function Placeholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-8">
      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-gray-600">
        {description}
      </p>

      <div className="mt-8 rounded-lg border border-dashed p-8 text-center text-sm text-gray-500">
        This section will be built next.
      </div>
    </div>
  );
}

function NusgEditor() {
  const [loading, setLoading] = useState(true);
  const [nusg, setNusg] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function loadNusg() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/election-bodies");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to load NUSG."
        );
      }

      const existingNusg = data.find(
        (body: any) => body.type === "STUDENT_GOVERNMENT"
      );

      setNusg(existingNusg || null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load NUSG."
      );
    } finally {
      setLoading(false);
    }
  }

  async function createNusg() {
  try {
    setCreating(true);
    setError("");

    const response = await fetch("/api/admin/election-bodies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "NUSG",
        type: "STUDENT_GOVERNMENT",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to create NUSG.");
    }

    await loadNusg();
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Unable to create NUSG."
    );
  } finally {
    setCreating(false);
  }
}

  useEffect(() => {
    loadNusg();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <p className="text-gray-500">
          Loading NUSG...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!nusg) {
    return (
      <div className="rounded-xl border bg-white p-8">
        <h3 className="text-xl font-semibold">
          National University Student Government
        </h3>

        <p className="mt-2 text-gray-600">
          NUSG has not been configured for this election yet.
        </p>

        <button
          onClick={createNusg}
          disabled={creating}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create NUSG"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Student Government
            </p>

            <h3 className="mt-1 text-2xl font-bold">
              {nusg.name}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Applies automatically to all students.
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
            Active
          </span>
        </div>
      </div>

      {/* Positions */}
<div className="rounded-xl border bg-white p-6">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold">
        Positions
      </h3>

      <p className="mt-1 text-sm text-gray-500">
        Manage the positions students will vote for.
      </p>
    </div>

    <button
      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
      onClick={() => {
        alert("Position editor coming next.");
      }}
    >
      + Add Position
    </button>
  </div>

  <div className="mt-6 space-y-3">
    {nusg.positions?.length > 0 ? (
      nusg.positions.map((position: any) => (
        <div
          key={position.id}
          className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
        >
          <div>
            <p className="font-medium">{position.name}</p>

            <p className="text-sm text-gray-500">
              Maximum votes: {position.maxVotes}
            </p>
          </div>

          <button
            className="rounded-lg border bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50"
            onClick={() => {
              alert(`Edit ${position.name} coming next.`);
            }}
          >
            Edit
          </button>
        </div>
      ))
    ) : (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-gray-500">
          No positions configured yet.
        </p>
      </div>
    )}
  </div>
</div>

      {/* Political Teams */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              Political Teams
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage political teams and independent candidates.
            </p>
          </div>

          <button
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium"
            onClick={() => {
              alert("Political team editor coming next.");
            }}
          >
            + Add Team
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-gray-500">
            No political teams configured yet.
          </p>
        </div>
      </div>
    </div>
  );
}
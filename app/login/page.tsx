"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail.endsWith("@students.nu-moa.edu.ph")) {
      alert("Please use your NU student email.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error ?? "Unable to log in.");
        setLoading(false);
        return;
      }

      router.push("/program");
    } catch {
      alert("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Student Login
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Use your NU student email to continue.
        </p>

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">
            Student Email
          </label>

          <input
            type="email"
            placeholder="yourname@students.nu-moa.edu.ph"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-700"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full rounded-lg bg-blue-900 py-3 font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Continue"}
        </button>
      </div>
    </main>
  );
}


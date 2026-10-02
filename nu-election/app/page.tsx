import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-blue-900">
            NU MOA Elections
          </h1>

          <Link
            href="/login"
            className="rounded-lg bg-blue-900 px-5 py-2 text-sm font-medium text-white hover:bg-blue-800"
          >
            Student Login
          </Link>
        </div>
      </nav>

      <section className="mx-auto flex min-h-[80vh] max-w-4xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-blue-700">
          National University - MOA
        </p>

        <h2 className="text-5xl font-bold tracking-tight text-gray-900">
          Student Elections
        </h2>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Exercise your right to vote and help choose the next generation
          of student leaders.
        </p>

        <Link
          href="/login"
          className="mt-8 rounded-xl bg-blue-900 px-8 py-4 font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >
          Vote Now
        </Link>
      </section>
    </main>
  );
}
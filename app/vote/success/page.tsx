export default function VoteSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="text-5xl">✓</div>

        <h1 className="mt-4 text-3xl font-bold">
          Vote Submitted
        </h1>

        <p className="mt-3 text-gray-600">
          Your vote has been successfully recorded.
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Thank you for participating in the NU MOA Student Election.
        </p>
      </div>
    </main>
  );
}
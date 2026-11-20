"use client";

export default function AdminError({ unstable_retry }: { unstable_retry: () => void }) {
  return (
    <div role="alert" className="m-6 rounded-xl border border-red-200 bg-white p-6 text-slate-900">
      <h1 className="text-xl font-semibold">Unable to load admin data</h1>
      <p className="mt-2">Check your connection and try again. If this continues, contact an administrator.</p>
      <button type="button" onClick={unstable_retry} className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-white">
        Try again
      </button>
    </div>
  );
}

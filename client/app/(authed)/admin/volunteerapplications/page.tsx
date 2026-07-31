import { signOut } from '@/lib/auth/actions';
import { VolunteerApplicationsTable } from "@/components/VolunteerApplicationsTable";

export default function VolunteerApplicationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">applications</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">Volunteer Applications</h1>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-500 hover:border-slate-300 hover:text-slate-900"
            >
              Sign out
            </button>
          </form>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <VolunteerApplicationsTable />
        </section>
      </div>
    </div>
  );
}

import { signOut } from '@/lib/auth/actions'
import KpiCards from '@/components/admin/KpiCards'
import { getHackerCheckboxCounts } from '@/lib/data/analytics'
import { AnalyticsGraph } from '@/components/admin/AnalyticGraph'

export default async function AdminPage() {
  const data = await getHackerCheckboxCounts()

  return (
    <div className="min-h-screen bg-slate-50 text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
              overview
            </p>

            <h1 className="mt-1 text-3xl font-semibold text-slate-900">
              Organizer Dashboard
            </h1>
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

        {/* KPI Cards */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <KpiCards />
        </section>

        {/* Analytics */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Detailed Statistics
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            <AnalyticsGraph
              title="Interested Tech Industries"
              data={data.interested_tech_industries}
            />

            <AnalyticsGraph
              title="Interested Technical Sessions"
              data={data.interested_technical_sessions}
            />

            <AnalyticsGraph
              title="Interested Career Sessions"
              data={data.interested_career_sessions}
            />

            <AnalyticsGraph
              title="Interested Community Sessions"
              data={data.interested_community_sessions}
            />

          </div>
        </section>

      </div>
    </div>
  )
}
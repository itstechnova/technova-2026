import { signOut } from '@/lib/auth/actions'
import { requireRole } from '@/lib/auth/dal'

export default async function AdminDashboard() {
  //Second layer of defense to prevent unauthorized users from accessing the admin dashboard
  await requireRole(['admin'])

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center text-3xl font-bold">Admin Dashboard</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}

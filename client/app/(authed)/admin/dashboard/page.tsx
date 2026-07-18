import { signOut } from '@/lib/auth/actions'

export default function Page() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen text-black">
      <h1 className="text-3xl font-bold">Organizer Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Welcome back! Here is your TechNova 2026 overview:
      </p>

      {/* Dashboard Content Container */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-500 italic">Dashboard components go here...</p>
      </div>

      <form action={signOut}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign out
          </button>
        </form>
    </div>

    
  );
}
import { signOut } from './actions'

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-center text-3xl font-bold">
          Welcome to the dashboard!
        </h1>
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
  );
}

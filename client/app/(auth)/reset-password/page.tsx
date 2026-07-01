'use client'

import { Suspense, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { updatePassword } from './actions'
import { SubmitButton } from '@/components/submit-button'

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}

function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Set a new password</h1>
        <p className="mb-6 text-sm text-gray-500">
          Choose a new password for your account.
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form action={updatePassword} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              New password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <SubmitButton
            label="Update password"
            pendingLabel="Updating..."
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </form>
      </div>
    </div>
  )
}

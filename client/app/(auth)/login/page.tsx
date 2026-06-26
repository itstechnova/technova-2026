'use client'

import { useState, useEffect, useActionState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { signInWithGoogle, authenticate } from './actions'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const searchParams = useSearchParams()
  const [state, formAction, isPending] = useActionState(authenticate, null)

  const urlError = searchParams.get('error')
  const urlMessage = searchParams.get('message')

  const error = state?.error || urlError
  const message = state?.message || urlMessage

  useEffect(() => {
    if (urlError || urlMessage) {
      // Clear the query parameters from the URL so they don't persist on refresh
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [urlError, urlMessage])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          {mode === 'signin' ? 'Login to TechNova!' : 'Create an account'}
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          {mode === 'signin'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="font-medium text-indigo-600 hover:underline"
          >
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error === 'auth' 
              ? 'Authentication failed. Please try again.' 
              : error === 'Invalid login credentials'
              ? 'Incorrect email or password. Please try again.'
              : error}
          </div>
        )}
        {message && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Continue with Google
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="mode" value={mode} />
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              {mode === 'signin' && (
                <a href="/forgot-password" className="text-sm font-medium text-indigo-600 hover:underline">
                  Forgot password?
                </a>
              )}
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
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
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? 'Please wait...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}

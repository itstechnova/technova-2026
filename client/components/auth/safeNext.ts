// Post-login destinations carried through the auth screens as `next`.
// Only same-site applicant paths are honoured, so `next` can never become an open redirect.

/** Where the signup form leaves the new account's email (and `next`) for /verify-email. */
export const SIGNUP_STORAGE_KEY = 'technova:signup'

type Options = {
  /**
   * Also accept an absolute http(s) URL and use only its path + query. For the email confirm link,
   * whose `next` is the full `emailRedirectTo` URL. The host is discarded, never redirected to.
   */
  allowAbsolute?: boolean
}

/** Returns `value` if it is a safe `/applicant/...` path, otherwise null. */
export function safeNextPath(value: unknown, { allowAbsolute = false }: Options = {}): string | null {
  if (typeof value !== 'string' || !value) return null

  let path = value
  if (allowAbsolute && /^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value)
      path = url.pathname + url.search
    } catch {
      return null
    }
  }

  if (!path.startsWith('/applicant/')) return null
  if (path.includes('//') || path.includes('\\') || path.includes('..')) return null
  // No control characters or whitespace (browsers strip some of them before resolving a URL).
  if (/[\u0000- \u007f]/.test(path)) return null
  return path
}

/** `/login` or `/signup` with a (validated) `next` carried along. */
export function withNext(pathname: string, next: string | null): string {
  return next ? `${pathname}?next=${encodeURIComponent(next)}` : pathname
}

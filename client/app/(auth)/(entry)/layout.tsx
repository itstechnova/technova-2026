import { LoginShell } from '@/components/auth/LoginShell'

// Login, signup and verify-email share this layout, so moving between them swaps only the form: the
// backdrop, planet scene, title and countdown stay mounted (and keep moving) instead of reloading.
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LoginShell>{children}</LoginShell>
}

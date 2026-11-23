# Supabase migrations

- `migrations/20261121000000_hacker_application_columns.sql`: adds the hacker application answer
  columns and `submitted_at` to `public.hacker`, plus an INSERT policy (own row only, `score` null).
  Additive and idempotent. Required by the application form.
- `migrations/20261121000100_tighten_application_rls.sql`: optional hardening. Replaces the open
  SELECT/UPDATE policies on `public.user` and `public.hacker` with own-row-or-admin rules and a
  trigger guarding `role`, `accepted`, etc. Read its header for what could break before applying.

Apply in filename order with `supabase db push` (linked project) or by pasting each file into the
dashboard SQL editor. Both can be re-run safely.

# Supabase migrations

- `migrations/20261121210631_hacker_application_columns.sql`: adds the hacker application answer
  columns and `submitted_at` to `public.hacker`, plus an INSERT policy (own row only, `score` null).
  Additive and idempotent. Required by the application form.
- `migrations/20261121210642_tighten_application_rls.sql`: optional hardening. Replaces the open
  SELECT/UPDATE policies on `public.user` and `public.hacker` with own-row-or-admin rules and a
  trigger guarding `role`, `accepted`, etc. Read its header for what could break before applying.
- `migrations/20261122000000_volunteer_application.sql`: adds the volunteer application answer
  columns and `submitted_at` to `public.volunteer`, own-row INSERT/SELECT policies (enables RLS on
  the table), and a private `resumes` Storage bucket (10 MB, PDF/DOCX) where each user can only
  upload/read/delete files in their own `<user id>/` folder; admins can read all. Required by the
  volunteer application.
- `migrations/20261122000100_tighten_volunteer_mentor_judge_rls.sql`: removes the open read/update
  policies on `public.volunteer` and `public.mentor` (anyone with the publishable key could read every row
  and edit any column, including `score`). After it: own row or admin can read, only admins can
  update. Anything using the publishable key without an admin session to read/update these tables
  must move to the secret key. Also re-keys the empty placeholder `public.judge` by the judge's user
  id (`judge_id`, plus `score`) with the same rules; it refuses to run if `judge` has rows.
- `migrations/20261122000200_mentor_application.sql`: adds the mentor application answer columns
  and `submitted_at` to `public.mentor`, plus an own-row INSERT policy (`score` null). Reuses the
  `resumes` bucket. Required by the mentor application.
- `migrations/20261122000300_judge_application.sql`: adds the judge application answer columns and
  `submitted_at` to `public.judge`, plus an own-row INSERT policy (`score` null). Needs the
  `judge_id` re-key from `20261122000100`. Reuses the `resumes` bucket. Required by the judge
  application.
- `migrations/20261122000400_application_age.sql`: adds `age smallint` to `public.volunteer`,
  `public.mentor` and `public.judge`. Required by the volunteer application (it asks for age).
- `migrations/20261122000500_drop_volunteer_legacy_columns.sql`: drops the unused placeholder
  columns `question_1` and `role_preference` from `public.volunteer` (their data is deleted; only a
  test row had any).

Apply in filename order with `supabase db push` (linked project) or by pasting each file into the
dashboard SQL editor. Both can be re-run safely.

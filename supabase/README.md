# Supabase migrations

- `migrations/20261121000000_hacker_application_columns.sql`: adds the hacker application answer
  columns and `submitted_at` to `public.hacker`, plus an INSERT policy (own row only, `score` null).
  Additive and idempotent. Required by the application form.
- `migrations/20261121000100_tighten_application_rls.sql`: optional hardening. Replaces the open
  SELECT/UPDATE policies on `public.user` and `public.hacker` with own-row-or-admin rules and a
  trigger guarding `role`, `accepted`, etc. Read its header for what could break before applying.

- `migrations/20261123000100_hacker_application_draft.sql`: adds `public.hacker_draft`, one jsonb row
  per user holding their unfinished application (own-row RLS only). The form saves to it when the
  applicant switches sections or saves and exits, and deletes it on submit. Additive and idempotent.
- `migrations/20261123000000_transportation_acknowledgement.sql`: adds `transportation_ack` to
  `public.hacker` for the "Getting to Waterloo" acknowledgement that replaced the transportation
  question. Additive and idempotent; the old `transportation` column is kept. Required by the
  application form.
- `migrations/20261123000200_country_of_residence.sql`: adds `country_of_residence` to
  `public.hacker`, one of the registration fields MLH requires. Additive and idempotent. Required by
  the application form.

Apply in filename order with `supabase db push` (linked project) or by pasting each file into the
dashboard SQL editor. Both can be re-run safely.

## Email templates

`email-templates/` holds the HTML saved in the Supabase dashboard (Authentication, Emails) for the
two auth emails Supabase sends itself: Confirm sign up and Reset password. The dashboard is what is
live; these files are the record of it.

They are rendered from `client/lib/resend/emails/confirm-signup.tsx` and `reset-password.tsx` with
Supabase's template variables in place of real values, so they match the emails the app sends
through Resend. After changing either component, render it again and paste the result into the
dashboard.

Both links go to `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=...`. That page only
verifies when its button is pressed, so a mail scanner opening the link does not use it up.
`{{ .SiteURL }}` is the project's Site URL, so the links always open on production, including for
accounts created on a preview or on localhost.

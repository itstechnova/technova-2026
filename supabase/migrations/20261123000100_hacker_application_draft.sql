-- Hacker application drafts, saved to the applicant's account.
--
-- Until now an unfinished application lived only in the browser's localStorage, so it did not
-- follow the applicant to another device or survive cleared site data. The form now also saves the
-- draft here when the applicant switches sections or saves and exits.
--
-- public.hacker stays "submitted applications only": a draft is one jsonb row per user in this
-- table, and it is deleted when the application is submitted.
--
-- Additive and idempotent. Nothing existing changes.

create table if not exists public.hacker_draft (
  user_id uuid primary key references public."user" (user_id) on update cascade on delete cascade,
  -- Answers keyed by question id (client/lib/application/forms/hacker.ts), same shape as the form's state.
  answers jsonb not null default '{}'::jsonb,
  -- Id of the step the applicant was on (a section id, or "review").
  step text not null default '',
  updated_at timestamptz not null default now(),
  constraint hacker_draft_answers_is_object check (jsonb_typeof(answers) = 'object'),
  -- A full application is a few kB; this only stops the row being used as free storage.
  constraint hacker_draft_size check (octet_length(answers::text) <= 100000 and char_length(step) <= 64)
);

alter table public.hacker_draft enable row level security;

revoke all on public.hacker_draft from anon;
grant select, insert, update, delete on public.hacker_draft to authenticated;

-- Applicants can only see and change their own draft. Admins get no access through the API:
-- unfinished answers are not applications.
drop policy if exists "Applicants can read own draft" on public.hacker_draft;
drop policy if exists "Applicants can create own draft" on public.hacker_draft;
drop policy if exists "Applicants can update own draft" on public.hacker_draft;
drop policy if exists "Applicants can delete own draft" on public.hacker_draft;

create policy "Applicants can read own draft"
  on public.hacker_draft for select to authenticated
  using (user_id = (select auth.uid()));

create policy "Applicants can create own draft"
  on public.hacker_draft for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "Applicants can update own draft"
  on public.hacker_draft for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Applicants can delete own draft"
  on public.hacker_draft for delete to authenticated
  using (user_id = (select auth.uid()));

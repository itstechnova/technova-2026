-- Volunteer application: answer columns, "insert/read my own application" policies, and a private
-- Storage bucket for resumes.
--
-- Additive and idempotent: only adds columns / policies / a bucket, never drops or rewrites data.
-- Column name == question id in client/lib/application/forms/volunteer.ts.
-- Left untouched (legacy / admin): question_1, role_preference, score.
-- Answers stored in public.user (first_name, last_name, pronouns, phone_number, shirt_size,
-- gender_identity) need no schema change.

alter table public.volunteer
  add column if not exists contact_email text,
  add column if not exists in_person text,                -- "Yes" | "No" | "Maybe"
  add column if not exists unavailable_times text[],      -- e.g. {"Sat 5 PM – 9 PM"}; empty/null = available throughout
  add column if not exists resume_path text,              -- object path in the "resumes" bucket
  add column if not exists volunteer_experience text,
  add column if not exists hackathon_experience text,     -- may be "Other: <text>"
  add column if not exists why_volunteer text,
  add column if not exists interested_areas text[],
  add column if not exists onboarding_session text,
  add column if not exists heard_from text,               -- may be "Other: <text>"
  add column if not exists additional_comments text,
  add column if not exists code_of_conduct boolean;

-- Submission timestamp. A volunteer row exists only once the application is submitted.
-- Added without a default first so existing rows keep NULL (unknown); new rows default to now().
alter table public.volunteer
  add column if not exists submitted_at timestamptz;
alter table public.volunteer
  alter column submitted_at set default now();

-- RLS is already enabled on public.volunteer (statement kept so this file stands alone). The table
-- also has two older open policies, "Enable read access for all users" (SELECT) and
-- "Enable Update Access" (UPDATE); 20261122000100_lock_down_volunteer_mentor_judge removes them.
alter table public.volunteer enable row level security;

-- INSERT: a signed-in user may create exactly their own row, and may not score themselves.
drop policy if exists "Applicants can insert own volunteer application" on public.volunteer;
create policy "Applicants can insert own volunteer application"
  on public.volunteer
  for insert
  to authenticated
  with check (
    volunteer_id = (select auth.uid())
    and score is null
  );

-- SELECT: own row (the portal shows the submitted answers), or any row for admins.
drop policy if exists "Volunteers read own row, admins read all" on public.volunteer;
create policy "Volunteers read own row, admins read all"
  on public.volunteer
  for select
  to authenticated
  using (
    volunteer_id = (select auth.uid())
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ---------------------------------------------------------------------------------------------
-- Resumes: private bucket, 10 MB, PDF / Word only. Objects live at `<user id>/<question id>/...`.
-- ---------------------------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'resumes',
  'resumes',
  false,
  10485760,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Applicants upload own resumes" on storage.objects;
create policy "Applicants upload own resumes"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Applicants read own resumes, admins read all" on storage.objects;
create policy "Applicants read own resumes, admins read all"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'resumes'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
    )
  );

-- Replacing or removing a resume before submitting deletes the old object.
drop policy if exists "Applicants delete own resumes" on storage.objects;
create policy "Applicants delete own resumes"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'resumes'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

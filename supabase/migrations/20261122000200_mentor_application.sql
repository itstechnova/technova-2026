-- Mentor application: answer columns and the "insert my own application" policy.
--
-- Additive and idempotent: only adds columns / one policy, never drops or rewrites data.
-- Column name == question id of the (upcoming) client/lib/application/forms/mentor.ts. Questions the
-- volunteer form also asks use the same column names as public.volunteer.
-- Left untouched (legacy / admin): organization, question_1, score.
-- Answers stored in public.user (first_name, last_name, pronouns, phone_number, shirt_size,
-- gender_identity) need no schema change.
-- SELECT (own row or admin) and UPDATE (admin only) come from 20261122000100_lock_down_volunteer_mentor_judge.
-- Resumes use the "resumes" bucket from 20261122000000_volunteer_application (own folder only).

alter table public.mentor
  add column if not exists contact_email text,
  add column if not exists in_person text,                -- "Yes" | "No" | "Maybe"
  add column if not exists unavailable_times text[],      -- e.g. {"Sat 5 PM – 9 PM"}; empty/null = available throughout
  add column if not exists resume_path text,              -- object path in the "resumes" bucket
  add column if not exists mentor_type text,              -- "I am an...": industry professional / upper-year student / "Other: <text>"
  add column if not exists hackathon_experience text,     -- "I have...": may be "Other: <text>"
  add column if not exists mentoring_experience text,
  add column if not exists mentoring_areas text[],        -- may include "Other: <text>"
  add column if not exists tech_stacks text,              -- languages, stacks or tools they want to mentor in
  add column if not exists other_roles text[],            -- workshop host, judge, ... (not binding)
  add column if not exists onboarding_session text,
  add column if not exists heard_from text,               -- may be "Other: <text>"
  add column if not exists volunteer_if_not_chosen text,  -- "Yes" | "No"
  add column if not exists links text,                    -- LinkedIn, portfolio, website, ...
  add column if not exists additional_comments text;

-- Submission timestamp. A mentor row exists only once the application is submitted.
-- Added without a default first so existing rows keep NULL (unknown); new rows default to now().
alter table public.mentor
  add column if not exists submitted_at timestamptz;
alter table public.mentor
  alter column submitted_at set default now();

-- INSERT: a signed-in user may create exactly their own row, and may not score themselves.
-- (mentor_id also has a gen_random_uuid() default; the check below means it must be set explicitly.)
drop policy if exists "Applicants can insert own mentor application" on public.mentor;
create policy "Applicants can insert own mentor application"
  on public.mentor
  for insert
  to authenticated
  with check (
    mentor_id = (select auth.uid())
    and score is null
  );

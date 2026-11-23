-- Judge application: answer columns and the "insert my own application" policy.
--
-- Additive and idempotent: only adds columns / one policy, never drops or rewrites data.
-- Column name == question id of the (upcoming) client/lib/application/forms/judge.ts. Questions the
-- volunteer/mentor forms also ask use the same column names as those tables.
-- Depends on 20261122000100_lock_down_volunteer_mentor_judge, which re-keys public.judge by
-- judge_id (-> user.user_id), adds score, and adds the SELECT (own row or admin) and UPDATE (admin
-- only) policies. Left untouched: created_at.
-- Answers stored in public.user (first_name, last_name, pronouns) need no schema change.
-- Resumes use the "resumes" bucket from 20261122000000_volunteer_application (own folder only).
-- "Send me a copy of my responses" is a Google Forms feature, not an answer, so it has no column.

alter table public.judge
  add column if not exists contact_email text,
  add column if not exists resume_path text,                 -- object path in the "resumes" bucket
  add column if not exists links text,                       -- LinkedIn, GitHub or portfolio
  add column if not exists in_person text,                   -- available in Waterloo Sun Jan 24, 11 AM – 5 PM: "Yes" | "No"
  add column if not exists role_and_organization text,       -- current role and company or school
  add column if not exists why_judge text,
  add column if not exists judging_experience text,          -- "Yes" | "No"
  add column if not exists judging_experience_details text,  -- events and role, if yes
  add column if not exists judging_areas text[],             -- may include "Other: <text>"
  add column if not exists standout_qualities text,          -- what makes a standout hackathon project
  add column if not exists constructive_feedback text,       -- feedback for a project that didn't work as planned
  add column if not exists briefing_session text,            -- "Yes" | "No" | "Maybe"
  add column if not exists code_of_conduct boolean,          -- MLH Code of Conduct, TechNova's values, judging fairly
  add column if not exists conflict_of_interest text,        -- "Yes (please explain below)" | "No"
  add column if not exists conflict_details text,
  add column if not exists heard_from text,                  -- optional; may be "Other: <text>"
  add column if not exists additional_comments text;

-- Submission timestamp, like the other application tables. A judge row exists only once the
-- application is submitted.
alter table public.judge
  add column if not exists submitted_at timestamptz;
alter table public.judge
  alter column submitted_at set default now();

-- INSERT: a signed-in user may create exactly their own row, and may not score themselves.
drop policy if exists "Applicants can insert own judge application" on public.judge;
create policy "Applicants can insert own judge application"
  on public.judge
  for insert
  to authenticated
  with check (
    judge_id = (select auth.uid())
    and score is null
  );

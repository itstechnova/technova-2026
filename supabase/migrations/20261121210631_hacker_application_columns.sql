-- Hacker application: answer columns + "insert my own application" policy.
--
-- Additive and idempotent: only adds columns / one policy, never drops or rewrites data.
-- Column name == question id in client/lib/application/forms/hacker.ts.
-- Reused as-is (already exist): school, major, interested_tech_industries,
-- interested_technical_sessions, interested_career_sessions, interested_community_sessions.
-- Left untouched (legacy / admin): question_1..3, year, resume_url, dietary_restrictions, score.
-- Answers stored in public.user (first_name, last_name, pronouns, phone_number, shirt_size,
-- gender_identity) need no schema change.

-- Welcome
alter table public.hacker
  add column if not exists contact_email text,
  add column if not exists age smallint;

-- General questions
alter table public.hacker
  add column if not exists transportation text,
  add column if not exists level_of_study text,
  add column if not exists graduation_year text,   -- text: may be "Other: <text>"; plain years are mirrored into "year"
  add column if not exists school_other text,
  add column if not exists hackathons_attended text,
  add column if not exists heard_from text[];

-- MLH requirements (consents)
alter table public.hacker
  add column if not exists mlh_code_of_conduct boolean,
  add column if not exists mlh_data_sharing boolean,
  add column if not exists mlh_emails boolean;

-- Short answer questions
alter table public.hacker
  add column if not exists why_attend text,
  add column if not exists prompt_choice text,      -- "a" | "b"
  add column if not exists prompt_a_response text,
  add column if not exists prompt_b_response text,
  add column if not exists superpower text,
  add column if not exists problem_solving text;

-- Event-specific questions (the other four interested_* arrays already exist)
alter table public.hacker
  add column if not exists interested_themed_sessions text[],
  add column if not exists interested_fields text[],
  add column if not exists other_sessions text;

-- Women+ in Tech (all optional)
alter table public.hacker
  add column if not exists wit_meaning text,
  add column if not exists wit_community text,
  add column if not exists wit_experience text,
  add column if not exists wit_inspiration text,
  add column if not exists wit_understanding text,
  add column if not exists wit_change text,
  add column if not exists wit_advice text,
  add column if not exists wit_future text;

-- Demographic questions (gender_identity itself lives on public.user)
alter table public.hacker
  add column if not exists ethnicity text[],
  add column if not exists gender_identity_other text,
  add column if not exists identity_categories text[],
  add column if not exists first_in_family_tech text,
  add column if not exists tech_experience text;

-- Final acknowledgment (consent)
alter table public.hacker
  add column if not exists final_acknowledgment boolean;

-- Submission timestamp. A hacker row exists only once the application is submitted.
-- Added without a default first so the rows that already exist keep NULL (unknown) instead of
-- being stamped with the time this migration ran; new rows default to now().
alter table public.hacker
  add column if not exists submitted_at timestamptz;
alter table public.hacker
  alter column submitted_at set default now();

-- INSERT policy: a signed-in user may create exactly their own row, and may not score themselves.
-- (There was no insert policy before, so inserts through the API were impossible.)
drop policy if exists "Applicants can insert own application" on public.hacker;
create policy "Applicants can insert own application"
  on public.hacker
  for insert
  to authenticated
  with check (
    hacker_id = (select auth.uid())
    and score is null
  );

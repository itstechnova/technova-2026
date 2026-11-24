-- Resume on the applicant's profile.
--
-- The hacker application now asks for a resume (question id `resume_path` in
-- client/lib/application/forms/shared.ts), and Profile & settings lets a hacker add or replace it
-- at any time, including after submitting. So it lives on public.user with the other profile
-- details, not on public.hacker (a row applicants cannot change once it exists; its legacy
-- `resume_url` column stays unused).
--
-- The value is the file's path in the private `resumes` Storage bucket:
-- `<user id>/resume_path/<timestamp>-<file name>`. The bucket's policies already keep applicants
-- to their own `<user id>/` folder; the check below does the same for the path on their row, so a
-- row can never point at someone else's file.
--
-- Additive and idempotent. Existing accounts have no resume (null), and the column stays nullable:
-- the form requires a resume to submit, but applications sent before it asked for one have none.
-- Apply this BEFORE deploying the form change: the application reads this column.

alter table public."user"
  add column if not exists resume_path text;

alter table public."user"
  drop constraint if exists user_resume_path_own_folder;

alter table public."user"
  add constraint user_resume_path_own_folder
  check (resume_path is null or starts_with(resume_path, user_id::text || '/resume_path/'));

-- Tighten rls of public.volunteer, public.mentor and public.judge, the same way 20261121210642_tighten_application_rls
-- did for public.user and public.hacker.
--
-- Before: volunteer and mentor had `SELECT using (true)` and `UPDATE using (true) with check (true)`
-- for the `public` role, so anyone holding the publishable key (signed in or not) could read every
-- row and change any column of any row, including score. judge was an empty placeholder
-- (id bigint, created_at) with RLS on but no policies or grants: unreachable through the API, and
-- with no link to a user.
--
-- After:
--   public.volunteer  SELECT  own row, or admin   (policy from 20261122000000_volunteer_application)
--                     INSERT  own row, score null (policy from 20261122000000_volunteer_application)
--                     UPDATE  admin only (scoring; applicants cannot edit after submitting)
--   public.mentor     SELECT  own row, or admin
--                     UPDATE  admin only
--                     INSERT  own row, score null (20261122000200_mentor_application)
--   public.judge      reshaped like mentor/volunteer: judge_id uuid (PK, -> user.user_id), score,
--                     created_at. SELECT own row or admin; UPDATE admin only; INSERT own row,
--                     score null (20261122000300_judge_application).
--   "admin" = auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'. New policies apply to `authenticated` only.
--
-- What could break: anything reading or updating these tables with the publishable key and no admin
-- session (scripts, bots, spreadsheets). Move those to the secret key, which bypasses RLS.
-- The service role, SQL editor and dashboard are not affected by RLS.

-- ---------------------------------------------------------------------------------------------
-- public.volunteer
-- ---------------------------------------------------------------------------------------------
drop policy if exists "Enable read access for all users" on public.volunteer;
drop policy if exists "Enable Update Access" on public.volunteer;

drop policy if exists "Admins can update volunteer applications" on public.volunteer;
create policy "Admins can update volunteer applications"
  on public.volunteer
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- ---------------------------------------------------------------------------------------------
-- public.mentor
-- ---------------------------------------------------------------------------------------------
alter table public.mentor enable row level security;

drop policy if exists "Enable read access for all users" on public.mentor;
drop policy if exists "Enable Update Access" on public.mentor;

drop policy if exists "Mentors read own row, admins read all" on public.mentor;
create policy "Mentors read own row, admins read all"
  on public.mentor
  for select
  to authenticated
  using (
    mentor_id = (select auth.uid())
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins can update mentor applications" on public.mentor;
create policy "Admins can update mentor applications"
  on public.mentor
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- ---------------------------------------------------------------------------------------------
-- public.judge
-- ---------------------------------------------------------------------------------------------
-- Re-keyed by the judge's user id, like hacker/volunteer/mentor. Only safe while the table is
-- empty (it was when this was written), so stop instead of discarding rows.
do $$
begin
  if exists (select 1 from public.judge) then
    raise exception 'public.judge has rows; re-key it by hand instead of running this migration';
  end if;
end
$$;

alter table public.judge drop constraint if exists judge_pkey;
alter table public.judge drop column if exists id;
alter table public.judge
  add column if not exists judge_id uuid not null references public."user"(user_id),
  add column if not exists score smallint;
alter table public.judge drop constraint if exists judge_pkey;
alter table public.judge add constraint judge_pkey primary key (judge_id);

alter table public.judge enable row level security;

-- The table had no API grants at all. Grant the usual ones; the policies below decide which rows.
grant select, insert, update on public.judge to authenticated;

drop policy if exists "Judges read own row, admins read all" on public.judge;
create policy "Judges read own row, admins read all"
  on public.judge
  for select
  to authenticated
  using (
    judge_id = (select auth.uid())
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

drop policy if exists "Admins can update judge applications" on public.judge;
create policy "Admins can update judge applications"
  on public.judge
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

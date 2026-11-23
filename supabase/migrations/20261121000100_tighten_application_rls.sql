-- OPTIONAL hardening: tighten RLS on public.user and public.hacker.
-- Independent of 20261121000000 except that it leaves that migration's INSERT policy in place.
--
-- Before: both tables had `SELECT using (true)` and `UPDATE using (true) with check (true)` for
-- every role, so anyone holding the publishable key (i.e. anyone, signed in or not) could read
-- every applicant's row and update any row, including role / accepted / score.
--
-- After:
--   public.user    SELECT  own row, or admin
--                  UPDATE  own row, or admin; a trigger stops non-admins from changing
--                          role, accepted, account_status, qr_token, email_status, email_date, user_id
--   public.hacker  SELECT  own row, or admin
--                  UPDATE  admin only (applicants cannot edit after submitting or set score)
--                  INSERT  unchanged (own row, score null - from the previous migration)
--   "admin" = auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'. Policies apply to `authenticated` only.
--
-- What could break:
--   * Anything reading or updating these tables anonymously or across users with the publishable
--     key: e.g. a Discord bot, a QR check-in scanner, scripts. Move those to the service-role key
--     (bypasses RLS and the trigger) or sign them in as an admin.
--   * A role change only reaches RLS once the user's JWT is refreshed (app_metadata is read from the token).
--   * Non-admin app code that writes a protected column on its own user row (e.g. a client
--     generating its own qr_token) will now get an error from the trigger.
--   * Updates with no end-user JWT (service role, SQL editor, auth triggers) are not restricted.

-- ---------------------------------------------------------------------------------------------
-- public.user policies
-- ---------------------------------------------------------------------------------------------
drop policy if exists "Enable read access for all users" on public."user";
drop policy if exists "Update Access" on public."user";
drop policy if exists "Users can read own row, admins read all" on public."user";
drop policy if exists "Users can update own row, admins update all" on public."user";

create policy "Users can read own row, admins read all"
  on public."user"
  for select
  to authenticated
  using (
    user_id = (select auth.uid())
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Users can update own row, admins update all"
  on public."user"
  for update
  to authenticated
  using (
    user_id = (select auth.uid())
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    user_id = (select auth.uid())
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ---------------------------------------------------------------------------------------------
-- public.user column guard: RLS cannot restrict columns, so a trigger does.
-- ---------------------------------------------------------------------------------------------
create or replace function public.user_guard_protected_columns()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  claims jsonb := auth.jwt();
begin
  -- No end-user JWT: SQL editor, migrations, auth (GoTrue) triggers, cron. Service-role API calls
  -- carry a JWT whose role is service_role. Let all of those through.
  if claims is null or (claims ->> 'role') is distinct from 'authenticated' then
    return new;
  end if;

  -- Admins may change anything.
  if (claims -> 'app_metadata' ->> 'role') = 'admin' then
    return new;
  end if;

  if new.user_id        is distinct from old.user_id
     or new.role           is distinct from old.role
     or new.accepted       is distinct from old.accepted
     or new.account_status is distinct from old.account_status
     or new.qr_token       is distinct from old.qr_token
     or new.email_status   is distinct from old.email_status
     or new.email_date     is distinct from old.email_date
  then
    raise exception 'Not allowed to change protected columns on public.user'
      using errcode = '42501'; -- insufficient_privilege
  end if;

  return new;
end;
$$;

drop trigger if exists user_guard_protected_columns on public."user";
create trigger user_guard_protected_columns
  before update on public."user"
  for each row
  execute function public.user_guard_protected_columns();

-- ---------------------------------------------------------------------------------------------
-- public.hacker policies
-- ---------------------------------------------------------------------------------------------
drop policy if exists "Enable read access for all users" on public.hacker;
drop policy if exists "Enable update access for all users" on public.hacker;
drop policy if exists "Hackers can read own application, admins read all" on public.hacker;
drop policy if exists "Admins can update applications" on public.hacker;

create policy "Hackers can read own application, admins read all"
  on public.hacker
  for select
  to authenticated
  using (
    hacker_id = (select auth.uid())
    or ((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin'
  );

create policy "Admins can update applications"
  on public.hacker
  for update
  to authenticated
  using (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin')
  with check (((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin');

-- Age (as of Jan 22, 2027, the event start) on the volunteer, mentor and judge applications, like
-- public.hacker.age. Column name == the shared `age` question id in client/lib/application/forms/shared.ts.
-- Additive and idempotent.

alter table public.volunteer add column if not exists age smallint;
alter table public.mentor    add column if not exists age smallint;
alter table public.judge     add column if not exists age smallint;

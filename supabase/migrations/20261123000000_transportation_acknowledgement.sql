-- Hacker application: "Getting to Waterloo" acknowledgement.
--
-- The application no longer asks where applicants need transportation from. It asks them to
-- acknowledge that TechNova does not provide transportation (question id `transportation_ack` in
-- client/lib/application/forms/hacker.ts).
--
-- Additive and idempotent. The old `transportation` text column is left in place: it still holds
-- answers from applications submitted before this change, and nothing writes to it any more.
-- Apply this BEFORE deploying the form change: submitting inserts into this column.

alter table public.hacker
  add column if not exists transportation_ack boolean;

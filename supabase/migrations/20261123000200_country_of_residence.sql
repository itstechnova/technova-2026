-- Hacker application: country of residence.
--
-- MLH requires member events to collect each registrant's country of residence (question id
-- `country_of_residence` in client/lib/application/forms/hacker.ts). The answer is the country's
-- name as shown in the form's list.
--
-- Additive and idempotent. Applications submitted before this change have no answer (null).
-- Apply this BEFORE deploying the form change: submitting inserts into this column.

alter table public.hacker
  add column if not exists country_of_residence text;

-- ScanMap baseline schema for Supabase/Postgres
-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'draft' check (status in ('active', 'paused', 'archived', 'draft')),
  total_pins integer not null default 0,
  total_scans integer not null default 0,
  avg_conversion numeric(5,2) not null default 0,
  pins jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  last_active timestamptz not null default now()
);

create index if not exists campaigns_user_id_idx on public.campaigns(user_id);
create index if not exists campaigns_user_id_last_active_idx on public.campaigns(user_id, last_active desc);

alter table public.campaigns enable row level security;

drop policy if exists "campaigns_select_own" on public.campaigns;
create policy "campaigns_select_own"
on public.campaigns
for select
using (auth.uid() = user_id);

drop policy if exists "campaigns_insert_own" on public.campaigns;
create policy "campaigns_insert_own"
on public.campaigns
for insert
with check (auth.uid() = user_id);

drop policy if exists "campaigns_update_own" on public.campaigns;
create policy "campaigns_update_own"
on public.campaigns
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "campaigns_delete_own" on public.campaigns;
create policy "campaigns_delete_own"
on public.campaigns
for delete
using (auth.uid() = user_id);

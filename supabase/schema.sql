create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  device_id text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.passes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  bar_day_date date not null,
  status text not null default 'active' check (status in ('active', 'redeemed')),
  redeemed_at timestamptz,
  redeemed_by uuid references public.users(id),
  created_at timestamptz not null default now(),
  unique (user_id, bar_day_date)
);

create index if not exists passes_bar_day_idx on public.passes (bar_day_date, status);

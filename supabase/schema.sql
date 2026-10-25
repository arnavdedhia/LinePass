-- Safe to run more than once, including on top of the users/passes tables created by hand.
create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  name text not null,
  device_token_hash text,
  active boolean not null default true
);

alter table public.users
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  address text not null,
  image_url text,
  logo_url text,
  hours_label text,
  created_at timestamptz not null default now()
);

-- weekday follows JavaScript's Date.getDay(): 0 = Sunday ... 6 = Saturday.
create table if not exists public.cover_options (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid not null references public.venues(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  title text not null,
  price_cents integer not null check (price_cents >= 0),
  created_at timestamptz not null default now()
);

-- A venue can offer several covers on the same night, but not the same title twice.
alter table public.cover_options drop constraint if exists cover_options_venue_id_weekday_key;
create unique index if not exists cover_options_venue_weekday_title_key
  on public.cover_options (venue_id, weekday, title);

-- One pass per user per bar day; redeemed_at stays null until door staff redeem it.
create table if not exists public.passes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  bar_day date not null,
  redeemed_at timestamptz,
  unique (user_id, bar_day)
);

alter table public.passes
  add column if not exists venue_id uuid references public.venues(id),
  add column if not exists title text,
  add column if not exists price_cents integer check (price_cents >= 0),
  add column if not exists redeemed_by uuid references public.users(id),
  add column if not exists created_at timestamptz not null default now();

create index if not exists passes_bar_day_idx on public.passes (bar_day);

-- The server uses the service-role key, which bypasses RLS; enabling it keeps the
-- tables closed to anyone holding only the public anon key.
alter table public.users enable row level security;
alter table public.venues enable row level security;
alter table public.cover_options enable row level security;
alter table public.passes enable row level security;

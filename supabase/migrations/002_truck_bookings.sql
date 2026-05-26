-- Reference only — table already exists in production. Safe to run (IF NOT EXISTS).
create table if not exists truck_bookings (
  id                   uuid primary key default gen_random_uuid(),
  reference            text unique not null,
  contact_name         text not null,
  contact_phone        text not null,
  pickup_address       text not null,
  pickup_lat           double precision not null,
  pickup_lng           double precision not null,
  delivery_address     text not null,
  delivery_lat         double precision not null,
  delivery_lng         double precision not null,
  material             text not null,
  material_other       text,
  quantity_trucks      integer not null,
  preferred_date       date not null,
  preferred_time_window text not null,           -- 'morning' | 'evening'
  notes                text,
  quoted_price         numeric not null,
  distance_km          numeric not null,
  status               text not null default 'pending',
  assigned_driver      text,
  shipday_order_id     text,
  created_at           timestamptz default now()
);

-- Idempotent backfill for existing rows missing reference
update truck_bookings set reference = 'PKS-T-' || floor(extract(epoch from created_at) * 1000)::text
  where reference is null;

alter table truck_bookings enable row level security;

create policy "anon insert only" on truck_bookings
  for insert to anon with check (true);

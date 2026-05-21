-- Reference only — table already exists in production. Safe to run (IF NOT EXISTS + ADD COLUMN IF NOT EXISTS).
create table if not exists parcels_bookings (
  id                  uuid primary key default gen_random_uuid(),
  reference           text unique not null,
  sender_name         text not null,
  sender_phone        text not null,
  receiver_name       text not null,
  receiver_phone      text not null,
  pickup_address      text not null,
  pickup_lat          double precision not null,
  pickup_lng          double precision not null,
  pickup_notes        text,
  dropoff_address     text not null,
  dropoff_lat         double precision not null,
  dropoff_lng         double precision not null,
  dropoff_notes       text,
  item_description    text not null,
  fragility           text not null,
  estimated_value     numeric,
  timing              text not null,
  vehicle_type        text not null default 'boda',
  preferred_date      date,
  preferred_run       text,
  additional_notes    text,
  quoted_price        numeric not null,
  distance_km         numeric not null,
  status              text not null default 'pending',
  shipday_order_id    text,
  delivery_photo_url  text,
  assigned_driver     text,
  created_at          timestamptz default now()
);

-- Idempotent backfill for existing rows missing reference
update parcels_bookings set reference = 'PKS-P-' || floor(extract(epoch from created_at) * 1000)::text
  where reference is null;

alter table parcels_bookings enable row level security;

create policy "anon insert only" on parcels_bookings
  for insert to anon with check (true);

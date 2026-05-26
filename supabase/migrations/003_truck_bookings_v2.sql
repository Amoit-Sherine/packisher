-- Migration 003: extend truck_bookings for multi-service inquiry flow
-- Adds new columns and relaxes NOT NULL constraints so both
-- material_delivery and move_goods service types can be stored.

-- New columns
ALTER TABLE truck_bookings
  ADD COLUMN IF NOT EXISTS service_type    text NOT NULL DEFAULT 'material_delivery',
  ADD COLUMN IF NOT EXISTS contact_email   text,
  ADD COLUMN IF NOT EXISTS goods_type      text,
  ADD COLUMN IF NOT EXISTS goods_other     text,
  ADD COLUMN IF NOT EXISTS pickup_notes    text,
  ADD COLUMN IF NOT EXISTS delivery_notes  text;

-- Relax constraints that do not apply to all service types
ALTER TABLE truck_bookings
  ALTER COLUMN pickup_address    DROP NOT NULL,
  ALTER COLUMN pickup_lat        DROP NOT NULL,
  ALTER COLUMN pickup_lng        DROP NOT NULL,
  ALTER COLUMN delivery_address  DROP NOT NULL,
  ALTER COLUMN delivery_lat      DROP NOT NULL,
  ALTER COLUMN delivery_lng      DROP NOT NULL,
  ALTER COLUMN material          DROP NOT NULL,
  ALTER COLUMN quoted_price      DROP NOT NULL,
  ALTER COLUMN distance_km       DROP NOT NULL;

-- Allow the new pending_quote status alongside legacy values
-- (no enum constraint exists, so no action needed for status column)

-- Backfill service_type for existing rows
UPDATE truck_bookings SET service_type = 'material_delivery' WHERE service_type IS NULL;

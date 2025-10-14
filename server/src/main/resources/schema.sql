CREATE UNIQUE INDEX idx_unique_bar_happy_drink
ON price (bar_id, COALESCE(happy_hour_id, -1), drink_id);

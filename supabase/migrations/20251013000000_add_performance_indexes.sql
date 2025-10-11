-- ============================================================================
-- PERFORMANCE INDEXES
-- Add missing indexes for frequently filtered fields and common query patterns
-- ============================================================================

-- ============================================================================
-- Events Table Indexes
-- ============================================================================

-- Index for eco_conscious filtering (used in filters)
CREATE INDEX IF NOT EXISTS idx_events_eco_conscious
  ON events(eco_conscious)
  WHERE eco_conscious = true;

-- Index for featured events
CREATE INDEX IF NOT EXISTS idx_events_featured
  ON events(featured)
  WHERE featured = true;

-- Composite index for most common query pattern:
-- WHERE city_id = X AND date >= Y AND hidden_by_reports = false
CREATE INDEX IF NOT EXISTS idx_events_city_date_hidden
  ON events(city_id, date, hidden_by_reports);

-- Composite index for filtered queries with eco_conscious
CREATE INDEX IF NOT EXISTS idx_events_city_date_eco
  ON events(city_id, date, eco_conscious, hidden_by_reports)
  WHERE eco_conscious = true;

-- ============================================================================
-- Places Table Indexes
-- ============================================================================

-- Index for verified filtering (CRITICAL - currently missing!)
CREATE INDEX IF NOT EXISTS idx_places_verified
  ON places(verified)
  WHERE verified = true;

-- Index for featured places
CREATE INDEX IF NOT EXISTS idx_places_featured
  ON places(featured)
  WHERE featured = true;

-- Composite index for most common query pattern:
-- WHERE city_id = X AND type = Y AND hidden_by_reports = false
CREATE INDEX IF NOT EXISTS idx_places_city_type_hidden
  ON places(city_id, type, hidden_by_reports);

-- Composite index for filtered queries with verified
CREATE INDEX IF NOT EXISTS idx_places_city_verified
  ON places(city_id, verified, hidden_by_reports)
  WHERE verified = true;

-- Composite index for eco-conscious places filtering
CREATE INDEX IF NOT EXISTS idx_places_city_eco
  ON places(city_id, eco_conscious, hidden_by_reports)
  WHERE eco_conscious = true;

-- ============================================================================
-- Notes:
-- - Partial indexes (WHERE clause) are smaller and faster for selective queries
-- - Composite indexes match the exact query patterns in useEventsQuery/usePlacesQuery
-- - All indexes use IF NOT EXISTS for safe re-running
-- ============================================================================

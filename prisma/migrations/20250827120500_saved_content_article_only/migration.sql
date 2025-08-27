-- Remove non-article saved content and enforce article-only constraint
DELETE FROM neon_auth.saved_content WHERE content_type IS DISTINCT FROM 'article';

DO $$
BEGIN
  ALTER TABLE neon_auth.saved_content
  ADD CONSTRAINT saved_content_article_only CHECK (content_type = 'article');
EXCEPTION WHEN duplicate_object THEN
  -- constraint already exists
  NULL;
END $$;

-- Ensure uniqueness still applies
CREATE UNIQUE INDEX IF NOT EXISTS saved_content_unique
  ON neon_auth.saved_content (user_id, content_id, content_type);
-- Add parent_id for threaded comments and an index
ALTER TABLE neon_auth.comments
ADD COLUMN IF NOT EXISTS parent_id integer REFERENCES neon_auth.comments(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_comments_article_parent ON neon_auth.comments (article_id, parent_id, created_at DESC);
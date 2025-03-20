-- Create comments table
CREATE TABLE IF NOT EXISTS "neon_auth"."comments" (
    "id" SERIAL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY ("user_id") REFERENCES "neon_auth"."users_sync"("id")
);

-- Create an index for faster comment retrieval by article
CREATE INDEX IF NOT EXISTS "comments_article_id_idx" ON "neon_auth"."comments" ("article_id");

-- Create an index for user's comments
CREATE INDEX IF NOT EXISTS "comments_user_id_idx" ON "neon_auth"."comments" ("user_id");

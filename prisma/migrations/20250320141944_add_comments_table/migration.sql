-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "neon_auth";

-- CreateTable
CREATE TABLE "neon_auth"."users_sync" (
    "id" TEXT NOT NULL,
    "raw_json" JSONB,
    "name" TEXT,
    "email" TEXT,
    "created_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "users_sync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neon_auth"."user_profile" (
    "user_id" TEXT NOT NULL,
    "name" TEXT,
    "last_name" TEXT,
    "bio" TEXT,
    "profile_picture_url" TEXT,
    "location" TEXT,
    "website" TEXT,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "neon_auth"."saved_content" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "content_id" TEXT,
    "content_type" TEXT,
    "saved_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "neon_auth"."comments" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "saved_content_user_id_content_id_content_type_key" ON "neon_auth"."saved_content"("user_id", "content_id", "content_type");

-- AddForeignKey
ALTER TABLE "neon_auth"."user_profile" ADD CONSTRAINT "user_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neon_auth"."saved_content" ADD CONSTRAINT "saved_content_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "neon_auth"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "neon_auth"."users_sync"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

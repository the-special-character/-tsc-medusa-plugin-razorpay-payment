import { Migration } from '@mikro-orm/migrations';

export class Migration20250228121446 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "seo_details" ("id" text not null, "metaTitle" text null, "metaDescription" text null, "metaImage" text null, "keywords" text null, "metaRobots" text null, "structuredData" jsonb null, "feedData" jsonb null, "metaViewport" text null, "canonicalURL" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "seo_details_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_seo_details_deleted_at" ON "seo_details" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "seo_social" ("id" text not null, "title" text null, "description" text null, "image" text null, "socialNetwork" text check ("socialNetwork" in ('Facebook', 'Twitter', 'Instagram')) not null, "seo_details_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "seo_social_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_seo_social_seo_details_id" ON "seo_social" (seo_details_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_seo_social_deleted_at" ON "seo_social" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "seo_social" add constraint "seo_social_seo_details_id_foreign" foreign key ("seo_details_id") references "seo_details" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "seo_social" drop constraint if exists "seo_social_seo_details_id_foreign";`);

    this.addSql(`drop table if exists "seo_details" cascade;`);

    this.addSql(`drop table if exists "seo_social" cascade;`);
  }

}

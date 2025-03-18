import { Migration } from '@mikro-orm/migrations';

export class Migration20250305065320 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "faq_category" drop constraint if exists "faq_category_handle_unique";`);
    this.addSql(`create table if not exists "faq_category" ("id" text not null, "title" text not null, "description" text null, "metadata" jsonb null, "handle" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "faq_category_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_faq_category_handle_unique" ON "faq_category" (handle) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_faq_category_deleted_at" ON "faq_category" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "faq" ("id" text not null, "title" text not null, "content" text null, "type" text null, "by_admin" boolean not null default false, "display_status" text check ("display_status" in ('published', 'draft')) not null default 'draft', "email" text not null, "customer_name" text null, "metadata" jsonb null, "category_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "faq_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_faq_category_id" ON "faq" (category_id) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_faq_deleted_at" ON "faq" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "faq" add constraint "faq_category_id_foreign" foreign key ("category_id") references "faq_category" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "faq" drop constraint if exists "faq_category_id_foreign";`);

    this.addSql(`drop table if exists "faq_category" cascade;`);

    this.addSql(`drop table if exists "faq" cascade;`);
  }

}

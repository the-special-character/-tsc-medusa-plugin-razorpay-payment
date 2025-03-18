import { Migration } from '@mikro-orm/migrations';

export class Migration20250305071941 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "variant_images" ("id" text not null, "thumbnail" text null, "images" text[] null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "variant_images_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_variant_images_deleted_at" ON "variant_images" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "variant_images" cascade;`);
  }

}

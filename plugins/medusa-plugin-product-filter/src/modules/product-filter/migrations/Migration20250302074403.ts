import { Migration } from '@mikro-orm/migrations';

export class Migration20250302074403 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "product_filter" ("id" text not null, "name" text not null, "value" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "product_filter_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_filter_name" ON "product_filter" (name) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_filter_value" ON "product_filter" (value) WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_product_filter_deleted_at" ON "product_filter" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "product_filter" cascade;`);
  }

}

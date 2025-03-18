import { Migration } from '@mikro-orm/migrations';

export class Migration20241217074718 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "additional_details" ("id" text not null, "additional_description" text null, "additional_details_title" text null, "additional_details_content" text null, "grid_view" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "additional_details_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_additional_details_deleted_at" ON "additional_details" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "additional_details" cascade;');
  }

}

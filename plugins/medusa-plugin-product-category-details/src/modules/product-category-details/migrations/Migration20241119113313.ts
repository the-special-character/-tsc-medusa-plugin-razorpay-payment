import { Migration } from '@mikro-orm/migrations';

export class Migration20241119113313 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "category_details" ("id" text not null, "thumbnail" text null, "product_aspect_ratio" text null, "product_bg_color" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "category_details_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "category_details" cascade;');
  }

}

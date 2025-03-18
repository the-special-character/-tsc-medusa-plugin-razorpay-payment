import { Migration } from '@mikro-orm/migrations';

export class Migration20241203085037 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "category_details" add column if not exists "media" text[] null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "category_details" drop column if exists "media";');
  }

}

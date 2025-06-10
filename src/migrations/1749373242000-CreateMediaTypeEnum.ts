import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMediaTypeEnum1710936000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."medias_type_enum" AS ENUM('image', 'video');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."medias_type_enum";`);
  }
} 
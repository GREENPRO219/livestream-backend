import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateLikesTable1749405494929 implements MigrationInterface {
    name = 'UpdateLikesTable1749405494929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop default before changing enum type
        await queryRunner.query(`ALTER TABLE "likes" ALTER COLUMN "content_type" DROP DEFAULT`);
        // Update enum type for content_type
        await queryRunner.query(`ALTER TYPE "likes_content_type_enum" RENAME TO "likes_content_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "likes_content_type_enum" AS ENUM ('Room', 'Media')`);
        await queryRunner.query(`ALTER TABLE "likes" ALTER COLUMN "content_type" TYPE "likes_content_type_enum" USING "content_type"::text::"likes_content_type_enum"`);
        await queryRunner.query(`DROP TYPE "likes_content_type_enum_old"`);
        // Set default again
        await queryRunner.query(`ALTER TABLE "likes" ALTER COLUMN "content_type" SET DEFAULT 'Media'`);

        // Add new columns
        await queryRunner.query(`ALTER TABLE "likes" ADD "room_id" character varying`);
        await queryRunner.query(`ALTER TABLE "likes" ADD "media_id" character varying`);

        // Migrate existing data
        await queryRunner.query(`
            UPDATE "likes"
            SET 
                room_id = CASE WHEN content_type = 'Room' THEN content_id ELSE NULL END,
                media_id = CASE WHEN content_type = 'Media' THEN content_id ELSE NULL END
        `);

        // Drop the old content_id column
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "content_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Add back the content_id column
        await queryRunner.query(`ALTER TABLE "likes" ADD "content_id" character varying NOT NULL`);

        // Migrate data back
        await queryRunner.query(`
            UPDATE "likes"
            SET content_id = COALESCE(room_id, media_id)
        `);

        // Drop the new columns
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "room_id"`);
        await queryRunner.query(`ALTER TABLE "likes" DROP COLUMN "media_id"`);

        // Drop default before reverting enum type
        await queryRunner.query(`ALTER TABLE "likes" ALTER COLUMN "content_type" DROP DEFAULT`);
        // Revert enum type for content_type (if needed, you may want to adjust this to your original values)
        await queryRunner.query(`ALTER TYPE "likes_content_type_enum" RENAME TO "likes_content_type_enum_new"`);
        await queryRunner.query(`CREATE TYPE "likes_content_type_enum" AS ENUM ('Room', 'Media')`); // Adjust if your original values were different
        await queryRunner.query(`ALTER TABLE "likes" ALTER COLUMN "content_type" TYPE "likes_content_type_enum" USING "content_type"::text::"likes_content_type_enum"`);
        await queryRunner.query(`DROP TYPE "likes_content_type_enum_new"`);
        // Set default again
        await queryRunner.query(`ALTER TABLE "likes" ALTER COLUMN "content_type" SET DEFAULT 'Media'`);
    }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFavoritesTable1749417525061 implements MigrationInterface {
    name = 'UpdateFavoritesTable1749417525061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop default before changing enum type
        await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "content_type" DROP DEFAULT`);
        
        // Update enum type for content_type
        // await queryRunner.query(`ALTER TYPE "favorites_content_type_enum" RENAME TO "favorites_content_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "favorites_content_type_enum" AS ENUM ('Room', 'Media')`);
        await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "content_type" TYPE "favorites_content_type_enum" USING CASE WHEN content_type = 'Video' THEN 'Media'::text ELSE content_type::text END::"favorites_content_type_enum"`);
        // await queryRunner.query(`DROP TYPE "favorites_content_type_enum_old"`);
        
        // Set default again
        await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "content_type" SET DEFAULT 'Media'`);

        // Add new columns
        await queryRunner.query(`ALTER TABLE "favorites" ADD "room_id" uuid`);
        await queryRunner.query(`ALTER TABLE "favorites" ADD "media_id" uuid`);

        // Migrate existing data
        await queryRunner.query(`
            UPDATE "favorites"
            SET 
                room_id = CASE WHEN content_type = 'Room' THEN content_id::uuid ELSE NULL END,
                media_id = CASE WHEN content_type = 'Media' THEN content_id::uuid ELSE NULL END
        `);

        // Drop the old content_id column
        await queryRunner.query(`ALTER TABLE "favorites" DROP COLUMN "content_id"`);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "favorites"
            ADD CONSTRAINT "FK_favorites_room"
            FOREIGN KEY ("room_id")
            REFERENCES "rooms"("id")
            ON DELETE CASCADE
        `);

        await queryRunner.query(`
            ALTER TABLE "favorites"
            ADD CONSTRAINT "FK_favorites_media"
            FOREIGN KEY ("media_id")
            REFERENCES "medias"("id")
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key constraints
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_media"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP CONSTRAINT "FK_favorites_room"`);

        // Add back the content_id column
        await queryRunner.query(`ALTER TABLE "favorites" ADD "content_id" character varying NOT NULL`);

        // Migrate data back
        await queryRunner.query(`
            UPDATE "favorites"
            SET content_id = COALESCE(room_id::text, media_id::text)
        `);

        // Drop the new columns
        await queryRunner.query(`ALTER TABLE "favorites" DROP COLUMN "room_id"`);
        await queryRunner.query(`ALTER TABLE "favorites" DROP COLUMN "media_id"`);

        // Revert enum type
        await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "content_type" DROP DEFAULT`);
        await queryRunner.query(`ALTER TYPE "favorites_content_type_enum" RENAME TO "favorites_content_type_enum_new"`);
        await queryRunner.query(`CREATE TYPE "favorites_content_type_enum" AS ENUM ('Room', 'Video')`);
        await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "content_type" TYPE "favorites_content_type_enum" USING CASE WHEN content_type = 'Media' THEN 'Video'::text ELSE content_type::text END::"favorites_content_type_enum"`);
        await queryRunner.query(`DROP TYPE "favorites_content_type_enum_new"`);
        await queryRunner.query(`ALTER TABLE "favorites" ALTER COLUMN "content_type" SET DEFAULT 'Video'`);
    }
}

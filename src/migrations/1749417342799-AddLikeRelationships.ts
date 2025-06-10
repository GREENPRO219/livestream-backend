import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLikeRelationships1749417342799 implements MigrationInterface {
    name = 'AddLikeRelationships1749417342799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First alter the column types to uuid
        await queryRunner.query(`
            ALTER TABLE "likes"
            ALTER COLUMN "room_id" TYPE uuid USING room_id::uuid
        `);

        await queryRunner.query(`
            ALTER TABLE "likes"
            ALTER COLUMN "media_id" TYPE uuid USING media_id::uuid
        `);

        // Add foreign key for room_id
        await queryRunner.query(`
            ALTER TABLE "likes"
            ADD CONSTRAINT "FK_likes_room"
            FOREIGN KEY ("room_id")
            REFERENCES "rooms"("id")
            ON DELETE CASCADE
        `);

        // Add foreign key for media_id
        await queryRunner.query(`
            ALTER TABLE "likes"
            ADD CONSTRAINT "FK_likes_media"
            FOREIGN KEY ("media_id")
            REFERENCES "medias"("id")
            ON DELETE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove foreign key for media_id
        await queryRunner.query(`
            ALTER TABLE "likes"
            DROP CONSTRAINT "FK_likes_media"
        `);

        // Remove foreign key for room_id
        await queryRunner.query(`
            ALTER TABLE "likes"
            DROP CONSTRAINT "FK_likes_room"
        `);

        // Convert columns back to character varying
        await queryRunner.query(`
            ALTER TABLE "likes"
            ALTER COLUMN "room_id" TYPE character varying
        `);

        await queryRunner.query(`
            ALTER TABLE "likes"
            ALTER COLUMN "media_id" TYPE character varying
        `);
    }
}

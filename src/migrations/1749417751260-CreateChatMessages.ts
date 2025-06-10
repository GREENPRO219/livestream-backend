import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateChatMessages1749417751260 implements MigrationInterface {
    name = 'CreateChatMessages1749417751260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "chat_messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "room_id" uuid NOT NULL,
                "message" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_chat_messages" PRIMARY KEY ("id"),
                CONSTRAINT "FK_chat_messages_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_chat_messages_room" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE
            )
        `);

        // Create index for faster room message queries
        await queryRunner.query(`
            CREATE INDEX "IDX_chat_messages_room_created" ON "chat_messages" ("room_id", "created_at" DESC)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_chat_messages_room_created"`);
        await queryRunner.query(`DROP TABLE "chat_messages"`);
    }
}

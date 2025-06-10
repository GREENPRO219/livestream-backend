import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoomMembersTable1749418000000 implements MigrationInterface {
  name = 'CreateRoomMembersTable1749418000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the room_members table
    await queryRunner.query(`
      CREATE TABLE "room_members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "room_id" uuid NOT NULL,
        "user_id" uuid NOT NULL,
        "joined_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_room_members" PRIMARY KEY ("id"),
        CONSTRAINT "FK_room_members_room" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_room_members_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "UQ_room_members_room_user" UNIQUE ("room_id", "user_id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the room_members table
    await queryRunner.query(`DROP TABLE "room_members"`);
  }
} 
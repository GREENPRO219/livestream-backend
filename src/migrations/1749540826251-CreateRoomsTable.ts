import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateRoomsTable1749540826251 implements MigrationInterface {
    name = 'CreateRoomsTable1749540826251'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rooms" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "description" character varying,
            "is_private" boolean NOT NULL DEFAULT false,
            "password" character varying,
            "created_by" uuid NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"),
            CONSTRAINT "FK_4504c6b1b0ed64d82ab24597924" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "rooms"`);
    }
} 
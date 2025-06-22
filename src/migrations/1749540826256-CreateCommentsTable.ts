import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentsTable1749540826256 implements MigrationInterface {
    name = 'CreateCommentsTable1749540826256'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comments" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "comment" character varying NOT NULL,
            "user_id" uuid NOT NULL,
            "media_id" uuid NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"),
            CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_bba232d13fadf75b8822ea88706" FOREIGN KEY ("media_id") REFERENCES "medias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "comments"`);
    }
} 
import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMediaTable1749540826253 implements MigrationInterface {
    name = 'CreateMediaTable1749540826253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "medias" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "filename" character varying NOT NULL,
            "originalname" character varying NOT NULL,
            "mimetype" character varying NOT NULL,
            "size" integer NOT NULL,
            "type" "public"."medias_type_enum" NOT NULL,
            "url" character varying NOT NULL,
            "duration" integer,
            "thumbnail" character varying,
            "user_id" uuid NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_f27321557a66cd4fae9bc1ed6e7" PRIMARY KEY ("id"),
            CONSTRAINT "FK_41d09f6d5c572f29cd001ed7edb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "medias"`);
    }
} 
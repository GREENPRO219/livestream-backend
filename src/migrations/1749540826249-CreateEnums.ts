import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateEnums1749540826249 implements MigrationInterface {
    name = 'CreateEnums1749540826249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."medias_type_enum" AS ENUM('image', 'video')`);
        await queryRunner.query(`CREATE TYPE "public"."content_type_enum" AS ENUM('Media', 'Room')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TYPE "public"."content_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."medias_type_enum"`);
    }
} 
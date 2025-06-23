import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeUserFullnameNullable1749540826259 implements MigrationInterface {
    name = 'MakeUserFullnameNullable1749540826259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "fullname" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "fullname" SET NOT NULL`);
    }
} 
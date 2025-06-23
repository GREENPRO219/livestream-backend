import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveEmailAndPasswordFromUsers1749540826258 implements MigrationInterface {
    name = 'RemoveEmailAndPasswordFromUsers1749540826258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "password"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying UNIQUE`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
    }
} 
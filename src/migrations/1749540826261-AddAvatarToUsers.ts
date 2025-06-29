import { MigrationInterface, QueryRunner } from "typeorm"

export class AddAvatarToUsers1749540826261 implements MigrationInterface {
    name = 'AddAvatarToUsers1749540826261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    }

} 
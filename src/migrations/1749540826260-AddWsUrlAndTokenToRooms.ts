import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWsUrlAndTokenToRooms1749540826260 implements MigrationInterface {
    name = 'AddWsUrlAndTokenToRooms1749540826260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" ADD COLUMN "ws_url" character varying`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD COLUMN "token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "ws_url"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "token"`);
    }
} 
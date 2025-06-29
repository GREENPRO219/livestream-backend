import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUploadTypeToMedia1751157072373 implements MigrationInterface {
    name = 'AddUploadTypeToMedia1751157072373'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medias" ADD "upload_type" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "medias" DROP COLUMN "upload_type"`);
    }

}

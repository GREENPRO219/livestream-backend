import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddUploadTypeToMedia1751157072373 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

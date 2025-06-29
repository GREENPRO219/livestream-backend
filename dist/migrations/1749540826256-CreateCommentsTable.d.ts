import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateCommentsTable1749540826256 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

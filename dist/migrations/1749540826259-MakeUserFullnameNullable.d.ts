import { MigrationInterface, QueryRunner } from "typeorm";
export declare class MakeUserFullnameNullable1749540826259 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

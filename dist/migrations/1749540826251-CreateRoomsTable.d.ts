import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateRoomsTable1749540826251 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

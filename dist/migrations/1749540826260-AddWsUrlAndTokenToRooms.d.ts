import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddWsUrlAndTokenToRooms1749540826260 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

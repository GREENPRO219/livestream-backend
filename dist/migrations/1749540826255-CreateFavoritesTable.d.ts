import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateFavoritesTable1749540826255 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

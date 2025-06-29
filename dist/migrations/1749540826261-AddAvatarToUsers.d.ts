import { MigrationInterface, QueryRunner } from "typeorm";
export declare class AddAvatarToUsers1749540826261 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

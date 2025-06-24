import { MigrationInterface, QueryRunner } from "typeorm";
export declare class RemoveEmailAndPasswordFromUsers1749540826258 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

import { MigrationInterface, QueryRunner } from "typeorm";
export declare class CreateChatMessagesTable1749540826257 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}

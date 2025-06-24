"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomsTable1749540826251 = void 0;
class CreateRoomsTable1749540826251 {
    constructor() {
        this.name = 'CreateRoomsTable1749540826251';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "rooms" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "description" character varying,
            "is_private" boolean NOT NULL DEFAULT false,
            "password" character varying,
            "created_by" uuid NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_0368a2d7c215f2d0458a54933f2" PRIMARY KEY ("id"),
            CONSTRAINT "FK_4504c6b1b0ed64d82ab24597924" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "rooms"`);
    }
}
exports.CreateRoomsTable1749540826251 = CreateRoomsTable1749540826251;
//# sourceMappingURL=1749540826251-CreateRoomsTable.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomMembersTable1749540826252 = void 0;
class CreateRoomMembersTable1749540826252 {
    constructor() {
        this.name = 'CreateRoomMembersTable1749540826252';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "room_members" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "room_id" uuid NOT NULL,
            "user_id" uuid NOT NULL,
            "joined_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_4493fab0433f741b7cf842e6038" PRIMARY KEY ("id"),
            CONSTRAINT "FK_e6cf45f179a524427ddf8bacd8e" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "FK_b2d15baf5b46ed9659bd71fbb43" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        )`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "room_members"`);
    }
}
exports.CreateRoomMembersTable1749540826252 = CreateRoomMembersTable1749540826252;
//# sourceMappingURL=1749540826252-CreateRoomMembersTable.js.map
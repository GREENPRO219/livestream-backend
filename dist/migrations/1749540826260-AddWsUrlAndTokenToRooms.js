"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddWsUrlAndTokenToRooms1749540826260 = void 0;
class AddWsUrlAndTokenToRooms1749540826260 {
    constructor() {
        this.name = 'AddWsUrlAndTokenToRooms1749540826260';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "rooms" ADD COLUMN "ws_url" character varying`);
        await queryRunner.query(`ALTER TABLE "rooms" ADD COLUMN "token" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "ws_url"`);
        await queryRunner.query(`ALTER TABLE "rooms" DROP COLUMN "token"`);
    }
}
exports.AddWsUrlAndTokenToRooms1749540826260 = AddWsUrlAndTokenToRooms1749540826260;
//# sourceMappingURL=1749540826260-AddWsUrlAndTokenToRooms.js.map
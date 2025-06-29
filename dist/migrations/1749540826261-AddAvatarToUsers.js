"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAvatarToUsers1749540826261 = void 0;
class AddAvatarToUsers1749540826261 {
    constructor() {
        this.name = 'AddAvatarToUsers1749540826261';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    }
}
exports.AddAvatarToUsers1749540826261 = AddAvatarToUsers1749540826261;
//# sourceMappingURL=1749540826261-AddAvatarToUsers.js.map
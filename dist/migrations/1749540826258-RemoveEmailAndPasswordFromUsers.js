"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveEmailAndPasswordFromUsers1749540826258 = void 0;
class RemoveEmailAndPasswordFromUsers1749540826258 {
    constructor() {
        this.name = 'RemoveEmailAndPasswordFromUsers1749540826258';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "password"`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying UNIQUE`);
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying NOT NULL`);
    }
}
exports.RemoveEmailAndPasswordFromUsers1749540826258 = RemoveEmailAndPasswordFromUsers1749540826258;
//# sourceMappingURL=1749540826258-RemoveEmailAndPasswordFromUsers.js.map
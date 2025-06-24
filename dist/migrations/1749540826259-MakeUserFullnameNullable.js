"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeUserFullnameNullable1749540826259 = void 0;
class MakeUserFullnameNullable1749540826259 {
    constructor() {
        this.name = 'MakeUserFullnameNullable1749540826259';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "fullname" DROP NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "fullname" SET NOT NULL`);
    }
}
exports.MakeUserFullnameNullable1749540826259 = MakeUserFullnameNullable1749540826259;
//# sourceMappingURL=1749540826259-MakeUserFullnameNullable.js.map
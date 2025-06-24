"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateEnums1749540826249 = void 0;
class CreateEnums1749540826249 {
    constructor() {
        this.name = 'CreateEnums1749540826249';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."medias_type_enum" AS ENUM('image', 'video')`);
        await queryRunner.query(`CREATE TYPE "public"."content_type_enum" AS ENUM('Media', 'Room')`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TYPE "public"."content_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."medias_type_enum"`);
    }
}
exports.CreateEnums1749540826249 = CreateEnums1749540826249;
//# sourceMappingURL=1749540826249-CreateEnums.js.map
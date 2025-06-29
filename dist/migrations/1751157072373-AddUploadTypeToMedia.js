"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUploadTypeToMedia1751157072373 = void 0;
class AddUploadTypeToMedia1751157072373 {
    constructor() {
        this.name = 'AddUploadTypeToMedia1751157072373';
    }
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "medias" ADD "upload_type" character varying`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "medias" DROP COLUMN "upload_type"`);
    }
}
exports.AddUploadTypeToMedia1751157072373 = AddUploadTypeToMedia1751157072373;
//# sourceMappingURL=1751157072373-AddUploadTypeToMedia.js.map
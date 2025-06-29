"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentsTable1749540826256 = void 0;
class CreateCommentsTable1749540826256 {
    constructor() {
        this.name = 'CreateCommentsTable1749540826256';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "comments" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "comment" character varying NOT NULL,
            "user_id" uuid NOT NULL,
            "media_id" uuid NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"),
            CONSTRAINT "FK_4c675567d2a58f0b07cef09c13d" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_bba232d13fadf75b8822ea88706" FOREIGN KEY ("media_id") REFERENCES "medias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "comments"`);
    }
}
exports.CreateCommentsTable1749540826256 = CreateCommentsTable1749540826256;
//# sourceMappingURL=1749540826256-CreateCommentsTable.js.map
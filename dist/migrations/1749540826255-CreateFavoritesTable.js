"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFavoritesTable1749540826255 = void 0;
class CreateFavoritesTable1749540826255 {
    constructor() {
        this.name = 'CreateFavoritesTable1749540826255';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "favorites" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "user_id" uuid NOT NULL,
            "room_id" uuid,
            "media_id" uuid,
            "content_type" "public"."content_type_enum" NOT NULL DEFAULT 'Media',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_890818d27523748dd36a4d1bdc8" PRIMARY KEY ("id"),
            CONSTRAINT "FK_35a6b05ee3b624d0de01ee50593" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_8064308fcef3673d433f25515ba" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_fcbae26eb06007bbc9026ff17e8" FOREIGN KEY ("media_id") REFERENCES "medias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "favorites"`);
    }
}
exports.CreateFavoritesTable1749540826255 = CreateFavoritesTable1749540826255;
//# sourceMappingURL=1749540826255-CreateFavoritesTable.js.map
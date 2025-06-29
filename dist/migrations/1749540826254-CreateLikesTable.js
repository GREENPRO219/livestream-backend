"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateLikesTable1749540826254 = void 0;
class CreateLikesTable1749540826254 {
    constructor() {
        this.name = 'CreateLikesTable1749540826254';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "likes" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "user_id" uuid NOT NULL,
            "room_id" uuid,
            "media_id" uuid,
            "content_type" "public"."content_type_enum" NOT NULL DEFAULT 'Media',
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_a9323de3f8bced7539a794b4a37" PRIMARY KEY ("id"),
            CONSTRAINT "FK_3f519ed95f775c781a254089171" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_648035d699cc0ec0448396aa15c" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_a00da072db92fd4c1f4b7600abe" FOREIGN KEY ("media_id") REFERENCES "medias"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "likes"`);
    }
}
exports.CreateLikesTable1749540826254 = CreateLikesTable1749540826254;
//# sourceMappingURL=1749540826254-CreateLikesTable.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateChatMessagesTable1749540826257 = void 0;
class CreateChatMessagesTable1749540826257 {
    constructor() {
        this.name = 'CreateChatMessagesTable1749540826257';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "chat_messages" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "user_id" uuid NOT NULL,
            "room_id" uuid NOT NULL,
            "message" text NOT NULL,
            "created_at" TIMESTAMP NOT NULL DEFAULT now(),
            CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"),
            CONSTRAINT "FK_5588b6cea298cedec7063c0d33e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
            CONSTRAINT "FK_7f52e11d11d4e8cc41224352869" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        )`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "chat_messages"`);
    }
}
exports.CreateChatMessagesTable1749540826257 = CreateChatMessagesTable1749540826257;
//# sourceMappingURL=1749540826257-CreateChatMessagesTable.js.map
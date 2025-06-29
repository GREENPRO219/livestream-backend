"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const database_config_1 = require("./database.config");
(0, dotenv_1.config)();
exports.default = new typeorm_1.DataSource({
    ...(0, database_config_1.getDatabaseConfig)(),
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    logging: true,
});
//# sourceMappingURL=data-source.js.map
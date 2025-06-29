"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = exports.getDatabaseConfig = void 0;
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const getDatabaseConfig = () => ({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'livestream',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false,
    } : false,
});
exports.getDatabaseConfig = getDatabaseConfig;
exports.databaseConfig = (0, exports.getDatabaseConfig)();
//# sourceMappingURL=database.config.js.map
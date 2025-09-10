"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const path_1 = require("path");
const typeorm_1 = require("typeorm");
const getDatabaseConfig = (configService) => {
    const databaseUrl = configService.get('DATABASE_URL');
    if (databaseUrl) {
        return {
            type: 'postgres',
            url: databaseUrl,
            entities: [(0, path_1.join)(__dirname, '..', 'entities', '**', '*.entity{.ts,.js}')],
            migrations: [(0, path_1.join)(__dirname, '..', 'migrations', '*{.ts,.js}')],
            synchronize: configService.get('DATABASE_SYNCHRONIZE', false),
            logging: configService.get('DATABASE_LOGGING', false),
            ssl: { rejectUnauthorized: false },
            extra: {
                connectionLimit: 10,
                acquireTimeout: 60000,
                timeout: 60000,
            },
        };
    }
    return {
        type: 'postgres',
        host: configService.get('DATABASE_HOST', 'localhost'),
        port: configService.get('DATABASE_PORT', 5432),
        username: configService.get('DATABASE_USERNAME', 'postgres'),
        password: configService.get('DATABASE_PASSWORD', 'postgres123'),
        database: configService.get('DATABASE_NAME', 'consorcios_db'),
        entities: [(0, path_1.join)(__dirname, '..', 'entities', '**', '*.entity{.ts,.js}')],
        migrations: [(0, path_1.join)(__dirname, '..', 'migrations', '*{.ts,.js}')],
        synchronize: configService.get('DATABASE_SYNCHRONIZE', true),
        logging: configService.get('DATABASE_LOGGING', true),
        ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        extra: {
            connectionLimit: 10,
            acquireTimeout: 60000,
            timeout: 60000,
        },
    };
};
exports.getDatabaseConfig = getDatabaseConfig;
const dataSourceOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres123',
    database: process.env.DATABASE_NAME || 'consorcios_db',
    entities: [(0, path_1.join)(__dirname, '..', 'entities', '**', '*.entity{.ts,.js}')],
    migrations: [(0, path_1.join)(__dirname, '..', 'migrations', '*{.ts,.js}')],
    synchronize: false,
    logging: process.env.DATABASE_LOGGING === 'true',
};
exports.default = new typeorm_1.DataSource(dataSourceOptions);
//# sourceMappingURL=database.config.js.map
export declare const getDatabaseConfig: () => {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    synchronize: boolean;
    ssl: boolean | {
        rejectUnauthorized: boolean;
    };
};
export declare const databaseConfig: {
    type: "postgres";
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    synchronize: boolean;
    ssl: boolean | {
        rejectUnauthorized: boolean;
    };
};

import { DataSource } from "typeorm"
import "reflect-metadata"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "root",
    database: "twick",
    synchronize: true,
    logging: false,
    entities: ['src/entity/**/*.ts'],
    migrations: [],
    subscribers: [],
})

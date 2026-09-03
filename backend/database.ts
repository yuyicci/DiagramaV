import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
    "DB_USER",
    "DB_PASSWORD",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME"
] as const;

const missingEnvVars = requiredEnvVars.filter(
    (name) => !process.env[name]
);

if (missingEnvVars.length > 0) {
    console.error(
        `Faltan variables de entorno obligatorias: ${missingEnvVars.join(", ")}`
    );
    process.exit(1);
}

const dbPort = Number(process.env.DB_PORT);

if (Number.isNaN(dbPort)) {
    console.error("DB_PORT debe ser un número válido");
    process.exit(1);
}

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: dbPort,
    database: process.env.DB_NAME
});

export default pool;